# Rúbrica NÁCAR v2.1 — clips regenerados sin fundidos

Evaluación adversarial posterior a la integración de los clips regenerados. Fecha: 2026-09-15. Evidencia reproducible en `qa/v2.1/`, `qa/R1/film-12-contact-sheet.webp` y `npm run film-check`.

| Criterio | Peso | Nota | Evidencia medida |
|---|---:|---:|---|
| Concepto y narrativa | 15% | 8.9 | Se conservan cuatro clips, 264 fotogramas y nueve capítulos; los tres clips regenerados recuperan continuidad espacial sin fundidos internos. |
| Tipografía | 15% | 8.7 | Cormorant Garamond e Inter autoalojadas, precargadas y con fallbacks métricos; `font-display: optional` elimina el reflow de carga fría. |
| Composición y espacio | 10% | 8.5 | Canvas a sangre y coda asimétrica; 0 px de overflow en 12 perfiles. |
| Color y atmósfera | 10% | 8.8 | Paleta porcelana/jade/oro/petróleo y scrims consistentes. |
| Movimiento y scroll | 15% | 9.3 | 45/45 cambios en seis tamaños; 263 pares/set comprobados. Máximo absoluto 33.959 desktop y 34.004 móvil, ambos bajo el guardarraíl calibrado 38.7981. Precarga direccional de 12 frames. |
| Reduce + accesibilidad | 10% | 9.2 | Nueve láminas en motion-off; control de 44 px de alto, foco visible y `aria-pressed` sincronizado en on/off. |
| Rendimiento | 10% | 9.3 | Carga fría 390×844, CPU 4×, 100 ms/1.6 Mbps: LCP 768 ms y CLS inicial 0.0000. Sets: 7,884,418 B desktop y 2,824,596 B móvil. |
| Detalle / craft | 10% | 9.3 | Consola y respuestas HTTP limpias, 0 overflow y guardarraíl absoluto reproducible; 0 dobles exposiciones en los 63 fotogramas de 85–105, 180–200 y 225–245. |
| Contenido y conversión | 5% | 8.4 | Copy específico y nueve CTA de WhatsApp funcionales; la nota no sube porque C18 no modificó ni volvió a medir conversión. |

Puntuación ponderada: **8.97 / 10**. Suben movimiento, craft y ligeramente narrativa por eliminar los tres fundidos internos; no se elevan tipografía, composición, accesibilidad, rendimiento ni conversión porque no cambiaron sus fundamentos.

## Puerta objetiva

- `npm run typecheck`: aprobado.
- `npm run build`: aprobado.
- `npm run film-check`: aprobado, guardarraíl absoluto 38.7981 y límites exactos 8,000,000 B desktop / 3,000,000 B móvil.
- `npm run qa`: aprobado en seis tamaños, motion on/off; LCP móvil <2.5 s, CLS inicial <0.05, consola limpia, overflow 0 y scroll-proof 45.
- Capturas: cinco puntos de scroll para 390×844 y cinco para 1440×900 en `qa/v2/`.
