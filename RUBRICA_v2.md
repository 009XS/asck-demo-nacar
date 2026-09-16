# Rúbrica NÁCAR v2.3 — reservas de R1d

Autoevaluación posterior a C26. Fecha: 2026-09-15. **No sustituye a la revisión independiente**:
la nota vigente sobre v2.2 es la de `qa/R1/REVISION_R1d.md` (**8.3 / 10, aprobada con reservas**) y
quien decide si la v2.3 llega a 8.5 es la re-revisión, no este archivo. La v2.2 se autoasignó 8.89
frente al 8.3 medido por R1d; aquí se parte de **las notas de R1d** y sólo se sube donde hay una
cifra nueva que lo justifique.

Evidencia reproducible: `qa/v2/metrics.json`, `qa/v2.3/contrast/`, `qa/PRODUCCION_v2.3.md`,
`npm run film-check` y `npm run qa`.

| Criterio | Peso | R1d (v2.2) | v2.3 | Qué cambió, medido |
|---|---:|---:|---:|---|
| Concepto y narrativa | 15% | 8.2 | **8.2** | Sin cambios de guion: mismos 4 clips, 264 fotogramas y 9 capítulos. Siguen abiertos el copy de los capítulos 02 y 06 y los tres consultorios distintos entre cortes (decisión de Kevin). |
| Tipografía | 15% | 8.5 | **8.5** | Sin cambios; sigue heredando el par de UMBRAL. |
| Composición y espacio | 10% | 7.5 | **7.5** | Sin cambios: los nueve capítulos repiten el bloque abajo-izquierda. |
| Color y atmósfera | 10% | 8.5 | **8.5** | Mismos colores. La medición ahora es más estricta, no más favorable: núcleo puro del glifo 8.27–8.51:1 y núcleo ancho (con antialias) 6.57–7.36:1 en las 36 combinaciones, todas ≥ 4.5. |
| Movimiento y scroll | 15% | 9.0 | **9.0** | Sin cambios de mecánica. La puerta de CLS de barrido baja de 0.25 a 0.1 y pasa de 2 a 6 viewports; el valor medido sigue siendo 0.0000 en los seis. |
| Fallback reduce + accesibilidad | 10% | 8.5 | **8.8** | Cerrado el hueco de teclado: **13/13 enlaces `wa.me` alcanzables con Tab en modo animado**, en 1440×900 y 390×844, con regresión en `qa.mjs`. Siguen abiertos la nav de 18 px con puntero grueso a 1024–1180 y la pérdida de posición de lectura al conmutar. |
| Rendimiento | 10% | 7.5 | **8.4** | Entrada móvil **2,461,821 B** y desktop **7,523,883 B** medidas por tamaño real de cuerpo: los dos presupuestos de la doctrina (2.5 MB / 8 MB) **se cumplen por primera vez** (antes 3,365,621 y 8,369,018). Sets 7,140,240 / 2,078,178 B. Sigue abierto el arranque en frío del contenedor. |
| Detalle / craft | 10% | 8.0 | **9.0** | Los tres descuentos de R1d cerrados: 0 reglas `.acto/.paso/.rail` (−4,638 B de CSS fuente), `Cache-Control` explícito en `/film/**` con fotogramas versionados por huella, y puertas de QA que sí miden (bytes por cuerpo real, CLS a 0.1, contraste sobre el estado real). |
| Contenido y conversión | 5% | 9.0 | **9.0** | Los mismos 13 CTA con mensaje por capítulo; ahora todos alcanzables sin ratón. |

**Suma ponderada = 8.56 → 8.6 / 10 autoasignado.** Topes activos: ninguno.

Cálculo: 8.2·0.15 + 8.5·0.15 + 7.5·0.10 + 8.5·0.10 + 9.0·0.15 + 8.8·0.10 + 8.4·0.10 + 9.0·0.10 + 9.0·0.05 = 8.555.

## Lo que sigue abierto (no se puntúa como resuelto)

- Composición repetida en los nueve capítulos.
- Copy de los capítulos 02 y 06 frente a la imagen; radiografía literal; correo Gmail en el pie
  (los tres, decisión expresa de Kevin).
- Nav de escritorio a 18 px de alto con `(pointer: coarse)` entre 1024 y 1180 px.
- Al conmutar el movimiento se pierde la posición de lectura.
- Arranque en frío del contenedor: R1d midió 3,508 ms de LCP en la primera visita del día. La
  puerta nueva separa las dos cosas — mediana de tres visitas contra el presupuesto de 2,500 ms y
  primera visita en frío contra el tope de 4,000 ms — pero no elimina el síntoma.
- El par tipográfico sigue siendo el de UMBRAL.

## Puerta objetiva

- `npm run typecheck`: aprobado.
- `npm run build`: aprobado.
- `npm run film-check`: aprobado; máximo interno 25.365 desktop / 25.199 móvil < 32.33175, 264
  fotogramas por set, 7,140,240 B ≤ 8,000,000 y 2,078,178 B ≤ 2,500,000.
- `npm run qa`: aprobado, `failures: []` en 12 perfiles. Bytes de entrada por tamaño real de
  cuerpo contra el presupuesto de la doctrina, CLS de barrido < 0.1 en los seis viewports,
  contraste medido sobre el estado real (36/36 con la tarjeta realmente visible), LCP en frío y
  mediana de tres, 13/13 CTA de WhatsApp con Tab, 45/45 cambios y ciclos del interruptor.
