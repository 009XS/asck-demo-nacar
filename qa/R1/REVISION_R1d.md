# REVISIÓN R1d — NÁCAR v2.2 (adversarial, contra la URL en vivo)

**Fecha:** 2026-09-15
**Objeto:** https://nacar.asck.tech · commits `0862c7f` + `d74f3f8` de `main`
**Worktree de revisión:** `C:\Users\anara\AppData\Local\Temp\nacar-review-r1d` (detached `d74f3f8`, eliminado al cerrar)
**Antecedente:** `qa/R1/REVISION_R1c.md` — RECHAZADA, 6.0/10, 5 bloqueantes
**Veredicto:** **APROBADA CON RESERVAS** — los 5 bloqueantes de R1c están corregidos de verdad; ninguno reaparece
**Puntuación:** **8.3 / 10** (suma ponderada 8.305, sin topes activos) frente al 8.89 que se autoasigna `RUBRICA_v2.md`

Esta revisión no confía en `C21.report.md`, `C22.report.md`, `RUBRICA_v2.md` ni en `qa/PRODUCCION_v2.2/`.
Se leyeron solo para saber qué se afirma. **Cada cifra de abajo sale de un comando ejecutado contra
la URL en vivo o contra los binarios servidos por ella**, con instrumentos propios (`r1d-*.mjs`).

---

## 0. Verificación de que se midió lo que se dice medir

| Comprobación | Resultado |
|---|---|
| `/film/manifest.json` en vivo vs. `public/film/manifest.json` de `d74f3f8` | **idéntico** (difiere solo en CRLF; `JSON` profundo igual) |
| SHA-1 de 24 fotogramas servidos (índices 0/32/65/66/93/97/98/101/131/197/206/263 × desktop y móvil) vs. los del worktree | **24/24 coinciden** |
| Páginas y cabeceras | `/` 200 (9 290 B), `/film/manifest.json` 200 (19 795 B), `/no-existe-r1d` **404 real** con página propia |

El sitio en vivo sirve exactamente los binarios de `d74f3f8`.

---

## 1. Los cinco bloqueantes de R1c, uno por uno

### B1 — Interruptor de movimiento: **CORREGIDO** (verificado en producción, no en local)

Ciclo completo **en sesión, sin recarga**, arrancando a mitad de la película (`r1d-toggle.mjs`):

| Viewport | Estado | tarjetas visibles (`visibility:visible` + `opacity:1`) | `.pin-spacer` | ScrollTriggers | alto del documento |
|---|---|---:|---:|---:|---:|
| 390×844 | on (antes del clic) | 1 / 9 | 1 | 3 | 28 432 px |
| 390×844 | **off (tras el clic)** | **9 / 9** | **0** | **0** | 15 282 px |
| 390×844 | off + recorrido | 9 / 9 | 0 | 0 | 15 282 px |
| 390×844 | **on de nuevo** | 1 / 9 (correcto: scrub) | 1 | 6 | 28 432 px · **10 fotogramas distintos en 12 muestras** |
| 1440×900 | on (antes) | 1 / 9 | 1 | 3 | 28 084 px |
| 1440×900 | **off** | **9 / 9** | **0** | **0** | 14 062 px |
| 1440×900 | **on de nuevo** | — | 1 | 5 | 28 084 px · **9 fotogramas distintos en 12 muestras** |

Camino inverso, el de quien tiene `prefers-reduced-motion: reduce` (`r1d-probe.mjs`):
carga en `off` → clic → `on` con **1 pin, 27 triggers, canvas pintado** → clic → `off` con
**9/9 tarjetas, 0 pins, 0 triggers y 0 estilos en línea residuales**; `localStorage['nacar:motion'] = "off"`
y la elección **persiste tras recargar**.

Además probé lo que R1c no llegó a probar — las **carreras** que rompieron la v2.1 (`r1d-carrera.mjs`):

| Caso | Resultado |
|---|---|
| Clic **antes** de que resuelva `manifest.json` | `off` limpio: 9/9 visibles, 0 pins, 0 triggers, 0 inline, 0 errores |
| 6 clics seguidos (90 ms) → termina en on | `on` correcto: 1 pin, 27 triggers |
| 5 clics seguidos (90 ms) → termina en off | `off` limpio: 9/9 visibles, 0 pins, 0 triggers, 0 inline |

Causa raíz atacada bien: en `src/lib/acto.ts` la escena se crea dentro de `self.add(...)` **dentro del
`.then()`**, el `fetch` lleva `AbortController` y la limpieza (`clearProps`, `removeEventListener`,
`classList.remove`, `delete dataset.frame`) se registra en el contexto. No hay fugas.

Evidencia: `r1d-01-interruptor-off-390.png`, `r1d-02-interruptor-off-1440.png`.

### B2 — Contraste de la etiqueta de capítulo: **CORREGIDO** (8.55 : 1 mínimo real)

Medición propia **sin forzar estilos**: se navega hasta el progreso donde cada tarjeta está
realmente visible, se captura el recuadro de la etiqueta con texto y se vuelve a capturar con el
texto en `transparent`; los píxeles del núcleo del glifo se comparan contra el fondo real detrás de
esos mismos píxeles (`r1d-contraste.mjs`, ×2 de densidad).

| Conjunto | Combinaciones | Contraste medido | Estado de la tarjeta |
|---|---:|---|---|
| 9 capítulos × {390×844, 1440×900} × {on, off} | **36** | **mín. 8.55 : 1 · máx. 8.57 : 1** (peor píxel 8.47) | 36/36 `visibility: visible`, `opacity: 1` |

Color efectivo `rgb(142,195,182)` sobre `rgb(16,32,28)` — el `.label` jade claro con almohadilla
petróleo (`box-shadow: 0 0 0 .45rem var(--petroleo)`). Antes: 2.19 : 1 (390) y 3.65 : 1 (1440).

Extendí la medición a los otros dos textos sobre imagen, que R1c no midió capítulo a capítulo:

| Elemento | n | Mínimo | Umbral | Veredicto |
|---|---:|---:|---:|---|
| `h2` del capítulo (92 px, texto grande) | 36 | **3.40 : 1** (cap. 03, modo quieto, 1440) | 3.0 : 1 | pasa, **al filo** |
| Párrafo del capítulo (18 px) | 36 | **5.38 : 1** | 4.5 : 1 | pasa |

Evidencia: `r1d-03-etiqueta-contraste.png`.

### B3 — CLS del pin: **CORREGIDO** (0.0000 medido por mí, en seis tamaños y con rueda real)

`PerformanceObserver('layout-shift')` propio, fases separadas, caché deshabilitada, ciclo de vida
completo (carga → 45 puntos por la pieza → fondo del documento → vuelta arriba):

| Viewport | CLS inicial | **CLS tras recorrer todo** | fuentes de shift ≥ 0.05 |
|---|---:|---:|---|
| 390×844 (CPU 4×, 1.6 Mbps) | 0.0000 | **0.0000** | ninguna |
| 667×375 | 0.0000 | **0.0000** | ninguna |
| 768×1024 | 0.0000 | **0.0000** | ninguna |
| 1024×768 | 0.0000 | **0.0000** | ninguna |
| 1440×900 | 0.0000 | **0.0000** | ninguna |
| 1920×1080 | 0.0000 | **0.0000** | ninguna |

Antes: 2.0000 (390 y 1440) y 4.0000 (667×375).

Prueba adicional con **rueda real** (no `scrollTo`), 120 golpes de bajada + 60 de subida
atravesando entrada y salida del pin (`r1d-rueda.mjs`):

| Viewport | CLS | fotogramas medidos | p50 | p95 | peores | tareas largas |
|---|---:|---:|---:|---:|---|---:|
| 1440×900 | **0.0000** | 676 | 16.7 ms | 16.8 ms | 33 / 33 / 50 ms | **0** |
| 390×844 (CPU 4×) | **0.0000** | 692 | 16.7 ms | 16.8 ms | 50 / 50 / 67 ms | **0** |

Es decir: 60 fps sostenidos y cero tareas largas durante el scrub, también con CPU a 4×.
`pinType:"transform"` y `scrub:.5` están efectivamente en el bundle servido.

### B4 — Continuidad del clip 02: **CORREGIDO** (medido sobre los binarios en vivo y mirado)

Descargué los 264 fotogramas de la URL y repetí la métrica de `film-check` por mi cuenta
(gris 64×64, diferencia media absoluta) — **sin usar el script del repo**:

| Clip | Mediana | Pico interno | Índice | Razón | Antes (R1c) |
|---|---:|---:|---:|---:|---|
| 1 | 4.275 | 13.757 | 14 | 3.218 | — |
| **2** | **6.748** | **9.894** | **83** | **1.466** | pico 33.959, razón 2.412 |
| 3 | 12.595 | 25.385 | 154 | 2.015 | — |
| 4 | 6.754 | 17.469 | 235 | 2.586 | — |
| Cortes declarados | — | 76.847 / 98.211 / 81.365 | 65 / 131 / 197 | — | igual |

Máximo interno de todo el set: **25.385** < guardarraíl `0.75 × 43.109 = 32.33175`.

Y lo que importa de verdad: **miré las imágenes**. Los 12 fotogramas 85→107 son un mismo travelling
sobre la **misma** unidad dental — mismo sillón, mismo taburete verde, mismo suelo de duela, misma
cortina; no hay sustitución de mobiliario (`r1d-04-clip02-continuo-85-107.png`). Los pares de mayor
diferencia de los cuatro clips (14/15, 83/84, 154/155, 235/236, más los segundos de cada clip) son
movimiento de cámara o la disolvencia radiografía→nácar, no cortes encubiertos. Los 24 fotogramas
equiespaciados muestran una progresión coherente nácar → consultorio → sillón → instrumental →
radiografía → nácar.

Matiz honesto, no bloqueante: los cortes **declarados** separan tres consultorios visualmente
distintos (unidad gris moderna con suelo de madera en el clip 02; sillón jade vintage con carpintería
verde oscuro en el clip 03). Para una landing que vende **una** clínica, son tres clínicas.

### B5 — Selección del set por puntero: **CORREGIDO en la página, PERO la regresión que lo protege no mide**

Bytes de entrada reales medidos con CDP (`Network.loadingFinished.encodedDataLength`), caché
deshabilitada, recorrido completo de la película (`r1d-live.mjs`):

| Viewport | Set servido | Entrada total | R1c |
|---|---|---:|---:|
| 390×844 | mobile | **3 365 621 B** | 3.21 MB |
| **667×375** | **mobile** | **3 365 621 B** | **8.27 MB** |
| **768×1024** | **mobile** | **3 365 621 B** | **8.27 MB** |
| 1024×768 | desktop | 8 368 995 B | — |
| 1440×900 | desktop | 8 369 018 B | 8.27 MB |
| 1920×1080 | desktop | 8 369 018 B | — |

`MOBILE_QUERY = '(max-width: 820px), (pointer: coarse) and (max-width: 1180px)'` coincide ya con el CSS.
La corrección es real.

**Pero la regresión número 4 que exigió R1c es ciega en producción.** `scripts/qa.mjs` suma
`response.headers()['content-length']`; contra `nacar.asck.tech` (HTTP/2) **251 de 274 respuestas
llegan sin esa cabecera**:

```
respuestas 274 · con content-length 23 · sin content-length 251
suma content-length (método del repo): 79 661 B
encodedDataLength (CDP, real):      3 365 621 B
protocolo: h2
```

Por eso `qa/PRODUCCION_v2.2/metrics.json` registra `inputBytes: 79661` en tres perfiles y **`0` en
los otros nueve**, y `C22.report.md` presenta esos «79,661 B medidos en la pasada aprobada» como
prueba de que se cumple el presupuesto. La puerta `inputBytes > 3_300_000` **no puede dispararse
nunca contra producción**: pasaría igual si se sirviera el set de escritorio de 8.4 MB. Localmente
(HTTP/1.1 de `vite preview`) sí mide, y de ahí sale el 3 170 256 B de C21.

Reproducido dos veces hoy: mi `r1d-bytes.mjs` y la propia ejecución de `npm run qa` contra
producción (`entrada 79661 B` en 390×844, 667×375 y 768×1024).

---

## 2. Hallazgos vigentes (ninguno es una regresión de R1c)

### H1 — El peso móvil incumple la doctrina y **ha empeorado** desde R1c (bloquea el 8.5)

| Presupuesto | Doctrina | Medido hoy | Desvío |
|---|---:|---:|---:|
| Entrada móvil con secuencia | ≤ 2 500 000 B | **3 365 621 B** | **+34.6 %** |
| Entrada desktop con secuencia | ≤ 8 000 000 B | **8 369 018 B** | +4.6 % |

Y los sets crecieron al regenerar el clip 02: desktop **7 884 418 → 7 983 510 B**, móvil
**2 824 596 → 2 980 502 B**. Los límites propios del repo (8 MB / 3 MB, solo fotogramas) se cumplen
por 0.2 % y 0.7 % de margen; los de la doctrina (entrada total) no. En R1c el desvío móvil era
+13 %; hoy es +35 %.

### H2 — Puertas de QA débiles o inexactas (bloquea el 8.5)

1. **Bytes:** ciega en producción (arriba).
2. **CLS:** R1c pidió `clsScroll < 0.1` como puerta; `qa.mjs` falla a partir de **0.25**, y solo en
   390×844 y 1440×900. El valor real es 0.0000 en los seis tamaños, así que apretar la puerta es gratis.
3. **Contraste:** `measureAllLabelContrasts` (a) **fuerza** `visibility:visible; opacity:1;
   transform:none` sobre la tarjeta en modo animado — no mide el estado real que ve el usuario — y
   (b) calcula el contraste como percentil 99.5 contra percentil 10 de luminancia del recorte, que
   no es la relación texto/fondo de WCAG. Da 8.53–8.54 y mi método riguroso da 8.55–8.57, así que
   hoy coinciden por suerte; el instrumento sigue siendo aproximado.

### H3 — CSS muerto todavía servido

`actoHtml` sí desapareció del bundle JS (0 coincidencias en `index-CLlWEV_1.js`), pero
`arcosActo()` sigue exportado en `src/lib/arco.ts` (sin importadores) y el CSS servido conserva
**32 bloques `.acto*` / `.paso*` / `.rail*` ≈ 3 085 B = 12.5 % del CSS** para marcado que no existe:
`document.querySelectorAll('[class*=acto],[class*=paso],[class*=rail]')` → **0 nodos**.

### H4 — LCP en frío: 3 508 ms en la primera visita del día

| Medición (390×844, CPU 4×, 1.6 Mbps, sin caché) | LCP |
|---|---:|
| Primera petición de la sesión (contenedor frío) | **3 508 ms** |
| 5 repeticiones seguidas | 812 / 924 / 1 000 / 1 136 / 1 256 ms (mediana **1 000**) |
| Otra pasada independiente (script de referentes) | 1 312 ms |
| `npm run qa` contra producción, hoy | 1 160 ms |

Elemento LCP: `p.h-sub` / `h1`, pintados desde el HTML. Bajo el tope de 4 s, pero por encima del
presupuesto de 2.5 s cuando el contenedor está frío — el mismo síntoma que C22 reportó (3 596 ms en
la primera pasada) y despachó como «arranque en frío» sin dejarlo anotado como riesgo.

### H5 — Accesibilidad: dos huecos que siguen abiertos

- **8 de 13 CTA a WhatsApp no se alcanzan con teclado en modo animado.** Las tarjetas están
  `visibility:hidden` hasta que el scrub las muestra, así que el orden de tabulación salta de la nav
  a la CTA de la coda (12 focos recorridos, ninguno es CTA de capítulo). En modo quieto sí están las
  13. Es el N7 de R1c, sin cambio.
- **Objetivos táctiles < 44 px con puntero grueso a 1024 y 1180 px**: `Método` 63×18, `Servicios`
  80×18, `Pacientes` 82×18, `Visita` 49×18. A 390, 768 y 820 px no hay ninguno por debajo de 44 (los
  cinco de R1c están corregidos y verificados), pero la nav de escritorio se sirve tal cual a una
  tableta en horizontal.
- Al pulsar el interruptor el documento encoge de 28 432 a 15 282 px y **la posición de lectura se
  pierde**: se cae a la coda o al pie. La obra está entera, pero el usuario aterriza en otro sitio.

### H6 — El `npm run qa` del repo contra producción **falla hoy** (exit 1) por un 502 transitorio

Ejecuté `QA_BASE=https://nacar.asck.tech QA_STEP_MS=600 npm run qa` en el worktree. Resultado:
**exit 1**, con un único fallo:

```
on 1024x768 · errors: ["Failed to load resource: the server responded with a status of 502 ()"]
            · broken: ["502 https://nacar.asck.tech/film/desktop/c01-005.webp"]
```

Los otros 11 perfiles pasan (LCP 644–1 160 ms, CLS inicial 0, CLS barrido 0, contraste mín. 8.54,
overflow 0, 45/45 cambios). Verifiqué si el 502 es reproducible: **528/528 fotogramas devuelven 200**
pidiendo los dos sets completos en lotes de 64 peticiones paralelas, y 120/120 en lotes de 30. Es
inestabilidad puntual de la plataforma (Traefik/Coolify), no un defecto del código — el `paint()`
degrada bien: conserva el fotograma anterior y no lanza excepción. Pero significa que «`npm run qa`
aprobado contra producción» (C22) **no se reproduce a demanda**, y que un visitante puede toparse con
un fotograma que no llega.

### H7 — Craft menor

- `/film/**` (8.4 MB desktop, 3.4 MB móvil, stills incluidas) se sirve **sin `Cache-Control`**;
  `nginx.conf` solo cubre `/assets/` (`immutable`), `/fonts/` y `index.html`. Medido: la segunda
  visita se resuelve por caché heurística (461 B de red), así que hoy no duele — pero la política es
  implícita y depende de `Last-Modified`.
- `mailto:asck7986@gmail.com` sigue en el pie (decisión expresa de Kevin, anotada).
- Radiografía literal (ortopantomografía) en el clímax: se conserva por decisión expresa de Kevin.
- Copy de los capítulos **02** («Escuchamos, medimos y mostramos») sobre macro de nácar (índices
  28–60) y **06** («tu boca en pantalla») sobre instrumental (143–176; la pantalla aparece en el 198):
  siguen sin corresponder con la imagen. Decisión de Kevin, anotada.
- Los 9 capítulos repiten el mismo bloque abajo-izquierda; `RUBRICA_v2.md` lo llama «composición
  deliberadamente consistente». Sigue siendo la misma composición nueve veces.

---

## 3. Lo que está bien (verificado, no asumido)

- **Consola y red limpias**: 0 errores de consola, 0 `pageerror`, 0 respuestas ≥ 400 en **mis 12
  combinaciones** (6 viewports × 2 modos), en las 274 peticiones de un recorrido completo y en 528/528
  fotogramas pedidos en paralelo. (La pasada del `qa.mjs` del repo sí cazó un 502 transitorio: H6.)
- **Sin overflow horizontal** en 320, 360, 390, 414, 768, 820 y 1180 px (`scrollWidth == clientWidth`).
- **Scroll-proof 45/45** en los 6 tamaños, con dos instrumentos a la vez: `data-frame` publicado por
  el JS **y** hash del canvas realmente pintado (48×27 en gris). Las dos series dan 45 valores
  distintos en 45 muestras.
- **Tipografía**: 2 familias exactas (Cormorant Garamond + Inter Variable), 4 `woff2` autoalojadas,
  **116 770 B** comprimidos; `h1` 158.4 px vs. cuerpo 18 px → **ratio 8.8 : 1**; etiqueta 11 px /
  `letter-spacing` 3.08 px.
- **Paleta**: ningún `#000`/`#fff` renderizado (los 19 «positivos» son `html`, `head`, `meta`,
  `title`, `link`, `style`, `script`, que no pintan nada).
- **Curvas**: en el bundle propio solo `expo`, `expo.out`, `power2.in/out`, `power3.out`,
  `power3.inOut`, `power4` y dos `ease:"none"` — ambos sobre animaciones con `scrub` (parallax del
  intersticio y desvanecido de la pista), que es la práctica correcta. **Cero `ease`/`linear` por defecto.**
- **Interruptor**: 156×44 (390) / 170×44 (1440), `aria-pressed` correcto en los dos estados, texto
  que cambia, `?motion=on|off`, `localStorage` con persistencia verificada.
- **Accesibilidad base**: `lang="es"`, skip link (235×46, con foco visible), `:focus-visible` de 2 px
  con color por contexto en los 12 focos recorridos, `<ol>` oculta con los 9 capítulos, único `<img>`
  con `alt`, jerarquía de encabezados sana (1 `h1`, `h2` por sección).
- **Conversión**: **13** enlaces `wa.me`, **13 de 13 con mensaje precargado** (R1c contó 8),
  `tel:+525514879836`, disclaimer de clínica ficticia y cédula marcada `(demo)`.
- **Modo quieto**: 9/9 láminas con las mismas imágenes a sangre, mismo copy y misma jerarquía;
  entrada 915 329 B en 390×844.
- **404 propio**: HTTP 404 real, `<title>404 — NÁCAR`, con vuelta al inicio.
- **`DIRECCION.md` vuelve a describir lo servido**: `--pizarra #63625C`, 1440/720 px, 10 fps,
  7 983 510 / 2 980 502 B, pico 25.385, guardarraíl 32.33175 — los cinco datos coinciden con mi medición.

---

## 4. Comparación en vivo con los tres referentes

Mismo día, mismo Chromium, sin caché; 390×844 con CPU 4× y 1.6 Mbps; barrido de 45 puntos a 1440×900.

| Criterio | **NÁCAR** | UMBRAL (8.5) | Entre líneas (danza) | Excamormar |
|---|---|---|---|---|
| LCP 390×844 (CPU 4×) | 1 312 ms (mediana propia 1 000; **3 508 en frío**) | **616 ms** | 1 220 ms | 3 516 ms |
| LCP 1440×900 | 1 024 ms | **664 ms** | 752 ms | 1 164 ms |
| CLS inicial 390 | **0.0000** | 0.0000 | 0.0260 | 0.0000 |
| **CLS tras recorrer la pieza (1440)** | **0.0000** | **1.5361** | 0.0001 | 0.0000 |
| Carga inicial 390 (sin recorrer) | **605 711 B** | 5 666 468 B | 1 156 487 B | 9 535 266 B |
| Entrada 1440 tras recorrer todo | **8 368 995 B** | 20 349 544 B | 2 551 401 B | 34 810 495 B |
| Entrada 390 tras recorrer todo | 3 365 621 B | — | — | — |
| Altura del documento (1440) | 31.2 pantallas | 38.2 | 10.7 | 33.7 |
| Cambios de imagen (45 muestras, hash de captura) | 45 | 45 | 45 | 45 |
| Pieza pinneada | 1 | 1 | 0 | 0 |
| Interruptor de movimiento | **170×44, `aria-pressed` ✓** | **no encontrado** | 99×44, `aria-pressed` ✓ | 252×44, **sin `aria-pressed`** |
| Enlaces `wa.me` | **13 (13 con mensaje)** | 0 | 6 | 0 |
| Errores de consola / HTTP ≥ 400 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Overflow horizontal | 0 | 0 | 0 | 0 |
| Familias tipográficas | Cormorant Garamond + Inter | **Cormorant Garamond + Inter** | Patrick Hand + Caveat | Archivo + Inter |

*Nota de método:* el instrumento neutro de R1c (hash del canvas) no sirve para danza ni Excamormar,
que no usan canvas; usé hash de captura reducida para los cuatro y **satura en 45/45 en todos**, así
que ese criterio ya no discrimina. Para NÁCAR el hash del canvas también da 45/45.

**Dónde gana NÁCAR ahora**

1. **CLS**: 0.0000 tras recorrer toda la pieza, incluida la entrada y salida del pin, con rueda real
   y con `scrollTo`. UMBRAL, el referente calibrado en 8.5, sigue en **1.5361**. Esta es la vuelta
   completa del peor dato de R1c.
2. **Peso**: 8.37 MB frente a 20.35 de UMBRAL y 34.81 de Excamormar, con una secuencia de 264
   fotogramas y 31.2 pantallas de recorrido.
3. **Fallback + interruptor**: único de los cuatro con obra idéntica en modo quieto, píldora ≥44 px,
   `aria-pressed` en ambos estados y ciclo verificado a prueba de carreras. UMBRAL no tiene interruptor.
4. **Conversión**: 13 CTA con mensaje precargado por capítulo; los otros tres suman 6, 0 y 0.
5. **Fluidez medida**: p95 de 16.8 ms y 0 tareas largas durante el scrub, también con CPU a 4×.

**Dónde sigue perdiendo**

1. **LCP**: 1 024 / 1 312 ms contra 664 / 616 ms de UMBRAL; y un primer golpe en frío de 3 508 ms.
2. **Identidad tipográfica**: el mismo par exacto que UMBRAL. Heredado, no inventado.
3. **Peso móvil sobre doctrina**: 3.37 MB contra un presupuesto de 2.5 MB. Danza pesa 1.16 MB.
4. **Composición**: nueve capítulos con el mismo bloque abajo-izquierda; UMBRAL varía más su retícula.

**Conclusión:** NÁCAR v2.2 **supera** a Entre líneas y a Excamormar, y **empata técnicamente con
UMBRAL**: le gana en CLS, peso, fallback y conversión; le pierde en LCP, identidad tipográfica y
presupuesto móvil. Ya no arrastra ningún defecto que los referentes no tengan.

---

## 5. Rúbrica

| Categoría | Peso | R1c | **R1d** | Por qué |
|---|---:|---:|---:|---|
| Concepto y narrativa | 15 % | 8.0 | **8.2** | Concepto nombrable y momento firma real (radiografía→nácar); el clip 02 ya no rompe el mundo; −copy de 2 de 9 capítulos y tres consultorios distintos |
| Tipografía | 15 % | 8.5 | **8.5** | 2 familias, 4 woff2 autoalojadas (116.8 KB), ratio 8.8:1 medido; hereda el par de UMBRAL |
| Composición y espacio | 10 % | 7.5 | **7.5** | Asimetría y numeración editorial correctas; los 9 capítulos repiten el mismo bloque |
| Color y atmósfera | 10 % | 6.5 | **8.5** | AA aprobado en todo: 8.55:1 en las 36 etiquetas, 5.38:1 mínimo en cuerpo, 3.40:1 en display; tokens del mundo, sin #000/#fff |
| Movimiento y scroll | 15 % | 7.5 | **9.0** | Un pin, `end` en px, `scrub .5`, `pinType transform`, 45/45 en 6 tamaños, CLS 0, p95 16.8 ms, 0 tareas largas, sin hijack |
| Fallback reduce + accesibilidad | 10 % | 4.0 | **8.5** | Misma obra en quieto, interruptor 44 px con `aria-pressed`, ciclo a prueba de carreras, persistencia, tap ≥44 en 390; −8 CTA sin teclado en animado, nav 18 px en tableta, se pierde la posición al conmutar |
| Rendimiento | 10 % | 6.0 | **7.5** | LCP mediana 1.0 s y CLS 0; −entrada móvil 3.37 MB (+35 % sobre doctrina), desktop 8.37 MB, LCP en frío 3.5 s |
| Detalle / craft | 10 % | 7.0 | **8.0** | 404, foco, HUD, disolvencias, biblia realineada, regresiones nuevas; −12.5 % de CSS muerto, `/film` sin `Cache-Control`, puertas de QA débiles |
| Contenido y conversión | 5 % | 8.5 | **9.0** | 13 CTA `wa.me`, las 13 con mensaje por capítulo; cifras concretas, disclaimer correcto |

**Suma ponderada = 8.305 → nota final 8.3 / 10.**
**Topes aplicados: ninguno.** (0 errores de consola · LCP < 4 s · sin overflow en 375 · reduce
manejado y digno · sin hijack · sin #000/#fff crudos · 2 familias · CTA funcionales.)

Por encima de 7.5 (enseñable a prospecto), **por debajo de 8.5 (estándar de entrega)**.
`RUBRICA_v2.md` se autoasigna 8.89; la diferencia está casi toda en Rendimiento (se puntúa 9.2 con
el presupuesto de la doctrina incumplido en móvil y con una puerta de bytes que no mide) y en
Reduce/Accesibilidad y Craft (9.4 y 9.0 sin descontar teclado, CSS muerto ni cabeceras).

---

## 6. Correcciones para alcanzar 8.5 (en orden)

1. **Peso móvil a presupuesto.** Entrada 3 365 621 B vs. 2 500 000 B de doctrina. Opciones medidas:
   bajar el set móvil a ~2.1 MB (q38 o 132 fotogramas con `floor`, la doctrina admite mitad de
   fotogramas en móvil) o servir 640 px en lugar de 720 px. Regresión: puerta sobre **entrada total
   medida**, no sobre el tamaño del directorio.
2. **Arreglar la puerta de bytes.** `scripts/qa.mjs` debe medir con
   `Network.loadingFinished.encodedDataLength` (CDP) o `performance.getEntriesByType('resource')
   .reduce((t,r)=>t+r.transferSize,0)`; hoy suma `content-length` y contra HTTP/2 lee 79 661 B donde
   hay 3 365 621 B. Sin esto, el bloqueante B5 no está protegido contra regresiones.
3. **Apretar la puerta de CLS a `< 0.1`** (hoy 0.25) y extenderla a los seis viewports: el valor real
   es 0.0000, así que no cuesta nada y cierra el hallazgo B3 de verdad.
4. **Medir el contraste sin falsear el estado.** Quitar el forzado de `visibility/opacity/transform`
   en modo animado (navegar al progreso de cada capítulo, como hace `r1d-contraste.mjs`) y comparar
   color de texto contra fondo real en vez de percentiles de luminancia.

## 7. Deseables

- Alcanzar las 8 CTA de capítulo con teclado en modo animado (p. ej. mantenerlas en el flujo con
  `visibility` conmutada solo por el scrub visual, o un índice navegable que salte a cada capítulo).
- Subir a 44 px los cuatro enlaces de la nav cuando `(pointer: coarse)` y el ancho es 1024–1180.
- Conservar la posición de lectura al conmutar el movimiento (mapear el progreso del pin al capítulo
  equivalente del modo quieto).
- Borrar los 32 bloques CSS `.acto*/.paso*/.rail*` (3 085 B, 12.5 % del CSS) y `arcosActo()`.
- `Cache-Control: public, max-age=31536000, immutable` para `/film/**` en `nginx.conf`.
- Densificar el scrim del capítulo 03 en modo quieto (h2 a 3.40:1, al filo del mínimo de texto grande).
- Romper la composición en 2 de los 9 capítulos.
- Realinear el copy de los capítulos 02 y 06 con la imagen, o mover sus tramos (decisión de Kevin).
- Vigilar el arranque en frío: 3.5 s de LCP en la primera visita tras una pausa larga.

---

## 8. Cómo reproducir

```
git -C <repo> worktree add %TEMP%\nacar-review-r1d origin/main
# node_modules por junction al repo principal; playwright 1.62.1

node r1d-live.mjs        # 6 viewports x 2 modos: LCP, CLS por fases, bytes CDP, overflow, 45 puntos
node r1d-lcp.mjs         # 5 repeticiones de LCP en 390x844 CPU 4x / 1.6 Mbps
node r1d-toggle.mjs      # ciclo on->off->on en sesion (B1)
node r1d-carrera.mjs     # clic antes del manifiesto y rafagas de clics (B1)
node r1d-contraste.mjs   # 9 capitulos x 2 anchos x 2 modos, sin forzar estilos (B2)
node r1d-rueda.mjs       # CLS y fotogramas con rueda real cruzando el pin (B3)
node r1d-frames.mjs      # 264 fotogramas en vivo: diffs, picos y hojas de contacto (B4)
node r1d-bytes.mjs       # content-length vs encodedDataLength contra produccion (B5)
node r1d-probe.mjs       # a11y, tipografia, copy, CTA, overflow, 404, ciclo off->on->off
node r1d-probe2.mjs      # #000/#fff, objetivos tactiles con puntero grueso, eases del bundle
node r1d-refs.mjs        # los 3 referentes en vivo, mismas condiciones
QA_BASE=https://nacar.asck.tech QA_STEP_MS=600 npm run qa   # el QA del repo, contra produccion
```

Salidas crudas: `out/live.json`, `out/toggle.json`, `out/contraste.json`, `out/contraste-h2.json`,
`out/contraste-p.json`, `out/frames-diff.json`, `out/refs.json`, `out/probe.json`, `out/probe2.json`,
`out/lcp.json`, `out/qa-remoto.log`.

## 9. Capturas entregadas

| Fichero | Qué prueba |
|---|---|
| `r1d-01-interruptor-off-390.png` | Tras pulsar «QUITAR MOVIMIENTO» en sesión a 390 px: capítulo 05 completo, imagen, copy, CTA y etiqueta legible (B1+B2) |
| `r1d-02-interruptor-off-1440.png` | Lo mismo a 1440 px: la obra sobrevive al interruptor (B1) |
| `r1d-03-etiqueta-contraste.png` | Recortes reales de la etiqueta con el contraste medido píxel a píxel: 8.55–8.57:1 (B2) |
| `r1d-04-clip02-continuo-85-107.png` | Fotogramas 85→107 del clip 02: un solo mundo, sin sustitución de mobiliario (B4) |
| `r1d-05-pelicula-1440-capitulo07.png` | La pieza animada funcionando a 1440: HUD, progreso, capítulo y CTA |
| `r1d-06-referentes-390.png` | Los cuatro sitios a 390 px en carga, misma sesión |
