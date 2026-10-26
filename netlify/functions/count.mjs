// POST /api/count → adds one row to the "events" tab of the back-office spreadsheet.
// Stored: day, event name (from a fixed list) and page language. No id, no answer, no IP address.
// Events: visit (first page of a browser session), start (first answer), report (diagnostic done),
// brief (report-out printed), frontpage (front page made), image (share image downloaded).

import { appendRow, EVENTS_TAB, BackOfficeError } from '../lib/sheets.mjs';

const EVENTS = ['visit', 'start', 'report', 'brief', 'frontpage', 'image'];

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

// Returns the row as an array, or a string that explains the error.
export function validate(input, now = new Date()) {
  if (!input || typeof input !== 'object') return 'Invalid body';
  const { e, lang } = input;
  if (!EVENTS.includes(e)) return 'Invalid event';
  if (lang !== 'en' && lang !== 'fr') return 'Invalid language';
  return [now.toISOString().slice(0, 10), e, lang];
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' });
  if (!sameOrigin(req)) return json({ error: 'Origin not allowed' }, 403);
  const raw = await req.text();
  if (raw.length > 200) return json({ error: 'Body too large' }, 413);
  let input;
  try { input = JSON.parse(raw); } catch { return json({ error: 'Invalid body' }, 400); }
  const row = validate(input);
  if (typeof row === 'string') return json({ error: row }, 400);
  try {
    await appendRow(EVENTS_TAB, row);
  } catch (e) {
    console.error(e);
    return json({ saved: false, reason: e instanceof BackOfficeError ? e.reason : 'Unexpected error' }, 503);
  }
  return json({ saved: true });
};

export const config = { path: '/api/count' };
