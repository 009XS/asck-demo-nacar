# Rúbrica NÁCAR v2 — evidencia final

Evaluación contra la rúbrica de `doctrina-diseno`. Fecha de medición: 2026-09-14.

| Criterio | Nota | Evidencia medida |
|---|---:|---|
| Concepto y narrativa (15%) | 9.4 | La materia se transforma en consulta y vuelve al nácar a través de 4 clips/264 fotogramas; 9 capítulos conservan antetítulo, titular, cuerpo y CTA. |
| Tipografía (15%) | 9.0 | Dos familias autoalojadas WOFF2: Cormorant Garamond e Inter; escala `clamp()` y display de hasta 10rem. |
| Composición y espacio (10%) | 9.0 | Canvas a sangre, copy asimétrico, HUD editorial y coda en retícula; 0 px de overflow en los 6 tamaños. |
| Color y atmósfera (10%) | 9.2 | Tokens porcelana/jade/oro/petróleo, scrim direccional y ausencia de #000/#fff como base. |
| Movimiento y scroll (15%) | 8.4 | Un solo ScrollTrigger, `scrub: 0.5`, pin de 22.5 pantallas, índice real 0–263 y fundidos de 3 fotogramas en cortes. Penaliza continuidad interna: razón de corte 6.798 desktop / 6.752 móvil, superior a 3.5. |
| Fallback reduce + accesibilidad (10%) | 9.2 | `?motion=off` mostró 9 láminas; toggle, localStorage seguro, foco, skip link y `<ol>` alternativo. |
| Rendimiento (10%) | 9.1 | LCP móvil CPU 4×: 516 ms; CLS 0; frames 7,512,862 B desktop y 3,493,070 B móvil. |
| Detalle / craft (10%) | 8.9 | HUD, progreso, foco, hover y 404 coherentes; 12 perfiles on/off sin consola ni 404. |
| Contenido y conversión (5%) | 9.2 | CTAs funcionales en cada capítulo; WhatsApp con mensaje precargado y disclaimer de demo. |

Puntuación ponderada: **8.98 / 10**. Sin topes activos. El objetivo ≥ 9.0 no se alcanza: faltan **0.02 puntos**, causados por los picos internos de continuidad de los clips.

## Checklist de agencia

1. Sí — mini-biblia en `DIRECCION.md`.
2. Sí — momento firma: recorrido nácar → clínica → nácar oro.
3. Sí — dos familias autoalojadas.
4. Sí — ratio display:cuerpo superior a 8:1 en desktop.
5. Sí — sin negro/blanco puros como base; paleta tokenizada.
6. Sí — copy lateral y coda con rupturas asimétricas.
7. Sí — una sola pieza scrub.
8. Sí — `end` funcional en px, 22.5 viewport, scrub 0.5.
9. Sí — no hay `ease`/`linear` por defecto en la pieza.
10. Sí — motion on/off y capturas en `qa/v2/`.
11. Sí — 390 px sin overflow y targets de 44 px.
12. Sí — LCP 516 ms, CLS 0, presupuestos de frames cumplidos.
13. Sí — consola y 404 limpios en 12 perfiles.
14. Sí — foco, skip link y alternativa textual.
15. No aplica — no hay 3D/WebGL.
16. Parcial — QA aprueba; film-check falla continuidad 3.5.
17. Sí — regresiones ejecutables en `scripts/qa.mjs` y `scripts/film-check.mjs`.
18. Sí — cifras concretas y CTAs que explican el siguiente paso.
19. Sí — 8.98, superior al umbral 7.5.
