# Future of Work · 4 Shifts

Site public du diagnostic « Future of Work · 4 Shifts » de Vincent Dupuis : modèle des 4 shifts, diagnostic en 14 questions, rapport et feuille de route, vision 2030 et Une de « The News Fix ».

Site statique, déployé par Netlify à chaque push sur `main`. Le pilotage du projet (specs, backlog, agents) est dans le dépôt privé `LeanAI-Studio`.

Projet personnel, sans lien avec un employeur.

## Back-office

Les textes du modèle (shifts, niveaux, défis, questions, initiatives, règles, en anglais et en français) se modifient dans un classeur Google Sheets privé. `content.js` les charge par `/api/content` au démarrage et garde le modèle intégré à `index.html` si le classeur est indisponible ou si une partie ne passe pas les contrôles.

L'onglet `media` décrit les 5 épisodes de la série LinkedIn affichés sur l'accueil (une ligne par épisode, `ep1` à `ep5`). Le site n'utilise que `id`, `shift` (vide pour l'épisode 1, sinon `S1` à `S4`), `title_en`/`title_fr`, `summary_en`/`summary_fr` (extrait du post affiché sous la vidéo), `linkedin_url`, `video_url`, `poster_url`, `captions_url` et `duration`. Les colonnes `source_video` et `source_poster` ne sortent jamais du back-office. Une cellule française vide reprend le texte anglais. Les liens sont des adresses `https://…` ou des fichiers du site sous `media/` (par exemple `media/ep2.mp4`). `video_url` vide : l'affiche s'affiche sans bouton lecture. `linkedin_url` vide : pas de lien « Comment on LinkedIn ». `duration` au format `m:ss` (saisir `'2:35` ou mettre la colonne au format texte), vide : pas de durée affichée. Si l'onglet manque ou ne passe pas les contrôles, le reste du modèle s'applique et l'accueil garde les épisodes intégrés à `index.html`.

Les réponses anonymes (niveaux, priorités, scores et profil facultatif : secteur, taille, fonction, zone, sans nom ni organisation) sont ajoutées par `/api/responses` à l'onglet `responses` du même classeur, sauf si le visiteur décoche la case prévue.

L'email facultatif pour recevoir la synthèse de l'étude est ajouté par `/api/contact` à l'onglet `contacts`, sans lien avec les réponses.

Variables d'environnement Netlify : `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`. Sans elles, le site fonctionne avec son modèle intégré et n'enregistre rien.

## The News Fix avec IA

`/api/newsfix` (`netlify/functions/newsfix.mjs`) fait écrire la Une par un agent « journaliste » : Claude, via l'API Anthropic. Le prompt, le schéma de sortie et les contrôles sont dans `netlify/lib/journalist.mjs`. Rien n'est conservé. La réponse est envoyée en flux (des espaces pendant la rédaction, puis l'article en JSON) pour garder la connexion ouverte. En cas d'erreur, de refus ou de limite atteinte, la page compose la Une sans IA à partir du diagnostic et de la feuille de route.

Variables d'environnement Netlify : `ANTHROPIC_API_KEY` (obligatoire ; sans elle, la Une est composée sans IA), `NEWSFIX_MODEL` (par défaut `claude-opus-5-5`), `NEWSFIX_PER_HOUR` (Unes par adresse IP et par heure, par défaut 3). Le plafond de dépense se règle dans la console Anthropic.
