// ===========================================================================
// NÁCAR — video corto de venta de la landing (adjunto para llamadas)
// Derivado del motor de "grabar-demo.template.cjs" (playbook grabacion-video-demo).
// Una landing no tiene login ni roles: el guion es scroll dirigido con rótulos.
// SOLO LECTURA: se recorre y se señala; ningún clic navega fuera (wa.me ni tel).
//
//   $env:ASCK_DEMO_PRUEBA='1'; node scripts/grabar-video.cjs   # validación corta
//   node scripts/grabar-video.cjs                              # toma final
// ===========================================================================

const PLAYWRIGHT = 'C:/Users/anara/Desktop/ASCK_WORKSPACE/02_DEMOS_SECTOR/arquitectura/node_modules/playwright';
const { chromium } = require(PLAYWRIGHT);

const PRUEBA = process.env.ASCK_DEMO_PRUEBA === '1';

const CONFIG = {
  // ?motion=on: la grabación debe capturar la experiencia animada aunque el
  // entorno pida movimiento reducido (regla de oro nº 5 del playbook).
  url: 'https://nacar.asck.tech/?motion=on',
  salida: 'D:/ASCK-Video/proceso/grabaciones',
  azul: '#2D6CDF',
  oscuro: '#0D1321',

  intro: {
    kicker: 'ASCK SOFTWARE · DEMO DE SECTOR',
    titulo: 'NÁCAR',
    bajada: 'Landing de captación para clínicas dentales',
    ms: PRUEBA ? 2200 : 5200,
  },
  outro: {
    kicker: 'ASCK SOFTWARE',
    titulo: 'Así puede verse su clínica',
    bajada: 'Tecnología que funciona para tu negocio.',
    lineas: ['Demo en vivo: nacar.asck.tech', 'contacto@asck.tech'],
    ms: PRUEBA ? 2600 : 6800,
  },
};

const TOTAL = 5;

const CURSOR_JS = () => {
  if (window.__cursorASCK) return;
  window.__cursorASCK = true;
  const add = () => {
    if (!document.body) return setTimeout(add, 50);
    const c = document.createElement('div');
    c.style.cssText = 'position:fixed;top:50%;left:50%;width:22px;height:22px;border-radius:50%;'
      + 'background:rgba(45,108,223,.35);border:2px solid #2D6CDF;box-shadow:0 0 0 4px rgba(45,108,223,.15);'
      + 'pointer-events:none;z-index:2147483646;transform:translate(-50%,-50%);transition:width .12s,height .12s';
    document.body.appendChild(c);
    addEventListener('mousemove', (e) => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
  };
  add();
};

async function asegurarOverlay(page) {
  await page.evaluate(({ azul, oscuro }) => {
    if (document.getElementById('__rotulo_asck')) return;
    if (!document.getElementById('__font_asck')) {
      const l = document.createElement('link');
      l.id = '__font_asck'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800&display=swap';
      document.head.appendChild(l);
    }
    const w = document.createElement('div');
    w.id = '__rotulo_asck';
    w.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483645;'
      + 'font-family:Montserrat,"Segoe UI Variable Display",system-ui,sans-serif';
    w.innerHTML = `<div id="__lower" style="position:absolute;left:44px;bottom:44px;max-width:840px;
        background:${oscuro}f2;border-left:5px solid ${azul};border-radius:4px 14px 14px 4px;
        padding:20px 32px 22px 26px;color:#fff;opacity:0;transform:translateY(22px);
        transition:opacity .5s ease,transform .5s cubic-bezier(.22,1,.36,1);box-shadow:0 18px 50px rgba(0,0,0,.42)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:9px">
          <div id="__kicker" style="font-size:12px;font-weight:700;letter-spacing:.2em;color:${azul}"></div>
          <div style="width:5px;height:5px;border-radius:50%;background:#3C4B63"></div>
          <div id="__num" style="font-size:12px;font-weight:700;letter-spacing:.14em;color:#7E90AC"></div>
        </div>
        <div id="__titulo" style="font-size:31px;font-weight:800;line-height:1.15;margin-bottom:9px"></div>
        <div id="__sub" style="font-size:17px;font-weight:500;line-height:1.45;color:#C9D4E6"></div></div>`;
    document.body.appendChild(w);
  }, { azul: CONFIG.azul, oscuro: CONFIG.oscuro });
}

async function rot(page, n, kicker, titulo, sub, ms = 4400) {
  await asegurarOverlay(page);
  await page.evaluate(({ n, kicker, titulo, sub, total }) => {
    document.getElementById('__kicker').textContent = kicker;
    document.getElementById('__num').textContent = String(n).padStart(2, '0') + ' / ' + total;
    document.getElementById('__titulo').textContent = titulo;
    document.getElementById('__sub').textContent = sub;
    const l = document.getElementById('__lower');
    l.style.opacity = '1'; l.style.transform = 'translateY(0)';
  }, { n, kicker, titulo, sub, total: TOTAL });
  await page.waitForTimeout(PRUEBA ? Math.min(ms, 1500) : ms);
  await page.evaluate(() => {
    const l = document.getElementById('__lower');
    if (l) { l.style.opacity = '0'; l.style.transform = 'translateY(22px)'; }
  }).catch(() => {});
  await page.waitForTimeout(500);
}

async function scrollSuave(page, px, ms) {
  await page.evaluate(({ px, ms }) => new Promise((res) => {
    const ini = window.scrollY, t0 = performance.now();
    const paso = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      window.scrollTo(0, ini + px * e);
      p < 1 ? requestAnimationFrame(paso) : res();
    };
    requestAnimationFrame(paso);
  }), { px, ms: PRUEBA ? Math.round(ms / 3) : ms });
}

async function irA(page, selector, offset = 0) {
  const y = await page.evaluate(({ selector, offset }) => {
    const el = document.querySelector(selector);
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY + offset) : null;
  }, { selector, offset });
  if (y === null) throw new Error('no existe ' + selector);
  const actual = await page.evaluate(() => window.scrollY);
  await scrollSuave(page, y - actual, 1400);
  await page.waitForTimeout(700);
}

async function pantalla(page, { kicker, titulo, bajada, lineas = [] }, ms) {
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800&display=swap">
    <style>*{margin:0;padding:0;box-sizing:border-box}
      body{height:100vh;background:${CONFIG.oscuro};color:#fff;display:flex;align-items:center;justify-content:center;
        font-family:Montserrat,"Segoe UI Variable Display",system-ui,sans-serif;overflow:hidden}
      .c{text-align:center;animation:sube .9s cubic-bezier(.22,1,.36,1) both}
      .k{font-size:15px;letter-spacing:.42em;color:${CONFIG.azul};font-weight:700;margin-bottom:26px}
      h1{font-size:82px;font-weight:800;letter-spacing:-.02em;margin-bottom:20px}
      p{font-size:25px;color:#C9D4E6;font-weight:500}
      .l{width:0;height:3px;background:${CONFIG.azul};margin:38px auto 0;animation:crece 1.5s .5s cubic-bezier(.22,1,.36,1) forwards}
      .d{margin-top:34px;font-size:19px;color:#8FA6C6;font-weight:500;line-height:1.9}
      @keyframes sube{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
      @keyframes crece{to{width:220px}}</style></head>
    <body><div class="c"><div class="k">${kicker}</div><h1>${titulo}</h1><p>${bajada}</p>
      <div class="l"></div>${lineas.length ? `<div class="d">${lineas.join('<br>')}</div>` : ''}</div></body></html>`);
  await page.waitForTimeout(ms);
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--force-device-scale-factor=1'] });
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: CONFIG.salida, size: { width: 1920, height: 1080 } },
    reducedMotion: 'no-preference',
    locale: 'es-MX',
  });
  await ctx.addInitScript(CURSOR_JS);
  const page = await ctx.newPage();
  const t0 = Date.now();
  const log = (m) => console.log(`[${String(Math.round((Date.now() - t0) / 1000)).padStart(3)}s] ${m}`);
  const seguro = async (n, fn) => {
    try { await fn(); } catch (e) { console.log(`  !! FALLO ${n}: ${String(e.message).slice(0, 110)}`); }
  };

  try {
    await pantalla(page, CONFIG.intro, CONFIG.intro.ms);
    log('intro');

    await page.goto(CONFIG.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1600);

    // 1 — hero
    await seguro('hero', async () => {
      await page.mouse.move(1500, 640, { steps: 24 });
      await rot(page, 1, 'PRIMERA IMPRESIÓN', 'La página que vende antes de contestar el teléfono',
        'Promesa clara, confianza y agenda por WhatsApp desde la primera pantalla.');
      log('hero');
    });

    // 2 — el método (la pieza pinneada: se recorre entera, despacio)
    await seguro('metodo', async () => {
      await irA(page, '#metodo');
      await rot(page, 2, 'EL MÉTODO', 'El paciente ve su primera cita, minuto a minuto',
        'El scroll cuenta los 45 minutos: escucha, escaneo 3D, plan en pantalla y precio cerrado.', 4600);
      // El cursor no debe quedar flotando en medio del escenario del acto.
      await page.mouse.move(960, 1044, { steps: 20 });
      const tramo = Math.round(1080 * 3.4 / 4);
      for (let i = 0; i < 4; i++) {
        await scrollSuave(page, tramo, 2600);
        await page.waitForTimeout(PRUEBA ? 400 : 1500);
      }
      log('metodo');
    });

    // 3 — especialidades
    await seguro('servicios', async () => {
      await irA(page, '#servicios');
      await rot(page, 3, 'ESPECIALIDADES', 'Cada servicio explicado en beneficio, no en jerga',
        'Estética, implantes, ortodoncia invisible y rehabilitación — con lenguaje de consultorio real.');
      await scrollSuave(page, 900, 2400);
      await page.waitForTimeout(1100);
      log('servicios');
    });

    // 4 — prueba social
    await seguro('pacientes', async () => {
      await irA(page, '#pacientes', -80);
      await rot(page, 4, 'PRUEBA SOCIAL', 'Los números y las reseñas hacen el cierre',
        'Calificación, años de práctica y testimonios que responden a las objeciones reales.');
      await scrollSuave(page, 850, 2400);
      await page.waitForTimeout(1100);
      log('pacientes');
    });

    // 5 — cierre y CTA (se SEÑALA el botón, no se hace clic: abriría wa.me)
    await seguro('cierre', async () => {
      await irA(page, '#contacto');
      await rot(page, 5, 'CAPTACIÓN', 'Toda la página termina en un WhatsApp',
        'Botón flotante y cierres con mensaje precargado: el paciente escribe y su recepción responde.');
      const b = await page.locator('#contacto .boton').first().boundingBox();
      if (b) {
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 30 });
        await page.waitForTimeout(1700);
      }
      const p = await page.locator('.wa-pill').boundingBox();
      if (p) {
        await page.mouse.move(p.x + p.width / 2, p.y + p.height / 2, { steps: 26 });
        await page.waitForTimeout(1500);
      }
      log('cierre');
    });

    await pantalla(page, CONFIG.outro, CONFIG.outro.ms);
    log('outro');
  } catch (e) {
    console.log('ERROR GLOBAL (se guarda lo grabado):', String(e.message).slice(0, 160));
  } finally {
    const video = page.video();
    await ctx.close();
    console.log('VIDEO:', await video.path());
    await browser.close();
  }
})();
