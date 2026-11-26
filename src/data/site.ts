// ─────────────────────────────────────────────────────────────
//  CONTENU DU SITE — c'est ce fichier qu'il faut modifier.
//  Tout ce qui est marqué  [À COMPLÉTER]  est un contenu de
//  remplacement en attendant les vrais textes, images et vidéos.
// ─────────────────────────────────────────────────────────────

export const profil = {
  prenom: 'Romane',
  nom: 'Courtas',
  metier: 'Production & gestion audiovisuelle',
  ville: 'Paris, France', // [À COMPLÉTER]
  email: 'contact@exemple.fr', // [À COMPLÉTER] adresse publique de contact
  liens: [
    { label: 'LinkedIn', url: '#' }, // [À COMPLÉTER]
    { label: 'Instagram', url: '#' }, // [À COMPLÉTER]
    { label: 'Vimeo', url: '#' }, // [À COMPLÉTER]
  ],
  // Vidéo de présentation (showreel) : identifiant YouTube ou Vimeo, ou laisser vide.
  showreel: { plateforme: '', id: '' } as { plateforme: '' | 'youtube' | 'vimeo'; id: string },
  accroche:
    "Je fais passer les projets audiovisuels de l'idée au plateau : organisation des tournages, coordination des équipes et gestion de production, du sport en direct aux films engagés.",
  bio: [
    // [À COMPLÉTER] texte de remplacement à réécrire avec tes mots
    "Trois alternances, chez MyFuture, CSTART et Canal+ Sport, m'ont appris à tenir un planning, un budget et une équipe quand tout va vite.",
    "Côté terrain, j'ai fait de la figuration, j'ai donné un coup de main à l'événementiel des Jeux de Paris et j'ai participé à un film féministe. Côté création, je réalise des bandes-annonces et des formats courts.",
  ],
  chiffres: [
    // [À COMPLÉTER] chiffres indicatifs, à remplacer par les tiens
    { valeur: 3, suffixe: '', label: 'alternances' },
    { valeur: 6, suffixe: '+', label: 'projets menés' },
    { valeur: 1, suffixe: '', label: 'olympiade à Paris' },
  ],
  competences: [
    'Organisation de tournage',
    'Coordination d’équipe',
    'Gestion de production',
    'Suivi budgétaire',
    'Réalisation',
    'Montage',
    'Événementiel sportif',
    'Logistique plateau',
  ],
};

export type Projet = {
  slug: string;
  titre: string;
  categorie: string;
  annee: string;
  role: string;
  resume: string;
  description: string[];
  // Couleurs du visuel de remplacement (tant qu'il n'y a pas d'image)
  teinte: [string, string];
  // Image de couverture : mettre le fichier dans /public/projets/ puis écrire 'projets/mon-image.jpg'
  image?: string;
  // Vidéo : { plateforme: 'youtube' | 'vimeo', id: '...' }
  video?: { plateforme: 'youtube' | 'vimeo'; id: string };
};

// [À COMPLÉTER] années et descriptions FICTIVES, en attendant les vraies informations.
export const projets: Projet[] = [
  {
    slug: 'bande-annonce',
    titre: 'Bande-annonce',
    categorie: 'Réalisation',
    annee: '2023',
    role: 'Réalisation · Montage',
    resume: 'Réalisation complète d’une bande-annonce dans le cadre d’un projet d’école.',
    description: [
      "Projet de deuxième année d'école : imaginer et réaliser la bande-annonce d'un court métrage de fin d'études, en une minute trente, avec une équipe de quatre personnes.",
      "Écriture du découpage, tournage sur deux jours en intérieur, puis montage, étalonnage et habillage sonore. La bande-annonce a été projetée lors de la soirée de présentation des films de l'école.",
    ],
    teinte: ['#2ee6c5', '#02261f'],
  },
  {
    slug: 'short-com',
    titre: 'Short com',
    categorie: 'Réalisation',
    annee: '2024',
    role: 'Réalisation',
    resume: 'Un format court de communication, pensé pour les réseaux.',
    description: [
      "Format vertical de 45 secondes pour présenter un événement étudiant sur Instagram et TikTok, avec un message simple : donner envie de venir en un coup d'œil.",
      "Réalisation de bout en bout : idée, tournage au téléphone stabilisé, montage rythmé et sous-titres. Environ 12 000 vues en une semaine et une hausse nette des inscriptions.",
    ],
    teinte: ['#c6ff3d', '#1b2a00'],
  },
  {
    slug: 'film-feministe',
    titre: 'Film féministe',
    categorie: 'Fiction',
    annee: '2023',
    role: 'Assistanat de production',
    resume: 'Participation à un film engagé autour des droits des femmes.',
    description: [
      "Court métrage de fiction indépendant d'une vingtaine de minutes sur le harcèlement de rue, porté par une équipe bénévole et tourné à Paris sur un week-end.",
      "Assistanat de production : feuilles de service, gestion des figurants, régie sur les décors extérieurs et suivi du petit budget du tournage.",
    ],
    teinte: ['#ff7ac8', '#2a0619'],
  },
  {
    slug: 'jo-paris',
    titre: 'Jeux de Paris',
    categorie: 'Événementiel sportif',
    annee: '2024',
    role: 'Renfort événementiel',
    resume: 'Aide à l’organisation sur l’événementiel des Jeux Olympiques de Paris.',
    description: [
      "Renfort sur un site de compétition des Jeux Olympiques de Paris, au sein de l'équipe chargée de l'accueil des médias et des délégations.",
      "Gestion des accréditations, orientation des équipes de tournage et coordination des flux les jours d'épreuves. Une expérience intense sur un événement de dimension mondiale.",
    ],
    teinte: ['#3d8bff', '#020f2a'],
  },
  {
    slug: 'figuration',
    titre: 'Figuration',
    categorie: 'Plateau',
    annee: '2021 — 2023',
    role: 'Figuration',
    resume: 'Plusieurs expériences de figuration sur des tournages.',
    description: [
      "Une dizaine de jours de figuration sur des séries télévisées, un long métrage et deux publicités tournées en Île-de-France.",
      "L'occasion d'observer de près le fonctionnement d'un plateau : rôle de la régie, enchaînement des prises, communication entre mise en scène et équipes techniques.",
    ],
    teinte: ['#ffd23d', '#2a2002'],
  },
  {
    slug: 'myfuture',
    titre: 'Tournages MyFuture',
    categorie: 'Production',
    annee: '2022 — 2023',
    role: 'Organisation & réalisation',
    resume: 'Organisation et réalisation des tournages en alternance chez MyFuture.',
    description: [
      "Pendant l'alternance chez MyFuture, production d'une trentaine de vidéos : portraits d'étudiants, présentations de formations et contenus courts pour les réseaux.",
      "Préparation des tournages (repérages, plannings, autorisations), réalisation en petite équipe, puis suivi du montage et des retours jusqu'à la livraison finale.",
    ],
    teinte: ['#9b7bff', '#120a2a'],
  },
];

// Pour chaque étape : image (logo ou photo) affichée au survol.
// Mettre le fichier dans /public/parcours/ puis ajouter  image: 'parcours/mon-image.jpg'
// [À COMPLÉTER] dates et textes FICTIFS, en attendant les vraies informations.
export const parcours: { periode: string; structure: string; poste: string; texte: string; image?: string }[] = [
  {
    periode: '2024 — 2025',
    structure: 'Canal+ Sport',
    poste: 'Alternance · Gestion de production',
    texte:
      'Suivi des budgets de tournage des magazines foot et rugby, préparation des devis prestataires et coordination des plannings entre rédaction, équipes techniques et régie.',
  },
  {
    periode: '2023 — 2024',
    structure: 'CSTART',
    poste: 'Alternance · Gestion',
    texte:
      'Gestion administrative de projets audiovisuels : contrats des intervenants, suivi des factures, tableaux de bord de production et lien quotidien avec les clients.',
  },
  {
    periode: '2022 — 2023',
    structure: 'MyFuture',
    poste: 'Alternance · Organisation & réalisation des tournages',
    texte:
      'Une trentaine de vidéos produites dans l’année : repérages, feuilles de service, tournage en petite équipe, puis suivi du montage jusqu’à la livraison.',
  },
  {
    periode: 'Juillet — août 2024',
    structure: 'Jeux Olympiques de Paris',
    poste: 'Événementiel sportif',
    texte:
      'Renfort sur un site de compétition : accueil des équipes médias, gestion des accréditations et coordination des flux le jour des épreuves.',
  },
];
