// Turns the back-office tabs into the model the site uses, in one language.
// An empty French cell falls back to the English text. The site checks the result
// against what its code needs, and keeps its built-in model if something is wrong.

const list = (v) => String(v ?? '').split(/[,;\s]+/).map((x) => x.trim()).filter(Boolean);
const num = (v) => { const n = Number(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };

export function shapeModel(tabs, lang) {
  const tx = (row, key) => String((lang === 'fr' && row[`${key}_fr`]) || row[`${key}_en`] || '');
  const shifts = Object.fromEntries(tabs.shifts.map((r) => [r.id, { n: tx(r, 'name'), full: tx(r, 'full'), line: tx(r, 'line') }]));
  const levels = tabs.levels.slice().sort((a, b) => num(a.level) - num(b.level)).map((r) => tx(r, 'name'));
  const texts = Object.fromEntries(tabs.texts.map((r) => [r.key, String((lang === 'fr' && r.fr) || r.en || '')]));
  const challenges = Object.fromEntries(tabs.challenges.map((r) => [r.id, { g: r.group, n: tx(r, 'name'), d: tx(r, 'desc'), ex: tx(r, 'headline') }]));
  const questions = tabs.questions.map((r) => ({
    id: r.id, s: r.shift, ch: list(r.challenges), t: tx(r, 'short'), topic: tx(r, 'topic'), q: tx(r, 'question'),
    o: [1, 2, 3, 4].map((k) => tx(r, `level${k}`)),
  }));
  const initiatives = tabs.initiatives.map((r) => {
    const i = { id: r.id, q: r.question, step: r.step, s: r.shift, year: num(r.year), n: tx(r, 'name'), d: tx(r, 'desc') };
    const req = list(r.requires);
    if (req.length) i.req = req;
    return i;
  });
  const rules = tabs.rules.map((r) => {
    const x = { id: r.id, cond: String(r.condition ?? ''), ch: list(r.challenges), t: tx(r, 'title'), d: tx(r, 'desc'), fix: tx(r, 'fix') };
    if (String(r.kind).trim().toLowerCase() === 'limit') x.kind = 'limit';
    return x;
  });
  // Profile: one row per option (field, id, labels); the row with id "question" holds the question.
  const profile = [];
  for (const r of tabs.profile || []) {
    let f = profile.find((x) => x.id === r.field);
    if (!f) { f = { id: r.field, q: '', o: [] }; profile.push(f); }
    if (String(r.id) === 'question') f.q = tx(r, 'label'); else f.o.push([String(r.id), tx(r, 'label')]);
  }
  return { lang, shifts, levels, levelNote: texts.levelNote || '', challenges, questions, initiatives, rules, profile };
}
