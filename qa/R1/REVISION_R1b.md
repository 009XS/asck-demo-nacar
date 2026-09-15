# RE-REVISIÓN R1b — NÁCAR v2

**Fecha:** 2026-09-15  
**Rama:** `v2/scroll-sequence-2026-09-14`  
**Commit revisado:** `44248a363ab049c9050e96a6a6cfcb08445e08b5`  
**Veredicto:** **APROBADA CON CORRECCIONES MENORES**  
**Puntuación:** **8.85 / 10**

NÁCAR v2 cierra de forma reproducible los cuatro bloqueantes de R1. Supera las puertas objetivas y, con 8.85, supera el 8.5 declarado para UMBRAL. No llega a 9.0 por dos reservas de acabado: las ventanas interpoladas de la película producen dobles exposiciones visibles en varias muestras y ocho CTA intermedios no abren WhatsApp directamente.

## Método independiente

- Se ejecutaron de nuevo `npm run typecheck`, `npm run build`, `npm run film-check` y `npm run qa`; las cuatro puertas aprobaron.
- Film-check leyó y comparó los 263 pares consecutivos de cada set, excluyendo únicamente los tres cortes declarados tras 65, 131 y 197.
- QA se ejecutó con Chromium sobre el build de producción en seis viewports, en motion on/off. En 390×844 aplicó CPU 4×, 100 ms de latencia, 1.6 Mbps y caché desactivada.
- Se regeneró la hoja de 12 muestras equiespaciadas desde el manifiesto actual: `film-12-contact-sheet.webp`.
- La inspección del referente público mediante navegador conectado no estuvo disponible; la comparación usa la calibración 8.5 exigida por el brief y la evidencia visual de UMBRAL ya conservada en `qa/R1/ref-umbral.png`. No se atribuyen nuevas métricas en vivo al referente.

## Puertas obligatorias

| Puerta | Medición R1b | Límite | Estado |
|---|---:|---:|---|
| Film desktop | razón **3.450**, pico tras 176 | ≤ 3.5 fuera de 3 cortes | Pasa |
| Film móvil | razón **3.338**, pico tras 176 | ≤ 3.5 fuera de 3 cortes | Pasa |
| CLS inicial móvil frío, on/off | **0.0000 / 0.0000** | < 0.05 | Pasa |
| LCP móvil frío, on/off | **744 / 692 ms** | < 2,500 ms | Pasa |
| Set móvil | **2,684,960 B** | ≤ 3,000,000 B | Pasa |
| Set desktop | **7,715,718 B** | ≤ 8,000,000 B | Pasa |
| Motion pill móvil, on | **155.58×44 px**, `aria-pressed=true` | ≥44 px y estado correcto | Pasa |
| Motion pill móvil, off | **165.42×44 px**, `aria-pressed=false` | ≥44 px y estado correcto | Pasa |

Los tres saltos declarados miden 76.864/89.315/80.523 desktop y 76.824/89.321/80.489 móvil; están correctamente excluidos como cambios entre clips. No existe ningún par interno con razón superior a 3.5.

## Film y recorrido

Las 12 muestras conservan un mundo visual coherente: nácar, esmalte, madera clara, travertino, sillón jade, instrumental, radiografía y regreso al nácar dorado; no aparecen caras ni dientes cartoon. La luz y la paleta se mantienen.

La continuidad numérica está corregida, pero el remedio se percibe: las muestras alrededor de 96 y 191, y la transición radiografía→nácar, exhiben dobles exposiciones evidentes. No son nuevos cortes duros y no incumplen el umbral, pero reducen naturalidad cinematográfica y explican que movimiento/craft no reciban 9.5.

El modo animado produjo **45/45 frames distintos** en los seis viewports. El modo quieto mostró las **9 láminas** con el mismo relato. El pin es de 22.5 pantallas; la coda queda por debajo de 8 pantallas en todos los viewports de altura ≥600 (máximo 7.62). En 667×375 resulta 14.78 pantallas por su escasa altura, fuera de la condición de la puerta pero largo en orientación horizontal.

## Robustez, accesibilidad y rendimiento

- Cero overflow horizontal en 390×844, 667×375, 768×1024, 1024×768, 1440×900 y 1920×1080, motion on/off.
- Cero errores de consola, excepciones de página o respuestas HTTP ≥400 en las 12 combinaciones.
- Foco visible, skip link, navegación por teclado, narrativa alternativa y control táctil de 44 px.
- `aria-pressed` está sincronizado con el estado resuelto tanto en `?motion=on` como en `?motion=off`.
- La carga fría cumple holgadamente LCP y CLS. El script registra CLS de scroll cercano a 2 durante el barrido programático del pin; no contamina el CLS inicial solicitado y es consecuencia de medir mutaciones del pin sin input real, pero conviene separar esa telemetría para no presentarla como Core Web Vital de usuario.

## Copy, tipografía, paleta y CTAs

- Nueve capítulos con arco materia→clínica→precisión→radiografía→nácar, sin lorem ni placeholders.
- Cormorant Garamond e Inter, exactamente dos familias autoalojadas; jerarquía editorial y escala fluida consistentes. `font-display: optional` es una desviación consciente respecto de la regla `swap`, adoptada para eliminar reflow frío.
- Paleta de `DIRECCION.md`: porcelana, arena, tinta, pizarra, jade, jade claro, oro y petróleo; no usa negro/blanco puros como base y aplica scrims sobre la película.
- WhatsApp final, navegación, método y píldora son funcionales; el disclaimer de demo aparece en el pie.
- Limitación: de los nueve CTA del film, ocho enlazan a `#servicios` y sólo el noveno abre WhatsApp. Hay conversión funcional en la página, pero no se cumple una lectura literal de “CTA a WhatsApp” en cada capítulo.

## Rúbrica doctrina-diseno

| Criterio | Peso | Nota | Evidencia |
|---|---:|---:|---|
| Concepto y narrativa | 15% | 8.8 | Concepto “capa por capa” sostenido en nueve capítulos y una firma clara. |
| Tipografía | 15% | 8.7 | Dos familias propias, escala y jerarquía sólidas; `optional` se aparta de la regla `swap`. |
| Composición y espacio | 10% | 8.5 | Canvas a sangre, coda editorial, cero overflow; recorrido horizontal alto en pantallas. |
| Color y atmósfera | 10% | 8.8 | Mundo cromático coherente con la mini-biblia y scrims legibles. |
| Movimiento y scroll | 15% | 8.9 | 263 pares conformes, 45/45 cambios y fallback equivalente; interpolaciones visibles. |
| Reduce + accesibilidad | 10% | 9.2 | Nueve láminas, toggle 44 px, foco y `aria-pressed` correctos. |
| Rendimiento | 10% | 9.4 | LCP 744 ms, CLS 0, sets dentro del presupuesto. |
| Detalle / craft | 10% | 8.8 | Consola/HTTP/overflow limpios; dobles exposiciones restan pulido. |
| Contenido y conversión | 5% | 8.4 | Copy específico y WhatsApp funcional; 8/9 CTA del film son anclas internas. |

**Suma ponderada: 8.85 / 10.** No se activa ningún tope de la doctrina.

## Comparación con UMBRAL (8.5)

NÁCAR supera la referencia numérica por **0.35 puntos**: tiene una identidad propia, un recorrido cinematográfico más extenso, fallback completo y puertas técnicas ya cerradas. La ventaja no es aplastante: UMBRAL conserva una continuidad visual más natural y una calibración de 8.5 ya consolidada, mientras NÁCAR todavía deja ver el artificio de sus interpolaciones. Por eso el resultado es aprobado con correcciones menores, no una declaración de superioridad absoluta.

## Correcciones menores priorizadas

1. En los frames fuente/regeneración de `public/film/{desktop,mobile}`, sustituir las ventanas de blend visibles por interpolación óptica o material continuo que mantenga razón ≤3.5 sin dobles exposiciones.
2. En `src/render.ts`, si el requisito es literal, convertir los ocho CTA `#servicios` en enlaces `waUrl()` con mensajes contextualizados por capítulo.
3. En `scripts/qa.mjs`, etiquetar el CLS del barrido programático como diagnóstico de pin y no como Web Vital; conservar `clsInitial` como puerta de carga.

## Veredicto

**APROBADA CON CORRECCIONES MENORES — 8.85/10.** Los cuatro bloqueantes de R1 están cerrados con mediciones reproducidas. Las reservas restantes afectan acabado y conversión, no impiden entrega.
