/* ALVERA — escenas provisionales (placeholders fotográficos ilustrados en SVG).
   Sustituir por fotografía real con data-img="ruta.jpg" en cada .ph */
(function () {
  const f = n => Math.round(n * 10) / 10;
  const rng = s => () => ((s = (s * 16807) % 2147483647) / 2147483647);
  let uid = 0;

  const pts = p => p.map(q => q.map(f).join(',')).join(' ');
  const poly = (p, fill, a = '') => `<polygon points="${pts(p)}" fill="${fill}" ${a}/>`;
  const rect = (x, y, w, h, fill, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${a}/>`;
  const lg = (id, a, st) => `<linearGradient id="${id}" x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}">${st.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</linearGradient>`;
  const rg = (id, st, c = [.5, .5, .5]) => `<radialGradient id="${id}" cx="${c[0]}" cy="${c[1]}" r="${c[2]}">${st.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</radialGradient>`;

  function wrap(W, H, id, defs, body) {
    return `<svg viewBox="0 0 ${f(W)} ${f(H)}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs>
<filter id="bl${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${f(W * .02)}"/></filter>
<filter id="bm${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${f(W * .008)}"/></filter>
<filter id="bs${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${f(W * .003)}"/></filter>
<radialGradient id="vg${id}" cx=".5" cy=".5" r=".78"><stop offset=".5" stop-color="#1a120a" stop-opacity="0"/><stop offset="1" stop-color="#1a120a" stop-opacity=".42"/></radialGradient>
${defs}</defs>${body}<rect width="${f(W)}" height="${f(H)}" fill="url(#vg${id})"/></svg>`;
  }

  /* ---------- Habitación con ventanal lateral ---------- */
  function room(W, H, o, id) {
    const fy = H * .74, wx1 = W * (o.wx || .6), wx2 = wx1 + W * (o.ww || .27), wy1 = H * .07;
    const m = Math.min(W, H);
    const defs =
      lg('w' + id, [0, 0, 1, 0], [[0, o.w1], [1, o.w2]]) +
      lg('f' + id, [0, 0, 0, 1], [[0, o.f1], [1, o.f2]]) +
      lg('s' + id, [0, 0, 1, 0], [[0, o.sofa], [1, o.sofa2]]) +
      lg('lt' + id, [0, 0, 0, 1], [[0, '#fffaf0'], [1, o.light]]) +
      lg('ni' + id, [0, 0, 1, 0], [[0, '#000', .28], [1, '#000', .04]]);
    let b = rect(0, 0, W, H, `url(#w${id})`);
    b += `<ellipse cx="${f((wx1 + wx2) / 2)}" cy="${f(H * .38)}" rx="${f(W * .4)}" ry="${f(H * .5)}" fill="${o.light}" opacity=".38" filter="url(#bl${id})"/>`;
    // ventanal
    b += rect(wx1, wy1, wx2 - wx1, fy - wy1, `url(#lt${id})`);
    const nM = 3;
    for (let i = 1; i < nM; i++) { const x = wx1 + (wx2 - wx1) * i / nM; b += rect(x - m * .004, wy1, m * .008, fy - wy1, o.dk, 'opacity=".78"'); }
    b += rect(wx1, wy1 + (fy - wy1) * .64 - m * .004, wx2 - wx1, m * .008, o.dk, 'opacity=".78"');
    b += `<rect x="${f(wx1)}" y="${f(wy1)}" width="${f(wx2 - wx1)}" height="${f(fy - wy1)}" fill="none" stroke="${o.dk}" stroke-width="${f(m * .012)}" opacity=".85"/>`;
    // suelo
    b += rect(0, fy, W, H - fy, `url(#f${id})`);
    if (o.planks) { for (let i = 1; i < 9; i++) b += rect(0, fy + (H - fy) * i * i / 81, W, m * .0015, '#3b2a1a', 'opacity=".22"'); }
    b += rect(0, fy - m * .004, W, m * .008, '#2a1d12', 'opacity=".28"');
    // luz sobre suelo y sombras de montantes
    b += poly([[wx1, fy], [wx2, fy], [wx2 - W * .4, H], [wx1 - W * .6, H]], o.light, `opacity=".52" filter="url(#bm${id})"`);
    for (let i = 1; i < nM; i++) { const x = wx1 + (wx2 - wx1) * i / nM, sw = m * .012; b += poly([[x - sw, fy], [x + sw, fy], [x + sw - W * .46, H], [x - sw - W * .5, H]], o.dk, `opacity=".16" filter="url(#bs${id})"`); }
    // nicho
    const nx = W * .07, nw = W * .13, ny = H * .2;
    b += `<path d="M${f(nx)},${f(fy - H * .02)} V${f(ny + nw / 2)} A${f(nw / 2)},${f(nw / 2)} 0 0 1 ${f(nx + nw)},${f(ny + nw / 2)} V${f(fy - H * .02)} Z" fill="url(#ni${id})"/>`;
    b += `<path d="M${f(nx + nw * .5)},${f(fy - H * .02)} q${f(-nw * .1)},${f(-H * .16)} ${f(nw * .12)},${f(-H * .28)}" stroke="${o.dk}" stroke-width="${f(m * .004)}" fill="none" opacity=".8"/>`;
    b += `<path d="M${f(nx + nw * .5 + nw * .12)},${f(fy - H * .3)} q${f(nw * .2)},${f(-H * .02)} ${f(nw * .26)},${f(H * .02)}" stroke="${o.dk}" stroke-width="${f(m * .003)}" fill="none" opacity=".7"/>`;
    b += `<ellipse cx="${f(nx + nw * .5)}" cy="${f(fy - H * .075)}" rx="${f(nw * .17)}" ry="${f(H * .06)}" fill="${o.ac}"/>`;
    b += `<ellipse cx="${f(nx + nw * .5 - nw * .05)}" cy="${f(fy - H * .095)}" rx="${f(nw * .05)}" ry="${f(H * .04)}" fill="#fff" opacity=".18"/>`;
    // arte
    const ax = W * .33, ay = H * .17, aw = W * .15, ah = H * .26;
    b += rect(ax + m * .008, ay + m * .01, aw, ah, '#000', `opacity=".18" filter="url(#bs${id})"`);
    b += rect(ax, ay, aw, ah, o.art);
    b += `<circle cx="${f(ax + aw * .5)}" cy="${f(ay + ah * .38)}" r="${f(aw * .22)}" fill="${o.ac}" opacity=".9"/>`;
    b += `<path d="M${f(ax)},${f(ay + ah)} Q${f(ax + aw * .5)},${f(ay + ah * .55)} ${f(ax + aw)},${f(ay + ah)} Z" fill="${o.dk}" opacity=".78"/>`;
    // sofá
    const sx = W * .17, sw2 = W * .47;
    b += `<ellipse cx="${f(sx + sw2 * .5)}" cy="${f(fy + H * .075)}" rx="${f(sw2 * .62)}" ry="${f(H * .03)}" fill="#1d130b" opacity=".4" filter="url(#bm${id})"/>`;
    b += poly([[sx, fy + H * .06], [sx + sw2, fy + H * .06], [sx + sw2 - W * .5, fy + H * .08], [sx - W * .5, fy + H * .08]], o.dk, `opacity=".1" filter="url(#bm${id})"`);
    b += `<rect x="${f(sx + sw2 * .03)}" y="${f(fy - H * .2)}" width="${f(sw2 * .94)}" height="${f(H * .17)}" rx="${f(H * .055)}" fill="url(#s${id})"/>`;
    b += `<rect x="${f(sx - sw2 * .03)}" y="${f(fy - H * .105)}" width="${f(sw2 * 1.06)}" height="${f(H * .165)}" rx="${f(H * .06)}" fill="url(#s${id})"/>`;
    b += `<rect x="${f(sx - sw2 * .03)}" y="${f(fy - H * .105)}" width="${f(sw2 * 1.06)}" height="${f(H * .165)}" rx="${f(H * .06)}" fill="${o.light}" opacity=".12"/>`;
    b += `<rect x="${f(sx + sw2 * .12)}" y="${f(fy - H * .125)}" width="${f(sw2 * .2)}" height="${f(H * .1)}" rx="${f(H * .03)}" fill="${o.ac}" opacity=".85"/>`;
    // mesa travertino
    const tx = W * .72, ty = fy + H * .095;
    b += `<ellipse cx="${f(tx)}" cy="${f(ty + H * .04)}" rx="${f(W * .075)}" ry="${f(H * .018)}" fill="#1d130b" opacity=".38" filter="url(#bm${id})"/>`;
    b += rect(tx - W * .05, ty - H * .02, W * .1, H * .06, o.stone || '#cdbd9f');
    b += `<ellipse cx="${f(tx)}" cy="${f(ty - H * .02)}" rx="${f(W * .05)}" ry="${f(H * .012)}" fill="#eadfc8"/>`;
    b += `<ellipse cx="${f(tx)}" cy="${f(ty - H * .03)}" rx="${f(W * .014)}" ry="${f(H * .018)}" fill="${o.dk}" opacity=".85"/>`;
    // planta
    if (o.plant) {
      const px = W * .93, py = fy;
      for (let i = 0; i < 6; i++) b += `<path d="M${f(px)},${f(py)} q${f((i - 2.5) * W * .018)},${f(-H * (.18 + i * .02))} ${f((i - 2.5) * W * .035)},${f(-H * (.3 + i * .015))}" stroke="${o.dk}" stroke-width="${f(m * .004)}" fill="none" opacity=".72"/>`;
      b += rect(px - W * .02, py - H * .05, W * .04, H * .06, o.ac, 'opacity=".9"');
    }
    return wrap(W, H, id, defs, b);
  }

  const P = {
    hero: { w1: '#cdb590', w2: '#8c7152', f1: '#a98660', f2: '#5e462e', light: '#ffe7bd', sofa: '#7f705f', sofa2: '#b3a28a', ac: '#b4623a', dk: '#241b14', art: '#e3d6bd', plant: 1, planks: 1, stone: '#c9b898' },
    living: { w1: '#e0d0b6', w2: '#b79b79', f1: '#b08f66', f2: '#6f5538', light: '#fff0d2', sofa: '#8f8070', sofa2: '#c2b199', ac: '#b4623a', dk: '#2a221b', art: '#eadfcb', plant: 1, planks: 1 },
    living2: { w1: '#d8d1c3', w2: '#a9a190', f1: '#a89675', f2: '#6a5a40', light: '#fff4dc', sofa: '#6f675b', sofa2: '#b9b09f', ac: '#a8844a', dk: '#26221d', art: '#e9e4d8', plant: 0, planks: 1, wx: .08, ww: .24 }
  };

  /* ---------- Arcos (casa de playa) ---------- */
  function arches(W, H, id) {
    const m = Math.min(W, H), fy = H * .78;
    const defs = lg('w' + id, [0, 0, 1, 0], [[0, '#eadfca'], [1, '#cbb592']]) + lg('f' + id, [0, 0, 0, 1], [[0, '#d7c2a0'], [1, '#a98f68']]) +
      lg('sk' + id, [0, 0, 0, 1], [[0, '#f7f1e4'], [.6, '#e8e4d8'], [.6, '#9fb0b0'], [1, '#6f8a8c']]) + lg('ba' + id, [0, 0, 0, 1], [[0, '#000', .25], [1, '#000', 0]]);
    let b = rect(0, 0, W, H, `url(#w${id})`);
    const n = 3, aw = W * .2, gap = W * .07, x0 = (W - (n * aw + (n - 1) * gap)) / 2, ay = H * .16;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (aw + gap);
      b += `<path d="M${f(x)},${f(fy)} V${f(ay + aw / 2)} A${f(aw / 2)},${f(aw / 2)} 0 0 1 ${f(x + aw)},${f(ay + aw / 2)} V${f(fy)} Z" fill="url(#sk${id})"/>`;
      b += `<path d="M${f(x)},${f(fy)} V${f(ay + aw / 2)} A${f(aw / 2)},${f(aw / 2)} 0 0 1 ${f(x + aw)},${f(ay + aw / 2)}" fill="none" stroke="#b69d78" stroke-width="${f(m * .01)}" opacity=".6"/>`;
    }
    b += rect(0, fy, W, H - fy, `url(#f${id})`);
    for (let i = 0; i < n; i++) { const x = x0 + i * (aw + gap); b += poly([[x, fy], [x + aw, fy], [x + aw - W * .35, H], [x - W * .38, H]], '#fff3d6', `opacity=".5" filter="url(#bm${id})"`); }
    b += poly([[0, fy], [W, fy], [W, fy + H * .02], [0, fy + H * .02]], '#000', 'opacity=".12"');
    // banco
    b += `<ellipse cx="${f(W * .5)}" cy="${f(fy + H * .08)}" rx="${f(W * .26)}" ry="${f(H * .018)}" fill="#1d130b" opacity=".3" filter="url(#bm${id})"/>`;
    b += `<rect x="${f(W * .26)}" y="${f(fy - H * .02)}" width="${f(W * .48)}" height="${f(H * .07)}" rx="${f(H * .03)}" fill="#e7dcc6"/>`;
    b += `<rect x="${f(W * .26)}" y="${f(fy + H * .03)}" width="${f(W * .48)}" height="${f(H * .02)}" fill="#000" opacity=".1"/>`;
    b += `<circle cx="${f(W * .83)}" cy="${f(fy + H * .06)}" r="${f(m * .05)}" fill="#b4623a"/><path d="M${f(W * .83)},${f(fy + H * .02)} q${f(m * .04)},${f(-H * .2)} ${f(m * .12)},${f(-H * .26)}" stroke="#4b3b28" stroke-width="${f(m * .004)}" fill="none"/>`;
    return wrap(W, H, id, defs, b);
  }

  /* ---------- Dormitorio / hotel al atardecer ---------- */
  function dusk(W, H, id) {
    const m = Math.min(W, H), fy = H * .78;
    const defs = lg('w' + id, [0, 0, 1, 0], [[0, '#2a211b'], [1, '#4a392c']]) + lg('f' + id, [0, 0, 0, 1], [[0, '#3a2b20'], [1, '#17110c']]) +
      rg('g' + id, [[0, '#ffc77d', .85], [.35, '#e39a52', .35], [1, '#e39a52', 0]], [.5, .5, .5]) + lg('h' + id, [0, 0, 1, 0], [[0, '#7a6552'], [1, '#a38b72']]);
    let b = rect(0, 0, W, H, `url(#w${id})`);
    b += `<ellipse cx="${f(W * .8)}" cy="${f(H * .46)}" rx="${f(W * .55)}" ry="${f(H * .45)}" fill="url(#g${id})"/>`;
    b += poly([[W * .04, 0], [W * .12, 0], [W * .2, fy], [W * .06, fy]], '#ffd9a0', `opacity=".5" filter="url(#bm${id})"`);
    b += rect(0, fy, W, H - fy, `url(#f${id})`);
    b += poly([[W * .04, fy], [W * .2, fy], [W * .5, H], [W * -.1, H]], '#ffcf91', `opacity=".22" filter="url(#bm${id})"`);
    // cabecero + cama
    b += `<rect x="${f(W * .2)}" y="${f(H * .26)}" width="${f(W * .56)}" height="${f(H * .38)}" rx="${f(H * .05)}" fill="url(#h${id})"/>`;
    b += `<rect x="${f(W * .2)}" y="${f(H * .26)}" width="${f(W * .56)}" height="${f(H * .38)}" rx="${f(H * .05)}" fill="#ffc77d" opacity=".14"/>`;
    b += `<rect x="${f(W * .16)}" y="${f(H * .55)}" width="${f(W * .64)}" height="${f(H * .22)}" rx="${f(H * .03)}" fill="#d7ccb8"/>`;
    b += `<rect x="${f(W * .16)}" y="${f(H * .68)}" width="${f(W * .64)}" height="${f(H * .09)}" fill="#8d7b66"/>`;
    b += `<ellipse cx="${f(W * .48)}" cy="${f(fy + H * .06)}" rx="${f(W * .4)}" ry="${f(H * .022)}" fill="#000" opacity=".5" filter="url(#bm${id})"/>`;
    // mesilla + lámpara
    b += rect(W * .82, H * .64, W * .1, H * .14, '#2a1f17') + `<rect x="${f(W * .82)}" y="${f(H * .64)}" width="${f(W * .1)}" height="${f(m * .008)}" fill="#c9a46a"/>`;
    b += `<path d="M${f(W * .87)},${f(H * .64)} V${f(H * .5)}" stroke="#c9a46a" stroke-width="${f(m * .005)}"/>`;
    b += `<path d="M${f(W * .835)},${f(H * .5)} L${f(W * .905)},${f(H * .5)} L${f(W * .89)},${f(H * .4)} L${f(W * .85)},${f(H * .4)} Z" fill="#ffd9a0"/>`;
    return wrap(W, H, id, defs, b);
  }

  /* ---------- Oficina boutique ---------- */
  function office(W, H, id) {
    const m = Math.min(W, H), fy = H * .72;
    const defs = lg('w' + id, [0, 0, 0, 1], [[0, '#d9d1c2'], [1, '#bdb29f']]) + lg('f' + id, [0, 0, 0, 1], [[0, '#b39c78'], [1, '#7c6747']]) + lg('sk' + id, [0, 0, 0, 1], [[0, '#fbf7ee'], [1, '#eadfc6']]);
    let b = rect(0, 0, W, H, `url(#w${id})`);
    b += rect(W * .04, H * .14, W * .92, H * .42, `url(#sk${id})`);
    for (let i = 1; i < 6; i++) b += rect(W * .04 + W * .92 * i / 6 - m * .004, H * .14, m * .008, H * .42, '#2a241d', 'opacity=".7"');
    b += `<rect x="${f(W * .04)}" y="${f(H * .14)}" width="${f(W * .92)}" height="${f(H * .42)}" fill="none" stroke="#2a241d" stroke-width="${f(m * .01)}" opacity=".8"/>`;
    b += rect(0, fy, W, H - fy, `url(#f${id})`);
    b += poly([[W * .04, fy], [W * .96, fy], [W * .8, H], [W * -.1, H]], '#fff3d6', `opacity=".42" filter="url(#bm${id})"`);
    // estantería de libros
    const r = rng(7);
    b += rect(W * .06, fy - H * .3, W * .16, H * .005, '#2a1f17');
    for (let i = 0; i < 12; i++) { const bw = W * .01 + r() * W * .006, bh = H * (.09 + r() * .07); b += rect(W * .065 + i * W * .0125, fy - H * .3 - bh, bw, bh, ['#a8844a', '#6d5b48', '#c9bba3', '#b4623a'][i % 4], 'opacity=".85"'); }
    // mesa larga
    b += `<ellipse cx="${f(W * .55)}" cy="${f(fy + H * .17)}" rx="${f(W * .36)}" ry="${f(H * .025)}" fill="#1d130b" opacity=".32" filter="url(#bm${id})"/>`;
    b += rect(W * .2, fy + H * .04, W * .7, H * .035, '#c3a679') + rect(W * .2, fy + H * .075, W * .7, H * .008, '#000', 'opacity=".25"');
    b += rect(W * .24, fy + H * .08, W * .008, H * .13, '#2a1f17') + rect(W * .86, fy + H * .08, W * .008, H * .13, '#2a1f17');
    // sillas
    [.38, .6].forEach(x => { b += `<path d="M${f(W * x)},${f(fy + H * .18)} v${f(-H * .09)} h${f(W * .06)} v${f(H * .09)}" fill="none" stroke="#2a1f17" stroke-width="${f(m * .007)}"/><rect x="${f(W * x - W * .005)}" y="${f(fy - H * .03)}" width="${f(W * .07)}" height="${f(H * .06)}" rx="${f(H * .02)}" fill="#7a6a58"/>`; });
    return wrap(W, H, id, defs, b);
  }

  /* ---------- Restaurante ---------- */
  function table(W, H, id) {
    const m = Math.min(W, H), fy = H * .68;
    const defs = lg('w' + id, [0, 0, 1, 0], [[0, '#2b1f18'], [1, '#4a3322']]) + lg('f' + id, [0, 0, 0, 1], [[0, '#3a2a1c'], [1, '#150f0a']]) + rg('g' + id, [[0, '#ffc778', .95], [.4, '#e8a156', .35], [1, '#e8a156', 0]]);
    let b = rect(0, 0, W, H, `url(#w${id})`);
    b += `<path d="M${f(W * .62)},${f(fy)} V${f(H * .26)} A${f(W * .19)},${f(W * .19)} 0 0 1 ${f(W * .98)},${f(H * .26)} V${f(fy)} Z" fill="#9c5a37" opacity=".72"/>`;
    b += rect(0, fy, W, H - fy, `url(#f${id})`);
    [.2, .45, .72].forEach((x, i) => {
      const cy = H * (.28 + (i % 2) * .05);
      b += `<ellipse cx="${f(W * x)}" cy="${f(cy + H * .12)}" rx="${f(W * .2)}" ry="${f(H * .26)}" fill="url(#g${id})"/>`;
      b += `<path d="M${f(W * x)},0 V${f(cy)}" stroke="#c9a46a" stroke-width="${f(m * .003)}"/>`;
      b += `<path d="M${f(W * x - W * .035)},${f(cy + H * .05)} A${f(W * .035)},${f(H * .05)} 0 0 1 ${f(W * x + W * .035)},${f(cy + H * .05)} Z" fill="#ffe0aa"/>`;
    });
    b += poly([[W * .08, H * .76], [W * .94, H * .76], [W * 1.02, H * .84], [W * 0, H * .84]], '#b99468');
    b += poly([[W * 0, H * .84], [W * 1.02, H * .84], [W * 1.02, H * .87], [W * 0, H * .87]], '#000', 'opacity=".4"');
    [.22, .46, .72].forEach(x => { b += `<ellipse cx="${f(W * x)}" cy="${f(H * .8)}" rx="${f(W * .045)}" ry="${f(H * .012)}" fill="#efe3cc"/>`; b += `<rect x="${f(W * x + W * .06)}" y="${f(H * .74)}" width="${f(W * .008)}" height="${f(H * .05)}" fill="#e8a156" opacity=".8"/>`; });
    b += `<ellipse cx="${f(W * .5)}" cy="${f(H * .9)}" rx="${f(W * .45)}" ry="${f(H * .03)}" fill="#000" opacity=".45" filter="url(#bm${id})"/>`;
    return wrap(W, H, id, defs, b);
  }

  /* ---------- Detalles de material ---------- */
  function stone(W, H, id) {
    const r = rng(31), cs = ['#d9c9ad', '#cdbb9d', '#e3d5bb', '#c3af8e', '#d2c1a3'];
    const defs = lg('l' + id, [0, 0, 1, 1], [[0, '#fff6df', .55], [.6, '#fff6df', 0], [1, '#3a2a18', .35]]);
    let b = rect(0, 0, W, H, '#d6c5a8'), y = -H * .02;
    while (y < H) {
      const h = H * (.012 + r() * .07);
      let d = `M0,${f(y)}`; for (let x = 0; x <= W; x += W / 8) d += ` L${f(x)},${f(y + (r() - .5) * H * .012)}`;
      d += ` V${f(y + h)} H0 Z`;
      b += `<path d="${d}" fill="${cs[(r() * cs.length) | 0]}" opacity="${f(.5 + r() * .5)}"/>`;
      if (r() > .55) b += rect(0, y + h * .5, W, H * .0025, '#8f7a5a', `opacity="${f(.12 + r() * .22)}"`);
      y += h;
    }
    for (let i = 0; i < 70; i++) b += `<ellipse cx="${f(r() * W)}" cy="${f(r() * H)}" rx="${f(W * (.003 + r() * .012))}" ry="${f(H * (.001 + r() * .003))}" fill="#7d6849" opacity="${f(.15 + r() * .3)}"/>`;
    b += rect(0, 0, W, H, `url(#l${id})`);
    return wrap(W, H, id, defs, b);
  }
  function wood(W, H, id) {
    const r = rng(11);
    const defs = lg('l' + id, [0, 0, 1, 0], [[0, '#fff2d0', .45], [.5, '#fff2d0', 0], [1, '#2a1a0c', .45]]);
    let b = rect(0, 0, W, H, '#bb9566'), x = 0;
    while (x < W) {
      const w = W * (.05 + r() * .06);
      b += rect(x, 0, w, H, ['#b48f60', '#c1a075', '#a98558', '#b99a6c'][(r() * 4) | 0], 'opacity=".9"') + rect(x, 0, W * .0025, H, '#4a331c', 'opacity=".4"');
      for (let k = 0; k < 14; k++) b += rect(x + r() * w, r() * H, W * .0012, H * (.15 + r() * .5), '#6b4b2a', `opacity="${f(.12 + r() * .25)}"`);
      b += `<ellipse cx="${f(x + w * (.3 + r() * .4))}" cy="${f(r() * H)}" rx="${f(w * .12)}" ry="${f(H * .03)}" fill="#7a5632" opacity=".3"/>`;
      x += w;
    }
    b += rect(0, 0, W, H, `url(#l${id})`);
    return wrap(W, H, id, defs, b);
  }
  function linen(W, H, id) {
    const defs = lg('l' + id, [0, 0, 1, 1], [[0, '#fff8e8', .5], [.5, '#fff8e8', 0], [1, '#2a1f12', .4]]) + lg('fo' + id, [0, 0, 1, 0], [[0, '#000', 0], [.5, '#000', .22], [1, '#000', 0]]);
    let b = rect(0, 0, W, H, '#d9ccb4');
    for (let y = 0; y < H; y += H * .006) b += rect(0, y, W, H * .0018, '#a8987a', 'opacity=".2"');
    for (let x = 0; x < W; x += W * .006) b += rect(x, 0, W * .0018, H, '#a8987a', 'opacity=".16"');
    b += poly([[W * .3, 0], [W * .55, 0], [W * .45, H], [W * .2, H]], `url(#fo${id})`, `filter="url(#bm${id})"`);
    b += poly([[W * .7, 0], [W * .78, 0], [W * .9, H], [W * .8, H]], `url(#fo${id})`, `opacity=".6" filter="url(#bm${id})"`);
    b += rect(0, 0, W, H, `url(#l${id})`);
    return wrap(W, H, id, defs, b);
  }
  function brass(W, H, id) {
    const m = Math.min(W, H);
    const defs = lg('w' + id, [0, 0, 1, 0], [[0, '#d7cdb9'], [1, '#a99d86']]) + lg('br' + id, [0, 0, 1, 0], [[0, '#6e5428'], [.3, '#d9bb7a'], [.5, '#a8844a'], [1, '#4f3a1a']]) + rg('kn' + id, [[0, '#f0d79c'], [.55, '#a8844a'], [1, '#5a431d']], [.35, .3, .8]);
    let b = rect(0, 0, W, H, `url(#w${id})`);
    b += rect(W * .08, H * .12, W * .05, H * .76, '#000', `opacity=".22" filter="url(#bm${id})"`);
    b += `<rect x="${f(W * .44)}" y="${f(H * .12)}" width="${f(W * .1)}" height="${f(H * .76)}" rx="${f(W * .05)}" fill="url(#br${id})"/>`;
    b += `<rect x="${f(W * .445)}" y="${f(H * .12)}" width="${f(W * .02)}" height="${f(H * .76)}" rx="${f(W * .01)}" fill="#fff0c4" opacity=".35"/>`;
    b += `<circle cx="${f(W * .49)}" cy="${f(H * .24)}" r="${f(m * .07)}" fill="url(#kn${id})"/><circle cx="${f(W * .49)}" cy="${f(H * .76)}" r="${f(m * .07)}" fill="url(#kn${id})"/>`;
    b += poly([[W * .54, 0], [W * .6, 0], [W * .98, H], [W * .8, H]], '#fff2d0', `opacity=".18" filter="url(#bm${id})"`);
    return wrap(W, H, id, defs, b);
  }
  function plaster(W, H, id) {
    const defs = lg('w' + id, [0, 0, 1, 1], [[0, '#e8dcc6'], [1, '#c8b595']]) + lg('sh' + id, [0, 0, 1, 0], [[0, '#2a1c10', .5], [1, '#2a1c10', 0]]);
    let b = rect(0, 0, W, H, `url(#w${id})`);
    b += `<path d="M${f(W * .5)},0 C${f(W * .35)},${f(H * .3)} ${f(W * .7)},${f(H * .6)} ${f(W * .45)},${f(H)} L0,${f(H)} L0,0 Z" fill="url(#sh${id})" filter="url(#bl${id})" opacity=".7"/>`;
    b += `<ellipse cx="${f(W * .78)}" cy="${f(H * .25)}" rx="${f(W * .4)}" ry="${f(H * .3)}" fill="#fff4da" opacity=".5" filter="url(#bl${id})"/>`;
    const r = rng(5);
    for (let i = 0; i < 26; i++) b += `<ellipse cx="${f(r() * W)}" cy="${f(r() * H)}" rx="${f(W * (.06 + r() * .1))}" ry="${f(H * (.02 + r() * .05))}" fill="${r() > .5 ? '#fff' : '#a38a64'}" opacity="${f(.05 + r() * .08)}" filter="url(#bm${id})"/>`;
    return wrap(W, H, id, defs, b);
  }
  function ceramic(W, H, id) {
    const m = Math.min(W, H);
    const defs = lg('w' + id, [0, 0, 1, 1], [[0, '#dcd0ba'], [1, '#b9a785']]) + lg('v' + id, [0, 0, 1, 0], [[0, '#f1e7d2'], [.6, '#d6c6a8'], [1, '#9b8764']]) + lg('t' + id, [0, 0, 1, 0], [[0, '#c98257'], [1, '#8a4527']]);
    let b = rect(0, 0, W, H, `url(#w${id})`) + rect(0, H * .72, W, H * .28, '#b59d78') + rect(0, H * .715, W, H * .008, '#000', 'opacity=".15"');
    b += poly([[W * .3, H * .74], [W * .52, H * .74], [W * -.1, H * .98], [W * -.2, H * .98]], '#2a1c10', `opacity=".25" filter="url(#bm${id})"`);
    b += `<path d="M${f(W * .34)},${f(H * .73)} C${f(W * .24)},${f(H * .52)} ${f(W * .3)},${f(H * .36)} ${f(W * .38)},${f(H * .3)} L${f(W * .4)},${f(H * .18)} H${f(W * .46)} L${f(W * .48)},${f(H * .3)} C${f(W * .56)},${f(H * .36)} ${f(W * .62)},${f(H * .52)} ${f(W * .52)},${f(H * .73)} Z" fill="url(#v${id})"/>`;
    b += `<path d="M${f(W * .43)},${f(H * .18)} q${f(W * .06)},${f(-H * .12)} ${f(W * .17)},${f(-H * .1)}" stroke="#4b3b28" stroke-width="${f(m * .004)}" fill="none"/>`;
    b += `<ellipse cx="${f(W * .72)}" cy="${f(H * .71)}" rx="${f(W * .1)}" ry="${f(H * .03)}" fill="url(#t${id})"/>`;
    b += `<ellipse cx="${f(W * .72)}" cy="${f(H * .695)}" rx="${f(W * .1)}" ry="${f(H * .028)}" fill="#e5a278"/>`;
    b += rect(W * .6, H * .66, W * .26, H * .03, '#2c241c') + rect(W * .6, H * .66, W * .26, H * .004, '#fff', 'opacity=".2"');
    b += poly([[W * .62, 0], [W * .78, 0], [W * 1, H], [W * .8, H]], '#fff2d0', `opacity=".2" filter="url(#bm${id})"`);
    return wrap(W, H, id, defs, b);
  }

  function scene(name, W, H, id) {
    if (P[name]) return room(W, H, Object.assign({}, P[name]), id);
    return ({ arches, dusk, office, table, stone, wood, linen, brass, plaster, ceramic }[name] || stone)(W, H, id);
  }

  /* Cada escena se "revela" una sola vez a bitmap (JPEG en blob) y se cachea:
     el navegador no vuelve a rasterizar filtros SVG al hacer scroll/zoom. */
  const cache = new Map();
  function bake(name, W, H, px) {
    const key = name + '|' + Math.round(W) + '|' + Math.round(H) + '|' + px;
    if (!cache.has(key)) cache.set(key, new Promise(res => {
      const h = Math.round(px * H / W);
      const str = scene(name, W, H, ++uid).replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${h}" `);
      const url = URL.createObjectURL(new Blob([str], { type: 'image/svg+xml' }));
      const im = new Image();
      im.onload = () => {
        const c = document.createElement('canvas'); c.width = px; c.height = h;
        c.getContext('2d').drawImage(im, 0, 0, px, h);
        URL.revokeObjectURL(url);
        c.toBlob(b => res(b ? URL.createObjectURL(b) : null), 'image/jpeg', .9);
      };
      im.onerror = () => res(null);
      im.src = url;
    }));
    return cache.get(key);
  }
  let chain = Promise.resolve();
  const tick = () => new Promise(r => setTimeout(r, 0));

  function render(el) {
    let W = 1000, H, ar = el.dataset.ar, big = 0;
    if (!ar || ar === 'auto') { const r = el.getBoundingClientRect(); H = 1000 * ((r.height || innerHeight) / (r.width || innerWidth)); big = 1; }
    else { const [a, b] = ar.split('/').map(Number); H = 1000 * b / a; }
    // si el contenedor no define su propia altura, la escena la toma de su proporción
    if (ar && ar !== 'auto' && !el.style.aspectRatio && !el.offsetHeight) el.style.aspectRatio = ar.replace('/', ' / ');
    const name = el.dataset.scene, px = big ? 1500 : 900;
    // fotografía real: sustituye a la escena provisional (que queda como respaldo si falla la carga)
    if (el.dataset.img) {
      el.querySelectorAll(':scope > img').forEach(i => i.remove());
      const im = new Image(); im.alt = el.getAttribute('aria-label') || ''; im.decoding = 'async'; im.draggable = false;
      if (!el.closest('.hero')) im.loading = 'lazy'; else im.fetchPriority = 'high';
      im.onerror = () => { im.remove(); delete el.dataset.img; render(el); };
      im.src = el.dataset.img; el.insertBefore(im, el.firstChild);
      return;
    }
    chain = chain.then(tick).then(() => bake(name, W, H, px)).then(url => {
      if (!url) return;
      el.querySelectorAll(':scope > img[data-baked]').forEach(i => i.remove());
      const im = new Image(); im.src = url; im.alt = ''; im.dataset.baked = '1'; im.decoding = 'async'; im.draggable = false;
      el.insertBefore(im, el.firstChild);
    });
  }

  window.ALV = { render, renderAll: () => document.querySelectorAll('.ph[data-scene]').forEach(render) };
  ALV.renderAll();
})();
