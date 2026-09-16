# Rúbrica NÁCAR v2.4 — cierre del bloqueante de R1e

Autoevaluación posterior a C28. Fecha: 2026-09-15. **No sustituye a la revisión independiente**:
la nota vigente sobre la v2.3 es la de `qa/R1/REVISION_R1e.md` (**8.4 / 10, aprobada con reservas**)
y quien decide si la v2.4 llega a 8.5 es la re-revisión, no este archivo. La v2.3 se autoasignó 8.6
frente al 8.4 medido por R1e; aquí se parte de **las notas de R1e** y sólo se sube donde hay una
cifra nueva, propia y reproducible que lo justifique.

Evidencia reproducible: `qa/v2/metrics.json` (bloques `contrastes` y `navObjetivos`),
`qa/v2.4/contrast/` (108 recortes), `qa/v2.4/puerta-contra-css-v2.3.json`, `qa/PRODUCCION_v2.4.md`,
`npm run film-check` y `npm run qa`.

## Lo que se arregló, medido

**El bloqueante de R1e (N1).** El scrim del modo quieto pasa de un eje a dos. Mínimos por elemento
sobre las nueve láminas, densidad ×2, estado real:

| Elemento | Modo | Ancho | Antes (v2.3) | Después (v2.4) | Umbral |
|---|---|---|---:|---:|---:|
| `h2` | quieto | 1440×900 | **2.62** | **6.26** | 3.0 |
| párrafo | quieto | 1440×900 | **4.18** | **6.79** | 4.5 |
| `h2` | quieto | 390×844 | 4.06 | **6.05** | 3.0 |
| párrafo | quieto | 390×844 | 4.61 | **6.46** | 4.5 |
| `h2` | animado | 390×844 | 3.95 | **4.95** | 3.0 |
| párrafo | animado | 390×844 | 5.22 | **6.02** | 4.5 |
| `h2` | animado | 1440×900 | 5.67 | 5.67 | 3.0 |
| párrafo | animado | 1440×900 | 5.90 | 5.90 | 4.5 |
| etiqueta | los dos | los dos | 7.39–7.83 | 7.39–7.83 | 4.5 |

**108 medidas de 108 por encima del umbral, y las 108 por encima de 4.5 : 1** — es decir, el
titular cumple el criterio de texto normal aunque la norma sólo le exija 3.0 por tamaño. El modo
animado no empeora en ninguna de las 54 medidas: mejora en móvil y queda idéntico en escritorio.

**La puerta.** `scripts/qa.mjs` medía el contraste sólo de `.label` —el único texto con fondo
propio— y por eso el fallo nunca sonó. Ahora mide **etiqueta, titular y párrafo** de los nueve
capítulos en los dos modos y los dos anchos, en pasada propia a densidad ×2, por muestreo de
píxeles del glifo contra su fondo real y sin forzar un solo estilo. Umbral 4.5 : 1 para texto
normal y 3.0 : 1 para texto grande (≥ 24 px computados; por debajo se le exige 4.5).
Comprobado que la puerta **muerde**: ejecutada contra el CSS de la v2.3 (arreglo revertido) falla
exactamente donde R1e denunció — `h2 2.62 < 3.0` y `párrafo 4.18 < 4.5`, capítulo 03, quieto,
1440×900 (`qa/v2.4/puerta-contra-css-v2.3.json`).

**Nav con puntero grueso.** Los cuatro enlaces medían 18 px de alto con `(pointer: coarse)` en
**cualquier** ancho de escritorio, no sólo entre 1024 y 1180 como decía el pendiente. Ahora miden
**44 px** en 1024×768, 1280×800 y 1440×900, la fila de la nav sigue en 79 px y no hay overflow.
La regla está acotada a `min-width: 821px` para no resucitar en el teléfono los enlaces que el
layout oculta: verificado que a 390 y 820 con puntero grueso sigue habiendo **1 solo** enlace
visible. La puerta comprueba además que la emulación de puntero grueso se aplicó de verdad, para
que no pueda pasar en vacío.

**Documentado, no tapado.** `DIRECCION.md` recoge por escrito que el fotograma móvil se dibuja
**≈ ×4.1 en DPR 2** sobre un master de 1344×768 y que el set «desktop» de 1440×822 ya es un
reescalado: limitación conocida y aceptada, no defecto, y ninguna afirmación de calidad puede
apoyarse en mirar los WebP a 1:1.

## Puntuación

| Criterio | Peso | R1e (v2.3) | v2.4 | Qué cambió, medido |
|---|---:|---:|---:|---|
| Concepto y narrativa | 15% | 8.2 | **8.2** | Sin cambios de guion: mismos 4 clips, 264 fotogramas, 9 capítulos. |
| Tipografía | 15% | 8.5 | **8.5** | Sin cambios; sigue heredando el par de UMBRAL. |
| Composición y espacio | 10% | 7.5 | **7.5** | Sin cambios: los nueve capítulos siguen arrancando en x = 72 px. |
| Color y atmósfera | 10% | 7.8 | **8.5** | R1e descontó 0.7 exclusivamente por el fallo AA. Cerrado y medido: 108/108 medidas ≥ 4.95 : 1. Se vuelve al 8.5 de R1d, **no por encima**: densificar el scrim mata algo de luz de la lámina, y eso es un coste, no una mejora. |
| Movimiento y scroll | 15% | 8.7 | **8.7** | No se tocó la mecánica y **no medí fps**: el descuento de R1e por p50 27.7 ms a 1920 y 9 tareas largas a 390 sigue vigente. |
| Fallback reduce + accesibilidad | 10% | 8.6 | **8.8** | Dos de los tres descuentos de R1e cerrados y verificados: nav ≥ 44 px con puntero grueso a 1024/1280/1440 y contraste AA del capítulo 03. **Sigue abierta** la pérdida de posición de lectura al conmutar. |
| Rendimiento | 10% | 8.5 | **8.5** | Sin cambios de peso salvo el CSS (+~290 B fuente por los scrims). Entrada móvil y desktop siguen bajo presupuesto, con el mismo margen escaso de ~1.5 % en móvil. Arranque en frío sigue sin cerrar. |
| Detalle / craft | 10% | 8.8 | **9.0** | El descuento «la puerta de contraste sólo mira la etiqueta» queda cerrado con 108 medidas y la prueba de que la puerta falla sin el arreglo; la limitación de resolución pasa de afirmación falsa a limitación escrita. Sigue abierto `immutable` sin `?v=`. |
| Contenido y conversión | 5% | 9.0 | **9.0** | Los mismos 13 CTA con mensaje por capítulo. |

**Suma ponderada = 8.490 → 8.5 / 10 autoasignado.** Topes activos: ninguno.

Cálculo: 8.2·0.15 + 8.5·0.15 + 7.5·0.10 + 8.5·0.10 + 8.7·0.15 + 8.8·0.10 + 8.5·0.10 + 9.0·0.10 + 9.0·0.05 = 8.490.

Está **en el filo**: basta una décima de discrepancia de la re-revisión en Movimiento o en
Fallback para caer al 8.4. No se sube nada que no se haya medido en esta misión.

## Lo que sigue abierto (no se puntúa como resuelto)

- Composición repetida en los nueve capítulos (x = 72 px las nueve veces).
- Copy de los capítulos 02 y 06 frente a la imagen; radiografía literal; correo Gmail en el pie
  (los tres, decisión expresa de Kevin).
- Al conmutar el movimiento se pierde la posición de lectura (44 % → 94 % del documento).
- Fluidez: p50 27.7 ms a 1920×1080 y 9 tareas largas a 390×844 con CPU 4× según R1e; no remedido.
- Arranque en frío del contenedor tras un despliegue nuevo.
- `/film/**` responde `immutable` también sin `?v=` o con un `?v=` inventado.
- La película se ve blanda en DPR 2 (ampliación ≈ ×4.1 en móvil): **aceptado por escrito** en
  `DIRECCION.md`, no resuelto.
- `mobile-01.jpg` y `mobile-02.jpg` siguen siendo casi la misma macro.
- El par tipográfico sigue siendo el de UMBRAL.

## Puerta objetiva

- `npm run typecheck`: aprobado.
- `npm run build`: aprobado.
- `npm run film-check`: aprobado; máximo interno 25.365 desktop / 25.199 móvil < 32.33175, 264
  fotogramas por set, 7,140,240 B ≤ 8,000,000 y 2,078,178 B ≤ 2,500,000.
- `npm run qa`: aprobado, `failures: []`. 12 perfiles de carga, **108 medidas de contraste AA**
  sobre etiqueta, titular y párrafo en los dos modos y los dos anchos, **5 perfiles de nav con
  puntero grueso emulado y verificado**, bytes de entrada por tamaño real de cuerpo, CLS de
  barrido < 0.1 en los seis viewports, LCP en frío y mediana de tres, 13/13 CTA de WhatsApp con
  Tab, 9/9 CTA de capítulo que reciben el clic del ratón, 45/45 cambios y ciclos del interruptor.
