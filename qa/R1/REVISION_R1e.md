# REVISIÓN R1e — NÁCAR v2.3 (adversarial, contra la URL en vivo)

**Fecha:** 2026-09-15
**Objeto:** https://nacar.asck.tech · commit en producción `f67d051`
**Worktree de revisión:** `C:\Users\anara\AppData\Local\Temp\nacar-review-r1e` (detached `origin/main` = `d21a4e2`; eliminado al cerrar)
**Antecedente:** `qa/R1/REVISION_R1d.md` — APROBADA CON RESERVAS, 8.3/10, 4 reservas bloqueantes + 9 deseables
**Veredicto:** **APROBADA CON RESERVAS** — las **cuatro** reservas bloqueantes de R1d y los **tres** deseables que el encargo pedía están cerrados y verificados por mí; aparece **un fallo de accesibilidad nuevo** (WCAG AA) que ninguna puerta cubre
**Puntuación:** **8.4 / 10** (suma ponderada 8.380) frente al **8.6 autoasignado** por `RUBRICA_v2.md`

No confío en `C26.report.md`, `qa/PRODUCCION_v2.3.md`, `RUBRICA_v2.md` ni en `qa/v2/metrics.json`:
se leyeron sólo para saber **qué se afirma**. Cada cifra de abajo sale de un comando propio
(`r1e-*.mjs`) ejecutado hoy contra la URL en vivo o contra los binarios que ella sirve.

---

## 0. Que se midió lo que se dice medir

| Comprobación | Resultado |
|---|---|
| `origin/main` (`d21a4e2`) vs. commit desplegado `f67d051` | el diff sólo toca `qa/`, `docs/` y `RUBRICA_v2.md`; **ni un byte de `src/`, `public/`, `index.html`, `nginx.conf` o `scripts/`** |
| `GET /` | **200**, 9 290 B, `Cache-Control: no-cache, must-revalidate` |
| `GET /film/manifest.json` | **200**, 26 739 B, `no-cache, must-revalidate` |
| Manifiesto servido vs. `public/film/manifest.json` del worktree | **JSON profundo idéntico** (el `sha256` difiere sólo por CRLF del checkout: `b367f185…` servido) |
| `sha256` de **los 528 fotogramas servidos** vs. el worktree | **264/264 desktop y 264/264 móvil idénticos** |
| Huella `?v=` recalculada por mí sobre **los bytes servidos** | desktop `fdaffb917d`, móvil `df4c114570` — **coinciden con `setVersions` del manifiesto** |
| `GET /no-existe-r1e` · `GET /film/mobile/c99-999.webp` | **404** los dos; `<title>404 — NÁCAR</title>` con vuelta al inicio |
| `/robots.txt` · `/healthz` | 200 / 200 |

El sitio en vivo sirve exactamente los binarios de `f67d051`. Todo lo de abajo se midió sobre eso.

---

## 1. Las cuatro reservas bloqueantes de R1d

### R1 — Peso móvil fuera de presupuesto: **CERRADA** (medido con dos instrumentos)

Entrada total tras recorrer la película entera, caché deshabilitada, **dos medidas independientes**:
tamaño real de cuerpo (`response.body().length`) y bytes de cable (`Network.loadingFinished.encodedDataLength`).

| Modo | Viewport | Cuerpo real | CDP (cable) | Presupuesto doctrina | Margen |
|---|---|---:|---:|---:|---:|
| on | 390×844 (CPU 4×, 1.6 Mbps) | **2 461 734 B** | 2 470 501 B | 2 500 000 | **1.5 %** libre |
| on | 667×375 | **2 461 734 B** | 2 470 501 B | 2 500 000 | 1.5 % |
| on | 768×1024 | **2 461 734 B** | 2 470 501 B | 2 500 000 | 1.5 % |
| on | 1024×768 | 7 523 796 B | 7 532 992 B | 8 000 000 | 6.0 % libre |
| on | 1440×900 | 7 523 796 B | 7 532 992 B | 8 000 000 | 6.0 % libre |
| on | 1920×1080 | 7 523 796 B | 7 532 992 B | 8 000 000 | 6.0 % libre |
| off | 390×844 | 1 034 437 B | 915 254 B | 2 500 000 | — |
| off | 1440×900 | 1 256 396 B | 1 135 865 B | 8 000 000 | — |

R1d medía 3 365 621 B (móvil, +34.6 % sobre doctrina) y 8 369 018 B (desktop, +4.6 %). **Los dos
presupuestos de la doctrina se cumplen por primera vez.** Set servido: 7 140 240 B desktop /
2 078 178 B móvil (contados por mí sobre los 528 binarios descargados).

*Matiz honesto:* el margen móvil es de **38 266 B (1.5 %)**. Cualquier fuente nueva, un icono o un
capítulo más lo rompe. No es holgura, es el filo.

### R2 — Puerta de bytes ciega en producción: **CERRADA** (y el diagnóstico de R1d, confirmado)

Reproduje el defecto que R1d denunció y la corrección, en la misma pasada:

| Perfil | Respuestas | Con `content-length` | Suma `content-length` (método viejo) | Cuerpo real (método nuevo) |
|---|---:|---:|---:|---:|
| on 390×844 | 275 | **33** | 99 007 B | **2 461 734 B** |
| on 667×375 | 275 | **33** | 99 007 B | **2 461 734 B** |
| on 768×1024 | 275 | **33** | 99 007 B | **2 461 734 B** |
| on 1024×768 | 275 | **0** | **0 B** | **7 523 796 B** |
| on 1440×900 | 275 | **0** | **0 B** | **7 523 796 B** |
| on 1920×1080 | 275 | **0** | **0 B** | **7 523 796 B** |

Protocolo `h2` (más `data:` y `h3`). El método viejo habría leído **0 B** donde hay 7.5 MB.
El nuevo lee las 275 respuestas y registra **0 respuestas 200 sin cuerpo** en los 12 perfiles;
si alguna lo fuera, la puerta falla. La puerta ahora compara contra el presupuesto de **entrada**
de la doctrina en los **seis** viewports, no contra un límite suelto en dos.

*Nota de método, a favor del repo:* `response.body()` devuelve el cuerpo **descomprimido** para
HTML/CSS/JS. En `off` eso da 1 034 437 B de cuerpo contra 915 254 B de cable — es decir, la puerta
se exige **más** de lo que pesa en la red. Es conservador, no complaciente.

### R3 — Puerta de CLS floja: **CERRADA**, y el valor real es 0 por tres caminos

`PerformanceObserver('layout-shift')` propio, por fases (carga → 45 puntos por la pieza → fondo
del documento → vuelta arriba), caché deshabilitada:

| Viewport | CLS carga | **CLS de ciclo de vida completo** | shifts ≥ 0.01 |
|---|---:|---:|---:|
| 390×844 (CPU 4×, 1.6 Mbps) | 0.0000 | **0.0000** | 0 |
| 667×375 | 0.0000 | **0.0000** | 0 |
| 768×1024 | 0.0000 | **0.0000** | 0 |
| 1024×768 | 0.0000 | **0.0000** | 0 |
| 1440×900 | 0.0000 | **0.0000** | 0 |
| 1920×1080 | 0.0000 | **0.0000** | 0 |

Lo mismo en `off` (6 perfiles): **0.0000**. Y con **rueda real** (`mouse.wheel`, 120 golpes de
bajada + 60 de subida atravesando entrada y salida del pin), en los seis tamaños:

| Viewport | CLS con rueda | fotogramas | p50 | p95 | 3 peores | tareas largas |
|---|---:|---:|---:|---:|---|---:|
| 390×844 (CPU 4×) | **0.0000** | 546 | 17.4 ms | **56.9 ms** | 101 / 111 / 144 ms | **8** |
| 667×375 | **0.0000** | 570 | 16.7 ms | 18.3 ms | 19 / 19 / 21 ms | 1 |
| 768×1024 | **0.0000** | 561 | 16.7 ms | 22.9 ms | 29 / 29 / 34 ms | 1 |
| 1024×768 | **0.0000** | 556 | 16.8 ms | 23.8 ms | 36 / 37 / 41 ms | 1 |
| 1440×900 | **0.0000** | 521 | 17.7 ms | 34.5 ms | 54 / 55 / 60 ms | 1 |
| 1920×1080 | **0.0000** | 482 | **26.6 ms** | 51.5 ms | 74 / 76 / 105 ms | 1 |

La puerta de `qa.mjs` pasa de 0.25 a **0.1** y de 2 a **6** viewports: verificado en el código
servido y en la ejecución. **Reserva cerrada sin discusión.**

*Pero la fluidez que R1d dio por buena no se reproduce.* R1d publicó «p95 de 16.8 ms y 0 tareas
largas, también con CPU a 4×». Yo mido, en dos pasadas independientes (`out/rueda.json`,
`out/rueda2.json`): 1920×1080 con **p50 27.7 ms** (≈36 fps de mediana) y p95 54 ms; 390×844 con
CPU 4× a **p95 42.3 ms y 9 tareas largas**. Sigue sin haber saltos de layout y el scrub es
utilizable, pero «60 fps sostenidos» es una afirmación que hoy no se sostiene en esta máquina.

### R4 — Contraste falseado: **CERRADA**, con mi propio instrumento y sin forzar nada

Método propio a **densidad ×2**: se navega al tramo real de cada capítulo (`data-from`/`data-to`
sobre `trigger.start/end`), se comprueba el estado computado, se captura el recuadro de la etiqueta
dos veces — con el glifo y con el glifo en `transparent` — y se compara la luminancia del texto
contra la del fondo **que hay detrás de esos mismos píxeles**.

| Conjunto | n | Núcleo ancho (decide) | Núcleo puro | Estado real |
|---|---:|---|---|---|
| 9 capítulos × {390×844, 1440×900} × {on, off} | **36** | **mín. 7.39 : 1 · máx. 7.83 : 1** | mín. 8.39 · máx. 8.51 | **36/36 `visibility: visible` y `opacity: 1` sin forzar un solo estilo** |

Umbral WCAG para 11 px: 4.5 : 1. **Pasa con holgura.** El `qa.mjs` del repo publica 6.57–7.36 con
el mismo enfoque a densidad ×1 (más antialias promediado, lectura más conservadora): coherente.
Evidencia: `r1e-03-etiqueta-contraste.png`.

---

## 2. Los tres deseables que el encargo pedía

| Deseable de R1d | Estado verificado por mí |
|---|---|
| Borrar los 32 bloques `.acto*/.paso*/.rail*` y `arcosActo()` | **HECHO**: 0 coincidencias `.acto/.paso/.rail` en el CSS servido (`index-CQHuGuFp.css`, 21 582 B; 5 273 B en cable con gzip), 0 `arcosActo`/`actoHtml` en el JS servido, **0 nodos** en el DOM |
| `Cache-Control` para `/film/**` | **HECHO Y BIEN**: fotograma `200 · public, max-age=31536000, immutable`; manifiesto `no-cache, must-revalidate`; póster y láminas `max-age=604800`. El `immutable` es seguro porque la URL lleva `?v=<huella>` — y la huella **es de verdad** el `sha256` de los 264 binarios (recalculada por mí sobre lo servido) |
| 13 CTA `wa.me` alcanzables con teclado en modo animado | **HECHO**: 13/13 en 1440×900 (22 focos recorridos) y 13/13 en 390×844 (18 focos). **0 focos sin contorno visible** y **0 focos sobre elementos invisibles** |

Y la corrección de la regresión propia de C26 (los 9 CTA de capítulo sin punteros) **resiste el
camino que la provocó**, que es el que ninguna puerta usa:

| Prueba | 1440×900 | 390×844 |
|---|---|---|
| 9 capítulos por `scrollTo` + `elementFromPoint` | **9/9 reciben el clic**, 0 tarjetas invisibles clicables | **9/9**, 0 invisibles clicables |
| **Con rueda real** hasta el 50 % del pin y scrub asentado | capítulo 05 con `opacity 1`, `pointer-events: auto` y **recibe el clic** | — |

Altura del CTA: **44 px** exactos en los dos anchos.

### Ciclo del interruptor on → off → on, en sesión y a mitad de película

| Viewport | antes (mitad del pin) | tras «QUITAR MOVIMIENTO» | recorrido en off | al reactivar |
|---|---|---|---|---|
| 390×844 | 0/9 tarjetas plenas (scrub), 1 pin, doc 28 450 px | **9/9 visibles · 0 pins · 0 triggers · 0 estilos en línea** · doc 15 300 px | 9/9, 0 pins | 1 pin · **12/12 fotogramas distintos en 12 muestras** |
| 1440×900 | 0/9, 1 pin, doc 28 034 px | **9/9 · 0 pins · 0 triggers · 0 inline** · doc 14 012 px | 9/9, 0 pins | 1 pin · **12/12** |

Interruptor: **156×44 px a 390 y 170–176×44 a 1440** (dos medidas independientes), `aria-pressed` correcto en los dos estados, texto que cambia
(«QUITAR MOVIMIENTO» ↔ «VER CON MOVIMIENTO»), `?motion=on|off` y `localStorage` con `try/catch`.

---

## 3. Hallazgo nuevo y bloqueante para el 8.5

### N1 — **Dos textos por debajo de WCAG AA en el modo quieto, y la puerta de contraste no los mira**

La puerta nueva de `qa.mjs` mide el contraste **sólo de `.label`**. Medí también los otros dos
textos sobre imagen, con el mismo instrumento (36 combinaciones cada uno):

| Elemento | n | Mínimo | Dónde | Umbral WCAG | Veredicto |
|---|---:|---:|---|---:|---|
| `h2` del capítulo (92 px, texto grande) | 36 | **2.62 : 1** | **cap. 03, modo quieto, 1440×900** | 3.0 : 1 | **FALLA** |
| Párrafo del capítulo (18 px) | 36 | **4.23 : 1** | **cap. 03, modo quieto, 1440×900** | 4.5 : 1 | **FALLA** |
| `.label` (11 px) | 36 | 7.39 : 1 | cap. 02, modo animado, 390 | 4.5 : 1 | pasa |

Por modo y ancho: `h2` mínimo 3.95 (on/390), 5.67 (on/1440), 4.06 (off/390) y **2.62 (off/1440)**;
párrafo mínimo 5.22 / 5.90 / 4.64 y **4.23**. El único punto negro es el **capítulo 03 en la
versión estática a 1440**: `still-03.jpg` es una curva de porcelana muy clara y el scrim del modo
quieto es un degradado **vertical** (`0deg, rgba(16,32,28,.9) → transparent 70%`) que no cubre la
zona alta-izquierda donde caen el titular y el párrafo. Texto `#F6F3EE` sobre crema.

Esto no es un descubrimiento nuevo: R1d lo dejó anotado como deseable («densificar el scrim del
capítulo 03 en modo quieto — h2 a 3.40:1, al filo»). **No se hizo.** R1d midió 3.40 y yo mido 2.62
sobre el mismo punto: la diferencia es de instrumento (yo capturo a densidad ×2 y promedio el
núcleo del glifo contra su fondo real). Con cualquiera de los dos números el titular está **en el
umbral o por debajo** de 3.0, y el párrafo, que R1d no midió capítulo a capítulo en este punto,
está claramente por debajo de 4.5. Duele el doble porque el modo quieto es el que ve el Chrome de
Kevin por defecto.

La doctrina es explícita: *«texto sobre imagen siempre con scrim direccional (34–66 %, más denso en
móvil y en la versión estática); AA 4.5:1 verificado en el texto MÁS USADO»*. Aquí no se cumple.

Evidencia: `r1e-04-capitulo03-quieto-1440.png`.

---

## 4. Hallazgos vigentes (no bloquean, pero bajan nota)

### N2 — El fotograma nunca se ve a tamaño real; la revisión visual de C26 midió a la escala equivocada

C26 justifica el salto a **q20** con una «revisión visual a tamaño real: 6 fotogramas de cada set,
vistos a 720×412 y 1440×822». **La página no dibuja los fotogramas a ese tamaño en ningún sitio.**
Medido en vivo sobre el lienzo real:

| Viewport | Lienzo (píxeles de dispositivo) | Fotograma | Ampliación `cover` | Qué se ve |
|---|---|---|---:|---|
| 390×844 DPR 2 | 780 × 1688 | 720 × 412 | **×4.10** | una franja central de **176 px** del fotograma, ampliada 4 veces |
| 1440×900 DPR 2 | 2880 × 1800 | 1440 × 822 | **×2.19** | el fotograma completo al doble |

Y el master es peor de lo que parece: `ffprobe` sobre `assets-src/clip/clip-01.mp4` da
**1344×768 @ 24 fps, 158 fotogramas** — o sea que el set «1440×822» **ya es un reescalado** del
original. En un portátil retina o en cualquier teléfono moderno, la película se ve **blanda**.
Las capturas 1:1 de píxeles de dispositivo lo enseñan sin discusión (`r1e-05-calidad-1a1.png`).

Lo justo para el repo: **q20 no introduce bloques ni bandas**, que es lo que C26 afirma y lo que yo
verifiqué mirando. Aislando la calidad a resolución fija (recodificando la referencia de alta
fidelidad a 720 px): q20 = 6 798 B y MAE 2.98/255; q44 = 9 382 B y MAE 2.35/255. El coste del
recorte de calidad es **modesto**; el que manda es la ampliación, que es anterior a la v2.3.
Pero la frase «indistinguible a 1:1» no se sostiene porque **1:1 no es lo que ve nadie**.

### N3 — Los objetivos táctiles de la nav fallan a partir de 1024 px con puntero grueso, no sólo hasta 1180

R1d y C26 dejan abierto «nav de escritorio a 18 px de alto con `(pointer: coarse)` **entre 1024 y
1180 px**». Medido:

| Ancho (con `hasTouch`, `pointer: coarse`) | Objetivos < 44 px |
|---|---|
| 390 · 768 · 820 | **0** |
| 1024 | 4 — Método 63×18, Servicios 80×18, Pacientes 82×18, Visita 49×18 |
| 1180 | 4 — Método 66×18, Servicios 86×18, Pacientes 88×18, Visita 51×18 |
| **1280** | **4 — Método 63×18, Servicios 80×18, Pacientes 82×18, Visita 49×18** |

El hueco no está acotado a 1024–1180: aparece **a partir de 1024 px y no desaparece** (medido en
1024, 1180 y 1280 con `pointer: coarse`). El
pendiente está mal enunciado en `RUBRICA_v2.md` y en `qa/PRODUCCION_v2.3.md`.

### N4 — Al conmutar el movimiento se pierde la posición de lectura (cuantificado)

| Viewport | scrollY antes → después | doc antes → después | posición relativa |
|---|---|---|---|
| 390×844 | 12 526 → 14 456 px | 28 450 → 15 300 px | **44 % → 94.5 %** (aterriza en el pie) |
| 1440×900 | 12 736 → 13 112 px | 28 034 → 14 012 px | **45 % → 94 %** |

La obra queda entera, pero quien pulsa el interruptor a mitad de la película cae casi en el cierre.
Sigue abierto desde R1c.

### N5 — Un fotograma sin `?v=` (o con cualquier `?v=`) sigue respondiendo `immutable`

Reproducido con `curl -I`: `…/c01-001.webp`, `…?v=df4c114570` y `…?v=DEADBEEF` devuelven las tres
**200** con el mismo `ETag` y `Cache-Control: public, max-age=31536000, immutable`. C26 lo anota
como riesgo teórico y es correcto que hoy nada del sitio genera esas URLs — el manifiesto siempre
versiona —, pero un enlace escrito a mano, un buscador o una herramienta antigua (los propios
`qa/R1/audit.mjs` y `contact-sheet.mjs`, que C26 dejó sin tocar) congelan un binario durante un año.

### N6 — El arranque en frío **no lo pude refutar ni confirmar**

| Medición (390×844, CPU 4×, 1.6 Mbps, sin caché) | LCP |
|---|---:|
| Primera visita de mi proceso (contenedor ya caliente) | **1 188 ms** |
| 3 repeticiones | 1 060 / 1 088 / 1 176 → **mediana 1 088 ms** |
| `npm run qa` contra producción, hoy | frío 1 356 ms · 904 / 1 116 / 1 316 → mediana **1 116 ms** |
| Mis 12 perfiles en vivo (6 viewports × 2 modos) | 740 – 1 084 ms |

Elemento LCP: `p.h-sub` / `h1`, pintados desde el HTML (FCP = LCP en las cuatro medidas; TTFB
331–395 ms). **Todo dentro del presupuesto de 2 500 ms.** Los 3 536 ms que C26 publica se midieron
con el contenedor recién creado; **no puedo reproducirlos sin desplegar, y no voy a desplegar**.
El riesgo sigue anotado, no cerrado.

### N7 — Craft menor

- `mailto:asck7986@gmail.com` en el pie, radiografía literal en el clímax y copy de los capítulos
  02 y 06 frente a la imagen: **decisiones expresas de Kevin**, sin tocar. Confirmo que el desajuste
  sigue: el capítulo 06 («Plan · *Ves lo que vemos. Tu boca en pantalla*») cae sobre el instrumental
  (fotograma 163) y la radiografía aparece en el capítulo 08 («Claridad · *Sin letra chica*»).
- Los tres cortes siguen separando **tres consultorios visualmente distintos** para una sola clínica.
- Las láminas `mobile-01.jpg` y `mobile-02.jpg` del modo quieto son casi la misma macro de nácar.
- Composición: los nueve capítulos arrancan en **x = 72 px exactos** en los nueve casos. No es una
  impresión, es el mismo bloque nueve veces.
- La puerta de `contentScreens > 8.01` sólo se aplica cuando el alto ≥ 600 px; a 667×375 la coda
  mide **14.84 pantallas** y nadie mira. Irrelevante para el usuario, relevante para la puerta.

---

## 5. Lo que está bien (verificado, no asumido)

- **`npm run qa` contra producción: APROBADO en mi primera pasada, exit 0**, `failures: []`, 12
  perfiles, y con el mensaje final «QA APROBADO». R1d no pudo reproducirlo (502 transitorio);
  hoy sí se reproduce a demanda.
- **Consola y red limpias**: 0 errores de consola, 0 `pageerror`, 0 respuestas ≥ 400 y 0 respuestas
  200 sin cuerpo en mis **12 combinaciones** (6 viewports × 2 modos) y en las 275 peticiones de cada
  recorrido completo. 528/528 fotogramas descargados con 200.
- **Scroll-proof 45/45 en los seis tamaños con dos instrumentos a la vez**: `data-frame` publicado
  por el JS **y** hash del canvas realmente pintado (48×27 en gris). 45 valores distintos en 45
  muestras, en ambas series y en los seis tamaños.
- **Sin overflow horizontal** en 320, 360, 375, 390, 414, 768, 820 y 1180 px.
- **Tipografía**: exactamente **2 familias** (Cormorant Garamond + Inter Variable; la tercera que
  aparece al barrer el DOM es la de `<html>`, que no pinta nada). **4 woff2 autoalojadas,
  115 524 B**. `h1` 158.4 px vs. cuerpo 16.56 px → **ratio 9.6 : 1**. Etiqueta 11 px con
  `letter-spacing` 3.08 px (0.28 em). Titular de 6 palabras.
- **`font-display: optional` es una desviación de la doctrina (`swap`) pero está justificada y
  probada**: los fallbacks métricos (`Georgia` a 86 % y `Arial` a 107.3 %) existen para matar el
  CLS de 0.25 que venía del swap. Verifiqué que la desviación **no cuesta la identidad**: con red a
  **400 kbps y CPU 4×**, `document.fonts.check` da `true` para Cormorant Garamond e Inter Variable
  y el `h1` se pinta con la fuente real. 6 de 6 intentos en tres perfiles de red.
- **Paleta**: 0 `#000`/`#fff` renderizados (los dos «positivos» son `color` y `border-top-color` por
  defecto del elemento `html`, que no pinta).
- **Curvas**: en el bundle propio sólo `expo`, `expo.out`, `power2.in/out`, `power3.out`,
  `power3.inOut`, `power4` y dos `ease:"none"`, ambos sobre tweens con `scrub` (parallax del
  intersticio y desvanecido de la pista). **Cero `ease`/`linear` por defecto.** 3 × `scrub:.5`,
  `pinType:"transform"`, `anticipatePin:1`. Un solo pin en toda la página.
- **Accesibilidad base**: `lang="es"`, skip link 235×46 con foco visible, `:focus-visible` con
  contorno en **los 22 focos** del recorrido a 1440 y **los 18** a 390, `<ol class="visually-hidden">`
  con los 9 capítulos, único `<img>` con `alt` y con `width`/`height`, jerarquía sana (1 `h1`,
  23 encabezados, `h2` por sección y `h3` anidados).
- **Modo quieto**: 9/9 láminas a sangre con las mismas imágenes, mismo copy y misma jerarquía;
  0 pins, 0 triggers, documento 15 282 px; entrada 1 034 437 B en 390×844.
- **Conversión**: **13** enlaces `wa.me`, **13 con mensaje precargado** por capítulo,
  `tel:+525514879836`, disclaimer de clínica ficticia (6 menciones) y cédula marcada `(demo)`.
- **Seguridad**: CSP completa más `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `X-Frame-Options`, `X-Robots-Tag: noindex, nofollow` y `Cross-Origin-Opener-Policy` **también en
  los WebP de `/film/`**. gzip en cable: HTML 3 306 B, CSS 5 273 B, JS 26 875 B.
- **Continuidad del metraje** (medida por mí sobre los binarios servidos, sin usar `film-check`):

  | Set | Mediana | Máx. interno | Índice | Cortes declarados | Guardarraíl |
  |---|---:|---:|---:|---|---:|
  | desktop | 7.167 | **25.365** | 155 | 76.857 / 98.226 / 81.301 | 32.33175 |
  | móvil | 7.200 | **25.199** | 155 | 76.863 / 98.119 / 81.183 | 32.33175 |

  Miré los tres pares de mayor diferencia interna de cada set (154/155, 149/150, 155/156) a tamaño
  de fotograma y son **movimiento de cámara sobre la misma unidad dental**, no cortes encubiertos.
  Los 24 fotogramas equiespaciados dan una progresión coherente nácar → consultorio → sillón →
  instrumental → radiografía → nácar (`r1e-06-contacto-movil-24.png`). **Ni un bloque ni una banda**
  en los recortes de las zonas más propensas (degradado oscuro de `c01-055`, 2 634 B; pared negra de
  `c04-015`) ampliados ×2.

---

## 6. Comparación en vivo con los tres referentes

Mismo día, mismo Chromium, misma sesión, sin caché. 390×844 con CPU 4× y 1.6 Mbps; barrido de
45 puntos a 1440×900 con hash de captura (instrumento neutro: danza y Excamormar no usan `canvas`
para la secuencia). Los interruptores se remidieron con selector estricto.

| Criterio | **NÁCAR** | UMBRAL (8.5) | Entre líneas (danza) | Excamormar |
|---|---|---|---|---|
| LCP 390×844 (CPU 4×, 1.6 Mbps) | 1 228 ms | **672 ms** | 1 192 ms | 2 032 ms |
| LCP 1440×900 | 944 ms | **688 ms** | 944 ms | 924 ms |
| CLS de carga, 390 | **0.0000** | **0.0000** | 0.0260 | **0.0000** |
| **CLS tras recorrer la pieza, 1440** | **0.0000** | **1.5361** | 0.0001 | 0.0000 |
| Carga inicial 390 (sin recorrer) | **512 358 B** | 5 666 468 B | 1 156 536 B | 9 535 257 B |
| Entrada total 1440 tras recorrer todo | 7 532 992 B | 20 349 673 B | **2 553 178 B** | 34 811 223 B |
| Altura del documento (1440) | 31.2 pantallas | 38.2 | 10.7 | 33.7 |
| Cambios de imagen (45 muestras) | 45 | 45 | 45 | 45 |
| Pieza pinneada · `canvas` | 1 · 1 | 1 · 2 | 0 · 1 | 0 · 1 |
| Interruptor de movimiento | **170×44, `aria-pressed` ✓** | **no existe** | 99×44, `aria-pressed` ✓ | 252×44, **sin `aria-pressed`** |
| Enlaces `wa.me` | **13 (13 con mensaje)** | 0 | 6 | 0 |
| Errores de consola / HTTP ≥ 400 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Overflow horizontal a 390 | 0 | 0 | 0 | 0 |
| Familias tipográficas | Cormorant Garamond + Inter | **Cormorant Garamond + Inter** | Patrick Hand + Caveat | Archivo + Inter |

**Dónde gana NÁCAR**

1. **CLS**: 0.0000 tras recorrer toda la pieza, incluidas entrada y salida del pin, por `scrollTo`
   y por rueda real, en seis tamaños. UMBRAL, el referente calibrado en 8.5, sigue en **1.5361**.
2. **Peso y primera impresión**: **512 KB** de carga inicial en móvil contra 5.67 MB de UMBRAL y
   9.54 MB de Excamormar; 7.53 MB totales contra 20.35 y 34.81, con 264 fotogramas y 31 pantallas.
3. **Fallback**: único de los cuatro con la obra íntegra en modo quieto, píldora ≥44 px con
   `aria-pressed` en ambos estados y ciclo verificado a prueba de carreras. UMBRAL no tiene
   interruptor; Excamormar lo tiene sin `aria-pressed`.
4. **Conversión**: 13 CTA con mensaje precargado por capítulo; los otros tres suman 6, 0 y 0.
5. **Puertas**: es el único de los cuatro con una suite de QA que corre contra su propia URL de
   producción y se reproduce.

**Dónde pierde**

1. **LCP**: 1 228 / 944 ms contra 672 / 688 ms de UMBRAL. UMBRAL sigue siendo casi el doble de
   rápido en el primer pintado.
2. **Identidad tipográfica**: el par es **exactamente el de UMBRAL**. Heredado, no inventado.
3. **Composición**: nueve capítulos con el bloque en `x = 72 px` los nueve; UMBRAL varía su retícula.
4. **Densidad de imagen**: UMBRAL gasta 20 MB porque enseña detalle; NÁCAR gasta 7.5 MB y en
   pantallas DPR 2 la película se ve blanda (N2).

**La frase honesta:** NÁCAR **supera** a Entre líneas y a Excamormar en todos los ejes medidos, y
frente a UMBRAL **gana en ingeniería y pierde en autoría**. Le saca 1.54 puntos de CLS, 11 veces
menos carga inicial en móvil, el único fallback con interruptor y 13 CTA contra 0 — pero le toma
prestado el par tipográfico, repite una sola composición nueve veces y arrastra un fallo de AA en su
propio modo quieto (el contraste de los referentes no lo audité; sólo el de NÁCAR). **No lo supera
como pieza de diseño: lo iguala por otro camino, el de una landing que además vende.**

---

## 7. Rúbrica

| Categoría | Peso | R1d | **R1e** | Por qué |
|---|---:|---:|---:|---|
| Concepto y narrativa | 15 % | 8.2 | **8.2** | Guion intacto: mismos 4 clips, 264 fotogramas, 9 capítulos. Siguen el copy de 02/06 contra la imagen y los tres consultorios distintos (decisión de Kevin) |
| Tipografía | 15 % | 8.5 | **8.5** | 2 familias exactas, 4 woff2 (115.5 KB), ratio 9.6:1 medido, `optional` justificado y probado a 400 kbps; hereda el par de UMBRAL |
| Composición y espacio | 10 % | 7.5 | **7.5** | Asimetría y numeración editorial correctas; los nueve capítulos arrancan en x = 72 px exactos |
| Color y atmósfera | 10 % | 8.5 | **7.8** | Etiqueta 7.39–7.83:1 en las 36 combinaciones con estado real; **−`h2` a 2.62:1 y párrafo a 4.23:1 en el capítulo 03 del modo quieto, por debajo de AA** |
| Movimiento y scroll | 15 % | 9.0 | **8.7** | Un pin, `end` en px, `scrub .5`, `pinType transform`, 45/45 en 6 tamaños con dos instrumentos, CLS 0.0000 por ciclo de vida y por rueda real; −p50 27.7 ms a 1920 y p95 42 ms con 9 tareas largas a 390 CPU 4× |
| Fallback reduce + accesibilidad | 10 % | 8.5 | **8.6** | 13/13 CTA con teclado y 9/9 con ratón (también tras rueda real), ciclo del interruptor limpio, foco visible en los 40 focos, tap ≥44 hasta 820 px; −nav de 18 px con puntero grueso a partir de 1024 px, −posición de lectura perdida, −el fallo de contraste del capítulo 03 vive aquí |
| Rendimiento | 10 % | 7.5 | **8.5** | **Los dos presupuestos de la doctrina cumplidos por primera vez** (2 461 734 / 7 523 796 B), LCP mediana 1 088 ms y CLS 0; −margen móvil de sólo 1.5 %, −arranque en frío sin cerrar, −el precio del recorte es una película blanda en pantallas DPR 2 |
| Detalle / craft | 10 % | 8.0 | **8.8** | CSS muerto fuera (21 582 B), `Cache-Control` con huella real verificada byte a byte, puertas que sí miden, `npm run qa` remoto reproducible hoy, cabeceras de seguridad en `/film`; −`immutable` sin `?v=`, −master 1344×768 vendido como 1440, −la puerta de contraste sólo mira la etiqueta |
| Contenido y conversión | 5 % | 9.0 | **9.0** | 13 CTA `wa.me`, las 13 con mensaje por capítulo; cifras concretas y disclaimer correcto |

**Suma ponderada = 8.380 → nota final 8.4 / 10.**
8.2·0.15 + 8.5·0.15 + 7.5·0.10 + 7.8·0.10 + 8.7·0.15 + 8.6·0.10 + 8.5·0.10 + 8.8·0.10 + 9.0·0.05 = 8.380

**Topes aplicados: ninguno.** 0 errores de consola · LCP < 4 s · sin overflow en 375 · `reduce`
manejado y digno · sin hijacking · sin `#000`/`#fff` crudos · 2 familias · CTA funcionales con
teclado y ratón · fuente propia.

Por encima de 7.5 (enseñable a prospecto), **a una décima del 8.5 de entrega**. `RUBRICA_v2.md` se
autoasigna 8.6; la diferencia está en Color (se puntúa 8.5 midiendo sólo la etiqueta, con dos textos
bajo AA sin medir) y en Movimiento (9.0 apoyado en una fluidez que hoy no se reproduce).

---

## 8. Correcciones bloqueantes para alcanzar 8.5

1. **Subir el capítulo 03 del modo quieto por encima de AA.** Hoy `h2` 2.62:1 (mínimo 3.0) y
   párrafo 4.23:1 (mínimo 4.5) a 1440×900. El scrim estático es un degradado vertical que no cubre
   la esquina alta-izquierda de `still-03.jpg`. Arreglo mínimo: añadir al `::before` del modo quieto
   un degradado **direccional** (90deg, como el del modo animado) o densificar la lámina 03.
2. **Meter `h2` y párrafo en la puerta de contraste.** `medirContrastes` sólo mide `.label`; los dos
   textos que fallan son justo los que no se miden. Con el mismo instrumento, 36 combinaciones por
   elemento, umbral 3.0 para el display y 4.5 para el cuerpo.

## 9. Deseables (por orden de rentabilidad)

- Subir a 44 px los cuatro enlaces de la nav cuando `(pointer: coarse)` **a partir de 1024 px**, no
  sólo entre 1024 y 1180. Corregir de paso el enunciado del pendiente en `RUBRICA_v2.md` y
  `qa/PRODUCCION_v2.3.md`.
- Servir el fotograma en función del **DPR**, no sólo del ancho CSS (o aceptar por escrito que en
  retina la película es blanda). Hoy: ×4.10 en móvil DPR 2, ×2.19 en 1440 DPR 2, sobre un master de
  1344×768. Si en algún momento se vuelve a grabar el metraje, grabarlo a ≥ 2160 px de ancho.
- Conservar la posición de lectura al conmutar (mapear el progreso del pin al capítulo equivalente).
- Devolver `404` a `/film/**` sin `?v=`, o marcarlo `no-cache`, para que nadie congele un binario un
  año por escribir la URL a mano. Actualizar `qa/R1/audit.mjs` y `contact-sheet.mjs`.
- Vigilar el margen móvil: 38 266 B (1.5 %) por debajo del presupuesto.
- Romper la composición en 2 de los 9 capítulos (hoy los nueve empiezan en x = 72 px).
- Diferenciar `mobile-01.jpg` y `mobile-02.jpg`, que son casi la misma macro.
- Reproducir el arranque en frío con un despliegue de prueba y decidir si se ataca o se acepta.

---

## 10. Cómo reproducir

```
git -C <repo> worktree add %TEMP%\nacar-review-r1e origin/main
# node_modules por junction al repo principal; playwright 1.62.1

node r1e-live.mjs        # 6 viewports x 2 modos: LCP, CLS por fases, bytes (cuerpo y CDP), overflow, 45 puntos
node r1e-rueda.mjs       # CLS y fotogramas con rueda real cruzando el pin, 6 viewports
node r1e-contraste.mjs   # etiqueta: 9 capitulos x 2 anchos x 2 modos, estado real, densidad x2
node r1e-contraste2.mjs  # h2 y parrafo del capitulo, mismas 36 combinaciones
node r1e-acceso.mjs      # teclado, punteros (scrollTo y rueda real), ciclo del interruptor, objetivos tactiles
node r1e-lcp.mjs         # LCP frio + 3 repeticiones en 390x844 CPU 4x / 1.6 Mbps
node r1e-frames.mjs      # descarga los 528 fotogramas servidos: sha256, diffs por clip, hojas de contacto
node r1e-canvas.mjs      # ampliacion real del fotograma en el lienzo y capturas 1:1
node r1e-fuentes.mjs     # font-display: optional a 4G, 1.6 Mbps y 400 kbps
node r1e-probe.mjs       # tipografia, paleta, eases, a11y, copy, CTA, 404, overflow
node r1e-refs.mjs        # los 3 referentes en vivo, mismas condiciones
QA_BASE=https://nacar.asck.tech QA_STEP_MS=600 npm run qa   # la puerta del repo, contra produccion
curl -sS -I "https://nacar.asck.tech/film/mobile/c01-001.webp?v=df4c114570"
curl -sS -I "https://nacar.asck.tech/film/mobile/c01-001.webp"
curl -sS -I "https://nacar.asck.tech/film/manifest.json"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,nb_frames \
        -of csv=p=0 assets-src/clip/clip-01.mp4      # 1344,768,24/1,158
```

Los instrumentos `r1e-*.mjs` vivían en el worktree, que se eliminó al cerrar la revisión (así lo
pedía el encargo); lo que cada uno mide está descrito arriba y las cifras de cabeceras, huellas y
master se reproducen con los `curl` y el `ffprobe` de este mismo bloque.

Salidas crudas: `out/live.json`, `out/rueda.json`, `out/rueda2.json`, `out/contraste.json`,
`out/contraste2.json`, `out/acceso.json`, `out/lcp.json`, `out/frames.json`, `out/canvas.json`,
`out/fuentes.json`, `out/probe.json`, `out/refs.json`, `out/qa-remoto.log`.

## 11. Capturas entregadas

| Fichero | Qué prueba |
|---|---|
| `r1e-01-pelicula-1440-on.png` | La pieza animada a 1440×900, capítulo 07 sobre el instrumental: HUD, progreso, etiqueta, CTA e interruptor |
| `r1e-02-pelicula-390-on.png` | Lo mismo a 390×844, capítulo 05: el encuadre móvil, el CTA y la píldora de movimiento |
| `r1e-03-etiqueta-contraste.png` | 18 recortes reales de la etiqueta con el contraste medido píxel a píxel sobre el estado real (7.39–7.83 : 1) |
| `r1e-04-capitulo03-quieto-1440.png` | **El fallo N1**: «Lo natural no se impone.» en porcelana sobre la curva clara — `h2` 2.62:1 y párrafo 4.23:1 |
| `r1e-05-calidad-1a1.png` | Recortes 1:1 de píxeles de dispositivo del lienzo real: ×4.10 en móvil DPR 2 y ×2.19 en 1440 DPR 2 |
| `r1e-06-contacto-movil-24.png` | 24 fotogramas equiespaciados del set móvil servido (q20): progresión coherente, sin bloques ni bandas |
