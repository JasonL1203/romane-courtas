# Portfolio de Romane Courtas

Site portfolio animé (Astro + GSAP/ScrollTrigger + Lenis), publié sur GitHub Pages.

## Modifier le contenu

Presque tout se change dans **`src/data/site.ts`** : profil, textes, chiffres, compétences, projets, parcours, liens.
Les éléments marqués `[À COMPLÉTER]` sont des contenus de remplacement.

- **Images de projets** : déposer le fichier dans `public/projets/` puis indiquer `image: 'projets/mon-image.jpg'` dans le projet.
- **Vidéos** : ajouter `video: { plateforme: 'youtube', id: 'XXXXXXXX' }` (l'identifiant est la fin du lien YouTube ou Vimeo).
- **Showreel** de l'accueil : `profil.showreel`.

## Travailler en local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère le site dans dist/
```

## Mise en ligne

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque push sur `main`.
Dans le dépôt GitHub : **Settings → Pages → Source : GitHub Actions**.
Un dépôt nommé `<pseudo>.github.io` donne l'adresse `https://<pseudo>.github.io/`.
