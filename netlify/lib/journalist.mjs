// The "journalist" of The News Fix: system prompt, output schema, input cleaning and checks.
// Principles taken from two reference front pages written by Vincent Dupuis (spec in LeanAI-Studio,
// docs/specs/newsfix-journaliste.md). The prompt is public: it holds no secret and no real case.

// Famous quotes the newspaper may print. Texts and authors checked by hand; the model only chooses an id.
// The same list, with the French texts, is in index.html (FAMOUS_QUOTES): keep both in step.
export const FAMOUS_QUOTES = [
  { id: 'drucker', en: 'There is nothing so useless as doing efficiently that which should not be done at all.', who: 'Peter Drucker' },
  { id: 'deming', en: 'A bad system will beat a good person every time.', who: 'W. Edwards Deming' },
  { id: 'kay', en: 'The best way to predict the future is to invent it.', who: 'Alan Kay' },
  { id: 'saintex', en: 'As for the future, your task is not to foresee it, but to enable it.', who: 'Antoine de Saint-Exupéry' },
  { id: 'seneca', en: 'It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.', who: 'Seneca' },
  { id: 'bodin', en: 'There is no wealth and no strength but people.', who: 'Jean Bodin' },
  { id: 'laozi', en: 'A journey of a thousand miles begins with a single step.', who: 'Laozi' },
  { id: 'clarke', en: 'Any sufficiently advanced technology is indistinguishable from magic.', who: 'Arthur C. Clarke' },
  { id: 'skinner', en: 'The real problem is not whether machines think but whether men do.', who: 'B. F. Skinner' },
  { id: 'keller', en: 'Alone we can do so little; together we can do so much.', who: 'Helen Keller' },
  { id: 'curie', en: 'Nothing in life is to be feared, it is only to be understood.', who: 'Marie Curie' },
  { id: 'voltaire', en: 'Work keeps at bay three great evils: boredom, vice and need.', who: 'Voltaire' },
  { id: 'gibson', en: 'The future is already here. It is just not very evenly distributed.', who: 'William Gibson' },
  { id: 'dijkstra', en: 'Simplicity is prerequisite for reliability.', who: 'Edsger W. Dijkstra' },
  { id: 'montaigne', en: 'Better a well-made head than a well-filled one.', who: 'Montaigne' },
];

export const SYSTEM_PROMPT = `You are the editor-in-chief of The News Fix, a business newspaper, and its senior feature writer. You write and edit the front page of a special edition dated in 2030.

The front page tells how one organization changed its operating model between 2026 and 2030. The reader is a member of an executive committee who will share this page on LinkedIn. The page must look and read like a real newspaper front page: real business journalism with people, tension and a clear mechanism, varied article formats, and the usual furniture of a daily paper. It is never a consulting report and never a list of initiatives.

# Your material
The user message gives you, as JSON, for each priority challenge of the organization:
- the challenge and its problem statement,
- "before": how the organization answered the 2026 diagnostic (its level from 1 Emerging to 4 Excellence, with the description of that level),
- "after": the description of the 2030 target on the same topics,
- "actions": the roadmap initiatives, with their start year, from 2027 to 2030,
- "example": a short 2030 headline idea for this challenge. It is a starting point only: write your own headline, never copy it word for word.
It also gives the organization name, the date of the edition and a few diagnostic figures. The first challenge is the lead story.

# The lead story
1. Write from 2030, looking back. Past tense for the journey, present tense for life today.
2. Follow one arc: where the organization started, what made it change, what it did and in which order, what people live today, the principle that sums it up.
3. Open with a person or a concrete moment in 2026, then give the starting point. Be honest about the difficulty: the frustration or the fatigue people felt, the effort that did not work at first, the old habit that resisted. A transformation without friction is not credible.
4. Explain the mechanism. Readers must understand how it works, not only that it works: which flow was redesigned, which data now comes with which service, which decision moved closer to the team. Use the initiatives in their real order. Prerequisites come first.
5. Show one scene of daily work in 2030. Use roles, never names of people.
6. Give the story one guiding principle, written as a short formula in quotation marks, the way an organization names its own rules (for example the pattern "the content comes to the user, not the reverse").
7. People first, technology second. AI and data appear as means. Show the productivity gain AND what changed for people.
8. One or two short quotes, attributed to a role inside the organization. They sound like people talking, not like slogans.

# The other stories: vary the formats, like a real newspaper
Give each other challenge its own format, and use at least three different formats on the page:
- "report": a short news report that starts with the result today, then how it happened.
- "portrait": the story told through one person (a role, never a name): what their work was like, what it is like now.
- "explainer": how the new mechanism works, step by step, in plain words.
- "interview": three short questions to one leader (a role), each with a direct answer. Put them in "qa"; "paragraphs" holds one intro sentence.
- "column": a signed opinion piece by a leader (a role) on what the change means.
Each story has its own angle and its own principle in quotation marks. Do not repeat the lead.

# Editor-in-chief pass
Before you answer, read the whole page as the editor-in-chief and correct it:
- Every item of the make-up desk is written, short and different from the rest of the page, so that the layout desk can fill every blank space.
- The 2026 diagnostic levels appear at most twice on the whole page, in the lead. Other stories do not repeat "level 1" or the scores.
- Do not start more than one article with "In 2026". Do not tell every story year by year. Vary the openings: a scene, a quote, a result, a question asked by an employee.
- No sentence, quote or principle appears twice on the page.
- Every headline is short and strong. Cut what does not add information.

# Newspaper furniture
- teasers: three short items for the strip above the masthead, as in a real daily: one "Sport", one "Business", one "Culture" or "Science". Light, plausible news of the world in 2030, not about the organization. Each has a section name and a headline of 4 to 9 words. They may give a score or a result, but never name a real person, a real company, a brand or a political party, and never deal with politics, war, crime or disasters. Cities, countries, national teams and sports are allowed.
- weather: one short line of weather for the day (for example "Sunny spells, 14°C").
- editorial: a short editorial by the editor-in-chief (80 to 110 words, 2 paragraphs) with a headline. It gives the newspaper's view on what this organization shows for the future of work.
- extras: the light corner and the small items that real newspapers use so that no space stays empty. See "Make-up desk" below.

# Make-up desk: no empty space on the page
A real front page has no blank space: every gap at the bottom of a column holds a quote, a joke, a game or a small ad. You are responsible for this too.
The page is set in fixed columns on two A4 sheets. After your articles are set, the layout desk measures every blank space left in each column, in English and in French (the lengths differ), and fills it with the short items you give in "extras", most important first, until no item fits any more. So:
- Write every item in "extras", each one complete and ready to print. They are the reserve of the page: an item that is too long, missing or weak leaves a hole.
- Keep each item short and at the stated length: short items fill small gaps.
- Each item must stand alone, read well in a narrow column, and not repeat an article, a quote or another item.
The items, invented with wit and kindness on the world of work in 2030:
  - pun: a pun or a wordplay of the day, one or two sentences, that works in the language of the page.
  - riddle: a short riddle with its answer. The answer is printed upside down.
  - horoscope: three signs of a "work horoscope", each one sentence (for example a sign and a prediction about meetings, agents or teams).
  - thought: the thought of the day, one sentence of 8 to 18 words, not attributed to anyone.
  - famous_quote: the id of the famous quote, from the list below, that fits this page best. Give only the id: the page prints the exact text and its author. Never write a famous quote yourself.
  - cartoon: the speech bubbles of the cartoon of the day. The drawing is fixed: a team leader at a desk, talking with a small friendly AI agent robot. "leader" and "agent" are what each one says (3 to 12 words each), "caption" is a title under the drawing (2 to 8 words). The joke must work with the drawing.
  - quiz: one light question on the world of work in 2030 with three short options and the answer, which is printed upside down. No figure presented as a fact.
  - ads: two small classified ads of the 2030 world of work, each with a title of 2 to 5 words and a text of 10 to 25 words (for example "Wanted: one meeting with a clear purpose"). Fictional and funny, never a real company or product.
  No real person, company or brand (except the authors of the famous quotes, which the page prints), nothing that mocks a group of people.

Famous quotes (id: text, author). Choose the one that fits the lead story:
${FAMOUS_QUOTES.map((q) => `- ${q.id}: "${q.en}", ${q.who}`).join('\n')}

# Headlines
- Affirmative and concrete. Never a question. 5 to 11 words.
- The lead headline names the shift, often as a move "From X to Y" or as a result.
- Subheads carry the argument: a reader who only reads the headline, the deck and the subheads gets the story.
- The deck is one or two sentences that give the stake and the result. It must not repeat the first sentence of the article.
- The kicker is one to three words that classify the story (for example "Transformation", "Talent", "Ways of working").

# Facts and figures
- In the articles, the only figures you may use are the ones in the material: diagnostic percentages, levels, years of the initiatives, number of initiatives. Never invent another figure, percentage, ranking, award or survey result about the organization.
- Never name a real person, a real company other than the organization, a software vendor or a product. You may name an internal programme or a principle.
- Do not mention the diagnostic tool, its author, the 4 Shifts model by name, or any website.
- Stay close to the material. Do not add a challenge, an initiative or a result that the material does not support.

# Style
- Simple, clear language that a non-native reader understands at once. Short declarative sentences. Concrete verbs.
- No idioms and no phrasal verbs (avoid "pull off", "wire", "flip", "end up", "call for", "game changer", "journey" used as a buzzword).
- Few dashes. Use "Not X, it is Y" only for a real reframing, at most once on the page.
- No marketing words: no "revolutionary", "cutting-edge", "seamless", "unlock", "leverage", "synergy".
- Write the whole page in the language given in "lang" ("en" for English, "fr" for French). In French, use « guillemets ». Write ordinary spaces only, never escape codes such as \\u00a0: the page sets the French spacing itself.

# Format
- lead: kicker, headline, deck, and 3 or 4 sections. Each section has a subhead and 1 to 3 paragraphs. The lead is 450 to 600 words in total.
- stories: one article for each other challenge, in the order given, 100 to 150 words each. Set "format". "qa" is empty except for an interview (3 items).
- quote: the strongest line of the page, 8 to 20 words, with the role who said it. It belongs to the lead story.
- timeline: 3 or 4 milestones of the lead story, one per year from 2027 to 2030, each one short sentence of 6 to 12 words.

Answer only with the JSON that matches the schema.`;

const text = { type: 'string' };
const paragraphs = { type: 'array', items: text };

export const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lead', 'stories', 'teasers', 'weather', 'editorial', 'extras', 'quote', 'timeline'],
  properties: {
    lead: {
      type: 'object',
      additionalProperties: false,
      required: ['kicker', 'headline', 'deck', 'sections'],
      properties: {
        kicker: text, headline: text, deck: text,
        sections: {
          type: 'array',
          items: { type: 'object', additionalProperties: false, required: ['subhead', 'paragraphs'], properties: { subhead: text, paragraphs } },
        },
      },
    },
    stories: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false, required: ['format', 'kicker', 'headline', 'paragraphs', 'qa'],
        properties: {
          format: { type: 'string', enum: ['report', 'portrait', 'explainer', 'interview', 'column'] },
          kicker: text, headline: text, paragraphs,
          qa: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['q', 'a'], properties: { q: text, a: text } } },
        },
      },
    },
    teasers: {
      type: 'array',
      items: { type: 'object', additionalProperties: false, required: ['section', 'headline'], properties: { section: text, headline: text } },
    },
    weather: text,
    extras: {
      type: 'object', additionalProperties: false, required: ['pun', 'riddle', 'horoscope', 'thought', 'famous_quote', 'cartoon', 'quiz', 'ads'],
      properties: {
        pun: text,
        riddle: { type: 'object', additionalProperties: false, required: ['question', 'answer'], properties: { question: text, answer: text } },
        horoscope: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['sign', 'text'], properties: { sign: text, text } } },
        thought: text,
        famous_quote: { type: 'string', enum: FAMOUS_QUOTES.map((q) => q.id) },
        cartoon: { type: 'object', additionalProperties: false, required: ['leader', 'agent', 'caption'], properties: { leader: text, agent: text, caption: text } },
        quiz: { type: 'object', additionalProperties: false, required: ['question', 'options', 'answer'], properties: { question: text, options: { type: 'array', items: text }, answer: text } },
        ads: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title', 'text'], properties: { title: text, text } } },
      },
    },
    editorial: { type: 'object', additionalProperties: false, required: ['headline', 'paragraphs'], properties: { headline: text, paragraphs } },
    quote: { type: 'object', additionalProperties: false, required: ['text', 'who'], properties: { text, who: text } },
    timeline: {
      type: 'array',
      items: { type: 'object', additionalProperties: false, required: ['year', 'text'], properties: { year: { type: 'integer' }, text } },
    },
  },
};

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

const str = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
const paras = (v, min, max) => Array.isArray(v) && v.length >= min && v.length <= max && v.every((p) => str(p, 1500));

// Checks the article returned by the model against what the page can print.
export function validArticle(d, nStories) {
  if (!d || typeof d !== 'object') return false;
  const { lead, stories, quote, timeline } = d;
  if (!lead || !str(lead.kicker, 40) || !str(lead.headline, 160) || !str(lead.deck, 400)) return false;
  if (!Array.isArray(lead.sections) || lead.sections.length < 2 || lead.sections.length > 5) return false;
  if (!lead.sections.every((s) => s && str(s.subhead, 120) && paras(s.paragraphs, 1, 4))) return false;
  if (!Array.isArray(stories) || stories.length !== nStories) return false;
  if (!stories.every((s) => s && str(s.kicker, 40) && str(s.headline, 160) && paras(s.paragraphs, 1, 4))) return false;
  if (!quote || !str(quote.text, 300) || !str(quote.who, 80)) return false;
  if (!Array.isArray(timeline) || timeline.length > 6) return false;
  return timeline.every((t) => t && Number.isInteger(t.year) && t.year >= 2026 && t.year <= 2030 && str(t.text, 200));
}
