import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s as any) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s as any)) as T[];

/* ── Défilement fluide ─────────────────────────────── */
const lenis = new Lenis({ duration: 1.15, smoothWheel: !reduce });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

// ancres internes
$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target as any, { offset: 0, duration: 1.6 });
  }),
);

/* ── En-tête qui se cache au défilement ─────────────── */
const header = $('[data-header]');
let lastY = 0;
lenis.on('scroll', ({ scroll }: { scroll: number }) => {
  if (!header) return;
  header.classList.toggle('is-hidden', scroll > lastY && scroll > 200);
  header.classList.toggle('is-scrolled', scroll > 30);
  lastY = scroll;
});

/* ── Révélations mises en attente pendant l'intro ───── */
let pageReady = false;
const queue: (() => void)[] = [];
const whenReady = (fn: () => void) => (pageReady ? fn() : queue.push(fn));
const flush = () => {
  pageReady = true;
  queue.splice(0).forEach((fn) => fn());
};

/* ── Transitions entre les pages ────────────────────── */
const curtain = $('.curtain');
const volets = $$('.curtain i');
// navigateurs récents : le navigateur anime lui-même le passage d'une page à l'autre
const vt = document.documentElement.classList.contains('vt');
function pageLinks() {
  $$<HTMLAnchorElement>('a[data-page]').forEach((a) =>
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const href = a.href;
      if (!curtain || reduce) return;
      if (new URL(href).pathname === location.pathname) {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }
      if (vt) {
        // on retient l'endroit du clic : l'onde de transition partira de là, sur les deux pages
        const x = e.clientX || window.innerWidth / 2;
        const y = e.clientY || window.innerHeight / 2;
        document.documentElement.style.setProperty('--vx', `${x}px`);
        document.documentElement.style.setProperty('--vy', `${y}px`);
        try {
          sessionStorage.setItem('pf-clic', `${Math.round(x)},${Math.round(y)}`);
        } catch {}
        return;
      }
      e.preventDefault();
      lenis.stop();
      // la page recule légèrement pendant que les volets montent l'un après l'autre
      gsap.to('main, .footer', { scale: 0.97, autoAlpha: 0.4, duration: 0.7, ease: 'power3.inOut' });
      gsap.fromTo(
        volets,
        { y: 0, yPercent: 101 },
        { yPercent: 0, duration: 0.62, ease: 'expo.inOut', stagger: 0.055, onComplete: () => (location.href = href) },
      );
    }),
  );
  // retour arrière du navigateur : on retire les volets
  window.addEventListener('pageshow', (e) => {
    if (e.persisted && curtain) {
      gsap.set(volets, { y: 0, yPercent: 101 });
      gsap.set('main, .footer', { clearProps: 'transform,opacity,visibility' });
      lenis.start();
    }
  });
}

/* ── Préchargement + intro ─────────────────────────── */
function intro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const pre = $('.preloader');
  const count = $('[data-count]');
  const obj = { v: 0 };
  const dejaVu = document.documentElement.classList.contains('deja-vu');
  try {
    sessionStorage.setItem('pf-vu', '1');
  } catch {}

  if (dejaVu && vt) {
    // la page arrive en glissant : on lance les apparitions pendant qu'elle monte
    tl.add(flush, 0.45);
  } else if (dejaVu && curtain) {
    // arrivée depuis une autre page : le rideau remonte
    // arrivée depuis une autre page : les volets continuent vers le haut, le contenu apparaît dessous
    tl.fromTo(volets, { y: 0, yPercent: 0 }, { yPercent: -101, duration: reduce ? 0 : 0.8, ease: 'expo.inOut', stagger: reduce ? 0 : 0.055 }, 0.05)
      .set(volets, { yPercent: 101 })
      .fromTo('main, .footer', { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0 : 0.9, ease: 'power2.out' }, 0.2)
      .add(flush, reduce ? 0 : 0.4);
  } else if (pre && count && !reduce) {
    tl.to(obj, {
      v: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => (count.textContent = String(Math.round(obj.v))),
    })
      .to('.preloader__bar span', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
      .to(pre, { yPercent: -125, duration: 1.2, ease: 'expo.inOut' }, '+=0.15')
      .set(pre, { display: 'none' });
  } else if (pre) {
    tl.set(pre, { display: 'none' });
  }

  if (!dejaVu) tl.add(flush, '-=0.5');

  if ($('.hero__char')) {
    tl.from('.hero__name', { autoAlpha: 0, duration: 0.8, ease: 'power1.out' }, dejaVu ? 0.45 : pre && !reduce ? '-=0.6' : 0)
      .from('[data-hero-line]', { autoAlpha: 0, duration: 0.8, ease: 'power1.out' }, '-=0.5')
      .from('[data-hero-fade]', { autoAlpha: 0, y: 16, duration: 1, stagger: 0.08 }, '-=1');
  }
  if (!dejaVu) tl.from('[data-header]', { autoAlpha: 0, duration: 1 }, '-=0.8');
  tl.add(() => {
    document.body.classList.remove('is-loading');
    lenis.start();
  }, dejaVu ? 0.5 : '-=1');
}

/* ── Animations au défilement ───────────────────────── */
function scrollAnimations() {
  const mm = gsap.matchMedia();

  // le showreel s'ouvre en plein cadre
  const frame = $('[data-reel-frame]');
  if (frame) {
    mm.add('(min-width: 901px)', () => {
      gsap.to(frame, {
        clipPath: 'inset(0% 0% 0% 0% round 18px)',
        ease: 'none',
        scrollTrigger: { trigger: '[data-reel]', start: 'top bottom', end: 'top top', scrub: true },
      });
    });
    mm.add('(max-width: 900px)', () => {
      gsap.to(frame, {
        clipPath: 'inset(0% 0% 0% 0% round 18px)',
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'center center', scrub: true },
      });
    });
    // le nom glisse légèrement en partant
    gsap.to('.hero__name', {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // timecode du showreel
  const tc = $('[data-timecode]');
  if (tc) {
    const t0 = performance.now();
    gsap.ticker.add(() => {
      const ms = performance.now() - t0;
      const f = Math.floor((ms / 40) % 25);
      const s = Math.floor(ms / 1000);
      const p = (n: number) => String(n).padStart(2, '0');
      tc.textContent = `00:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(f)}`;
    });
  }

  // bandeaux défilants, accélérés par la vitesse de défilement
  $$('[data-marquee]').forEach((row) => {
    const dir = Number(row.dataset.marquee);
    const track = $('.marquee__track', row)!;
    track.innerHTML += track.innerHTML; // doublé pour la boucle
    let x = 0;
    let boost = 0;
    gsap.ticker.add((_, dt) => {
      const w = track.scrollWidth / 2;
      x -= (0.06 + boost) * dt * dir;
      boost *= 0.92;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      track.style.transform = `translate3d(${x}px,0,0)`;
    });
    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      boost = Math.min(Math.abs(velocity) * 0.04, 1.2);
    });
  });

  // titres : lignes qui montent
  $$('[data-reveal]').forEach((el) => {
    const tw = gsap.from(el, { autoAlpha: 0, duration: 0.7, ease: 'power1.out', paused: true });
    ScrollTrigger.create({
      trigger: el.closest('h1, h2') ?? el,
      start: 'top 85%',
      once: true,
      onEnter: () => whenReady(() => tw.play()),
    });
  });

  // texte de profil : les mots s'allument au fil du défilement
  $$('[data-words]').forEach((el) => {
    const split = new SplitText(el, { type: 'words' });
    gsap.fromTo(
      split.words,
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      },
    );
  });

  // compteurs
  $$('[data-counter]').forEach((el) => {
    const end = Number(el.dataset.counter);
    const o = { v: 0 };
    gsap.to(o, {
      v: end,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => (el.textContent = String(Math.round(o.v))),
    });
  });

  // liste des compétences
  gsap.from('[data-skill]', {
    y: 12,
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.05,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.about__skills', start: 'top 85%' },
  });


  // projets : carrousel horizontal automatique, piloté par la souris
  carousel();
  if ($('[data-card]')) {
    const btns = $$('[data-card] .card__btn');
    gsap.set(btns, { y: 110, autoAlpha: 0 });
    whenReady(() => gsap.to(btns, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.07, ease: 'expo.out', delay: 0.1, clearProps: 'transform' }));
  }
  tilt();
  aura();

  // parcours : les lignes se dessinent
  $$('[data-row]').forEach((row) => {
    const tl = gsap.timeline({ paused: true });
    ScrollTrigger.create({ trigger: row, start: 'top 92%', once: true, onEnter: () => whenReady(() => tl.play()) });
    tl.from($('[data-row-line]', row), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' }).from(
      Array.from(row.children.length > 2 ? row.children : row.querySelectorAll('a > *')).filter((c) => !c.hasAttribute('data-row-line')),
      { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' },
      '-=0.7',
    );
  });

  // parcours : image qui suit la souris au survol d'une ligne
  const float = $('[data-float]');
  if (float && finePointer) {
    gsap.set(float, { xPercent: -50, yPercent: -50, scale: 0.8, transformPerspective: 900 });
    const fry = gsap.quickTo(float, 'rotationY', { duration: 0.7, ease: 'power3' });
    const fx = gsap.quickTo(float, 'x', { duration: 0.5, ease: 'power3' });
    const fy = gsap.quickTo(float, 'y', { duration: 0.5, ease: 'power3' });
    const fr = gsap.quickTo(float, 'rotate', { duration: 0.6, ease: 'power3' });
    let lastX = 0;
    $$('[data-float-row]').forEach((row) => {
      row.addEventListener('pointerenter', (e) => {
        $$('[data-float-item]', float).forEach((it) => it.classList.toggle('is-on', it.dataset.floatItem === row.dataset.floatRow));
        if (float.style.visibility !== 'inherit') gsap.set(float, { x: e.clientX + 180, y: e.clientY });
        lastX = e.clientX;
        gsap.to(float, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
      });
      row.addEventListener('pointermove', (e) => {
        // l'image se place à droite du pointeur, sans sortir de l'écran
        const w = float.offsetWidth;
        fx(Math.min(e.clientX + 40 + w / 2, window.innerWidth - w / 2 - 16));
        fy(e.clientY);
        fr(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4));
        fry(gsap.utils.clamp(-28, 28, (e.clientX - lastX) * 1.4));
        lastX = e.clientX;
      });
    });
    $('.tl__list')?.addEventListener('pointerleave', () => {
      gsap.to(float, { autoAlpha: 0, scale: 0.8, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });
      fr(0);
      fry(0);
    });
    lenis.on('scroll', () => {
      if (!$('.tl__row:hover')) gsap.to(float, { autoAlpha: 0, scale: 0.8, duration: 0.2, overwrite: 'auto' });
    });
  }

  // grand prénom en bas de page
  if ($('[data-giant]')) gsap.from('[data-giant]', {
    yPercent: 40,
    ease: 'none',
    scrollTrigger: { trigger: '[data-giant]', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
}

/* ── Carrousel de projets ───────────────────────────── */
let carouselDragged = false;
let carouselPaused = false;
function carousel() {
  const root = $('[data-carousel]');
  const track = $('[data-carousel-track]');
  if (!root || !track) return;

  const BASE = reduce ? 0 : 0.06; // vitesse de croisière (px par ms), vers la gauche
  const BOOST = 0.4; // vitesse max ajoutée quand la souris est collée au bord
  let x = 0;
  let speed = -BASE; // vitesse actuelle (lissée)
  let target = -BASE; // vitesse visée
  let visible = false;
  let hovering = false;
  let dragging = false;
  let dragStartX = 0;
  let dragStartPos = 0;
  let lastPointerX = 0;
  let dragVel = 0;
  let wheeling = false;

  const half = () => track.scrollWidth / 2; // largeur d'un jeu de cartes (le 2e est une copie)

  // mise en volume : les cartes tournent et reculent en s'éloignant du centre, comme sur un tambour
  const cards = $$('[data-card]', track);
  let geo: { c: number }[] = [];
  let vw = window.innerWidth;
  const measure = () => {
    vw = window.innerWidth;
    geo = cards.map((c) => ({ c: c.offsetLeft + c.offsetWidth / 2 }));
  };
  measure();
  window.addEventListener('resize', measure);
  const paint = () => {
    track.style.transform = `translate3d(${x}px,0,0)`;
    if (reduce) return;
    const angle = vw < 900 ? 16 : 30;
    const depth = vw < 900 ? 70 : 210;
    for (let i = 0; i < cards.length; i++) {
      const n = gsap.utils.clamp(-1.5, 1.5, (geo[i].c + x - vw / 2) / (vw / 2));
      cards[i].style.transform = `translate3d(0,0,${(-n * n * depth).toFixed(1)}px) rotateY(${(n * angle).toFixed(2)}deg)`;
    }
  };
  paint();
  const loop = () => {
    const w = half();
    if (w <= 0) return;
    while (x <= -w) x += w;
    while (x > 0) x -= w;
  };

  ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onToggle: (st) => (visible = st.isActive) });

  // souris à droite : on avance vers la droite (plus vite) ; souris à gauche : on repart vers la gauche
  root.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || dragging) return;
    hovering = true;
    const r = root.getBoundingClientRect();
    const n = ((e.clientX - r.left) / r.width) * 2 - 1; // -1 … 1
    const dead = 0.35; // zone centrale : vitesse de croisière ralentie
    const k = Math.abs(n) < dead ? 0 : Math.sign(n) * ((Math.abs(n) - dead) / (1 - dead)) ** 1.6;
    target = k === 0 ? -BASE * 0.6 : -k * BOOST - (k > 0 ? BASE : 0);
    root.classList.toggle('go-right', k > 0.05);
    root.classList.toggle('go-left', k < -0.05);
  });
  root.addEventListener('pointerleave', () => {
    hovering = false;
    target = -BASE;
    root.classList.remove('go-left', 'go-right');
  });

  // défilement horizontal au pavé tactile (ou Maj + molette)
  let wheelTimer = 0;
  root.addEventListener(
    'wheel',
    (e) => {
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
      if (Math.abs(dx) <= Math.abs(e.deltaY) && !e.shiftKey) return; // geste vertical : la page défile normalement
      e.preventDefault();
      x -= dx;
      loop();
      paint();
      wheeling = true;
      speed = gsap.utils.clamp(-1.5, 1.5, -dx / 16);
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => (wheeling = false), 120);
    },
    { passive: false },
  );

  // glisser (souris ou doigt)
  root.addEventListener('pointerdown', (e) => {
    dragging = true;
    carouselDragged = false;
    dragStartX = lastPointerX = e.clientX;
    dragStartPos = x;
    dragVel = 0;
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 6 && !carouselDragged) {
      carouselDragged = true;
      root.classList.add('is-dragging');
    }
    if (carouselDragged) {
      x = dragStartPos + dx;
      dragVel = e.clientX - lastPointerX;
      lastPointerX = e.clientX;
      loop();
      paint();
    }
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove('is-dragging');
    if (carouselDragged) speed = gsap.utils.clamp(-2, 2, dragVel / 16); // élan au lâcher
    setTimeout(() => (carouselDragged = false), 0);
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);

  gsap.ticker.add((_, dt) => {
    if (!visible || dragging || wheeling || carouselPaused) return;
    const t = hovering ? target : -BASE;
    speed += (t - speed) * Math.min(1, dt / 250); // accélération douce
    x += speed * dt;
    loop();
    paint();
  });
}

/* ── Cartes projets : inclinaison et reflet sous la souris ── */
function tilt() {
  if (!finePointer || reduce) return;
  $$('.card__btn').forEach((btn) => {
    const media = $('.card__media', btn);
    if (!media) return;
    btn.addEventListener('pointermove', (e) => {
      const r = media.getBoundingClientRect();
      const px = gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width);
      const py = gsap.utils.clamp(0, 1, (e.clientY - r.top) / r.height);
      btn.classList.add('is-tilting');
      media.style.setProperty('--ry', `${((px - 0.5) * 16).toFixed(2)}deg`);
      media.style.setProperty('--rx', `${((0.5 - py) * 14).toFixed(2)}deg`);
      media.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      media.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    });
    btn.addEventListener('pointerleave', () => {
      btn.classList.remove('is-tilting');
      media.style.setProperty('--ry', '0deg');
      media.style.setProperty('--rx', '0deg');
    });
  });
}

/* ── Halo de lumière qui suit la souris ─────────────── */
function aura() {
  const el = $('[data-aura]');
  if (!el || !finePointer || reduce) return;
  const ax = gsap.quickTo(el, 'x', { duration: 1.6, ease: 'power3' });
  const ay = gsap.quickTo(el, 'y', { duration: 1.6, ease: 'power3' });
  let on = false;
  window.addEventListener('pointermove', (e) => {
    if (!on) {
      on = true;
      gsap.set(el, { x: e.clientX, y: e.clientY });
      gsap.to(el, { opacity: 1, duration: 1.2 });
    }
    ax(e.clientX);
    ay(e.clientY);
  });
}

/* ── Boutons magnétiques (souris classique) ─────────── */
function cursor() {
  if (!finePointer) return;

  $$('[data-magnetic]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * 0.3);
      my((e.clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener('pointerleave', () => {
      mx(0);
      my(0);
    });
  });
}

/* ── Fenêtre de détail des projets ──────────────────── */
function modal() {
  const m = $('[data-modal]');
  if (!m) return;
  const panel = $('.modal__panel', m)!;
  const veil = $('.modal__veil', m)!;
  const closeBtn = $('.modal__close', m)!;
  let current: HTMLElement | null = null;
  let opener: HTMLElement | null = null;
  let pull = 0;
  let closing = false;
  const flash = $('[data-flash]', m);
  const FULL = 'inset(0px 0px 0px 0px round 0px)';
  // découpe de la fiche aux dimensions de la carte (ou null si la carte n'est plus à l'écran)
  const cardRect = (from: HTMLElement | null) => {
    const r = from ? ($('.card__media', from) ?? from).getBoundingClientRect() : null;
    if (!r || r.right < 40 || r.left > window.innerWidth - 40 || r.bottom < 40 || r.top > window.innerHeight - 40) return null;
    return r;
  };
  const cardClip = (from: HTMLElement | null) => {
    const r = cardRect(from);
    if (!r) return `inset(${window.innerHeight * 0.5}px ${window.innerWidth * 0.5}px ${window.innerHeight * 0.5}px ${window.innerWidth * 0.5}px round 18px)`;
    const c = (v: number) => Math.max(0, v).toFixed(1);
    return `inset(${c(r.top)}px ${c(window.innerWidth - r.right)}px ${c(window.innerHeight - r.bottom)}px ${c(r.left)}px round 18px)`;
  };

  const open = (slug: string, from: HTMLElement) => {
    current = $(`[data-project="${slug}"]`, m);
    if (!current) return;
    opener = from;
    $$('[data-project]', m).forEach((a) => (a.hidden = a !== current));
    $$('iframe[data-src]', current).forEach((f) => (f.setAttribute('src', f.dataset.src!)));
    panel.scrollTop = 0;
    m.classList.add('is-open');
    document.documentElement.classList.add('fiche-ouverte');
    m.setAttribute('aria-hidden', 'false');
    lenis.stop();
    pull = 0;
    closing = false;
    carouselPaused = true;
    // la fiche s'ouvre depuis la carte cliquée, qui s'agrandit jusqu'à remplir l'écran
    const card = from.closest<HTMLElement>('[data-card]');
    if (flash && card) {
      flash.style.setProperty('--c1', card.style.getPropertyValue('--c1'));
      flash.style.setProperty('--c2', card.style.getPropertyValue('--c2'));
    }
    gsap.set(panel, { yPercent: 0, y: 0, clipPath: reduce ? FULL : cardClip(from) });
    gsap.timeline()
      .to(veil, { opacity: 1, duration: 0.5 })
      .to('.projects', { scale: 0.93, autoAlpha: 0.5, duration: 0.9, ease: 'expo.out' }, 0)
      .fromTo(flash, { opacity: 1 }, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 0.15)
      .to(panel, { clipPath: FULL, duration: 0.95, ease: 'expo.inOut' }, 0)
      .fromTo(closeBtn, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 0.5)
      .from($$('.modal__head > *, .modal__video, .modal__text, .modal__next', current), { y: 60, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'expo.out' }, 0.45);
    $('.modal__close', m)?.focus({ preventScroll: true });
  };

  // dir 'down' : la fiche redescend (croix, Échap) ; 'up' : elle part vers le haut (défilement au-delà de la fin)
  const close = (dir: 'down' | 'up' = 'down') => {
    if (!m.classList.contains('is-open') || closing) return;
    closing = true;
    gsap.timeline({
      onComplete: () => {
        m.classList.remove('is-open');
        document.documentElement.classList.remove('fiche-ouverte');
        m.setAttribute('aria-hidden', 'true');
        if (current) $$('iframe[data-src]', current).forEach((f) => f.setAttribute('src', 'about:blank'));
        gsap.set(panel, { yPercent: 100, y: 0, clipPath: FULL });
        carouselPaused = false;
        if (dir === 'up') {
          // retour en haut de la liste des projets ; on laisse retomber l'élan du défilement
          lenis.scrollTo(0, { immediate: true, force: true });
          window.setTimeout(() => lenis.start(), 700);
        } else lenis.start();
        opener?.focus({ preventScroll: true });
        closing = false;
      },
    })
      .to(closeBtn, { autoAlpha: 0, scale: 0.6, duration: 0.3 }, 0)
      .to('.projects', { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'expo.out', clearProps: 'transform' }, dir === 'up' ? 0.25 : 0.1)
      .to(panel, dir === 'up'
        ? { yPercent: -100, y: 0, duration: 0.9, ease: 'expo.inOut' }
        : cardRect(opener) && !reduce
          ? { clipPath: cardClip(opener), y: 0, duration: 0.8, ease: 'expo.inOut' }
          : { yPercent: 100, y: 0, duration: 0.7, ease: 'expo.in' }, 0)
      .to(dir === 'down' && cardRect(opener) && !reduce ? flash : {}, { opacity: 1, duration: 0.45, ease: 'power2.in' }, 0.25)
      .to(veil, { opacity: 0, duration: 0.4 }, '-=0.3')
      .set(flash, { opacity: 0 });
  };

  // continuer à défiler en bas de la fiche ramène à la liste des projets
  const PULL_MAX = 150;
  let pullTimer = 0;
  // on ignore l'élan qui amène en bas : il faut être arrivé au bout depuis un court instant
  let bottomSince = 0;
  const atBottom = () => {
    const bottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2;
    if (!bottom) {
      bottomSince = 0;
      return false;
    }
    if (!bottomSince) bottomSince = performance.now();
    return performance.now() - bottomSince > 350;
  };
  panel.addEventListener('scroll', () => atBottom(), { passive: true });
  const addPull = (d: number) => {
    if (closing) return;
    pull = Math.max(0, pull + d);
    const bar = current ? $('[data-pull-bar]', current) : null;
    gsap.to(panel, { y: -pull * 0.5, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
    if (bar) gsap.to(bar, { scaleX: Math.min(1, pull / PULL_MAX), duration: 0.2, overwrite: 'auto' });
    window.clearTimeout(pullTimer);
    if (pull >= PULL_MAX) {
      pull = 0;
      close('up');
      if (bar) gsap.set(bar, { scaleX: 0, delay: 1 });
      return;
    }
    pullTimer = window.setTimeout(() => {
      pull = 0;
      gsap.to(panel, { y: 0, duration: 0.6, ease: 'expo.out' });
      if (bar) gsap.to(bar, { scaleX: 0, duration: 0.5, ease: 'expo.out' });
    }, 350);
  };
  panel.addEventListener(
    'wheel',
    (e) => {
      if (e.deltaY > 0 && atBottom()) addPull(e.deltaY);
      else if (pull > 0 && e.deltaY < 0) addPull(e.deltaY * 2);
    },
    { passive: true },
  );
  let touchY = 0;
  panel.addEventListener('touchstart', (e) => (touchY = e.touches[0].clientY), { passive: true });
  panel.addEventListener(
    'touchmove',
    (e) => {
      const y = e.touches[0].clientY;
      const d = touchY - y;
      touchY = y;
      if (d > 0 && atBottom()) addPull(d * 2.2);
    },
    { passive: true },
  );

  gsap.set(panel, { yPercent: 100 });
  $$('[data-open]').forEach((b) =>
    b.addEventListener('click', (e) => {
      if (carouselDragged) return e.preventDefault();
      open(b.dataset.open!, b);
    }),
  );
  // « Projet suivant » en bas de chaque fiche
  $$('[data-next]', m).forEach((b) =>
    b.addEventListener('click', () => {
      const next = $(`[data-project="${b.dataset.next}"]`, m);
      if (!next || !current) return;
      const prev = current;
      gsap.to(prev, {
        autoAlpha: 0,
        y: -40,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          $$('iframe[data-src]', prev).forEach((f) => f.setAttribute('src', 'about:blank'));
          gsap.set(prev, { autoAlpha: 1, y: 0 });
          prev.hidden = true;
          current = next;
          next.hidden = false;
          $$('iframe[data-src]', next).forEach((f) => f.setAttribute('src', f.dataset.src!));
          panel.scrollTop = 0;
          gsap.from($$('.modal__head > *, .modal__video, .modal__text, .modal__next', next), {
            y: 50,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.06,
            ease: 'expo.out',
          });
        },
      });
    }),
  );
  $$('[data-close]', m).forEach((b) => b.addEventListener('click', () => close()));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && close());
}

/* ── Horloge de Paris ───────────────────────────────── */
function clock() {
  const el = $('[data-clock]');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
  const tick = () => (el.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 15000);
}

/* ── Démarrage ──────────────────────────────────────── */
cursor();
modal();
clock();
pageLinks();
document.fonts.ready.then(() => {
  scrollAnimations();
  intro();
  ScrollTrigger.refresh();
});
