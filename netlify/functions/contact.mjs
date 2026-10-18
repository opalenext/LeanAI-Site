// POST /api/contact → adds { date, email, language } to the "contacts" tab, to send the summary of the study.
// Nothing links this row to the answers: no response id, and the date is the day only.

import { appendRow, CONTACTS_TAB, BackOfficeError } from '../lib/sheets.mjs';

const MAX_SIZE = 1_000;

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
});

function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(req.url).host; } catch { return false; }
}

export function validate(input, now = new Date()) {
  if (!input || typeof input !== 'object') return 'Invalid body';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  if (email.length > 254 || !/^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Invalid email';
  if (input.lang !== 'en' && input.lang !== 'fr') return 'Invalid language';
  return [now.toISOString().slice(0, 10), email.toLowerCase(), input.lang];
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' });
  if (!sameOrigin(req)) return json({ error: 'Origin not allowed' }, 403);
  const raw = await req.text();
  if (raw.length > MAX_SIZE) return json({ error: 'Body too large' }, 413);
  let input;
  try { input = JSON.parse(raw); } catch { return json({ error: 'Invalid body' }, 400); }
  // Hidden field that people never fill: a filled value means a robot. Answer as if saved.
  if (input && input.website) return json({ saved: true });
  const row = validate(input);
  if (typeof row === 'string') return json({ error: row }, 400);
  try {
    await appendRow(CONTACTS_TAB, row, { raw: true });
  } catch (e) {
    console.error(e);
    return json({ saved: false, reason: e instanceof BackOfficeError ? e.reason : 'Unexpected error' }, 503);
  }
  return json({ saved: true });
};

export const config = { path: '/api/contact' };
