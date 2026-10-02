/* ALVERA — motion: slow, smooth, precise, calm. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  root.classList.add('js');

  /* grano de película (una sola textura, reutilizada) */
  (() => {
    const c = document.createElement('canvas'); c.width = c.height = 180;
    const x = c.getContext('2d'), d = x.createImageData(180, 180);
    for (let i = 0; i < d.data.length; i += 4) { const v = 110 + Math.random() * 145; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = Math.random() * 95; }
    x.putImageData(d, 0, 0);
    root.style.setProperty('--grain', `url(${c.toDataURL()})`);
  })();

  $('#yr').textContent = new Date().getFullYear();

  /* ---------- reveal ---------- */
  $$('.lines').forEach(g => $$('.ln', g).forEach((l, i) => l.firstElementChild.style.setProperty('--i', i)));
  // las puertas (clip-path) se observan a través de su contenedor: un elemento recortado a 0 nunca "intersecta"
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { (e.target._door || e.target).classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv,.lines').forEach(el => io.observe(el));
  $$('.door').forEach(el => { const host = el.parentElement; host._door = el; io.observe(host); });

  /* ---------- statement: palabras que se encienden ---------- */
  const st = $('#statementText');
  const words = [];
  (function wrapWords(node) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = t; words.push(s); frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) wrapWords(n);
    });
  })(st);

  /* ---------- contadores ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const to = +e.target.dataset.count; if (reduce) { e.target.textContent = to; return; }
    const t0 = performance.now(), dur = 2600;
    const step = t => { const p = clamp((t - t0) / dur), v = 1 - Math.pow(1 - p, 4); e.target.textContent = Math.round(to * v); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- method: paso activo ---------- */
  const steps = $$('.step'), mms = $$('.mm'), mmNow = $('#mmNow');
  const sio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const i = +e.target.dataset.i;
    steps.forEach((s, k) => s.classList.toggle('on', k === i));
    mms.forEach((m, k) => m.classList.toggle('on', k === i));
    mmNow.textContent = String(i + 1).padStart(2, '0');
  }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => sio.observe(s));

  /* ---------- services: imagen flotante / tap ---------- */
  const fl = $('#svcFloat'), items = $$('.svc-i'), flImgs = $$('.ph', fl);
  const hoverOK = () => matchMedia('(hover:hover) and (min-width:901px)').matches;
  let fx = 0, fy = 0, tx = 0, ty = 0;
  items.forEach((li, i) => {
    li.addEventListener('mouseenter', e => { if (!hoverOK()) return; fl.classList.add('on'); flImgs.forEach((p, k) => p.classList.toggle('on', k === i)); fx = tx = e.clientX; fy = ty = e.clientY; });
    li.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    li.addEventListener('mouseleave', () => fl.classList.remove('on'));
    $('button', li).addEventListener('click', () => {
      if (hoverOK()) return;
      const open = !li.classList.contains('open');
      items.forEach(o => { o.classList.remove('open'); $('button', o).setAttribute('aria-expanded', 'false'); });
      li.classList.toggle('open', open); $('button', li).setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- nav / menú ---------- */
  const nav = $('#nav'), menuBtn = $('#menuBtn'), menu = $('#menu');
  const setMenu = o => { document.body.classList.toggle('menu-open', o); menuBtn.setAttribute('aria-expanded', o); menu.setAttribute('aria-hidden', !o); document.body.style.overflow = o ? 'hidden' : ''; };
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- horizontal work ---------- */
  const work = $('.work'), track = $('#workTrack'), bar = $('#workBar');
  let dist = 0;
  const hz = () => !reduce && innerWidth > 900;
  function sizeWork() {
    if (!hz()) { work.style.height = ''; track.style.transform = ''; dist = 0; return; }
    track.style.transform = 'none';
    dist = Math.max(0, track.scrollWidth - innerWidth);
    work.style.height = (dist + innerHeight) + 'px';
  }

  /* ---------- frame loop ---------- */
  const heroMedia = $('#heroMedia'), heroInner = $('#heroInner'), heroShade = $('#heroShade'), heroFade = $('#heroFade');
  const matter = $('.matter'), matterBg = $('.matter-bg'), mw = $$('#matterWords li');
  const pars = $$('[data-par]');
  let ly = scrollY, lastY = scrollY, vh = innerHeight;

  function frame() {
    const y = scrollY;
    ly += (y - ly) * .1; if (Math.abs(y - ly) < .1) ly = y;

    // nav
    nav.classList.toggle('scrolled', y > 50);
    if (!document.body.classList.contains('menu-open')) nav.classList.toggle('hide', y > vh * .9 && y > lastY + 1);
    if (y < lastY - 1) nav.classList.remove('hide');
    lastY = y;

    if (!reduce) {
      // hero: el espacio se abre suavemente
      const p = clamp(ly / vh);
      heroMedia.style.transform = `translate3d(0,${(p * 4.5).toFixed(2)}%,0) scale(${(1.1 - .1 * p).toFixed(4)})`;
      heroInner.style.transform = `translate3d(0,${(-p * 34).toFixed(1)}px,0)`;
      heroInner.style.opacity = (1 - p * .5).toFixed(3);
      heroShade.style.opacity = (1 + p * .5).toFixed(3);
      heroFade.style.opacity = clamp((p - .45) * 1.9).toFixed(3);

      // statement
      const sr = st.getBoundingClientRect();
      const sp = clamp((vh * .82 - sr.top) / (sr.height + vh * .25));
      const n = Math.round(sp * 1.15 * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));

      // work
      if (dist) {
        const r = work.getBoundingClientRect(), pr = clamp(-r.top / (r.height - vh));
        track.style.transform = `translate3d(${(-pr * dist).toFixed(1)}px,0,0)`;
        bar.style.width = (pr * 100).toFixed(1) + '%';
      }

      // materiality
      const mr = matter.getBoundingClientRect(), mp = clamp(-mr.top / (mr.height - vh));
      if (mr.bottom > 0 && mr.top < vh) {
        matterBg.style.transform = `translate3d(0,${((.5 - mp) * 5).toFixed(2)}%,0) scale(${(1.16 - .16 * mp).toFixed(4)})`;
        mw.forEach((li, i) => li.classList.toggle('on', mp > .1 + i * .15));
      }

      // parallax muy leve
      pars.forEach(w => {
        const r = w.getBoundingClientRect(); if (r.bottom < -100 || r.top > vh + 100) return;
        const off = (r.top + r.height / 2 - vh / 2) / vh, ph = $('.ph', w);
        ph.style.transform = `translate3d(0,${(off * -(+w.dataset.par)).toFixed(2)}px,0)`;
      });
    }

    // imagen flotante de servicios
    fx += (tx - fx) * .12; fy += (ty - fy) * .12;
    fl.style.transform = `translate3d(${(fx + 44).toFixed(1)}px,${(fy - fl.offsetHeight * .5).toFixed(1)}px,0) rotate(${clamp((tx - fx) / 400, -.04, .04).toFixed(3)}rad)`;

    requestAnimationFrame(frame);
  }

  /* ---------- formulario (mock) ---------- */
  const form = $('#form'), msg = $('#formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('[required]', form).forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.closest('.f').classList.toggle('err', bad); if (bad) ok = false; });
    if (!ok) { msg.textContent = 'Please add your name and a valid email.'; return; }
    msg.textContent = 'Thank you — we will write to you within two working days.';
    console.info('[ALVERA demo] form payload', Object.fromEntries(new FormData(form)));
    form.reset();
  });

  /* ---------- video ambiental: lazy, mudo, en loop; solo se reproduce lo que se ve ---------- */
  const saveData = navigator.connection && navigator.connection.saveData;
  const videoOK = () => !reduce && !saveData;
  const seen = new Map();
  function setVideo(host) {
    const v = host._video; if (!v) return;
    const want = seen.get(host) && !(host.classList.contains('mm') && !host.classList.contains('on'));
    if (want) {
      if (!v.src) v.src = host.dataset.video;
      const p = v.play(); if (p && p.catch) p.catch(() => {});
    } else if (v.src) v.pause();
  }
  const vio = new IntersectionObserver(es => es.forEach(e => { seen.set(e.target, e.isIntersecting); setVideo(e.target); }), { threshold: .2 });
  if (videoOK()) $$('.ph[data-video]').forEach(host => {
    const v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.preload = 'none'; v.disablePictureInPicture = true;
    // iOS Safari exige los atributos en el DOM (no basta con las propiedades) para permitir autoplay
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    v.setAttribute('aria-hidden', 'true'); v.tabIndex = -1;
    v.className = 'ph-video';
    v.addEventListener('playing', () => v.classList.add('on'));
    if (host.closest('.hero')) {
      // el hero arranca ya: autoplay + src inmediato (iOS lo permite si va muted + playsinline)
      v.autoplay = true; v.setAttribute('autoplay', ''); v.preload = 'auto'; v.src = host.dataset.video;
      v.addEventListener('loadeddata', () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); });
    }
    host.appendChild(v); host._video = v;
    vio.observe(host);
  });
  // Modo de bajo consumo / autoplay bloqueado: reintenta en el primer toque o scroll
  const retry = () => seen.forEach((vis, h) => { if (vis && h._video && h._video.paused) setVideo(h); });
  ['touchend', 'pointerup', 'click', 'keydown'].forEach(ev => addEventListener(ev, retry, { passive: true }));
  // el método cambia de imagen activa: sincroniza sus videos
  new MutationObserver(ms => ms.forEach(m => setVideo(m.target))).observe(document.querySelector('.method-media'), { subtree: true, attributes: true, attributeFilter: ['class'] });

  /* ---------- resize ---------- */
  let rt, lastOrient = innerWidth > innerHeight;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      vh = innerHeight; sizeWork();
      const o = innerWidth > innerHeight;
      if (o !== lastOrient) { lastOrient = o; ['.hero-ph', '#matterImg'].forEach(s => ALV.render($(s))); }
    }, 150);
  });
  addEventListener('load', sizeWork);
  document.fonts && document.fonts.ready.then(sizeWork);
  sizeWork();
  requestAnimationFrame(frame);
})();
