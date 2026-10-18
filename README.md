# Future of Work · 4 Shifts

Site public du diagnostic « Future of Work · 4 Shifts » de Vincent Dupuis : modèle des 4 shifts, diagnostic en 14 questions, rapport et feuille de route, vision 2030 et Une de « The News Fix ».

Site statique, déployé par Netlify à chaque push sur `main`. Le pilotage du projet (specs, backlog, agents) est dans le dépôt privé `LeanAI-Studio`.

Projet personnel, sans lien avec un employeur.

## Back-office

Les textes du modèle (shifts, niveaux, défis, questions, initiatives, règles, en anglais et en français) se modifient dans un classeur Google Sheets privé. `content.js` les charge par `/api/content` au démarrage et garde le modèle intégré à `index.html` si le classeur est indisponible ou si une partie ne passe pas les contrôles.

Les réponses anonymes (niveaux, priorités, scores et profil facultatif : secteur, taille, fonction, zone, sans nom ni organisation) sont ajoutées par `/api/responses` à l'onglet `responses` du même classeur, sauf si le visiteur décoche la case prévue.

L'email facultatif pour recevoir la synthèse de l'étude est ajouté par `/api/contact` à l'onglet `contacts`, sans lien avec les réponses.

Variables d'environnement Netlify : `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`. Sans elles, le site fonctionne avec son modèle intégré et n'enregistre rien.
