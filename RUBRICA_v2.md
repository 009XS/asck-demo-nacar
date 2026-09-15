# Rúbrica NÁCAR v2 — remedición C18

Evaluación adversarial posterior a la prueba de clips regenerados. Fecha: 2026-09-15. Evidencia reproducible en `qa/v2/metrics.json`, `qa/R1/film-12-contact-sheet.webp` y `npm run film-check`.

| Criterio | Peso | Nota | Evidencia medida |
|---|---:|---:|---|
| Concepto y narrativa | 15% | 8.8 | Se conservan cuatro clips, 264 fotogramas y nueve capítulos. Los blends internos aprobados corrigen la continuidad, aunque reducen algo de variedad de movimiento. |
| Tipografía | 15% | 8.7 | Cormorant Garamond e Inter autoalojadas, precargadas y con fallbacks métricos; `font-display: optional` elimina el reflow de carga fría. |
| Composición y espacio | 10% | 8.5 | Canvas a sangre y coda asimétrica; 0 px de overflow en 12 perfiles. |
| Color y atmósfera | 10% | 8.8 | Paleta porcelana/jade/oro/petróleo y scrims consistentes. |
| Movimiento y scroll | 15% | 9.0 | 45/45 cambios en seis tamaños; 263 pares/set comprobados. Razón máxima 3.450 desktop y 3.338 móvil; ningún par interno sobre 3.5. Precarga direccional de 12 frames. |
| Reduce + accesibilidad | 10% | 9.2 | Nueve láminas en motion-off; control de 44 px de alto, foco visible y `aria-pressed` sincronizado en on/off. |
| Rendimiento | 10% | 9.3 | Carga fría 390×844, CPU 4×, 100 ms/1.6 Mbps: LCP 768 ms y CLS inicial 0.0000. Sets: 7,715,718 B desktop y 2,684,960 B móvil. |
| Detalle / craft | 10% | 9.0 | Consola y respuestas HTTP limpias, 0 overflow, presupuestos y continuidad codificados como regresiones; la hoja de contacto aún muestra dobles exposiciones en 97 y 240. |
| Contenido y conversión | 5% | 8.4 | Copy específico y nueve CTA de WhatsApp funcionales; la nota no sube porque C18 no modificó ni volvió a medir conversión. |

Puntuación ponderada: **8.88 / 10**. No suben movimiento ni craft: ningún clip regenerado supera la puerta del set completo y las muestras 97 y 240 aún exhiben doble exposición. Se mantiene la versión C12 aprobada.

## Puerta objetiva

- `npm run typecheck`: aprobado.
- `npm run build`: aprobado.
- `npm run film-check`: aprobado, límites exactos 8,000,000 B desktop / 3,000,000 B móvil.
- `npm run qa`: aprobado en seis tamaños, motion on/off; LCP móvil <2.5 s, CLS inicial <0.05, consola limpia, overflow 0 y scroll-proof 45.
- Capturas: cinco puntos de scroll para 390×844 y cinco para 1440×900 en `qa/v2/`.
