// POST /api/newsfix → writes the 2030 front page of The News Fix with Claude (Anthropic API).
// Input: the organization name, the priority challenges with the diagnostic answers, the 2030 target
// and the roadmap initiatives (payload() in index.html). Nothing is stored.
// The answer is streamed: spaces every few seconds keep the connection open while the model writes,
// then the article as JSON. Any error ends with { "error": … } and the page lays out the front page without AI.

import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, SCHEMA, validArticle } from '../lib/journalist.mjs';

const MAX_SIZE = 40_000;
const MODEL = process.env.NEWSFIX_MODEL || 'claude-opus-5-5';
const PER_HOUR = Number(process.env.NEWSFIX_PER_HOUR) || 3;

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
});

function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(req.url).host; } catch { return false; }
}

// Front pages per IP address and per hour, in the memory of this function instance only.
const hits = new Map();
function limited(ip, now = Date.now()) {
  const hour = Math.floor(now / 3_600_000);
  for (const [k, v] of hits) if (v.hour !== hour) hits.delete(k);
  const h = hits.get(ip) || { hour, n: 0 };
  h.n += 1; hits.set(ip, h);
  return h.n > PER_HOUR;
}

const s = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Keeps only the expected fields, with a size limit on each text.
export function material(input) {
  if (!input || typeof input !== 'object') return null;
  const { lang, items } = input;
  if (lang !== 'en' && lang !== 'fr') return null;
  if (!Array.isArray(items) || items.length < 1 || items.length > 5) return null;
  const level = (x) => ({ topic: s(x && x.topic, 120), text: s(x && x.text, 600), ...(x && [1, 2, 3, 4].includes(x.level) ? { level: x.level } : {}) });
  const clean = items.map((i) => ({
    challenge: s(i && i.challenge, 120), problem: s(i && i.problem, 600), example: s(i && i.example, 200),
    before: (Array.isArray(i && i.before) ? i.before : []).slice(0, 8).map(level),
    after: (Array.isArray(i && i.after) ? i.after : []).slice(0, 8).map(level),
    actions: (Array.isArray(i && i.actions) ? i.actions : []).slice(0, 20).map((a) => ({
      year: Number.isInteger(a && a.year) && a.year >= 2026 && a.year <= 2030 ? a.year : null, name: s(a && a.name, 160), what: s(a && a.what, 600),
    })),
  }));
  if (clean.some((i) => !i.challenge)) return null;
  const c = input.context && typeof input.context === 'object' ? input.context : {};
  const num = (v) => (typeof v === 'number' && v >= 0 && v <= 1000 ? Math.round(v) : undefined);
  return {
    lang, company: s(input.company, 60) || (lang === 'fr' ? 'l’organisation' : 'the organization'), date: s(input.date, 60),
    diagnostic_2026: { progress_to_2030_target_pct: num(c.progress), productivity_pct: num(c.productivity), culture_pct: num(c.culture), and_score_pct: num(c.and), initiatives: num(c.initiatives) },
    items: clean,
  };
}

async function write(m) {
  const client = new Anthropic({ timeout: 55_000, maxRetries: 1 });
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `Write the front page from this material.\n\n${JSON.stringify(m, null, 1)}` }],
  });
  const msg = await stream.finalMessage();
  if (msg.stop_reason === 'refusal' || msg.stop_reason === 'max_tokens') throw new Error(`stop: ${msg.stop_reason}`);
  const out = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  const article = JSON.parse(out);
  if (!validArticle(article, m.items.length - 1)) throw new Error('invalid article');
  return article;
}

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' });
  if (!sameOrigin(req)) return json({ error: 'Origin not allowed' }, 403);
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: 'Not configured' }, 503);
  const raw = await req.text();
  if (raw.length > MAX_SIZE) return json({ error: 'Body too large' }, 413);
  let input;
  try { input = JSON.parse(raw); } catch { return json({ error: 'Invalid body' }, 400); }
  const m = material(input);
  if (!m) return json({ error: 'Invalid body' }, 400);
  if (limited((context && context.ip) || req.headers.get('x-nf-client-connection-ip') || 'unknown')) return json({ error: 'Too many front pages' }, 429);

  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(ctl) {
      const beat = setInterval(() => ctl.enqueue(enc.encode(' ')), 4000);
      let out;
      try { out = await write(m); } catch (e) { console.error(e); out = { error: 'newsroom' }; }
      clearInterval(beat);
      ctl.enqueue(enc.encode(JSON.stringify(out)));
      ctl.close();
    },
  });
  return new Response(body, { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
};

export const config = { path: '/api/newsfix' };
