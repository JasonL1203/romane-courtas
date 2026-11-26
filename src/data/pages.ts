// Pages du site, dans l'ordre du menu
const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
export const url = (slug: string) => (slug ? `${base}${slug}/` : base);

export const pages = [
  { slug: '', label: 'Profil', resume: 'Qui je suis, ce que je sais faire' },
  { slug: 'projets', label: 'Projets', resume: 'Tournages, films, événements' },
  { slug: 'parcours', label: 'Parcours', resume: 'Alternances et expériences' },
  { slug: 'contact', label: 'Contact', resume: 'Travailler ensemble' },
];

export const suivante = (slug: string) => {
  const i = pages.findIndex((p) => p.slug === slug);
  const n = pages[i + 1];
  return n ? { label: n.label, href: url(n.slug) } : { label: 'Accueil', href: url('') };
};
