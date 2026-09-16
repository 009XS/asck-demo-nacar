# NÁCAR v2.3 en producción

Fecha: 2026-09-15 · URL: https://nacar.asck.tech
Commit desplegado: **`f67d0517` (`main`)** — corrige la regresión de punteros descrita en el §10.
Despliegue anterior de la v2.3: `e9cc21abd42ee55f4f00ec7f212305b18957dfd1` (merge de `a253143`).
Tag de respaldo: `respaldo-main-antes-v2.3-2026-09-15` → `d8e70f740fe770a290ffe995e00e81ca7fc8c233`
Deployments Coolify: `vcd31whpnhwwxb5ldpwxbl3i` (`finished`, 30 s) y **`jayklppycvsc16zlovsge5e9` (`finished`, 20 s)**.

Todas las cifras de este documento salen de un comando ejecutado contra la URL en vivo después
del despliegue. Evidencia cruda en `qa/PRODUCCION_v2.3/`.

## 1. Integridad de lo servido

| Comprobación | Resultado |
|---|---|
| `GET /` | **200**, 9,290 B |
| `GET /film/manifest.json` | **200**, 26,739 B |
| `sha256` del manifiesto remoto vs. el del commit | `b367f185c74f71b6eef0127ac21f536787d063830d6dc235a8f7762c13ada482` — **idéntico** |
| Huellas del manifiesto | desktop `fdaffb917d`, móvil `df4c114570` |
| `sha256` de 4 fotogramas servidos vs. el repo (`mobile/c01-001`, `mobile/c03-040`, `desktop/c01-010`, `desktop/c04-060`) | **4/4 idénticos** |
| `GET /no-existe-c26` y `GET /film/mobile/c99-999.webp` | **404** los dos |

## 2. Cache-Control (reserva: `/film/**` se servía sin cabecera)

```
/film/mobile/c01-001.webp?v=df4c114570   200  Cache-Control: public, max-age=31536000, immutable
/film/desktop/c04-066.webp?v=fdaffb917d  200  Cache-Control: public, max-age=31536000, immutable
/film/manifest.json                      200  Cache-Control: no-cache, must-revalidate
/film/poster.jpg                         200  Cache-Control: public, max-age=604800
/assets/index-CQHuGuFp.css               200  Cache-Control: public, max-age=31536000, immutable
/                                        200  Cache-Control: no-cache, must-revalidate
```

Las cinco cabeceras de seguridad siguen presentes en los WebP de `/film/`
(`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`,
`X-Robots-Tag: noindex, nofollow`).

El `immutable` es seguro porque el manifiesto sirve cada fotograma con `?v=<huella sha256 del
set>`: los nombres son estables entre versiones, la URL no. Un fotograma pedido **sin** la query
también responde 200 con `immutable`; nada del sitio genera esas URLs, pero queda anotado.

## 3. QA remota — `QA_BASE=https://nacar.asck.tech QA_STEP_MS=600 npm run qa`

**Aprobada en la primera pasada** de cada uno de los dos despliegues, `failures: []`, exit 0. La
tabla es la del build final (`f67d0517`). Log completo en
`qa/PRODUCCION_v2.3/qa-remoto.log`; métricas en `qa/PRODUCCION_v2.3/metrics.json`.

| Modo | Viewport | LCP | CLS inicial | CLS barrido | Entrada (cuerpo real) | Presupuesto | Contraste mín. | Overflow | Cambios |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| on | 390×844 | 1,220 ms | 0 | **0** | **2,461,734 B** | 2,500,000 | 6.80 | 0 | 45/45 |
| on | 667×375 | 664 ms | 0 | **0** | **2,461,734 B** | 2,500,000 | — | 0 | 45/45 |
| on | 768×1024 | 896 ms | 0 | **0** | **2,461,734 B** | 2,500,000 | — | 0 | 45/45 |
| on | 1024×768 | 1,028 ms | 0 | **0** | 7,523,796 B | 8,000,000 | — | 0 | 45/45 |
| on | 1440×900 | 864 ms | 0 | **0** | 7,523,796 B | 8,000,000 | 6.57 | 0 | 45/45 |
| on | 1920×1080 | 944 ms | 0 | **0** | 7,523,796 B | 8,000,000 | — | 0 | 45/45 |
| off | 390×844 | 1,112 ms | 0 | 0 | 1,034,437 B | 2,500,000 | 6.96 | 0 | — |
| off | 667×375 | 900 ms | 0 | 0 | 1,034,437 B | 2,500,000 | — | 0 | — |
| off | 768×1024 | 824 ms | 0 | 0 | 1,034,437 B | 2,500,000 | — | 0 | — |
| off | 1024×768 | 972 ms | 0 | 0 | 1,256,396 B | 8,000,000 | — | 0 | — |
| off | 1440×900 | 788 ms | 0 | 0 | 1,256,396 B | 8,000,000 | 6.85 | 0 | — |
| off | 1920×1080 | 956 ms | 0 | 0 | 1,256,396 B | 8,000,000 | — | 0 | — |

0 errores de consola, 0 `pageerror`, 0 respuestas ≥ 400 y 0 respuestas 200 sin cuerpo en los
doce perfiles.

## 4. Bytes reales de entrada (reserva: la puerta no medía en producción)

Dos instrumentos independientes, caché deshabilitada, recorrido completo de la película:

| Perfil | Antes (R1d, v2.2) | Ahora, cuerpo real (`response.body()`) | Ahora, `encodedDataLength` (CDP) |
|---|---:|---:|---:|
| 390×844 | 3,365,621 B | **2,461,734 B** | **2,470,502 B** |
| 667×375 | 3,365,621 B | **2,461,734 B** | **2,470,502 B** |
| 768×1024 | 3,365,621 B | **2,461,734 B** | **2,470,502 B** |

Los tres quedan por debajo de los 2,500,000 B de la doctrina y de los 2.6 MB exigidos por la
misión. Desglose del perfil móvil: 2,078,178 B de secuencia + 383,548 B de HTML, JS, CSS,
fuentes, póster y manifiesto.

Desktop: 8,369,018 B → **7,523,796 B**, también bajo los 8,000,000 B de la doctrina.
(La medición del primer despliegue dio 2,461,726 / 7,523,788 B; los 8 B de diferencia son el
`__BUILD_ID__` y el hash del bundle.)

## 5. LCP separado en frío y mediana

```
despliegue 1 (contenedor recién creado):  frío 3536 ms | 1120 / 860 / 1004 ms | mediana 1004 ms
despliegue 2 (contenedor ya caliente):    frío 1220 ms |  876 / 892 /  928 ms | mediana  892 ms
```

La primera visita **con el contenedor recién desplegado** mide **3,536 ms** — bajo el tope de
4,000 ms pero muy por encima del presupuesto. Media hora después, con el contenedor caliente, la
misma medición «en frío» da 1,220 ms. Las medianas de tres visitas nuevas (1,004 y 892 ms) están
dentro del presupuesto de 2,500 ms en los dos casos. **El arranque en frío sigue abierto**: la
puerta lo mide y lo publica en vez de esconderlo tras una segunda pasada.

## 6. Contraste medido sobre el estado real

36 combinaciones (9 capítulos × {390×844, 1440×900} × {on, off}). En modo animado se navega al
tramo de cada capítulo y se comprueba el estado real; **36/36 con `visibility: visible` y
`opacity: 1` sin forzar nada**.

| Lectura | Mínimo | Máximo | Umbral |
|---|---:|---:|---:|
| Núcleo ancho del glifo (incluye antialias de un texto de 11 px) | **6.57 : 1** | 7.36 : 1 | 4.5 |
| Núcleo puro (sólo píxeles totalmente de texto) | **8.27 : 1** | 8.51 : 1 | 4.5 |

La lectura que decide la puerta es la conservadora. El núcleo puro coincide con el 8.55–8.57 que
midió R1d con densidad ×2: el color no cambió, cambió el instrumento.

## 7. CTA de WhatsApp con teclado

```
teclado 1440x900 (modo on): 13/13 enlaces wa.me alcanzados con Tab
teclado 390x844 (modo on): 13/13 enlaces wa.me alcanzados con Tab
```

Antes: 5 de 13 (los 8 CTA de capítulo inactivos quedaban fuera del orden de tabulación porque
`autoAlpha` apagaba la `visibility`).

```
punteros 1440x900 (modo on): 9/9 CTA de capitulo reciben el clic; 0 tarjetas invisibles clicables
```

## 8. Una regresión propia, encontrada y corregida antes de cerrar

Al comprobar en producción que los CTA siguieran siendo clicables **con el ratón** — el teclado ya
daba 13/13 — la medición devolvió **0 de 9 CTA de capítulo recibiendo el clic y 1 tarjeta invisible
que sí lo recibía**. Causa: al sustituir `autoAlpha` por `opacity`, los punteros se encendían desde
el `onUpdate` de ScrollTrigger, que deja de dispararse en cuanto termina el scroll; con `scrub` la
timeline sigue moviéndose después, así que la última sincronización ocurría con el capítulo todavía
a opacidad baja y la tarjeta acababa visible con `pointer-events: none`.

Corregido en `f67d0517`: `sincronizarPunteros` cuelga ahora del `onUpdate` de la **timeline**. Y se
añadió la comprobación a `qa.mjs` como puerta: para cada uno de los 9 capítulos se navega a su
tramo y se verifica con `elementFromPoint` que el CTA visible recibe el clic y que ninguna tarjeta
invisible lo recibe. Verificado en vivo tras el segundo despliegue: **9/9 y 0 invisibles clicables**.

## 9. Evidencia

- Capturas de producción: `qa/PRODUCCION_v2.3/` (5 a 1440×900 y 5 a 390×844).
- 36 recortes de etiqueta con el contraste medido: `qa/v2.3/contrast/`.
- Video del recorrido regrabado contra producción: paquete de evidencia
  `PORTAFOLIO_EVIDENCIA_2026-09-14/nacar/video/nacar-v2-scroll-1080p.mp4` (H.264 High@4.0,
  1920×1080, yuv420p, 25 fps, 1,402 fotogramas, 56.080 s, 19,286,428 B, faststart, sin intervalos
  negros; grabado contra el build final). El de la v2.2 se conserva como
  `nacar-v2-scroll-1080p.v2.2.mp4`.

## 10. Lo que sigue abierto

- Arranque en frío: 3,536 ms de LCP en la primera visita tras el despliegue.
- Nav de escritorio a 18 px de alto con `(pointer: coarse)` entre 1024 y 1180 px.
- Al conmutar el movimiento se pierde la posición de lectura.
- Composición repetida en los nueve capítulos; par tipográfico heredado de UMBRAL.
- Copy de los capítulos 02 y 06, radiografía literal y correo Gmail: decisiones de Kevin.
