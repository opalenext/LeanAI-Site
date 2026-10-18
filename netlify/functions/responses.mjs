// POST /api/responses → adds one anonymous row to the "responses" tab of the back-office spreadsheet.
// Stored: date, a random id of the diagnostic, the step (report or priorities), the language,
// the 14 levels, the priority challenges and the scores. No name, no organization, no IP address.

import { responsesHeader, appendRow, RESPONSES_TAB, BackOfficeError } from '../lib/sheets.mjs';

const MAX_SIZE = 4_000;

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
});

// Refuses posts from another site. A browser always sends the Origin header on a POST.
function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(req.url).host; } catch { return false; }
}

const score = (v) => (typeof v === 'number' && v >= 0 && v <= 100 ? Math.round(v) : null);

// Returns the row as { column: value }, or a string that explains the error.
export function validate(input, now = new Date()) {
  if (!input || typeof input !== 'object') return 'Invalid body';
  const { rid, step, lang, answers, priorities = [], scores = {}, flags } = input;
  if (typeof rid !== 'string' || !/^[a-z0-9]{12,40}$/.test(rid)) return 'Invalid id';
  if (step !== 'report' && step !== 'priorities') return 'Invalid step';
  if (lang !== 'en' && lang !== 'fr') return 'Invalid language';
  if (!answers || typeof answers !== 'object') return 'Missing answers';
  const ids = Object.keys(answers);
  if (!ids.length || ids.length > 30 || ids.some((q) => !/^q\d{2}$/.test(q) || ![1, 2, 3, 4].includes(answers[q]))) return 'Invalid answers';
  if (!Array.isArray(priorities) || priorities.length > 5 || priorities.some((c) => typeof c !== 'string' || !/^[a-z]{2,20}$/.test(c))) return 'Invalid priorities';
  if (step === 'priorities' && priorities.length < 3) return 'Invalid priorities';
  const row = {
    date: now.toISOString().slice(0, 19).replace('T', ' '),
    response_id: rid, step, lang, ...answers,
    priorities: priorities.join(', '),
    overall: score(scores.overall), productivity: score(scores.productivity), culture: score(scores.culture),
    contradictions: Number.isInteger(flags) && flags >= 0 && flags <= 50 ? flags : null,
  };
  return row;
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' });
  if (!sameOrigin(req)) return json({ error: 'Origin not allowed' }, 403);
  const raw = await req.text();
  if (raw.length > MAX_SIZE) return json({ error: 'Body too large' }, 413);
  let input;
  try { input = JSON.parse(raw); } catch { return json({ error: 'Invalid body' }, 400); }
  const row = validate(input);
  if (typeof row === 'string') return json({ error: row }, 400);
  try {
    const head = await responsesHeader();
    await appendRow(RESPONSES_TAB, head.map((h) => row[h] ?? ''));
  } catch (e) {
    console.error(e);
    return json({ saved: false, reason: e instanceof BackOfficeError ? e.reason : 'Unexpected error' }, 503);
  }
  return json({ saved: true });
};

export const config = { path: '/api/responses' };
