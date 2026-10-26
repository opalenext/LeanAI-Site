// Future of Work · 4 Shifts — languages (English is the source, French is a translation).
// Language at load: ?lang=fr|en, then the choice saved in this browser, then the first browser
// language that is French or English, otherwise English. Changing language reloads the page.
(function () {
  'use strict';
  var KEY = 'fow4_lang';
  function detect() {
    var p = new URLSearchParams(location.search).get('lang');
    if (p === 'fr' || p === 'en') { try { localStorage.setItem(KEY, p); } catch (e) {} return p; }
    try { var m = localStorage.getItem(KEY); if (m === 'fr' || m === 'en') return m; } catch (e) {}
    var ls = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < ls.length; i++) { var c = String(ls[i]).toLowerCase().slice(0, 2); if (c === 'fr' || c === 'en') return c; }
    return 'en';
  }
  var LANG = detect();
  window.LANG = LANG;
  document.documentElement.lang = LANG;

  window.setLang = function (l) {
    if (l === LANG) return;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    var u = new URL(location.href); u.searchParams.set('lang', l); location.replace(u.toString());
  };

  // ---------- Interface texts (key = English text; {x} = value inserted) ----------
  var UI = {
    // Navigation and common
    'Introduction': 'Introduction', 'Interactive map': 'Carte interactive', 'Your Diagnostic': 'Votre diagnostic',
    'Your Priorities': 'Vos priorités', 'Your News Fix': 'Votre News Fix', 'Steps': 'Étapes', 'Language': 'Langue',
    'Start your diagnostic': 'Commencer votre diagnostic',
    'Explore the interactive map': 'Explorer la carte interactive', 'Shift {n}': 'Shift {n}', 'Privacy': 'Confidentialité',
    'Print the executive report (PDF, 2 pages)': 'Imprimer la synthèse (PDF, 2 pages)', 'Productivity': 'Productivité', 'Culture': 'Culture',
    'Productivity challenges': 'Défis de productivité', 'Cultural challenges': 'Défis culturels',
    // Share card and newspaper
    'Serving the sky, the moon and the stars': 'Au service du ciel, de la lune et des étoiles', 'The human edition': 'Édition humaine',
    'The insiders’ view': 'Le regard de l’intérieur', 'Weather': 'Météo', 'Special edition': 'Édition spéciale', 'Special edition · No. 2030': 'Édition spéciale · N° 2030', '€3': '3 €', 'Page {p}': 'Page {p}', 'Editorial': 'Éditorial', 'Pun of the day': 'Le calembour du jour', 'contact Vincent Dupuis on LinkedIn ↗': 'contactez Vincent Dupuis sur LinkedIn ↗', 'Your front page is up to date with these answers and priorities. Change them to create a new one.': 'Votre Une est à jour avec ces réponses et ces priorités. Modifiez-les pour en créer une nouvelle.', 'Only one front page is left. To go further,': 'Il ne vous reste qu’une Une. Pour aller plus loin,', 'To go further,': 'Pour aller plus loin,', 'Your answers, priorities, organization name or language have changed since this front page.': 'Vos réponses, vos priorités, le nom de l’organisation ou la langue ont changé depuis cette Une.', 'Generate it again with my changes →': 'La générer à nouveau avec mes modifications →', 'The riddle': 'L’énigme', 'Answer:': 'Réponse :', 'Work horoscope': 'L’horoscope du travail', 'The editor-in-chief': 'La rédaction en chef', 'Portrait': 'Portrait', 'Explainer': 'Décryptage', 'Opinion': 'Point de vue', 'Our organization': 'Notre organisation', 'Interview': 'Interview',
    'Also in this edition': 'Aussi dans cette édition', 'More human. More digital.': 'Plus humain ET plus digital.',
    'Not a trade-off. AND.': 'Pas un compromis.', 'Write your own 2030 front page': 'Écrivez votre Une 2030',
    // Introduction
    'From the LinkedIn series {t}, by Vincent Dupuis': 'Tiré de la série LinkedIn {t}, de Vincent Dupuis',
    'Measure the gap between your operating model and 2030': 'Mesurez l’écart entre votre modèle opérationnel et 2030',
    'You get an executive report-out for your ExCom, a roadmap for your priorities, and your 2030 vision as the front page of The News Fix, written for your organization.':
      'Vous obtenez une synthèse pour votre comité exécutif, une feuille de route pour vos priorités et votre vision 2030 en Une de The News Fix, écrite pour votre organisation.',
    'Fourteen questions · About ten minutes · No account': 'Quatorze questions · Dix minutes environ · Sans compte',
    'Example front page of The News Fix for a fictional company. Lead story: “{t}”': 'Exemple de Une de The News Fix pour une entreprise fictive. Article principal : « {t} »',
    'The model · The LinkedIn series': 'Le modèle · La série LinkedIn', 'Four shifts, one operating system': 'Quatre shifts, un seul système',
    'Five episodes of the series “{t}”. Episode 1 explains why. Episodes 2 to 5 present one shift each.':
      'Cinq épisodes de la série « {t} ». L’épisode 1 pose le constat. Les épisodes 2 à 5 présentent chacun un shift.',
    'Episode {e}/{t} · Introduction': 'Épisode {e}/{t} · Introduction', 'Shift {n} · Episode {e}/{t}': 'Shift {n} · Épisode {e}/{t}',
    'Four forces reshape work at the same time:': 'Quatre forces transforment le travail en même temps :',
    'A generational crossover': 'Un croisement des générations', 'A new relationship to work': 'Un nouveau rapport au travail',
    'The AI reset': 'La remise à zéro par l’IA', 'Constant uncertainty': 'Une incertitude permanente',
    // Episode summaries (quoted from the LinkedIn posts)
    "Many companies are deploying AI to solve yesterday's problems. I believe we should start from tomorrow instead.": 'Beaucoup d’entreprises déploient l’IA pour résoudre les problèmes d’hier. Je pense qu’il faut plutôt partir de demain.',
    'Our HR processes are built around individual talent. Yet work is done by teams.': 'Nos processus RH sont construits autour du talent individuel. Pourtant, le travail se fait en équipe.',
    'Simplify the transaction. Elevate the moment. Let AI handle the admin, so people get back to what makes the difference.': 'Simplifier la transaction. Valoriser le moment. Laisser l’IA gérer l’administratif, pour que chacun revienne à ce qui fait la différence.',
    'The gap is not the technology. It is the method.': 'L’écart ne vient pas de la technologie. Il vient de la méthode.',
    "What our HR systems currently see of an employee's life is just the tip of the iceberg.": 'Ce que nos systèmes RH voient aujourd’hui de la vie d’un salarié n’est que la partie émergée de l’iceberg.',
    'Fragmented answers will not be enough. Work needs a new operating system.': 'Des réponses fragmentées ne suffiront pas. Le travail a besoin d’un nouveau système d’exploitation.',
    'Play episode {e}: {t}': 'Lire l’épisode {e} : {t}', 'Episode {e}: {t}': 'Épisode {e} : {t}', 'Duration:': 'Durée :',
    'This video is not available.': 'Cette vidéo n’est pas disponible.',
    'Comment on LinkedIn': 'Commenter sur LinkedIn', 'Comment on the bonus episode on LinkedIn (opens in a new tab)': 'Commenter l’épisode bonus sur LinkedIn (nouvel onglet)',
    'Play the bonus episode: {t}': 'Lire l’épisode bonus : {t}', 'Bonus episode: {t}': 'Épisode bonus : {t}', 'Bonus episode · Shift {n}': 'Épisode bonus · Shift {n}',
    'A bonus episode shows workforce intelligence in practice.': 'Un épisode bonus montre la workforce intelligence en pratique.',
    'One job, step by step: tasks, AI impact, job redesign, new skills. Then, at company scale, a workforce digital twin simulates the workforce each business scenario requires.':
      'Un métier, pas à pas : tâches, impact de l’IA, refonte du poste, nouvelles compétences. Puis, à l’échelle de l’entreprise, un workforce digital twin simule les effectifs dont chaque scénario business a besoin.', 'Comment on episode {e} on LinkedIn (opens in a new tab)': 'Commenter l’épisode {e} sur LinkedIn (nouvel onglet)',
    'Each shift addresses several productivity and cultural challenges at the same time. Their effects add up, but only if they push in the same direction.':
      'Chaque shift répond à plusieurs défis de productivité et de culture à la fois. Leurs effets s’additionnent, à condition d’aller dans le même sens.',
    'Your journey': 'Votre parcours', 'Three steps, three deliverables': 'Trois étapes, trois livrables',
    'About ten minutes in total. Your answers are saved in your browser, so you can continue later.': 'Dix minutes environ au total. Vos réponses sont enregistrées dans votre navigateur : vous pouvez reprendre plus tard.',
    'Step {n}:': 'Étape {n} :', 'You get': 'Vous obtenez',
    'Fourteen questions on the four shifts. Each one has four levels, from Emerging to Excellence.': 'Quatorze questions sur les quatre shifts, chacune sur quatre niveaux, d’Emerging à Excellence.',
    'Your maturity profile and a two-page executive report-out for your ExCom.': 'Votre profil de maturité et une synthèse de deux pages pour votre comité exécutif.',
    'Choose 3 to 5 challenges. The roadmap builds itself, with its prerequisites.': 'Choisissez 3 à 5 défis. La feuille de route se construit seule, avec ses prérequis.',
    'A roadmap from 2027 to 2030, as a list or a Gantt chart.': 'Une feuille de route de 2027 à 2030, en liste ou en Gantt.',
    'Each priority becomes a 2030 interview: before, today, and what you did to get there.': 'Chaque priorité devient une interview de 2030 : avant, aujourd’hui, et ce que vous avez fait pour y arriver.',
    'Your 2030 front page, as an image to share on LinkedIn.': 'Votre Une 2030, en image à partager sur LinkedIn.',
    'Before you start, explore the interactive map, which shows how each shift acts on the sixteen challenges and where shifts could cancel each other out.':
      'Avant de commencer, parcourez la carte interactive qui montre comment chaque shift agit sur les seize défis, et où des shifts pourraient s’annuler.',
    'The author': 'L’auteur',
    'Engineer and innovator, with more than 25 years of experience and over 30 patents. Vincent makes breakthrough technology deliver real value: first in products, now in data and AI. He incubated a world-first product in startup mode and brought it to launch with a premium car maker. He then led Lean product development at very large scale. Since 2021, he applies the same discipline to data and AI: vision first, then reinvent the process before automating it, with value stream redesign and AI agents.': 'Ingénieur et innovateur, plus de 25 ans d’expérience et plus de 30 brevets. Vincent transforme les technologies de rupture en valeur réelle : d’abord dans les produits, aujourd’hui dans la data et l’IA. Il a incubé en mode startup un produit inédit au monde, jusqu’à son lancement avec un constructeur automobile premium. Il a ensuite dirigé le développement produit Lean à très grande échelle. Depuis 2021, il applique la même discipline à la data et à l’IA : la vision d’abord, puis réinventer le processus avant de l’automatiser, par la refonte des flux de valeur et des agents IA.',
    'Vincent Dupuis on stage, speaking about AI': 'Vincent Dupuis sur scène, en train de parler d’IA',
    'Future of Work · 4 Shifts is a personal project. It is not linked to any employer.': 'Future of Work · 4 Shifts est un projet personnel. Il n’est lié à aucun employeur.',
    'Your 2030 vision starts with fourteen questions': 'Votre vision 2030 commence par quatorze questions',
    'About ten minutes. No account. Your report-out, your roadmap and your front page at the end.': 'Dix minutes environ. Sans compte. À la fin : votre synthèse, votre feuille de route et votre Une.',
    'Your answers are saved in your browser. To see your report, you accept that your levels and priorities are added to anonymous statistics, with no name and no organization. The profile questions and the email for the study results are optional.':
      'Vos réponses sont enregistrées dans votre navigateur. Pour voir votre rapport, vous acceptez que vos niveaux et vos priorités soient ajoutés à des statistiques anonymes, sans nom ni organisation. Les questions de profil et l’email pour recevoir les résultats de l’étude sont facultatifs.',
    'Read the privacy page': 'Lire la page Confidentialité',
    'I accept that my answers are added, anonymously, to the 4 Shifts statistics: levels, priorities, scores and profile, no name and no organization. Required to continue.':
      'J’accepte que mes réponses soient ajoutées, de façon anonyme, aux statistiques 4 Shifts : niveaux, priorités, scores et profil, sans nom ni organisation. Nécessaire pour continuer.',
    // Profile and contact
    'Compare with organizations like yours': 'Se comparer à des organisations proches de la vôtre',
    'Four optional questions. They are used only in the anonymous statistics, to compare results by sector, size, role and region. Never your name or your organization.':
      'Quatre questions facultatives. Elles servent uniquement aux statistiques anonymes, pour comparer les résultats par secteur, taille, fonction et zone. Jamais votre nom ni votre organisation.',
    'Get the results of the study': 'Recevoir les résultats de l’étude',
    'When enough leaders have answered, we publish a summary of the results. Leave your email to receive it: one email, nothing else.':
      'Quand assez de dirigeants auront répondu, nous publierons une synthèse des résultats. Laissez votre email pour la recevoir : un seul email, rien d’autre.',
    'Your professional email': 'Votre email professionnel', 'name@company.com': 'nom@entreprise.com', 'Send': 'Envoyer',
    'Your email is stored separately from your diagnostic. Your answers stay anonymous: nobody can link them to your email. Your email is deleted once the summary is sent.':
      'Votre email est enregistré à part de votre diagnostic. Vos réponses restent anonymes : personne ne peut les relier à votre email. Votre email est supprimé une fois la synthèse envoyée.',
    'Thank you. You will receive the summary of the results.': 'Merci. Vous recevrez la synthèse des résultats.',
    'This email address does not look valid.': 'Cette adresse email ne semble pas valide.',
    'Your email could not be saved. Please try again later.': 'Votre email n’a pas pu être enregistré. Réessayez plus tard.',
    // Map
    'Interactive map': 'Carte interactive', 'Four pillars, sixteen challenges': 'Quatre piliers, seize défis',
    'Each pillar contributes to the challenges it addresses. When several pillars act on the same challenge, their effects add up, but only if they all push in the same direction. Click a link, a pillar or a challenge to see its explanation.':
      'Chaque pilier contribue aux défis qu’il traite. Quand plusieurs piliers agissent sur le même défi, leurs effets s’additionnent, à condition d’aller tous dans le même sens. Cliquez sur un lien, un pilier ou un défi pour voir son explication.',
    'Map of the four pillars and the challenges they address': 'Carte des quatre piliers et des défis qu’ils traitent',
    'Scroll sideways to see the whole map.': 'Faites défiler sur le côté pour voir toute la carte.',
    'Coherence watch-out': 'Point de vigilance', 'Watch-out': 'Vigilance', 'Single pillar': 'Un seul pilier', 'Aligned': 'Aligné',
    'Coherence check': 'Contrôle de cohérence', 'Combined effect': 'Effet combiné', 'Risk of opposite effects': 'Risque d’effets contraires',
    'Guardrail': 'Garde-fou', 'Productivity challenge': 'Défi de productivité', 'Cultural challenge': 'Défi culturel',
    '{p} → challenge': '{p} → défi', 'How {p} contributes': 'Ce qu’apporte {p}', 'Other pillars acting on this challenge': 'Autres piliers qui agissent sur ce défi',
    'Challenge · {n} of 4 pillars': 'Défi · {n} piliers sur 4', 'Challenge · {n} of 4 pillars ': 'Défi · {n} pilier sur 4', 'Shift {n} · Episode {e}': 'Shift {n} · Épisode {e}',
    'SHIFT {n} · EPISODE {e}': 'SHIFT {n} · ÉPISODE {e}', '{n} CHALLENGES': '{n} DÉFIS',
    'Addresses {p} productivity and {c} cultural challenges. {w} of them have a coherence watch-out.':
      'Traite {p} défis de productivité et {c} défis culturels. {w} d’entre eux ont un point de vigilance.',
    'Challenge': 'Défi', 'Pillars': 'Piliers', 'Coherence': 'Cohérence', 'Read ↓': 'Lire ↓',
    '{t}. Read the explanation below.': '{t}. Lire l’explication plus bas.',
    // 1. Diagnostic: questions
    'Step 1 · Your Diagnostic': 'Étape 1 · Votre diagnostic', 'Question {i} of {n}': 'Question {i} sur {n}',
    '1 · Typical today': '1 · Typique aujourd’hui', '4 · Target 2030': '4 · Cible 2030', '← Back': '← Retour',
    'See your report': 'Voir votre rapport', 'Next →': 'Suivant →',
    // 1. Diagnostic: report
    'Large gap': 'Écart fort', 'Gap': 'Écart', 'Close': 'Proche', 'Maturity {v}%': 'Maturité {v} %',
    'Limit · ': 'Limite · ', 'Guardrail:': 'Garde-fou :', 'Challenges affected:': 'Défis concernés :',
    'No contradiction detected between your practices. The shifts you invest in push in the same direction.':
      'Aucune contradiction entre vos pratiques. Les shifts dans lesquels vous investissez vont dans le même sens.',
    'Your operating model today, against the 2030 target': 'Votre modèle opérationnel aujourd’hui, face à la cible 2030',
    'Maturity is 0% when a practice is typical of today, and 100% when it matches the 2030 target state of the model.':
      'La maturité vaut 0 % quand une pratique est typique d’aujourd’hui, et 100 % quand elle atteint la cible 2030 du modèle.',
    'Of the way to the 2030 target state': 'Du chemin vers la cible 2030', '{v}% still to go': 'Encore {v} % à parcourir',
    'Productivity maturity': 'Maturité productivité', 'Culture maturity': 'Maturité culture',
    'Productivity and culture move together. A strong result on one side does not make up for a weak one on the other.':
      'Productivité et culture avancent ensemble. Un bon résultat d’un côté ne compense pas un résultat faible de l’autre.',
    'Your maturity profile': 'Votre profil de maturité',
    'Your 14 practices, from Emerging to Excellence · 2030-ready. The dashed outer ring is the 2030 target.':
      'Vos 14 pratiques, d’Émergent à Excellence · prêt pour 2030. L’anneau extérieur en pointillés est la cible 2030.',
    'Contradictions between your practices: one shift pushes a challenge forward while another pushes it back, and the effects cancel out.':
      'Les contradictions entre vos pratiques : un shift fait avancer un défi pendant qu’un autre le fait reculer, et les effets s’annulent.',
    'Where the gaps are': 'Où sont les écarts', 'Generate the executive report for your ExCom': 'Générer la synthèse pour votre comité exécutif',
    'Set your priorities →': 'Définir vos priorités →', '← Change my answers': '← Modifier mes réponses',
    'Maturity profile on the 14 practices, from Emerging to Excellence · 2030-ready': 'Profil de maturité sur les 14 pratiques, d’Émergent à Excellence · prêt pour 2030',
    '2030-ready': 'prêt 2030',
    // Executive report-out
    'Future of Work 2030 · Executive report-out': 'Future of Work 2030 · Synthèse pour le comité exécutif',
    'Page {n} of 2': 'Page {n} sur 2', 'Contradiction': 'Contradiction', 'Why it matters': 'Pourquoi c’est important', 'Limit': 'Limite',
    'No contradiction was found between current practices. The shifts already in motion push in the same direction.':
      'Aucune contradiction entre les pratiques actuelles. Les shifts déjà engagés vont dans le même sens.',
    'Your practices already match the 2030 target on these challenges.': 'Vos pratiques atteignent déjà la cible 2030 sur ces défis.',
    'Prepared with the Future of Work · 4 Shifts diagnostic ({h}). 14-question self-assessment: an indication to open the discussion, not a benchmark.':
      'Préparé avec le diagnostic Future of Work · 4 Shifts ({h}). Auto-évaluation en 14 questions : une indication pour ouvrir la discussion, pas un benchmark.',
    'Your executive report-out': 'Votre synthèse pour le comité exécutif',
    'Two pages for your ExCom: where you stand, what blocks progress, and the decisions to take. Print it or save it as PDF, or copy the summary into an email.':
      'Deux pages pour votre comité exécutif : où vous en êtes, ce qui bloque, et les décisions à prendre. Imprimez-la, enregistrez-la en PDF, ou copiez la synthèse dans un email.',
    'Organization name (optional)': 'Nom de l’organisation (facultatif)', 'Copy the summary': 'Copier la synthèse', '← Back to your report': '← Retour à votre rapport',
    'Our operating model is {v}% of the way to 2030': 'Notre modèle opérationnel a parcouru {v} % du chemin vers 2030',
    'Summary': 'Synthèse', 'Where we stand': 'Où nous en sommes', 'of the way to the 2030 target': 'du chemin vers la cible 2030',
    'productivity maturity': 'maturité productivité', 'culture maturity': 'maturité culture',
    'Levels:': 'Niveaux :', 'Three proposed priorities': 'Trois priorités proposées', 'Maturity': 'Maturité', 'Shifts that address it': 'Shifts qui le traitent',
    'Contradictions to resolve': 'Contradictions à résoudre',
    'One practice pushes a challenge forward while another pushes it back, and the effects cancel out.':
      'Une pratique fait avancer un défi pendant qu’une autre le fait reculer, et les effets s’annulent.',
    'First moves for 2027': 'Premières actions pour 2027', 'For these three priorities, with the prerequisites they need.': 'Pour ces trois priorités, avec leurs prérequis.',
    'Decisions requested from the ExCom': 'Décisions demandées au comité exécutif',
    'Summary copied. Paste it into your email to the ExCom.': 'Synthèse copiée. Collez-la dans votre email au comité exécutif.',
    'Copy is not available here. Select the summary in the report and copy it with your keyboard.': 'La copie n’est pas disponible ici. Sélectionnez la synthèse dans le rapport et copiez-la au clavier.',
    // 2. Priorities and roadmap
    'Prerequisite': 'Prérequis', 'Needs': 'Nécessite', 'Unlocks': 'Débloque', 'Consolidate and scale what is in place.': 'Consolider et étendre ce qui est en place.',
    'Needs: ': 'Nécessite : ', 'Your roadmap, 2027 to 2030': 'Votre feuille de route, 2027 à 2030',
    'Roadmap view': 'Vue de la feuille de route', 'List': 'Liste', 'Gantt': 'Gantt',
    'Dependency across shifts': 'Dépendance entre shifts', 'Dependency within a shift · Hover or tap a bar to isolate its links': 'Dépendance dans un shift · Survolez ou touchez une barre pour isoler ses liens',
    'Your answers already match the 2030 target on these challenges. Choose other priorities to build a roadmap.':
      'Vos réponses atteignent déjà la cible 2030 sur ces défis. Choisissez d’autres priorités pour construire une feuille de route.',
    'Generate your 2030 vision': 'Générer votre vision 2030',
    'The News Fix newsroom writes your front page from your diagnostic and this roadmap. Your organization name, these answers and this roadmap are sent to an AI model and are not stored.':
      'La rédaction de The News Fix écrit votre Une à partir de votre diagnostic et de cette feuille de route. Le nom de votre organisation, ces réponses et cette feuille de route sont envoyés à un modèle d’IA et ne sont pas conservés.',
    'lead story': 'article principal', 'maturity {v}%': 'maturité {v} %',
    'Step 2 · Your Priorities': 'Étape 2 · Vos priorités', 'Never transform everything at once': 'Ne jamais tout transformer à la fois',
    'Choose {a} to {b} priority challenges. Your roadmap updates below with each choice. The first one becomes the lead story of your front page.': 'Choisissez {a} à {b} défis prioritaires. Votre feuille de route se met à jour plus bas à chaque choix. Le premier devient l’article principal de votre Une.',
    '{n} selected · choose {a} to {b}': '{n} sélectionnés · choisissez-en {a} à {b}', '{n} selected · choose {a} to {b} ': '{n} sélectionné · choisissez-en {a} à {b}',
    'Organization name, for your front page (optional)': 'Nom de l’organisation, pour votre Une (facultatif)', 'Our company': 'Notre entreprise',
    '{n} challenges at most. Unselect one first.': '{n} défis au maximum. Retirez-en un d’abord.',
    // 3. News Fix
    'Future of Work 2030 · Roadmap': 'Future of Work 2030 · Feuille de route',
    'Printing…': 'Impression…', 'The newsroom is writing your front page. It takes about a minute.': 'La rédaction écrit votre Une. Cela prend environ une minute.', 'The newsroom is writing your front page: {n} words so far.': 'La rédaction écrit votre Une : {n} mots déjà écrits.',
    'What was it like before?': 'Comment était-ce avant ?', 'What is it like today?': 'Comment est-ce aujourd’hui ?', 'What did you do to get there?': 'Qu’avez-vous fait pour y arriver ?',
    'We kept what was already in place and scaled it.': 'Nous avons gardé ce qui était en place et nous l’avons étendu.',
    'We did not automate yesterday. We redesigned tomorrow.': 'Nous n’avons pas automatisé hier. Nous avons redessiné demain.',
    'A member of the leadership team': 'Un membre de l’équipe de direction',
    'No front page yet.': 'Pas encore de Une.', 'Back to your priorities': 'Retour à vos priorités', 'Your organization': 'Votre organisation',
    'of the way to the 2030 target in the 2026 diagnostic': 'du chemin vers la cible 2030 au diagnostic de 2026',
    'initiatives on the 2027–2030 roadmap': 'initiatives sur la feuille de route 2027–2030',
    'Step 3 · Your News Fix': 'Étape 3 · Votre News Fix', 'Your 2030 vision is on the front page': 'Votre vision 2030 fait la Une', 'Share it on LinkedIn': 'Partagez-la sur LinkedIn',
    'The image shows your 2030 headlines only. Your diagnostic figures stay private.': 'L’image ne montre que vos titres de 2030. Les chiffres de votre diagnostic restent privés.',
    'Download the image': 'Télécharger l’image', 'Download this image': 'Télécharger cette image', 'Image for LinkedIn': 'Image pour LinkedIn', 'Your full front page': 'Votre Une complète', 'Copy the post text': 'Copier le texte du post', 'Open LinkedIn ↗': 'Ouvrir LinkedIn ↗', 'Suggested post text': 'Texte de post proposé',
    'Download the image, copy the text, then create a post on LinkedIn and add the image.': 'Téléchargez l’image, copiez le texte, puis créez un post sur LinkedIn et ajoutez l’image.',
    'Special edition · The human edition': 'Édition spéciale · Édition humaine',     'Interview by the News Fix newsroom': 'Interview par la rédaction de The News Fix', 'By the News Fix newsroom': 'Par la rédaction de The News Fix',
    'You can print {n} more front pages.': 'Vous pouvez encore imprimer {n} Unes.', 'You can print one more front page.': 'Vous pouvez encore imprimer une Une.',
    'You have printed your {n} front pages.': 'Vous avez imprimé vos {n} Unes.', 'See your 2030 vision →': 'Voir votre vision 2030 →',
    'To print more, contact Vincent Dupuis on LinkedIn ↗': 'Pour en imprimer d’autres, contactez Vincent Dupuis sur LinkedIn ↗', 'The road to 2030': 'La route vers 2030', 'From the 2026 diagnostic': 'Selon le diagnostic de 2026',
    'Written with the Future of Work · 4 Shifts model': 'Écrit avec le modèle Future of Work · 4 Shifts', 'More human. More digital. Not a trade-off. AND.': 'Plus humain ET plus digital. Pas un compromis.',
    '← Back to your priorities and roadmap': '← Retour à vos priorités et à votre feuille de route',
    'The AI newsroom was not reachable, so the interviews were laid out directly from your diagnostic and roadmap, without AI.':
      'La rédaction IA n’était pas joignable : les interviews ont été mises en page directement à partir de votre diagnostic et de votre feuille de route, sans IA.',
    'The image tool did not load. Check your connection and reload the page.': 'L’outil d’image ne s’est pas chargé. Vérifiez votre connexion et rechargez la page.',
    'Preparing…': 'Préparation…', 'Image downloaded: the-news-fix-2030.png. Now copy the text and create your LinkedIn post.': 'Image téléchargée : the-news-fix-2030.png. Copiez maintenant le texte et créez votre post LinkedIn.',
    'The image could not be created. Try again, or take a screenshot of the preview.': 'L’image n’a pas pu être créée. Réessayez, ou faites une capture d’écran de l’aperçu.',
    'Text copied. Paste it in your LinkedIn post.': 'Texte copié. Collez-le dans votre post LinkedIn.', 'Select the text and copy it with your keyboard.': 'Sélectionnez le texte et copiez-le au clavier.',
    // Buttons and suggested priorities
    'Saved in your browser only. It is not sent from this page.': 'Enregistré uniquement dans votre navigateur. Il n’est pas envoyé depuis cette page.',
    'Saved in your browser only. Sent to the AI to write your front page, then not stored, and never added to the statistics.': 'Enregistré uniquement dans votre navigateur. Envoyé à l’IA pour écrire votre Une, puis non conservé, et jamais ajouté aux statistiques.',
    'Scroll sideways to see all the years.': 'Faites défiler sur le côté pour voir toutes les années.',
    'Print the roadmap (PDF)': 'Imprimer la feuille de route (PDF)',
    'Print the front page (PDF, 2 pages)': 'Imprimer la Une (PDF, 2 pages)',
    'suggested': 'proposé',
    'productivity': 'productivité',
    'culture': 'culture',
    'We suggest your largest gap in productivity, your largest gap in culture, and your second largest gap in {side}, because productivity and culture must move together.': 'Nous proposons votre plus grand écart en productivité, votre plus grand écart en culture et votre deuxième plus grand écart en {side}, car productivité et culture doivent avancer ensemble.',
    'We suggest your largest gap in productivity, your largest gap in culture, and your largest remaining gap, because productivity and culture must move together.': 'Nous proposons votre plus grand écart en productivité, votre plus grand écart en culture et votre plus grand écart restant, car productivité et culture doivent avancer ensemble.',
    'Largest gap in productivity, largest gap in culture, then the second largest gap in {side}, the weaker side.': 'Plus grand écart en productivité, plus grand écart en culture, puis deuxième plus grand écart en {side}, le côté le plus faible.',
    'Largest gap in productivity, largest gap in culture, then the largest remaining gap.': 'Plus grand écart en productivité, plus grand écart en culture, puis plus grand écart restant.',
    // Sample front page on the home page
    'Four years after its diagnostic, the leadership team explains how it redesigned its flows before automating them, and where the time went.':
      'Quatre ans après son diagnostic, l’équipe de direction explique comment elle a redessiné ses flux avant de les automatiser, et où est passé le temps gagné.'
  };

  window.T = function (en, v) {
    var s = (LANG === 'fr' && Object.prototype.hasOwnProperty.call(UI, en)) ? UI[en] : en;
    if (v) for (var k in v) s = s.split('{' + k + '}').join(v[k]);
    return s;
  };
  window.locale = LANG === 'fr' ? 'fr-FR' : 'en-GB';
  window.num = function (x) { return LANG === 'fr' ? String(x) + ' %' : String(x) + '%'; };

  if (LANG !== 'fr') { window.I18N_MAP = function () {}; return; }

  // ---------- Model (French) ----------
  var F = window.FOW, FR = {
    shifts: {
      S1: { n: 'Équipes talentueuses', full: 'Des talents individuels aux équipes talentueuses',
            line: 'Des systèmes RH qui gèrent tous les modèles d’équipe, des missions ouvertes à tous, et une performance à la fois individuelle et collective.' },
      S2: { n: 'Moments qui comptent', full: 'Des transactions RH aux moments qui comptent',
            line: 'L’IA prend l’administratif, le temps sur site est conçu pour le travail collectif, et les managers agissent en coachs.' },
      S3: { n: 'Transformation LeanAI', full: 'De la tech magique à la transformation LeanAI',
            line: 'La vision d’abord, cibler là où la valeur est prête, redessiner tout le flux avant de l’automatiser, et prévoir le rôle humain.' },
      S4: { n: 'Workforce digital twin', full: 'De la gestion des ressources au workforce digital twin',
            line: 'Une gouvernance de confiance, un graphe de connaissance des collaborateurs, des services proactifs, et un plan piloté en cours d’année.' }
    },
    levels: ['Émergent', 'En développement', 'Avancé', 'Excellence · prêt pour 2030'],
    profile: {
      sector: ['Secteur', { industry: 'Industrie et manufacturing', mobility: 'Automobile, aéronautique, défense', energy: 'Énergie et utilities', finance: 'Banque et assurance',
        health: 'Santé et pharma', tech: 'Tech et logiciel', retail: 'Distribution et biens de consommation', services: 'Services et conseil', public: 'Secteur public', other: 'Autre' }],
      size: ['Taille de l’organisation', { xs: 'Moins de 250 personnes', s: '250 à 999', m: '1 000 à 4 999', l: '5 000 à 49 999', xl: '50 000 et plus' }],
      role: ['Votre fonction', { ceo: 'Direction générale', hr: 'RH', ops: 'Opérations', transfo: 'Transformation, digital, IT', finance: 'Finance', other: 'Autre' }],
      region: ['Où vous travaillez', { fr: 'France', europe: 'Europe (hors France)', namerica: 'Amérique du Nord', other: 'Autre' }]
    },
    levelNote: 'Excellence · prêt pour 2030 : la pratique est ancrée, améliorée en continu et partagée dans toute l’organisation.',
    challenges: {
      fluid: { n: 'Équipes fluides', d: 'Le travail va plus vite que l’organigramme.', ex: 'Les équipes se forment en quelques jours, sans réorganisation' },
      agility: { n: 'Agilité organisationnelle', d: 'Les programmes montent en charge plus vite que les structures ne s’adaptent.', ex: 'Nouveau programme staffé en trois semaines' },
      skills: { n: 'Compétences qui évoluent vite', d: 'Les compétences vieillissent plus vite que tout plan annuel.', ex: 'La moitié de nos nouvelles compétences s’apprennent en mission' },
      knowledge: { n: 'Savoir-faire', d: 'Les experts partent à la retraite. Leur savoir-faire doit passer à la génération suivante.', ex: 'La vague de départs passe. Le savoir-faire reste.' },
      workplace: { n: 'Lieu de travail efficace', d: 'Les jours au bureau sont pleins, mais on n’y travaille pas ensemble.', ex: 'Les jours au bureau sont devenus des jours d’équipe' },
      simplif: { n: 'Simplification', d: 'L’administratif prend le temps des managers et des collaborateurs.', ex: 'L’administratif, c’est fini. Le travail redevient humain.' },
      benefits: { n: 'Bénéfices tangibles', d: 'Des pilotes IA partout, de la valeur nulle part.', ex: 'L’IA rapporte : la valeur prouvée avant chaque passage à l’échelle' },
      sovereignty: { n: 'Souveraineté', d: 'Garder la maîtrise des données critiques, de l’IA et du savoir-faire.', ex: 'Notre savoir-faire critique reste sous notre contrôle' },
      collective: { n: 'Individualisme ou travail collectif', d: 'Les objectifs individuels affaiblissent le travail d’équipe.', ex: 'Les résultats d’équipe comptent autant que les résultats individuels' },
      recog: { n: 'Leviers de reconnaissance', d: 'On se sent reconnu une fois par an, au mieux.', ex: 'De la reconnaissance chaque semaine, pas une fois par an' },
      network: { n: 'Réseau social réel et virtuel', d: 'Le travail hybride affaiblit le sentiment d’appartenance.', ex: 'Hybrides, et plus proches que jamais' },
      purpose: { n: 'Sens au travail', d: 'On demande pourquoi, pas seulement quoi.', ex: 'Chacun sait pourquoi son travail compte' },
      leadership: { n: 'Nouveau leadership', d: 'Le leadership d’hier épuise l’engagement.', ex: 'Nos managers sont devenus des coachs' },
      growth: { n: 'État d’esprit de croissance', d: 'La peur de l’IA fige les gens au lieu de les faire grandir.', ex: 'De la peur de l’IA à l’envie d’apprendre' },
      augmented: { n: 'Collaborateurs augmentés', d: 'L’IA va-t-elle me remplacer, ou améliorer mon travail ?', ex: 'Les agents IA préparent. Les humains décident.' },
      global: { n: 'Pensée systémique', d: 'Le changement permanent demande des personnes qui voient tout le système.', ex: 'Nos dirigeants voient tout le système avant de décider' }
    },
    questions: {
      q11: { t: 'Tous les modèles d’équipe dans les RH', topic: 'Les modèles d’équipe dans les processus RH', q: 'Équipes : quels modèles d’équipe vos processus RH voient-ils et soutiennent-ils ?',
        o: ['Seulement la hiérarchie.', 'Les rôles matriciels et projet sont enregistrés dans le système RH, mais aucun processus ne les utilise.', 'Les projets et les équipes agiles sont visibles, et certains processus les couvrent (staffing, objectifs).', 'Staffing, objectifs, évaluations et budgets fonctionnent pour les équipes hiérarchiques, matricielles, en réseau et agiles.'] },
      q12: { t: 'Mobilité par missions ouvertes', topic: 'Mobilité et missions', q: 'Mobilité : comment les personnes progressent-elles et bougent-elles dans l’organisation ?',
        o: ['Uniquement ou surtout par les offres de poste.', 'Certains projets ou postes sont ouverts en interne, de façon informelle.', 'Une place de marché des missions existe dans une partie de l’entreprise, avec un moteur de recommandation fondé sur les compétences.', 'Les missions sont ouvertes à tous et soutiennent l’apprentissage tout au long de la vie : chacun peut découvrir un nouveau métier avant d’y postuler. Le mélange des générations est encouragé, pour la culture et la transmission du savoir-faire.'] },
      q13: { t: 'Performance individuelle et d’équipe', topic: 'Performance et reconnaissance des équipes', q: 'Performance : comment la performance des équipes est-elle gérée et reconnue ?',
        o: ['Uniquement des objectifs individuels, revus une fois par an.', 'Quelques objectifs d’équipe existent, mais la performance reste surtout individuelle.', 'La performance individuelle et celle de l’équipe comptent toutes deux dans les évaluations et les rémunérations.', 'Performances individuelle et collective sont combinées, et les équipes reçoivent une part des gains qu’elles génèrent (% du gain total).'] },
      q21: { t: 'Du temps humain plutôt que de l’administratif', topic: 'Le temps dans les processus RH', q: 'Temps : où passe le temps dans vos processus RH clés (évaluations, intégration, développement) ?',
        o: ['Surtout dans les formulaires et l’administratif.', 'Moitié administratif, moitié conversation.', 'Une partie de l’administratif est automatisée, et une partie du temps gagné va aux conversations.', 'L’IA gère l’administratif, et le temps va aux conversations sur la contribution et le développement.'] },
      q22: { t: 'Un temps sur site qui a un sens', topic: 'Le temps sur site', q: 'Lieu de travail : à quoi sert le temps passé sur site ?',
        o: ['À un nombre de jours de présence.', 'Des jours d’équipe sont fixés, mais chacun travaille surtout seul.', 'Certains jours sur site sont prévus pour le travail collectif.', 'Le temps sur site est conçu autour de ce qui demande d’être ensemble : transmission du savoir-faire entre générations, résolution de problèmes et moments d’équipe.'] },
      q23: { t: 'Des managers coachs', topic: 'Le rôle des managers', q: 'Leadership : quel est le rôle des managers ?',
        o: ['Les managers gèrent surtout les tâches et les résultats.', 'Le coaching est encouragé, mais pas soutenu.', 'Les managers sont formés au coaching, et le coaching fait partie de leur évaluation.', 'Les managers agissent en coachs d’équipe : ils utilisent les leviers d’engagement des nouvelles générations, et osent désapprendre et réinventer.'] },
      q31: { t: 'Une vision 2030 partagée', topic: 'Comment démarrent les transformations IA', q: 'Vision : comment démarrent vos transformations IA ?',
        o: ['À partir d’un outil ou d’une offre fournisseur.', 'À partir de cas d’usage remontés du terrain, sans vision partagée.', 'Du haut vers le bas : les dirigeants ciblent des processus pour régler les problèmes d’aujourd’hui.', 'À partir d’une vision 2030, écrite sous forme de titres et partagée avec les dirigeants et les collaborateurs, puis en remontant vers les processus concernés.'] },
      q32: { t: 'Un choix guidé par la valeur', topic: 'Choisir par où commencer', q: 'Focus : comment choisissez-vous par où commencer ?',
        o: ['Chaque équipe lance ses propres pilotes.', 'Les cas d’usage sont classés selon les gains attendus.', 'Les cas d’usage sont classés selon la maturité des données et la simplicité d’adoption, pas seulement selon les gains.', 'Les opportunités sont positionnées sur la matrice LeanAI (maturité des données, simplicité d’adoption, impact), et la valeur est prouvée avant le passage à l’échelle.'] },
      q33: { t: 'Redessiner le flux avant l’IA', topic: 'Redessiner les processus avant l’IA', q: 'Réinventer : avant d’automatiser avec l’IA, redessinez-vous le processus ?',
        o: ['Les processus existants sont généralement automatisés tels quels.', 'Un peu de simplification d’abord.', 'Cartographie des flux de valeur sur les processus clés, qui traite à la fois la simplification, l’automatisation et l’IA.', 'Chaque projet IA redessine d’abord tout le flux, en définissant ce que fait l’IA et ce que font les personnes, et le temps libéré devient du temps humain. Le savoir-faire cœur de métier reste sur une IA souveraine.'] },
      q34: { t: 'Compétences et rôles avec l’IA', topic: 'Rôles et compétences avec l’IA', q: 'Personnes : comment les rôles et les compétences évoluent-ils avec l’IA ?',
        o: ['Les personnes s’adaptent d’elles-mêmes au fil du déploiement de l’IA.', 'Des formations dédiées aux outils d’IA sont organisées.', 'Les rôles sont redessinés sur certains processus, en même temps que le déploiement de l’IA, avec un plan de montée en compétences.', 'L’impact de l’IA sur chaque métier est évalué (à quelle profondeur, à quelle vitesse), avec un plan de montée en compétences et de reconversion à l’échelle de l’entreprise. L’IA capte le savoir des experts dans le flux de travail et le rend accessible aux nouvelles générations.'] },
      q41: { t: 'Une gouvernance des données de confiance', topic: 'Gouvernance des données RH', q: 'Confiance : comment les données sur les collaborateurs sont-elles gouvernées, et les collaborateurs leur font-ils confiance ?',
        o: ['Pas de gouvernance particulière au-delà des droits d’accès au système RH.', 'Des règles existent et sont documentées, surtout pour les RH et l’IT.', 'La gouvernance définit quelles données restent individuelles et lesquelles sont agrégées, et les règles sont partagées avec les représentants du personnel.', 'Gouvernance transparente et de confiance : les données critiques restent sous contrôle de l’entreprise, et chaque collaborateur peut vérifier, en libre-service ou en demandant à un agent IA, quelles données le concernant sont utilisées et pourquoi.'] },
      q42: { t: 'Graphe de connaissance des collaborateurs', topic: 'Des données RH connectées', q: 'Graphe de connaissance : vos données sur les collaborateurs sont-elles connectées ?',
        o: ['Les données sont dans des systèmes séparés (RH, formation, projets), sans lien entre eux.', 'Certains systèmes sont reliés par l’identifiant salarié, et des rapports les combinent à la main.', 'Un graphe de compétences relie personnes, compétences et rôles, et sert des usages propres aux RH, comme la mobilité ou le développement.', 'Un graphe de connaissance couvre les personnes, les équipes et l’organisation au-delà des RH : projets, bases de connaissances et communautés. Il se met à jour automatiquement.'] },
      q43: { t: 'Des services data proactifs', topic: 'Les services data pour la performance et la culture', q: 'Services : comment les données et le graphe de connaissance soutiennent-ils la performance et la culture ?',
        o: ['Des rapports et des tableaux de bord, surtout utilisés par les RH.', 'Libre-service : les RH et les métiers analysent les données sur les collaborateurs, combinées avec leurs propres données, pour décider.', 'Les données sont intégrées aux décisions clés sur la performance et la culture, comme le staffing, la succession ou l’engagement des équipes, avec des règles définies.', 'Services proactifs : les signaux sont détectés tôt et transformés en propositions, au niveau de l’équipe pour les managers (engagement, charge de travail, collaboration) et pour les métiers (risques, staffing dynamique, compétences émergentes). Les humains décident.'] },
      q44: { t: 'Un pilotage continu des effectifs', topic: 'Planification des effectifs', q: 'Pilotage : comment le plan d’effectifs est-il construit et piloté pour un impact à court, moyen et long terme, IA comprise ?',
        o: ['Un plan annuel ou pluriannuel, revu une fois par an.', 'Une prévision trimestrielle, surtout sur les effectifs, avec des plans d’action pour combler l’écart entre réel et cible.', 'Une revue régulière qui va au-delà des effectifs et déclenche des actions : compétences, familles de métiers, diversité.', 'Piloté en continu : les signaux déclenchent des alertes, l’impact de l’IA sur les métiers, de la perte de savoir-faire et des choix d’organisation est simulé, et des scénarios (former, recruter, redéployer, agents IA) sont testés avant de décider.'] }
    },
    initiatives: {
      'I1.1a': ['Cartographier les vrais modèles d’équipe', 'Rendre visibles les équipes matricielles, projet et agiles dans les systèmes RH.'],
      'I1.1b': ['Des processus RH pour tous les modèles d’équipe', 'Staffing, objectifs, évaluations et budgets fonctionnent pour tous les modèles d’équipe.'],
      'I1.2a': ['Fixer les règles des missions et piloter une place de marché', 'Convenir avec les représentants du personnel de qui paie, qui évalue la performance et de la durée des missions. Puis ouvrir des missions dans un périmètre, avec des recommandations fondées sur les compétences, d’abord déclarées, en mélangeant les générations.'],
      'I1.2b': ['Des missions ouvertes à tous, reliées aux compétences', 'Chacun peut découvrir un métier avant d’y postuler, et les missions deviennent une façon reconnue de développer ses compétences.'],
      'I1.3a': ['Ajouter des objectifs et une reconnaissance d’équipe', 'Les résultats d’équipe comptent à côté de la performance individuelle.'],
      'I1.3b': ['Une performance combinée, avec partage des gains', 'Les équipes reçoivent une part des gains qu’elles génèrent.'],
      'I2.1a': ['L’IA prend l’administratif des processus RH', 'Sur des flux redessinés d’abord, jamais sur les anciens formulaires.'],
      'I2.1b': ['Les évaluations deviennent des conversations de développement', 'Le temps gagné va aux conversations sur la contribution et le développement.'],
      'I2.2a': ['Chaque équipe définit à quoi sert le temps sur site', 'Une raison d’être plutôt qu’un nombre de jours de présence.'],
      'I2.2b': ['Concevoir les moments sur site', 'Transmission du savoir-faire entre générations, résolution de problèmes et moments d’équipe.'],
      'I2.3a': ['Former et évaluer les managers comme coachs d’équipe', 'Les compétences de coaching, et le coaching entre dans la sélection et l’évaluation des managers.'],
      'I2.3b': ['Des managers qui désapprennent et réinventent', 'Les managers coachent avec les leviers d’engagement des nouvelles générations, et osent désapprendre et réinventer.'],
      'I3.1a': ['Écrire et partager les titres de 2030', 'Avec les dirigeants et les collaborateurs : commencer par la vision, pas par la technologie.'],
      'I3.1b': ['Remonter vers les processus concernés', 'Identifier les processus que la vision 2030 transforme.'],
      'I3.2a': ['Positionner les opportunités sur la matrice LeanAI', 'Maturité des données, simplicité d’adoption et impact.'],
      'I3.2b': ['Prouver la valeur avant le passage à l’échelle', 'Des pilotes mesurés, puis des décisions de passage à l’échelle.'],
      'I3.3a': ['Cartographie des flux de valeur sur les flux clés', 'Simplification, automatisation et IA traitées ensemble, avec l’humain au centre. Commencer par un flux bien cadré et répétable, avec des dépenses directes et des données robustes, comme le recrutement.'],
      'I3.3b': ['Vague 2 : chaque projet IA redessine d’abord le flux', 'Définir ce que fait l’IA et ce que font les personnes. Le temps libéré devient du temps humain.'],
      'I3.4a': ['Redessiner les rôles en même temps que le déploiement de l’IA', 'Flux par flux, avec un plan de montée en compétences.'],
      'I3.4b': ['L’impact de l’IA sur chaque métier, et la transmission du savoir', 'Un plan de montée en compétences et de reconversion à l’échelle de l’entreprise. L’IA capte le savoir des experts pour les nouvelles générations.'],
      'I4.1a': ['Fixer et partager les règles de gouvernance des données', 'Ce qui reste individuel, ce qui est agrégé, partagé avec les représentants du personnel.'],
      'I4.1b': ['Transparence pour les collaborateurs sur l’usage des données', 'Un libre-service ou un agent IA montre à chacun quelles données sont utilisées et pourquoi.'],
      'I4.2a': ['Construire un graphe de compétences pour les usages RH', 'Relier personnes, compétences et rôles pour la mobilité et le développement.'],
      'I4.2b': ['Graphe de connaissance des collaborateurs', 'Au-delà des RH : projets, bases de connaissances et communautés, mis à jour automatiquement.'],
      'I4.3a': ['Intégrer les données aux décisions clés', 'Staffing, succession et engagement des équipes, avec des règles définies.'],
      'I4.3b': ['Des services proactifs pour les managers et les métiers', 'Des signaux au niveau de l’équipe sur l’engagement, la charge de travail et la collaboration. Risques, staffing dynamique, compétences émergentes. Les humains décident.'],
      'I4.4a': ['Une revue régulière qui va au-delà des effectifs', 'Compétences, familles de métiers et diversité, avec des actions.'],
      'I4.4b': ['Workforce digital twin', 'Les signaux déclenchent des alertes. L’impact de l’IA, de la perte de savoir-faire et des choix d’organisation est simulé. Les scénarios sont testés avant de décider.']
    },
    rules: [
      ['Administratif automatisé avant de redessiner le flux', 'L’administratif des processus RH est automatisé sur des flux qui n’ont pas été redessinés. C’est de la tech magique : des tâches plus rapides, aucune valeur nouvelle.', 'Redessiner le flux par la cartographie des flux de valeur avant d’automatiser l’administratif.'],
      ['Une vision sans refonte', 'La vision 2030 est partagée, mais les processus sont automatisés tels quels. La vision n’atteindra pas le travail.', 'Lancer la cartographie des flux de valeur sur les processus concernés par la vision.'],
      ['Une refonte qui corrige le présent', 'Les processus sont bien redessinés, mais pour régler les problèmes d’aujourd’hui. Sans vision 2030, la refonte optimise l’existant au lieu de construire l’avenir.', 'Écrire d’abord les titres de 2030, puis choisir les flux à redessiner.'],
      ['Une refonte sans plan pour les rôles', 'Les flux sont redessinés avec l’IA, mais personne ne définit la contribution humaine. La peur d’être remplacé grandit.', 'Planifier l’évolution des rôles et la montée en compétences avec chaque refonte.'],
      ['Du temps libéré, sans moments collectifs pour l’utiliser', 'La refonte libère du temps, mais le temps sur site n’est pas conçu pour le travail collectif. Le temps gagné est perdu.', 'Décider, équipe par équipe, à quoi sert le temps sur site.'],
      ['Des missions qui construisent le collectif, une évaluation qui reste individuelle', 'Les missions poussent à travailler en équipe, mais seule la performance individuelle est évaluée. Les deux effets s’annulent.', 'Ajouter des objectifs et une reconnaissance d’équipe à côté de la performance individuelle.'],
      ['Des équipes fluides sans managers coachs', 'Les équipes se forment et changent vite, mais les managers gèrent encore des tâches. Les équipes fluides ont besoin de managers qui les soudent.', 'Former les managers au coaching d’équipe avant d’étendre les équipes fluides.'],
      ['Des règles sur les données connues des seules RH et IT', 'Des règles existent, mais les collaborateurs ne savent pas ce qui est collecté ni pourquoi. Sans confiance, les données s’appauvrissent, voire sont volontairement faussées.', 'Partager les règles avec les représentants du personnel, et rendre l’usage des données visible pour les collaborateurs.'],
      ['Un graphe riche sans gouvernance de confiance', 'Les données sur les collaborateurs sont connectées plus vite que la confiance ne se construit. La culture s’affaiblit et la qualité des données baisse.', 'Mettre en place une gouvernance transparente et de confiance avant de connecter plus de données.'],
      ['Des décisions sur la partie émergée de l’iceberg', 'Les décisions s’appuient sur les données, mais seulement sur celles du système RH : une petite partie de ce que les personnes savent et font vraiment.', 'Construire un graphe de compétences avant d’y appuyer plus de décisions.'],
      ['Planifier les compétences sans données sur les compétences', 'Le plan va au-delà des effectifs, mais aucune donnée ne relie les personnes à leurs compétences. Le plan repose sur des hypothèses.', 'Construire le graphe de compétences dont le plan a besoin.'],
      ['Des signaux entre les mains de managers qui contrôlent', 'Des signaux sur les collaborateurs utilisés par des managers qui contrôlent peuvent être vus comme de la surveillance. La peur grandit au lieu de la confiance.', 'Former les managers à utiliser les signaux pour coacher, au niveau de l’équipe.'],
      ['Un staffing piloté par les données dans un système uniquement hiérarchique', 'Le staffing s’appuie sur les données, mais les systèmes RH ne voient que la hiérarchie. Les équipes qui font le travail restent invisibles.', 'Rendre visibles les vrais modèles d’équipe dans les systèmes RH.'],
      ['Des signaux sur la culture sans gouvernance de confiance', 'Les données d’engagement et de charge de travail sont utilisées avant que les règles soient partagées. Les collaborateurs y voient de la surveillance, et la confiance baisse.', 'Partager les règles sur les données avec les représentants du personnel avant d’utiliser des signaux d’équipe.'],
      ['Des gains partagés par équipe, mais des équipes invisibles pour les systèmes RH', 'Les équipes reçoivent une part des gains qu’elles génèrent, mais les systèmes RH ne voient que la hiérarchie. Les équipes projet et agiles ne peuvent pas être mesurées ni récompensées équitablement.', 'Rendre visibles les vrais modèles d’équipe dans les systèmes RH avant de partager les gains par équipe.'],
      ['L’impact de l’IA simulé, les personnes sans plan', 'Le workforce digital twin simule comment l’IA transforme les métiers, mais les personnes n’ont pas de plan de montée en compétences. Elles voient le changement arriver, et la peur grandit.', 'Transformer chaque simulation en plan de montée en compétences et de reconversion visible par les personnes.']
    ]
  };
  Object.keys(FR.shifts).forEach(function (s) { Object.assign(F.shifts[s], FR.shifts[s]); });
  F.levels = FR.levels; F.levelNote = FR.levelNote;
  (F.profile || []).forEach(function (f) { var t = FR.profile[f.id]; if (t) { f.q = t[0]; f.o.forEach(function (o) { if (t[1][o[0]]) o[1] = t[1][o[0]]; }); } });
  Object.keys(FR.challenges).forEach(function (c) { Object.assign(F.challenges[c], FR.challenges[c]); });
  F.questions.forEach(function (q) { var t = FR.questions[q.id]; if (t) Object.assign(q, t); });
  F.initiatives.forEach(function (i) { var t = FR.initiatives[i.id]; if (t) { i.n = t[0]; i.d = t[1]; } });
  F.rules.forEach(function (r, k) { var t = FR.rules[k]; if (t) { r.t = t[0]; r.d = t[1]; r.fix = t[2]; } });

  // ---------- Interactive map (French) ----------
  var MAP = {
    l: { fluid: ['Équipes', 'fluides'], agility: ['Agilité', 'organisationnelle'], skills: ['Compétences', 'qui évoluent'], knowledge: ['Savoir-faire'],
      workplace: ['Lieu de travail', 'efficace'], simplif: ['Simplification'], benefits: ['Bénéfices', 'tangibles'], sovereignty: ['Souveraineté'],
      collective: ['Individualisme ou', 'collectif'], recog: ['Leviers de', 'reconnaissance'], network: ['Réseau social', 'réel et virtuel'], purpose: ['Sens', 'au travail'],
      leadership: ['Nouveau', 'leadership'], growth: ['Esprit de', 'croissance'], augmented: ['Collaborateurs', 'augmentés'], global: ['Pensée', 'systémique'] },
    knowledgeD: 'Les experts partent à la retraite. Leur savoir-faire doit passer d’une génération à l’autre.',
    L: {
      S1: { fluid: 'Les systèmes RH gèrent tous les modèles d’équipe : hiérarchie, matrice, réseau et équipes agiles. On rejoint et on quitte une équipe sans que l’organigramme bloque.',
        agility: 'Une place de marché des missions staffe les projets avec toute l’entreprise. La capacité suit les priorités en quelques semaines, sans réorganisation.',
        skills: 'Apprendre tout au long de la vie par les missions : on développe de nouvelles compétences en faisant un nouveau travail, au rythme de l’activité.',
        knowledge: 'Les missions mélangent les générations dans une même équipe : les experts transmettent leur savoir-faire en situation de travail.',
        workplace: 'Les rituels d’équipe, comme la planification et les débriefs, donnent aux jours sur site une raison collective.',
        collective: 'Les objectifs d’équipe et le partage des gains font de l’équipe, et non de l’individu, l’unité de performance.',
        recog: 'Les résultats d’équipe comptent dans les évaluations et les rémunérations, et les équipes reçoivent une part des gains qu’elles génèrent.',
        network: 'Les missions entre sites et fonctions créent de vrais liens, qui tiennent en travail hybride.',
        purpose: 'Une mission avec un objectif d’équipe clair montre à chacun pourquoi son travail compte.',
        leadership: 'Les managers construisent et soudent des équipes, au lieu de gérer des individus un par un.' },
      S2: { knowledge: 'Les jours sur site sont repensés pour la transmission du savoir-faire entre générations et la résolution rapide des problèmes.',
        workplace: 'Redéfinir à quoi sert le site : le travail collectif, pas la présence.',
        simplif: 'L’IA prend les notes et prépare les évaluations. Les managers consacrent ce temps à la conversation.',
        benefits: 'Le temps administratif gagné se mesure, et il est réinvesti dans les moments qui créent de la valeur.',
        collective: 'Les débriefs transforment l’expérience individuelle en progrès d’équipe.',
        recog: 'Les évaluations deviennent de vraies conversations sur la contribution, pas des formulaires à cocher.',
        network: 'Les moments d’équipe en présentiel restaurent le sentiment d’appartenance en travail hybride.',
        purpose: 'On vient au bureau pour une raison. La présence devient un sens.',
        leadership: 'Les managers agissent en coachs : ils utilisent les leviers d’engagement des nouvelles générations et soudent leurs équipes comme des entraîneurs de haut niveau.',
        growth: 'Les débriefs transforment les erreurs en apprentissage : on grandit au lieu de craindre l’échec.' },
      S3: { knowledge: 'Capter le savoir : des agents IA captent le savoir-faire des experts dans le flux redessiné.',
        workplace: 'Le flux redessiné montre quelles étapes demandent d’être ensemble : le temps sur site est prévu pour elles.',
        simplif: 'Réinventer avant d’automatiser : la cartographie des flux de valeur supprime étapes et transferts, puis l’IA accélère ce qui reste.',
        benefits: 'Un ROI tangible : on commence là où les données sont mûres et le changement simple, et la valeur est prouvée avant le passage à l’échelle.',
        sovereignty: 'La transformation décide de ce qui est cœur de métier pour l’entreprise. Les processus et le savoir-faire cœur de métier tournent sur une IA souveraine.',
        agility: 'L’impact de l’IA est évalué pour chaque métier, et les personnes montent en compétences ou se reconvertissent : l’organisation s’adapte à mesure que l’IA transforme le travail.',
        skills: 'Les titres de 2030 montrent quelles compétences le travail redessiné demande. L’écart devient un plan de formation.',
        recog: 'Le processus futur définit où se trouve la valeur humaine, et la reconnaît au niveau individuel et collectif.',
        purpose: 'L’IA augmente le travail humain. Le temps administratif devient du temps humain, ce qui donne plus de sens au travail.',
        network: 'Moins de transferts peut vouloir dire moins de contacts. La refonte consacre le temps libéré aux moments collectifs.',
        augmented: 'L’humain est au centre de chaque refonte. L’IA augmente la part humaine du travail, elle ne la supprime pas.',
        leadership: 'Les managers accompagnent le changement en coachs, en commençant par la vision, pas par la technologie.',
        growth: 'La vision d’abord : des titres de 2030 partagés transforment la peur de l’IA en un avenir que l’on veut construire.' },
      S4: { fluid: 'Staffing dynamique des projets : le jumeau voit compétences et disponibilités, et les équipes se forment vite autour d’un nouveau travail.',
        knowledge: 'Les données hors RH (projets, bases de connaissances, communautés) montrent où se trouve le savoir-faire et où il est menacé.',
        benefits: 'Des services RH stratégiques à la valeur mesurable : refonte des métiers avec l’IA, scénarios d’effectifs, prévention des risques d’équipe et d’organisation, design organisationnel.',
        sovereignty: 'Le graphe de connaissance est un avantage compétitif. Les données sur les collaborateurs restent gouvernées et sous le contrôle de l’entreprise, et la captation et la réutilisation du savoir tournent sur une IA souveraine.',
        agility: 'Le plan est piloté en cours d’année : les signaux déclenchent des alertes, et les actions correctives sont simulées avant de décider.',
        skills: 'Les compétences émergentes et en déclin sont détectées tôt. Former, recruter, redéployer ou déployer des agents IA est simulé avant de décider.',
        augmented: 'Le jumeau montre comment l’IA transforme chaque tâche : chacun apprend et grandit au lieu de craindre l’IA. Les humains décident.',
        network: 'Les communautés et les contributions font partie du graphe de connaissance : le jumeau voit le vrai réseau, pas seulement l’organigramme.',
        collective: 'Des signaux au niveau de l’équipe sur l’engagement, la charge de travail et la collaboration aident les managers à agir pour l’équipe, jamais sur les individus.',
        leadership: 'Les managers reçoivent des signaux au niveau de l’équipe pour coacher, pas pour contrôler des individus.',
        growth: 'Plusieurs scénarios au lieu d’une prévision : l’incertitude devient quelque chose à explorer, pas à craindre.',
        global: 'Le jumeau relie données métier, compétences et collaborateurs. Les dirigeants voient tout le système et l’impact de chaque décision.' }
    },
    K: {
      fluid: ['Équipes talentueuses ouvre tous les modèles d’équipe et les missions. Le digital twin les staffe avec les données.', 'Un staffing optimisé par les seules données pourrait remanier les équipes en permanence et casser les équipes stables sur lesquelles repose Équipes talentueuses.', 'Le jumeau staffe des équipes, pas seulement des individus. La stabilité des équipes est une contrainte de chaque simulation.'],
      agility: ['Trois piliers agissent ensemble : des systèmes RH pour tous les modèles d’équipe, une organisation fondée sur les compétences, et un plan corrigé en cours d’année.', 'Un plan corrigé chaque mois n’a aucun effet si les flux redessinés supposent encore des cases de postes fixes.', 'Un seul langage des compétences pour les missions, la refonte des processus et le jumeau.'],
      skills: ['Le jumeau détecte l’écart, LeanAI définit les compétences dont le travail futur a besoin, les missions les développent en situation de travail.', 'Si les simulations favorisent le recrutement ou les agents IA, elles contredisent la promesse de progresser par les missions.', 'Chaque simulation inclut l’option interne (missions, montée en compétences) et la compare aux autres.'],
      knowledge: ['Les quatre piliers agissent : transmission en situation de travail, jours sur site pour transmettre, captation du savoir par l’IA, et carte du savoir menacé. C’est l’effet cumulé le plus fort du système.', 'Si les agents IA de connaissance remplacent la transmission entre personnes, les moments de transmission sur site perdent leur raison d’être.', 'Les agents captent, les personnes transmettent. L’agent aide le mentor, il ne remplace pas le moment de mentorat.'],
      workplace: ['Des rituels d’équipe, des jours sur site repensés pour le travail collectif, et des flux qui montrent quelles étapes demandent d’être ensemble.', 'Une refonte optimisée pour la productivité individuelle à distance viderait les jours sur site.', 'Les flux redessinés indiquent explicitement les étapes qui demandent d’être ensemble.'],
      simplif: ['Moments qui comptent retire l’administratif des évaluations. LeanAI redessine tout le flux.', 'Automatiser le formulaire d’évaluation d’aujourd’hui sans refonte ne fait qu’accélérer une tâche sans valeur.', 'Réinventer avant d’automatiser. Pas d’IA sur un processus qui n’a pas été redessiné.'],
      benefits: ['Du temps gagné, un ROI prouvé avant le passage à l’échelle, et des services RH stratégiques.', 'Si les bénéfices se mesurent seulement en heures gagnées, la pression pousse à réduire le temps humain, l’inverse de ce que veut Moments qui comptent.', 'Compter le temps humain réinvesti comme un bénéfice, pas seulement les coûts évités.'],
      sovereignty: ['LeanAI garde les processus et le savoir-faire cœur de métier sur une IA souveraine. Le jumeau garde le graphe de connaissance sous le contrôle de l’entreprise.', 'Les données hors RH peuvent pousser vers plus de plateformes externes, à l’encontre du choix d’une IA souveraine.', 'Une seule classification des données critiques, partagée par LeanAI et le jumeau.'],
      collective: ['Les objectifs d’équipe, le partage des gains, les débriefs et les signaux d’équipe vont dans le même sens.', 'Des évaluations qui ne regardent que les objectifs individuels garderaient l’individualisme en premier.', 'Les évaluations portent à la fois sur la performance individuelle et sur la contribution à l’équipe.'],
      recog: ['Reconnaissance d’équipe, évaluations qui deviennent des conversations, et valeur humaine définie dans le flux redessiné.', 'Si LeanAI ne reconnaît la valeur humaine que personne par personne, il va à l’encontre de la reconnaissance d’équipe d’Équipes talentueuses.', 'Dans chaque pilier, la reconnaissance combine performance individuelle et collective. Aucun pilier ne reconnaît seulement l’individu.'],
      network: ['Les missions entre sites, les moments d’équipe en présentiel et un graphe de connaissance qui voit les communautés construisent l’appartenance.', 'LeanAI supprime des transferts. Quand ces échanges étaient aussi des contacts humains, il affaiblit ce que construit Moments qui comptent.', 'Le temps libéré par la refonte va aux moments collectifs. Simplifier la transaction, élever le moment.'],
      purpose: ['Des objectifs d’équipe clairs, une raison de venir sur site, et plus de temps humain dans le travail.', 'L’automatisation pourrait supprimer des tâches qui ont du sens, pas seulement l’administratif.', 'L’étape Vision nomme les tâches humaines qui doivent rester humaines.'],
      leadership: ['Les quatre piliers agissent. Les managers soudent les équipes, coachent, accompagnent le changement et utilisent des signaux d’équipe.', 'Les tableaux de bord du jumeau peuvent pousser les managers à contrôler les individus, l’inverse de la posture de coach.', 'Le jumeau donne des signaux d’équipe pour coacher. Toujours agrégés, jamais individuels.'],
      growth: ['Les débriefs, une vision partagée et des scénarios transforment la peur en apprentissage.', 'Si les collaborateurs voient les signaux du jumeau comme de la surveillance, la peur grandit.', 'Une gouvernance de confiance : transparente, agrégée, jamais individuelle, expliquée aux collaborateurs.'],
      augmented: ['LeanAI met l’humain au centre de la refonte. Le jumeau donne des agents IA aux managers et aux experts.', 'Quand les simulations proposent des agents IA comme option à côté du recrutement, on peut y lire un remplacement, l’inverse de l’augmentation.', 'Les agents IA sont présentés comme une capacité ajoutée aux équipes. Les humains gardent la décision.'],
      global: ['Seul le digital twin traite ce défi.', 'Pas de conflit entre piliers, mais pas d’effet cumulé non plus. Si le jumeau prend du retard, rien d’autre ne couvre ce défi.', 'Chercher quel autre pilier pourrait contribuer, par exemple les missions entre sites et fonctions.']
    }
  };
  window.I18N_MAP = function (P, C, L, K) {
    Object.keys(P).forEach(function (s) { P[s].n = F.shifts[s].n; P[s].full = F.shifts[s].full; });
    Object.keys(C).forEach(function (c) { C[c].n = F.challenges[c].n; C[c].d = F.challenges[c].d; if (MAP.l[c]) C[c].l = MAP.l[c]; });
    C.knowledge.d = MAP.knowledgeD;
    Object.keys(L).forEach(function (s) { Object.keys(L[s]).forEach(function (c) { if (MAP.L[s][c]) L[s][c] = MAP.L[s][c]; }); });
    Object.keys(K).forEach(function (c) { var t = MAP.K[c]; if (t) { K[c].sum = t[0]; K[c].risk = t[1]; K[c].guard = t[2]; } });
  };
})();
