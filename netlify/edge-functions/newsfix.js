// POST /api/newsfix → the journalist (Claude, Anthropic API) writes the 2030 front page of The News Fix.
// Edge Function: it only has to send its headers within 40 s, then the stream can last as long as the
// model writes (a front page takes about a minute; serverless functions stop after 10 s when streaming).
// It forwards the Anthropic event stream as is, without reading it, to stay far below the 50 ms CPU limit.
// The page reads the stream, rebuilds the article and checks it. Nothing is stored.
// Raw fetch rather than the Anthropic SDK: loading the SDK would cost CPU time that this runtime does not have.

import { SYSTEM_PROMPT, SCHEMA, material } from '../lib/journalist.mjs';

const MAX_SIZE = 40_000;
const env = (k) => (globalThis.Netlify && Netlify.env.get(k)) || '';
const MODEL = env('NEWSFIX_MODEL') || 'claude-opus-5-5';
const PER_HOUR = Number(env('NEWSFIX_PER_HOUR')) || 3;

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
});

function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(req.url).host; } catch { return false; }
}

// Front pages per IP address and per hour, in the memory of this edge instance only.
const hits = new Map();
function limited(ip, now = Date.now()) {
  const hour = Math.floor(now / 3_600_000);
  for (const [k, v] of hits) if (v.hour !== hour) hits.delete(k);
  const h = hits.get(ip) || { hour, n: 0 };
  h.n += 1; hits.set(ip, h);
  return h.n > PER_HOUR;
}

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405, { Allow: 'POST' });
  if (!sameOrigin(req)) return json({ error: 'origin' }, 403);
  const key = env('ANTHROPIC_API_KEY');
  if (!key) return json({ error: 'not_configured' }, 503);
  const raw = await req.text();
  if (raw.length > MAX_SIZE) return json({ error: 'too_large' }, 413);
  let input;
  try { input = JSON.parse(raw); } catch { return json({ error: 'invalid' }, 400); }
  const m = material(input);
  if (!m) return json({ error: 'invalid' }, 400);
  if (limited((context && context.ip) || 'unknown')) return json({ error: 'rate_limited' }, 429);

  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'server-side-fallback-2026-07-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 16000,
        stream: true,
        fallbacks: 'default',
        output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `Write the front page from this material.\n\n${JSON.stringify(m, null, 1)}` }],
      }),
    });
  } catch (e) {
    console.error('newsfix: Anthropic API unreachable', e);
    return json({ error: 'api_unreachable' }, 502);
  }
  if (!res.ok || !res.body) {
    console.error('newsfix: Anthropic API', res.status, (await res.text().catch(() => '')).slice(0, 500));
    return json({ error: 'api', status: res.status }, 502);
  }
  return new Response(withHeartbeat(res.body), { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store' } });
};

// The model thinks silently before its first word, sometimes for more than a minute. A comment line
// (": keep-alive"), which SSE readers ignore, is sent every 15 s without data, between two events only,
// so that the page and the network see that the connection is alive. The bytes are passed through untouched.
const BEAT = new TextEncoder().encode(': keep-alive\n\n');
function withHeartbeat(body) {
  const { readable, writable } = new TransformStream();
  const w = writable.getWriter();
  let between = true, last = Date.now();
  const beat = setInterval(() => { if (between && Date.now() - last >= 14000) { last = Date.now(); w.write(BEAT).catch(() => {}); } }, 15000);
  (async () => {
    const r = body.getReader();
    try {
      for (;;) {
        const { value, done } = await r.read(); if (done) break;
        last = Date.now(); between = value.length >= 2 && value[value.length - 1] === 10 && value[value.length - 2] === 10;
        await w.write(value);
      }
    } catch (e) { console.error('newsfix: stream', e); }
    finally { clearInterval(beat); w.close().catch(() => {}); }
  })();
  return readable;
}

export const config = { path: '/api/newsfix', method: 'POST' };
