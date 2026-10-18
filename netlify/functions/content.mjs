// GET /api/content?lang=en|fr → the model (questions, levels, initiatives, rules...) from the back-office spreadsheet.
// The CDN keeps the answer one minute: a change in the spreadsheet reaches the site in a minute at most.

import { readModel } from '../lib/sheets.mjs';
import { shapeModel } from '../lib/model.mjs';

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
});

export default async (req) => {
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' });
  const lang = new URL(req.url).searchParams.get('lang') === 'fr' ? 'fr' : 'en';
  try {
    const model = shapeModel(await readModel(), lang);
    return json(model, 200, {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Netlify-CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'Netlify-Vary': 'query=lang',
    });
  } catch (e) {
    console.error(e);
    // The site then uses its built-in model.
    return json({ error: 'Back-office unavailable' }, 503);
  }
};

export const config = { path: '/api/content' };
