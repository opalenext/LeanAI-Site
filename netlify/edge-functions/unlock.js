// POST /api/unlock { code } → { ok: true } when the code matches NEWSFIX_UNLOCK_CODE (Netlify environment variable).
// Vincent sends a visitor the link https://<site>/?unlock=<code>: the page then gives back the 3 front pages
// counted in the visitor's browser. Without the variable, every code is refused. Attempts are limited per IP.

const env = (k) => (globalThis.Netlify && Netlify.env.get(k)) || '';
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

const tries = new Map();
function tooMany(ip, now = Date.now()) {
  const hour = Math.floor(now / 3_600_000);
  for (const [k, v] of tries) if (v.hour !== hour) tries.delete(k);
  const t = tries.get(ip) || { hour, n: 0 };
  t.n += 1; tries.set(ip, t);
  return t.n > 10;
}

// Same time whatever the position of the first wrong character
function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  if (tooMany((context && context.ip) || 'unknown')) return json({ ok: false, error: 'rate_limited' }, 429);
  const secret = env('NEWSFIX_UNLOCK_CODE');
  let code = '';
  try { code = String((await req.json()).code || '').trim().slice(0, 100); } catch { return json({ ok: false }, 400); }
  return json({ ok: !!secret && !!code && same(code, secret) });
};

export const config = { path: '/api/unlock', method: 'POST' };
