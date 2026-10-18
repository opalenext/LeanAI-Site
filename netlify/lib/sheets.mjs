// Google Sheets access for the back-office, with the Sheets API v4 and no dependency.
// Netlify environment variables:
//   GOOGLE_SHEET_ID                 id of the spreadsheet (in its URL)
//   GOOGLE_SERVICE_ACCOUNT_EMAIL    service account, shared on the spreadsheet as editor
//   GOOGLE_PRIVATE_KEY              private key of the service account (private_key field of the JSON file)

import { createSign } from 'node:crypto';

const API = 'https://sheets.googleapis.com/v4/spreadsheets';

export const MODEL_TABS = ['shifts', 'levels', 'texts', 'challenges', 'questions', 'initiatives', 'rules'];
export const RESPONSES_TAB = 'responses';

// An error whose reason can be shown to the site owner: it never contains a secret.
export class BackOfficeError extends Error {
  constructor(reason) { super(reason); this.reason = reason; }
}

function settings() {
  const env = (k) => (process.env[k] || '').trim();
  const missing = ['GOOGLE_SHEET_ID', 'GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY'].filter((k) => !env(k));
  if (missing.length) throw new BackOfficeError(`Missing variable: ${missing.join(', ')}`);
  // The key is pasted from the JSON file: its line breaks are written \n, and it may keep its quotes.
  const key = env('GOOGLE_PRIVATE_KEY').replace(/^"|",?$/g, '').replace(/\\n/g, '\n');
  if (!key.includes('-----BEGIN PRIVATE KEY-----') || !key.includes('-----END PRIVATE KEY-----')) {
    throw new BackOfficeError('GOOGLE_PRIVATE_KEY must contain the whole private_key value, from -----BEGIN PRIVATE KEY----- to -----END PRIVATE KEY-----');
  }
  return { id: env('GOOGLE_SHEET_ID'), email: env('GOOGLE_SERVICE_ACCOUNT_EMAIL'), key };
}

let token = null;

// OAuth access token of the service account, kept in memory while it is valid.
async function accessToken() {
  if (token && token.expires > Date.now() + 60_000) return token.value;
  const { email, key } = settings();
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;
  let signature;
  try { signature = createSign('RSA-SHA256').update(unsigned).sign(key, 'base64url'); } catch {
    throw new BackOfficeError('GOOGLE_PRIVATE_KEY cannot be read: copy the private_key value again, in full');
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new BackOfficeError(`Google sign-in refused (${res.status}): ${[e.error, e.error_description].filter(Boolean).join(', ').slice(0, 200)}`);
  }
  const data = await res.json();
  token = { value: data.access_token, expires: Date.now() + data.expires_in * 1000 };
  return token.value;
}

async function call(path, options = {}) {
  const { id } = settings();
  const res = await fetch(`${API}/${id}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new BackOfficeError(`Google Sheets refused (${res.status}): ${String(e.error?.message || '').slice(0, 200)}`);
  }
  return res.json();
}

const empty = (v) => v === undefined || v === null || v === '';

// Rows of a tab as objects { column: value }. Column names are in row 1.
// Rows with an empty first cell are skipped, so blank lines are allowed.
export function rowsToObjects(rows = []) {
  const [head = [], ...data] = rows;
  const cols = head.map((h) => String(h).trim());
  return data
    .filter((r) => !empty(r[0]))
    .map((r) => Object.fromEntries(cols.map((c, i) => [c, typeof r[i] === 'string' ? r[i].trim() : r[i] ?? '']).filter(([c]) => c)));
}

// Reads every model tab in one call.
export async function readModel() {
  const params = new URLSearchParams({ valueRenderOption: 'UNFORMATTED_VALUE' });
  for (const t of MODEL_TABS) params.append('ranges', t);
  const { valueRanges } = await call(`/values:batchGet?${params}`);
  return Object.fromEntries(MODEL_TABS.map((t, i) => [t, rowsToObjects(valueRanges[i].values)]));
}

export async function responsesHeader() {
  const params = new URLSearchParams({ valueRenderOption: 'UNFORMATTED_VALUE' });
  const data = await call(`/values/${encodeURIComponent(`${RESPONSES_TAB}!1:1`)}?${params}`);
  return (data.values?.[0] ?? []).map((h) => String(h).trim());
}

// Adds one row at the end of a tab. USER_ENTERED so that the date is a real date:
// the caller only passes values it has validated (numbers, ids, fixed words), never free text.
export async function appendRow(tab, row) {
  const params = new URLSearchParams({ valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS' });
  await call(`/values/${encodeURIComponent(`${tab}!A1`)}:append?${params}`, {
    method: 'POST',
    body: JSON.stringify({ values: [row] }),
  });
}
