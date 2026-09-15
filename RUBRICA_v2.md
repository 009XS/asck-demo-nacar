# Rúbrica NÁCAR v2.2 — correcciones R1c

Evaluación adversarial posterior a las correcciones C21. Fecha: 2026-09-15. Evidencia reproducible en `qa/v2/`, `qa/v2.2/`, `qa/R1/film-12-contact-sheet.webp`, `npm run film-check` y `npm run qa`.

| Criterio | Peso | Nota | Evidencia medida |
|---|---:|---:|---|
| Concepto y narrativa | 15% | 8.8 | Se conservan cuatro clips, 264 fotogramas y nueve capítulos. El clip 02 ya no sustituye sillón, suelo ni paredes; se mantienen las decisiones de Kevin sobre radiografía y copy. |
| Tipografía | 15% | 8.5 | Cormorant Garamond e Inter autoalojadas, dos familias y ratio de escala 8.8:1. Sigue compartiendo el par tipográfico de UMBRAL, así que no se sobrepuntúa identidad. |
| Composición y espacio | 10% | 8.0 | Canvas a sangre, coda asimétrica y 0 px de overflow en 12 perfiles; los nueve capítulos conservan una composición deliberadamente consistente. |
| Color y atmósfera | 10% | 9.0 | Etiquetas sobre scrim local petróleo: contraste real mínimo 8.53:1 en 36 capturas (9 capítulos × 2 anchos × 2 modos), frente a 2.19/3.65:1. |
| Movimiento y scroll | 15% | 9.4 | 45/45 cambios en seis tamaños; CLS de barrido 0.0000 en 390×844 y 1440×900; pin transform y ciclo on→off→on estable. |
| Reduce + accesibilidad | 10% | 9.4 | En off quedan 9/9 tarjetas, 0 pin-spacer y 0 triggers; off→on y on→off→on pasan; los cinco objetivos señalados miden al menos 44 px. |
| Rendimiento | 10% | 9.2 | Entrada 667×375 y 768×1024: 3,170,256 B; sets 7,983,510 B / 2,980,502 B; LCP móvil local 756 ms y CLS inicial 0. |
| Detalle / craft | 10% | 9.0 | Consola/HTTP limpios, guardarraíl 0.75× activo, evidencia R1 versionada y `actoHtml` eliminado. La deuda estética de radiografía se conserva por decisión del cliente. |
| Contenido y conversión | 5% | 8.5 | 13 enlaces WhatsApp y mensajes por capítulo; contacto Gmail y radiografía se mantienen expresamente por decisión de Kevin. |

Puntuación ponderada: **8.89 / 10**. Sin topes: el fallback ya no destruye la narrativa ni existe un incumplimiento AA repetido.

## Puerta objetiva

- `npm run typecheck`: aprobado.
- `npm run build`: aprobado.
- `npm run film-check`: aprobado; máximo interno 25.385 < 32.33175, 264 fotogramas por set y presupuestos conformes.
- `npm run qa`: aprobado; 12 perfiles, 45/45 cambios, CLS de barrido < 0.25, contraste ≥ 4.5, selección móvil en 667/768, ciclos del interruptor y objetivos táctiles.
