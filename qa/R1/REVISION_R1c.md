# REVISIÓN R1c — NÁCAR v2.1 (adversarial, contra la URL en vivo)

**Fecha:** 2026-09-15
**Objeto:** https://nacar.asck.tech · commit `faa35d8` de `main`
**Worktree de revisión:** `C:\Users\anara\AppData\Local\Temp\nacar-review` (detached `faa35d8`, eliminado al cerrar)
**Veredicto:** **RECHAZADA**
**Puntuación:** **6.0 / 10** (suma ponderada 7.13, truncada por el tope «fallback reduce = página sin narrativa»)

Esta revisión no confía en `RUBRICA_v2.md`, `C18c.report.md` ni `qa/R1/REVISION_R1b.md`. Se leyeron
solo para saber qué se afirma. Todo número de abajo sale de un comando ejecutado contra la URL en
vivo o contra los ficheros servidos.

---

## 0. Verificación de que se midió lo que se dice medir

| Comprobación | Resultado |
|---|---|
| `/film/manifest.json` en vivo vs. `public/film/manifest.json` de `faa35d8` | **JSON idéntico** (264+264 fotogramas, 3 cortes, 9 capítulos) |
| SHA-1 de 7 fotogramas servidos vs. los del worktree (`c01-001`, `c02-001`, `c02-033`, `c03-001`, `c04-001`, `c04-066`, `mobile/c02-001`) | **7/7 coinciden** |

El sitio en vivo sirve exactamente los binarios de `faa35d8`.

---

## 1. Hallazgos bloqueantes

### B1 — El interruptor de movimiento rompe la pieza central (1 clic, sin recarga)

**Hecho.** Al pulsar «QUITAR MOVIMIENTO» con la página animada, `data-motion` pasa a `off` pero el
contexto GSAP de la película **no se revierte**: sobreviven 1 `ScrollTrigger` y 1 `.pin-spacer`, y
las 9 `.film-card` conservan el estilo en línea `opacity:0; visibility:hidden` que puso GSAP.

Medido (1440×900 y 390×844, en vivo, `probe2.mjs` / `probe3.mjs`):

| Estado | `data-motion` | tarjetas visibles | opacidades | `.pin-spacer` | triggers | alto del documento |
|---|---|---:|---|---:|---:|---:|
| Antes del clic (on) | on | 0 de 9 | `0,0,…` | 1 | 27 | 28 060 px |
| **Tras el clic (off)** | off | **0 de 9** | `0,0,0,0,0,0,0,0,0` | **1** | **1** | **34 288 px** |
| Tras desplazarse (off) | off | **1 de 9** (op. 0.33) | `0,0,1,0,0,0,0,0,0` | 1 | 1 | 34 232 px |
| Tras recargar | off | 9 de 9 | `1,1,1,1,1,1,1,1,1` | 0 | 0 | 14 106 px |

**Consecuencia visible:** el capítulo 01 queda fantasma al 33 % de opacidad y los ocho restantes
desaparecen por completo — incluidas sus ocho CTA a WhatsApp. El usuario recorre ~34 000 px de
petróleo vacío. Evidencia: `r1c-04-interruptor-roto-capitulo-vacio.png` (pantalla completa, sin
imagen, sin titular, sin copy, sin CTA).

**Causa raíz** (`src/lib/acto.ts`): el `ScrollTrigger` y la `timeline` se crean dentro del
`.then()` de `fetch('/film/manifest.json')`. `gsap.context()` solo captura lo que se crea de forma
**síncrona** en su cuerpo; lo creado después en la promesa queda fuera, así que el
`contextos.forEach(c => c.revert())` de `main.ts` no lo mata ni restaura los estilos en línea.

**Dirección inversa:** `off → on` (el camino de Kevin, cuyo Chrome reporta `reduce`) **sí funciona**
— 11 fotogramas distintos de 12 muestras tras encender. El fallo es unidireccional, y es
precisamente la dirección que usa quien necesita quitar el movimiento.

**Arreglo:** `gsap.context((self) => { … fetch().then(() => self.add(() => { /* timeline + ST */ })) })`,
o construir la escena con el manifiesto ya resuelto antes de abrir el contexto.

---

### B2 — La etiqueta de capítulo es ilegible en los nueve capítulos (AA reprobado)

**Hecho.** `.label` hereda `color: var(--pizarra)` = `#63625c`, un gris oscuro, y se usa sobre la
película (fondo oscuro con scrim) y sobre las láminas del modo quieto.

Contraste medido sobre las capturas reales (extremos de la banda de texto, `contrast.cjs`):

| Elemento | Viewport | Contraste medido | Exigido |
|---|---|---:|---:|
| Etiqueta «05 — CONSULTA» | 390×844 | **2.19 : 1** | 4.5 : 1 |
| Etiqueta «07 — PRECISIÓN» | 1440×900 | **3.65 : 1** | 4.5 : 1 |
| Titular display | 1440×900 | 15.62 : 1 | ok |
| Cuerpo de la tarjeta | 1440 / 390 | 13.06 / 13.38 : 1 | ok |
| HUD `07 / 09` | 1440×900 | 7.80 : 1 | ok |
| Botón WhatsApp de la nav | 1440×900 | 5.90 : 1 | ok |

Falla incluso el umbral de texto grande (3:1) en móvil. La numeración editorial `01 —` es un
elemento **del canon** de la doctrina; aquí está presente y no se lee. Afecta a los 9 capítulos, en
los dos modos. Evidencia: `r1c-03-etiqueta-capitulo-ilegible-390.png`.

**Arreglo:** sobre `.film` y `.film-card`, `.label { color: var(--jade-claro) }` o
`rgba(246,243,238,.72)`; es un token, no un rediseño.

---

### B3 — CLS real de 2.0–4.0, reclasificado como «diagnóstico» en el propio QA

**Hecho.** Con `PerformanceObserver('layout-shift')` sobre la página en vivo, el CLS inicial es
`0.0000` en las 12 combinaciones, pero al recorrer la pieza pinneada aparecen desplazamientos
enteros de viewport:

| Viewport | CLS inicial | CLS acumulado tras el barrido | fuentes de los shifts |
|---|---:|---:|---|
| 390×844 (CPU 4×, 1.6 Mbps, sin caché) | 0.0000 | **2.0000** | `canvas` ×2 (t=3204 ms, t=29951 ms) |
| 667×375 | 0.0000 | **4.0000** | `#metodo` ×2, `canvas` ×2 |
| 768×1024 | 0.0000 | 2.0000 | `canvas` ×2 |
| 1024×768 | 0.0000 | 2.0000 | `canvas` ×2 |
| 1440×900 | 0.0000 | 2.0000 | `canvas` ×2 (t=3742 ms, t=30823 ms) |
| 1920×1080 | 0.0000 | 1.9911 | `canvas` ×2 |

Son exactamente dos shifts de valor `1.0` — entrada y salida del pin —, no ruido de muestreo. CLS es
una métrica de **ciclo de vida completo**: lo que mide CrUX/PageSpeed en este sitio es ≈2.0, veinte
veces el umbral «bueno» (0.1). La doctrina exige «CLS ≈ 0», sin distinguir fases.

`scripts/qa.mjs` separa `clsInitial` (puerta) de `clsScrollDiagnostico` (informativo) desde el
commit `f9f6b5d`; R1b lo recomendó explícitamente. **Mover la puerta no arregla la métrica.**

**Arreglo:** `pinType: 'transform'` en el `ScrollTrigger`, o sacar el `canvas` del flujo con
`position: fixed` propio en lugar de depender del pin, y reservar la altura con el `pin-spacer`
desde el primer pintado.

---

### B4 — La secuencia **no** es un solo mundo visual: hay una sustitución de mobiliario dentro del clip 02

**Hecho.** Entre los índices **97 y 98** (dentro de `c02`, sin corte declarado) la cámara sigue
paneando pero el mundo cambia de identidad:

- índices 93–97: unidad dental **moderna gris-marrón** con lámpara cenital, taburete verde a la
  izquierda, suelo de **duela de madera**;
- índices 98–101: sillón **vintage jade con base de latón**, el taburete ha desaparecido, el suelo
  es **piedra clara** y aparece un mueble bajo distinto.

Evidencia visual: `r1c-01-salto-interno-clip02.png` (9 fotogramas consecutivos, 93→101).

Evidencia numérica (`npm run film-check`, set desktop): pico interno **33.959** en `picoAfter: 98`,
frente a una mediana de clip de **14.078** → 2.41× la mediana, y ~40 % de la magnitud de un corte
real (los tres declarados miden 76.96 / 89.06 / 81.30).

El guardarraíl v2.1 se fijó en `LIMITE_SALTO = 38.7981` = 0.9 × 43.109 (el salto humano confirmado
del clip 02 **original**). Es decir: **el umbral se calibró justo por encima del defecto que
quedaba**, y la «razón local» (que sí lo detectaba) se degradó a métrica informativa. El pico de
33.959 pasa por 12 % de margen.

La propia `DIRECCION.md` lo reconoce en su última línea: «queda como deuda de continuidad del
material fuente». Una deuda declarada sigue siendo una deuda: para el criterio «un solo mundo
visual, sin saltos», esto es un fallo.

---

### B5 — Un teléfono en horizontal y una tableta descargan el set de escritorio (7.88 MB)

**Hecho.** `src/lib/acto.ts` elige el set con `matchMedia('(max-width: 640px)')`. La doctrina exige
`pointer: coarse`, no solo ancho.

Peso de entrada total medido (sin caché, recorrido completo de la película):

| Viewport | Set servido | Entrada medida |
|---|---|---:|
| 390×844 | mobile | 3.21 MB |
| **667×375 (teléfono en horizontal)** | **desktop** | **8.27 MB** |
| **768×1024 (tableta)** | **desktop** | **8.27 MB** |
| 1440×900 | desktop | 8.27 MB |

Curiosamente el CSS del modo quieto **sí** usa `(pointer:coarse) and (max-width:1180px)` para las
láminas (línea 1001 de `sections.css`): la regla correcta existe en el proyecto, pero no se aplicó
al selector de set de la secuencia.

---

## 2. Hallazgos no bloqueantes con evidencia

### N1 — La radiografía no es «abstracta» y lee como cráneo

`DIRECCION.md` pide «radiografía abstracta» y prohíbe «caras generadas». Lo servido en los índices
198–235 es una **ortopantomografía literal**: órbitas, senos maxilares, rama mandibular y arcada
completa. El fotograma 206 lee como cráneo sonriente a pantalla completa
(`r1c-02-radiografia-craneo.png`); el 225 muestra anatomía inverosímil (arcada duplicada arriba a la
izquierda, manchas anaranjadas que no existen en una radiografía) y el 232 superpone cráneo y nácar
como doble exposición.

Es un morfado del modelo de vídeo, no un fundido nuestro — eso está bien resuelto. Pero para una
landing cuyo objetivo declarado es «matar el miedo al dentista», poner una calavera sonriente y
anatómicamente falsa en el clímax es una decisión de dirección que juega en contra del encargo.

### N2 — Dos de los nueve capítulos hablan de algo que no está en pantalla

Con `tramos` × 263 fotogramas:

| Capítulo | Tramo | Índices | Qué se ve | Veredicto |
|---|---|---|---|---|
| 02 «Diagnóstico — mirar antes de tocar» | 0.105–0.23 | 28–60 | macro de nácar / esmalte | **no cuadra** |
| 06 «Plan — ves lo que vemos, **tu boca en pantalla**» | 0.545–0.67 | 143–176 | sillón e instrumental; la pantalla no aparece hasta el 198 | **no cuadra** |

Los otros siete sí cuadran. La doctrina permite tramos independientes del metraje, pero «tu boca en
pantalla» sobre un paño de instrumental es una promesa visual incumplida.

### N3 — Cinco objetivos táctiles por debajo de 44 px en 390 px

| Elemento | Texto | Tamaño |
|---|---|---|
| `A.h-quiet` | CONOCER EL MÉTODO | 187×**27** |
| `A.nav__marca` | NÁCAR · ESTUDIO DENTAL | 121×**38** |
| `A.nav__wa` | **WHATSAPP** (CTA principal de la nav) | 117×**38** |
| `A.cierre__tel` | O LLAMA: +52 55 1487 9836 | 226×**27** |
| `a[mailto]` | asck7986@gmail.com | 127×**16** |

### N4 — `DIRECCION.md` ya no describe lo que se sirve

| Dato en la biblia | Realidad medida |
|---|---|
| set desktop `7 512 862 B` | **7 884 418 B** |
| set móvil `3 493 070 B` | **2 824 596 B** |
| WebP móvil «800 px» | **720×412 px** |
| «razón 6.798 / 6.752 frente al límite 3.5» | razón máx. **2.412 / 2.412** frente a límite **4.0** (+ guardarraíl absoluto 38.7981) |
| `--pizarra #6D6C66` | CSS: `#63625c` |

El checklist de nivel agencia pide «la mini-biblia existe y el CSS la reproduce token por token».
Aquí la biblia describe una versión anterior.

### N5 — Código muerto de la v1 sigue en el bundle

`src/render.ts` define `actoHtml()` (la pieza pinneada de arcos de la v1, con `arcosActo()`) y la
retiene con `void actoHtml` — lo que impide el tree-shaking. Su CSS (`.acto*`, `.paso*`, `.rail*`)
también sigue en `sections.css`.

### N6 — Correo de contacto en Gmail

El pie enlaza `mailto:asck7986@gmail.com`. El correo operativo de ASCK es `contacto@asck.tech`; una
dirección de Gmail en una demo premium resta credibilidad.

### N7 — Las ocho CTA de capítulo son inalcanzables por teclado sin recorrer el pin

En modo animado las tarjetas están `visibility:hidden` hasta que el scrub las muestra, así que la
tabulación salta del botón de la nav directamente a la CTA de la coda. No es un fallo de la doctrina
(las CTA existen y funcionan), pero 8 de los 13 enlaces a WhatsApp solo se alcanzan con rueda.

---

## 3. Lo que sí está bien (verificado, no asumido)

- **LCP excelente en todas partes**: 696–1268 ms; en 390×844 con CPU 4× y 1.6 Mbps, **1204 ms**
  (animado) y **1268 ms** (quieto), muy por debajo de 2 500 ms. Elemento LCP: `h1` / `p.h-sub`,
  pintados desde el HTML — el patrón UMBRAL está bien aplicado.
- **CLS inicial 0.0000** en las 12 combinaciones.
- **Scroll-proof 45/45**: los 45 puntos de muestreo (intervalo 600 ms) devuelven 45 valores
  distintos de `data-frame` en los 6 viewports. Matiz honesto: `data-frame` es el índice exacto que
  el propio JS publica; medido con el instrumento neutro que usé para los referentes (hash del
  canvas pintado) el resultado es **35** de 45 muestras — igual que UMBRAL, dos menos que
  Excamormar. Las dos cifras no son comparables entre sí; la de 35 sí lo es entre sitios.
- **Consola limpia**: 0 errores, 0 excepciones de página, 0 respuestas HTTP ≥ 400 en las 12
  combinaciones (y 0 en los 528 `HEAD` a los fotogramas; el único fallo fue un `fetch failed`
  transitorio que reintentado devuelve 200).
- **Presupuestos de set**: desktop 7 884 418 B (98.6 % del límite propio de 8 MB); móvil
  2 824 596 B (94.2 % del límite propio de 3 MB, aunque **+13 % sobre los 2.5 MB de la doctrina**).
- **Modo quieto en carga fría**: 0.92 MB de entrada, las 9 láminas visibles con el mismo copy y la
  misma jerarquía. Es «la misma obra, otra mecánica» bien hecha… mientras no se toque el interruptor.
- **Tipografía**: exactamente 2 familias (Cormorant Garamond 300/400/300-italic + Inter Variable),
  4 `woff2` autoalojados, 115.6 KB en total, `h1` 158.4 px vs. cuerpo 18 px → **ratio 8.8 : 1**.
- **Foco**: `:focus-visible` de 2 px con color por contexto en los 10 focos recorridos; skip link
  presente y funcional; `<ol class="visually-hidden">` con los 9 capítulos.
- **404 propio**: HTTP 404 real y página compuesta («404 — NÁCAR»).
- **Conversión**: 13 enlaces `wa.me`, 8 con mensaje precargado por capítulo; sin formularios falsos;
  disclaimer de clínica ficticia en el pie; cédula marcada `(demo)`.
- **Movimiento**: un solo pin, `end` como función en px de viewport, `scrub: 0.5`,
  `invalidateOnRefresh`, `visibilitychange → ScrollTrigger.refresh()`, disolvencia de corte con
  sombra 35 % y `smoothstep`, canvas `{alpha:false}` con DPR ≤ 2, póster por encima del canvas. Sin
  `ease`/`linear` por defecto (grep limpio). Sin hijacking.
- **Sin overflow horizontal** en 320, 360 y 390 px: `scrollWidth == clientWidth`. Los únicos
  elementos que rebasan el viewport son los arcos SVG decorativos (`aria-hidden`), sangrados a
  propósito y recortados; no hay barra horizontal.

---

## 4. Comparación con los tres referentes (medida en vivo, mismas condiciones)

Todas las filas: Chromium, sin caché; 390×844 con CPU 4×; medición propia, el mismo día.

| Criterio | NÁCAR | Entre líneas (danza) | Excamormar | UMBRAL (8.5) |
|---|---|---|---|---|
| LCP 390×844 (CPU 4×) | **1204 ms** | 1112 ms | 1480 ms | **724 ms** |
| LCP 1440×900 | 856 ms | 824 ms | 880 ms | **576 ms** |
| CLS inicial 390 | 0.0000 | 0.0101 | 0.0000 | 0.0000 |
| **CLS tras recorrer la pieza (1440)** | **2.0000** | **0.0051** | **0.0000** | 1.5369 |
| Entrada 390×844 | **3.21 MB** | 2.55 MB | 10.18 MB | 6.07 MB |
| Entrada 1440×900 | **8.27 MB** | 2.55 MB | 34.81 MB | 20.35 MB |
| Modo quieto, entrada | 0.92 MB | 1.52 MB | 9.54 MB | 0.72 MB |
| Interruptor de movimiento | **156–187×44, `aria-pressed` ✓** | 99×44, `aria-pressed` ✓ | 252×44, **sin `aria-pressed`** | **no encontrado** |
| Cambios de imagen, mismo método (hash del canvas, 45 muestras, 1440) | 35 | 13 | 37 | 35 |
| Altura total del documento (1440) | 31.2 pantallas | 10.7 | 33.7 | 37.6 |
| Pieza pinneada (`.pin-spacer`) | 1 | 0 | 0 | 1 |
| Errores de consola / 404 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Overflow horizontal (6 viewports) | 0 | 0 | 0 | 0 |
| Familias tipográficas | Cormorant Garamond + Inter | Patrick Hand + Caveat | Archivo + Inter | Cormorant Garamond + Inter |
| Enlaces `wa.me` | **13** | 6 | 0 | 0 |

### Dónde gana NÁCAR

1. **Peso.** 8.27 MB de entrada en desktop contra 20.35 MB de UMBRAL y 34.81 MB de Excamormar;
   3.21 MB en móvil contra 6.07 y 10.18 MB. Es el único que mete una secuencia de 264 fotogramas
   dentro de los presupuestos de la doctrina en desktop.
2. **Densidad narrativa por pantalla.** Consigue 35 cambios de imagen (mismo método de medida) en
   31.2 pantallas, frente a 35 de UMBRAL en 37.6 y 37 de Excamormar en 33.7: más historia por
   pantalla, y con 9 bloques de copy y CTA propios frente a los de los referentes. Danza no compite
   aquí (13 cambios en 10.7 pantallas).
3. **Interruptor de movimiento.** Es el único con píldora ≥44 px **y** `aria-pressed` correcto junto
   con danza; Excamormar tiene botón («VER EL RECORRIDO SIN ANIMACIÓN», 252×44) pero sin
   `aria-pressed`, y en UMBRAL una búsqueda amplia de controles con texto/clase de
   movimiento/reduce no encontró ninguno. En carga fría el modo quieto de NÁCAR sirve las 9 láminas
   por 0.92 MB.
4. **Conversión.** 13 CTA a WhatsApp con mensaje precargado por capítulo; los otros tres suman 6, 0
   y 0.
5. **Tipografía.** Dos familias con carácter y ratio 8.8:1 medido. Danza usa Patrick Hand + Caveat,
   dos manuscritas, lo que la doctrina desaconseja como sistema de titulares.

### Dónde pierde NÁCAR

1. **CLS.** 2.0 (y 4.0 en horizontal) contra 0.005 de danza, 0.000 de Excamormar y 1.54 de UMBRAL.
   Es el peor de los cuatro, incluso peor que el referente calibrado.
2. **LCP.** 1204 / 856 ms contra 724 / 576 ms de UMBRAL. Pierde contra el referente en las dos
   medidas, aunque los cuatro están dentro del presupuesto.
3. **Integridad del material.** Ni danza ni Excamormar ni UMBRAL tienen una sustitución de
   mobiliario a mitad de plano. Es un defecto exclusivo de NÁCAR, y tiene número: 33.959.
4. **Contraste del texto.** 2.19:1 en la etiqueta de los nueve capítulos. Ninguno de los tres
   referentes presenta un fallo AA en un elemento repetido nueve veces.
5. **Robustez del modo quieto.** Danza conserva su obra al pulsar el interruptor; NÁCAR la pierde.
6. **Identidad tipográfica.** NÁCAR usa **exactamente el mismo par que UMBRAL** (Cormorant Garamond
   + Inter Variable). No inventó su sistema: lo heredó. Para «mejor que UMBRAL» eso no suma.

**Conclusión de la comparación:** NÁCAR **supera** a Entre líneas y a Excamormar en ambición
narrativa, conversión y (frente a Excamormar) en peso; **no supera a UMBRAL**. Pierde contra él en
LCP, CLS, peso relativo por pantalla de secuencia e identidad tipográfica propia, y suma defectos
que UMBRAL no tiene (salto interno, contraste AA, interruptor roto).

---

## 5. Rúbrica

| Categoría | Peso | Nota | Por qué |
|---|---:|---:|---|
| Concepto y narrativa | 15 % | 8.0 | Concepto nombrable y momento firma real; −2 por dos capítulos cuyo copy no corresponde a la imagen y por el clímax de calavera |
| Tipografía | 15 % | 8.5 | 2 familias, autoalojadas, ratio 8.8:1 medido, medidas controladas; hereda el par de UMBRAL |
| Composición y espacio | 10 % | 7.5 | Asimetría y numeración editorial correctas; los 9 capítulos repiten el mismo bloque abajo-izquierda |
| Color y atmósfera | 10 % | 6.5 | Tokens del mundo, sin #000/#fff, scrims correctos; **AA reprobado (2.19:1) en la etiqueta más repetida** |
| Movimiento y scroll | 15 % | 7.5 | Un pin, `end` en px, `scrub 0.5`, 45/45, sin hijack; −2 por el CLS del pin y la ruptura de continuidad |
| Fallback reduce + accesibilidad | 10 % | 4.0 | Carga fría impecable, pero **el interruptor deja la pieza central en blanco**; 5 objetivos < 44 px |
| Rendimiento | 10 % | 6.0 | LCP y CLS inicial excelentes y medidos; CLS de ciclo de vida 2.0–4.0; set desktop a tabletas y móviles en horizontal; móvil +13 % sobre la doctrina |
| Detalle / craft | 10 % | 7.0 | 404, foco, selección, HUD y disolvencias cuidados; código muerto, biblia desactualizada, correo Gmail |
| Contenido y conversión | 5 % | 8.5 | Voz propia, cifras concretas, 13 CTA con mensaje precargado, disclaimer correcto |

**Suma ponderada = 7.13.**

**Topes aplicados:** «Fallback reduce = lista rota / página sin narrativa → **6**». El estado que
produce el propio interruptor del sitio es una sucesión de pantallas vacías sin imagen, sin copy y
sin CTA (B1). La doctrina exige que el evento global lo consuman **todos** los módulos; el de la
película no lo hace.

**Nota final: 6.0 / 10.** Por debajo de 7.5 (enseñable) y muy por debajo de 8.5 (entregable).

---

## 6. Correcciones bloqueantes (en orden)

1. **`src/lib/acto.ts`** — registrar la escena en el contexto: `gsap.context((self) => { … fetch()
   .then(() => self.add(() => { timeline; ScrollTrigger.create(…) })) })`. Regresión obligatoria en
   `scripts/qa.mjs`: cargar con `?motion=on`, **pulsar** `[data-motion-toggle]`, y exigir 9 tarjetas
   con `visibility: visible` y `opacity: 1`, `0` `.pin-spacer` y `0` ScrollTriggers.
2. **`src/styles/sections.css`** — color propio para `.film .label` / `.film-card .label`
   (`var(--jade-claro)` o `rgba(246,243,238,.72)`). Regresión: medir contraste ≥ 4.5:1 sobre las
   capturas de los 9 capítulos en 390 y 1440.
3. **CLS del pin** — `pinType: 'transform'` (o canvas fijo propio). Regresión: `clsScroll < 0.1`
   como **puerta**, no como diagnóstico.
4. **Selector de set** — `matchMedia('(pointer: coarse) and (max-width: 1180px)')` igual que ya hace
   el CSS del modo quieto. Regresión: entrada < 4 MB en 667×375 y 768×1024.
5. **Continuidad del clip 02** — regenerar el tramo 93–101 (o declarar un corte real ahí) hasta que
   el pico interno baje por debajo de ~2× la mediana del clip. Devolver el guardarraíl relativo a
   puerta y bajar `LIMITE_SALTO`; un umbral calibrado por encima del defecto que queda no es un
   guardarraíl.

## 7. Deseables

- Sustituir la ortopantomografía literal por la «radiografía abstracta» que pide la biblia, o al
  menos por un encuadre que no lea como cráneo sonriente.
- Realinear el copy de los capítulos 02 y 06 con lo que se ve (o mover sus tramos).
- Subir a 44 px los 5 objetivos táctiles listados en N3.
- Actualizar `DIRECCION.md` con los pesos, el ancho móvil real (720 px), la razón vigente y el token
  `--pizarra` que realmente usa el CSS.
- Borrar `actoHtml`/`arcosActo` y su CSS.
- Cambiar `asck7986@gmail.com` por `contacto@asck.tech`.
- Variar la composición de alguna tarjeta (2 de 9) para romper la repetición del bloque
  abajo-izquierda.

---

## 8. Cómo reproducir

```
git -C <repo> worktree add %TEMP%\nacar-review faa35d8
node qa-live.mjs      # 6 viewports x 2 modos contra https://nacar.asck.tech, muestreo 600 ms
node qa-refs.mjs      # los 3 referentes en vivo, mismas condiciones
node probe.mjs        # overflow real, tap targets, foco/teclado, tipografia medida, 404
node probe2.mjs       # interruptor on->off  (B1)
node probe4.mjs       # interruptor off->on  (funciona)
node contrast.cjs     # contraste sobre las capturas reales
npm run film-check    # picos internos y cortes declarados
```

Salidas crudas: `out/nacar-live.json`, `out/refs.json`, `out/probe.json`, `out/probe2.json`.

## 9. Capturas entregadas

| Fichero | Qué prueba |
|---|---|
| `r1c-01-salto-interno-clip02.png` | Fotogramas 93→101: el sillón, el taburete y el suelo cambian dentro del mismo plano (B4) |
| `r1c-02-radiografia-craneo.png` | Fotograma 206 ampliado: ortopantomografía literal que lee como cráneo (N1) |
| `r1c-03-etiqueta-capitulo-ilegible-390.png` | «05 — CONSULTA» a 2.19:1 sobre la lámina (B2) |
| `r1c-04-interruptor-roto-capitulo-vacio.png` | Tras pulsar «QUITAR MOVIMIENTO»: pantalla completa vacía (B1) |
| `r1c-05-desktop-capitulo07.png` | El nivel real que alcanza la pieza cuando funciona, 1440×900 |
| `r1c-06-movil-modo-quieto.png` | Modo quieto en carga fría, 390×844: la misma obra, otra mecánica |

---

**Nota de entorno:** el commit `9b4ce12` (posterior a `faa35d8`) anadio `qa/` al `.gitignore`, asi
que este informe y sus capturas viven en disco pero ya no se versionan. Si la evidencia de QA debe
quedar en el repo, hay que excluir `qa/R1/` de esa regla.
