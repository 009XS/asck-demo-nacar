# NÁCAR v2.3 en producción

Fecha: 2026-09-15 · URL: https://nacar.asck.tech
Commit desplegado: `e9cc21abd42ee55f4f00ec7f212305b18957dfd1` (merge de `a253143` en `main`)
Tag de respaldo: `respaldo-main-antes-v2.3-2026-09-15` → `d8e70f740fe770a290ffe995e00e81ca7fc8c233`
Deployment Coolify: `vcd31whpnhwwxb5ldpwxbl3i` — `finished` a los 30 s.

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

**Aprobada en la primera pasada**, `failures: []`, exit 0. Log completo en
`qa/PRODUCCION_v2.3/qa-remoto.log`; métricas en `qa/PRODUCCION_v2.3/metrics.json`.

| Modo | Viewport | LCP | CLS inicial | CLS barrido | Entrada (cuerpo real) | Presupuesto | Contraste mín. | Overflow | Cambios |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| on | 390×844 | 3,536 ms (frío) | 0 | **0** | **2,461,726 B** | 2,500,000 | 6.80 | 0 | 45/45 |
| on | 667×375 | 768 ms | 0 | **0** | **2,461,726 B** | 2,500,000 | — | 0 | 45/45 |
| on | 768×1024 | 1,020 ms | 0 | **0** | **2,461,726 B** | 2,500,000 | — | 0 | 45/45 |
| on | 1024×768 | 756 ms | 0 | **0** | 7,523,788 B | 8,000,000 | — | 0 | 45/45 |
| on | 1440×900 | 908 ms | 0 | **0** | 7,523,788 B | 8,000,000 | 6.57 | 0 | 45/45 |
| on | 1920×1080 | 828 ms | 0 | **0** | 7,523,788 B | 8,000,000 | — | 0 | 45/45 |
| off | 390×844 | 1,208 ms | 0 | 0 | 1,034,429 B | 2,500,000 | 6.96 | 0 | — |
| off | 667×375 | 780 ms | 0 | 0 | 1,034,429 B | 2,500,000 | — | 0 | — |
| off | 768×1024 | 584 ms | 0 | 0 | 1,034,429 B | 2,500,000 | — | 0 | — |
| off | 1024×768 | 928 ms | 0 | 0 | 1,256,388 B | 8,000,000 | — | 0 | — |
| off | 1440×900 | 824 ms | 0 | 0 | 1,256,388 B | 8,000,000 | 6.85 | 0 | — |
| off | 1920×1080 | 676 ms | 0 | 0 | 1,256,388 B | 8,000,000 | — | 0 | — |

0 errores de consola, 0 `pageerror`, 0 respuestas ≥ 400 y 0 respuestas 200 sin cuerpo en los
doce perfiles.

## 4. Bytes reales de entrada (reserva: la puerta no medía en producción)

Dos instrumentos independientes, caché deshabilitada, recorrido completo de la película:

| Perfil | Antes (R1d, v2.2) | Ahora, cuerpo real (`response.body()`) | Ahora, `encodedDataLength` (CDP) |
|---|---:|---:|---:|
| 390×844 | 3,365,621 B | **2,461,726 B** | **2,470,502 B** |
| 667×375 | 3,365,621 B | **2,461,726 B** | **2,470,502 B** |
| 768×1024 | 3,365,621 B | **2,461,726 B** | **2,470,502 B** |

Los tres quedan por debajo de los 2,500,000 B de la doctrina y de los 2.6 MB exigidos por la
misión. Desglose del perfil móvil: 2,078,178 B de secuencia + 383,548 B de HTML, JS, CSS,
fuentes, póster y manifiesto.

Desktop: 8,369,018 B → **7,523,788 B**, también bajo los 8,000,000 B de la doctrina.

## 5. LCP separado en frío y mediana

```
LCP 390x844 CPU4x: frío 3536 ms | repeticiones 1120 / 860 / 1004 ms | mediana 1004 ms
```

La primera visita del proceso, con el contenedor recién desplegado, mide **3,536 ms** — bajo el
tope de 4,000 ms pero muy por encima del presupuesto. La mediana de tres visitas nuevas es
**1,004 ms**, dentro del presupuesto de 2,500 ms. **El arranque en frío sigue abierto**: la puerta
lo mide y lo publica en vez de esconderlo tras una segunda pasada.

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

## 8. Evidencia

- Capturas de producción: `qa/PRODUCCION_v2.3/` (5 a 1440×900 y 5 a 390×844).
- 36 recortes de etiqueta con el contraste medido: `qa/v2.3/contrast/`.
- Video del recorrido regrabado contra producción: paquete de evidencia
  `PORTAFOLIO_EVIDENCIA_2026-09-14/nacar/video/nacar-v2-scroll-1080p.mp4` (H.264 High@4.0,
  1920×1080, yuv420p, 25 fps, 56.000 s, 19,521,247 B, faststart, sin intervalos negros). El de la
  v2.2 se conserva como `nacar-v2-scroll-1080p.v2.2.mp4`.

## 9. Lo que sigue abierto

- Arranque en frío: 3,536 ms de LCP en la primera visita tras el despliegue.
- Nav de escritorio a 18 px de alto con `(pointer: coarse)` entre 1024 y 1180 px.
- Al conmutar el movimiento se pierde la posición de lectura.
- Composición repetida en los nueve capítulos; par tipográfico heredado de UMBRAL.
- Copy de los capítulos 02 y 06, radiografía literal y correo Gmail: decisiones de Kevin.
