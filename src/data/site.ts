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

export const projets: Projet[] = [
  {
    slug: 'bande-annonce',
    titre: 'Bande-annonce',
    categorie: 'Réalisation',
    annee: '20XX', // [À COMPLÉTER]
    role: 'Réalisation · Montage',
    resume: 'Réalisation complète d’une bande-annonce dans le cadre d’un projet d’école.',
    description: [
      '[À COMPLÉTER] Le contexte du projet scolaire, le film concerné, la consigne.',
      '[À COMPLÉTER] Ce qui a été fait : écriture, tournage, montage, étalonnage, son.',
    ],
    teinte: ['#2ee6c5', '#02261f'],
  },
  {
    slug: 'short-com',
    titre: 'Short com',
    categorie: 'Réalisation',
    annee: '20XX',
    role: 'Réalisation',
    resume: 'Un format court de communication, pensé pour les réseaux.',
    description: [
      '[À COMPLÉTER] Pour qui, quel message, quelle diffusion.',
      '[À COMPLÉTER] Rôle et les résultats (vues, retours…).',
    ],
    teinte: ['#c6ff3d', '#1b2a00'],
  },
  {
    slug: 'film-feministe',
    titre: 'Film féministe',
    categorie: 'Fiction',
    annee: '20XX',
    role: 'Participation au tournage',
    resume: 'Participation à un film engagé autour des droits des femmes.',
    description: [
      '[À COMPLÉTER] Le titre du film, l’équipe, le propos.',
      '[À COMPLÉTER] Rôle précis sur le projet.',
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
      '[À COMPLÉTER] Sur quel site / quelles épreuves, pour quelle structure.',
      '[À COMPLÉTER] Missions et ce qui en ressort.',
    ],
    teinte: ['#3d8bff', '#020f2a'],
  },
  {
    slug: 'figuration',
    titre: 'Figuration',
    categorie: 'Plateau',
    annee: '20XX',
    role: 'Figuration',
    resume: 'Plusieurs expériences de figuration sur des tournages.',
    description: [
      '[À COMPLÉTER] Les productions (films, séries, pubs).',
      '[À COMPLÉTER] Ce que ça a appris sur le fonctionnement d’un plateau.',
    ],
    teinte: ['#ffd23d', '#2a2002'],
  },
  {
    slug: 'myfuture',
    titre: 'Tournages MyFuture',
    categorie: 'Production',
    annee: '20XX',
    role: 'Organisation & réalisation',
    resume: 'Organisation et réalisation des tournages en alternance chez MyFuture.',
    description: [
      '[À COMPLÉTER] Les types de vidéos produites, le rythme, l’équipe.',
      '[À COMPLÉTER] Responsabilités, de la préparation à la livraison.',
    ],
    teinte: ['#9b7bff', '#120a2a'],
  },
];

export const parcours = [
  {
    periode: '20XX — 20XX', // [À COMPLÉTER]
    structure: 'Canal+ Sport',
    poste: 'Alternance · Gestion',
    texte: '[À COMPLÉTER] Missions de gestion au sein de Canal+ Sport.',
  },
  {
    periode: '20XX — 20XX',
    structure: 'CSTART',
    poste: 'Alternance · Gestion',
    texte: '[À COMPLÉTER] Missions de gestion chez CSTART.',
  },
  {
    periode: '20XX — 20XX',
    structure: 'MyFuture',
    poste: 'Alternance · Organisation & réalisation des tournages',
    texte: '[À COMPLÉTER] Préparation, planning, tournage et suivi des vidéos.',
  },
  {
    periode: '2024',
    structure: 'Jeux Olympiques de Paris',
    poste: 'Événementiel sportif',
    texte: '[À COMPLÉTER] Aide à l’organisation pendant les Jeux.',
  },
];
