# REVISIÓN ADVERSARIAL R1 — NÁCAR v2

**Fecha:** 2026-09-14  
**Veredicto:** **RECHAZADA**  
**Puntuación:** **7.7 / 10**

NÁCAR v2 tiene concepto, voz y dirección de arte de nivel portafolio, pero no está terminada bajo los límites de esta misión. Falla cuatro comprobaciones objetivas: continuidad del film, CLS, peso móvil y tamaño táctil del control de movimiento. No supera honestamente a los tres referentes en el estado medido.

## Método y evidencia

- Build de producción: `npm run build`, aprobado.
- Film: `npm run film-check`, falló con razón 6.798 desktop y 6.752 móvil.
- Navegador: Playwright Chromium sobre `vite preview` en `localhost:4187`.
- Viewports: 390×844, 667×375, 768×1024, 1024×768, 1440×900 y 1920×1080, en motion on/off.
- Perfil móvil de rendimiento: 390×844, CPU 4×, latencia 100 ms y 1.6 Mbps, caché desactivada.
- Referentes abiertos en vivo el 2026-09-14: UMBRAL, Entre líneas y EXCAMORMAR respondieron HTTP 200. Capturas en `ref-*.png`.
- Resultados crudos: `metrics.json`, `perf-focus.json`; muestras: `film-01...film-12`, `film-12-contact-sheet.webp` y `film-pico-92-99.webp`.

## 1. Film-check y juicio visual

| Set | Frames | Mediana | Pico | Pico tras | Razón | Límite |
|---|---:|---:|---:|---:|---:|---:|
| Desktop | 264 | 6.344 | 43.126 | 95 | **6.798** | 3.5 |
| Móvil | 264 | 6.386 | 43.117 | 95 | **6.752** | 3.5 |

Los cortes declarados están tras 65, 131 y 197. El motor sólo funde cuando `raw > after && raw <= after + 3`; por ello el pico 95→96 no es un corte cubierto: es un salto interno del clip 02. `film-pico-92-99.webp` muestra el cambio brusco de encuadre del sillón entre las dos filas. Es defecto, no transición aceptable.

Los 12 fotogramas equiespaciados (índices 0, 24, 48, 72, 96, 120, 143, 167, 191, 215, 239 y 263) sí conforman un mundo reconocible: luz cálida, crema/jade/petróleo, travertino, instrumental y nácar. No hay caras, dientes cartoon ni disolvencias largas. La radiografía dental es clínica, no caricaturesca. Los cuatro cambios de plano son notorios, pero los tres declarados quedan cubiertos por un fundido corto de tres frames con sombra de 35%; el salto 95→96 queda fuera.

## 2. Recorrido y estados de movimiento

- Altura total móvil motion-on: 28,365 px / 844 = **33.61 pantallas**.
- Recorrido pinneado configurado: **22.5 pantallas**; contenido no pinneado aproximado: **11.11 pantallas**.
- Scroll-proof: **45/45 cambios** en 667×375, 768×1024, 1024×768, 1440×900 y 1920×1080; en 390×844, **45/45** tras calentamiento sin throttling. Con red limitada y barrido rápido sólo 4 frames llegaron a tiempo: la carga por lotes no anticipa bien un desplazamiento veloz.
- `?motion=on` produce canvas pinneado; `?motion=off` produce **9 láminas visibles** con las mismas imágenes, copy y jerarquía. El fallback es digno.
- El control es visible sobre el fold, cambia entre “Quitar movimiento” y “Ver con movimiento”, y al enfocarlo muestra outline sólido de 2 px con offset 3 px.
- Falla táctil: caja medida **149.9 × 30.6 px** en 390×844, no los 44 px mínimos. Además carece de `aria-pressed`, por lo que el estado no se expone como botón toggle.

## 3. Rendimiento y robustez

| Métrica móvil fría | Resultado | Objetivo | Estado |
|---|---:|---:|---|
| LCP | **748 ms** | < 2,500 ms | Pasa |
| CLS inicial | **0.1984** | < 0.05 | **Falla** |
| Frames móviles | **3,493,070 B (3.493 MB decimal; 3.331 MiB)** | ≤ 3.0 MB | **Falla** |
| Frames desktop | 7,512,862 B | referencia doctrina ≤ 8 MB | Pasa |

El CLS se compone principalmente de un salto 0.19774 a 1,463 ms, antes de hacer scroll. El informe anterior no es reproducible porque mide CLS después de manipular la página y su script acepta hasta 5 MiB móvil, mientras esta misión exige 3.0 MB.

No hubo errores de consola ni respuestas ≥400 en las 12 combinaciones locales. Overflow horizontal: **0 px en los seis tamaños**, on y off.

## 4. Copy, conversión y sistema visual

- Hay 9 capítulos con arco claro: materia → diagnóstico/esmalte → llegada/consulta → plan/precisión/claridad → regreso al nácar.
- Cada capítulo contiene antetítulo, titular, párrafo y CTA. Sin embargo, sólo el capítulo 09 lleva a WhatsApp; los ocho primeros enlazan a `#servicios`. Cumple CTA por capítulo, pero no “CTA a WhatsApp” en los nueve.
- WhatsApp usa `wa.me/525514879836` y mensaje precargado. Los CTA final, nav y píldora son funcionales.
- Dos familias autoalojadas: Cormorant Garamond e Inter; `font-display: swap`; escala fluida hasta 10rem. Hay pesos adicionales 400/itálica declarados y usados en citas/elementos secundarios.
- Paleta de `DIRECCION.md` reproducida con porcelana, arena, tinta, pizarra, jade, jade claro, oro y petróleo. No hay #000/#fff como base. Los scrims del film son direccionales y más densos en móvil.
- Disclaimer de demo visible en el footer; sin lorem ni placeholders visibles. La cédula está marcada “(demo)”.

## 5. Rúbrica doctrina-diseno

| Criterio | Peso | Nota | Evidencia adversarial |
|---|---:|---:|---|
| Concepto y narrativa | 15% | 8.7 | Concepto “capa por capa” gobierna film y copy; momento firma claro. El salto interno rompe la ilusión del recorrido continuo. |
| Tipografía | 15% | 8.6 | Dos familias propias, jerarquía extrema y medidas controladas. Buen nivel editorial, no llega a perfección óptica demostrada. |
| Composición y espacio | 10% | 8.3 | Film a sangre, copy lateral y coda asimétrica; 0 overflow. El hero móvil es sólido, aunque el recorrido total es largo (33.61 pantallas). |
| Color y atmósfera | 10% | 8.8 | Mundo cromático propio y consistente; scrims correctos. |
| Movimiento y scroll | 15% | 6.8 | 22.5vh, scrub 0.5 y 45 cambios; razón de corte 6.798/6.752 y salto no fundido. Carga rápida móvil no sostiene el proof bajo throttling. |
| Reduce + accesibilidad | 10% | 7.5 | Nueve láminas equivalentes, query y foco visible; control de 30.6 px y sin `aria-pressed`. |
| Rendimiento | 10% | 5.8 | LCP excelente, pero CLS 0.1984 y frames móviles 3.493 MB incumplen. |
| Detalle / craft | 10% | 7.6 | Consola/404/overflow limpios, estados cuidados; continuidad y tap target son defectos visibles/operativos. |
| Contenido y conversión | 5% | 8.4 | Voz propia, cifras y siguiente paso claros; 8/9 CTA de capítulos no son WhatsApp. |

**Suma ponderada: 7.70.** No se activa un tope formal de la doctrina, pero los incumplimientos obligatorios impiden aprobar.

## 6. Comparación honesta en vivo

- **UMBRAL** (HTTP 200, 37.57 pantallas): sigue arriba. Su continuidad medida/calibrada (~3.1 y 8.5/10 doctrinal), carga por escena y fallback probado son más maduros. NÁCAR tiene una atmósfera propia comparable, pero pierde en continuidad y estabilidad de layout.
- **Entre líneas** (HTTP 200, 10.71 pantallas): su hero ilustrado, caligrafía, bailarina y microcopy forman una firma inmediata y singular; además muestra “Pausar movimiento” explícito. NÁCAR es más cinematográfica y tiene mejor copy clínico, pero el material generado se siente menos artesanal y su control no cumple 44 px.
- **EXCAMORMAR** (HTTP 200, 33.73 pantallas): su lenguaje de cinta de obra, grabado arquitectónico y transformación “una obra/dos vidas” es más distintivo y físicamente ligado al giro. NÁCAR es más serena y editorial, pero su salto 95→96 y su CLS hacen que el acabado sea inferior.

Conclusión: NÁCAR no supera a los tres. Compite visualmente, pero no iguala la solidez técnica de UMBRAL ni la singularidad gráfica de Entre líneas/EXCAMORMAR.

## 7. Correcciones priorizadas para llegar a 9.0

1. **Bloqueante — continuidad:** regenerar o estabilizar `assets-src/clip/clip-02.mp4` alrededor del frame fuente que produce 95→96; después volver a generar `public/film/{desktop,mobile}/c02-*` y exigir `npm run film-check` ≤3.5. No declarar el salto como corte para ocultarlo.
2. **Bloqueante — CLS:** en `index.html`, `src/fonts.css` y/o inicialización de `src/lib/acto.ts`, reservar métricas y geometría antes del primer paint. Instrumentar attribution del salto a 1,463 ms y eliminarlo hasta CLS <0.05 en carga fría 390×844 CPU 4×.
3. **Bloqueante — peso móvil:** regenerar `public/film/mobile/*.webp` a ≤3,000,000 B totales; preferible reducir a la mitad de frames con `floor` y/o 720 px, como prescribe la doctrina. Actualizar los límites de `scripts/qa.mjs` y `scripts/film-check.mjs` de 5 MiB al requisito real.
4. **Bloqueante — control:** en `src/styles/sections.css`, dar a `.motion-pill` `min-height:44px` y padding/área táctil real; en `src/main.ts` mantener `aria-pressed` sincronizado con el estado resuelto.
5. **Alta — carga anticipada:** en `src/lib/acto.ts`, sustituir lotes adyacentes reactivos por carga priorizada 0 → cada N → relleno y prefetch direccional, para que un scroll rápido móvil no quede en 4/45 cambios bajo 4G.
6. **Alta — conversión:** en `src/render.ts`, decidir explícitamente si los nueve CTA deben abrir `waUrl()`; si el requisito es literal, cambiar los ocho `#servicios` a WhatsApp con mensajes por capítulo.
7. **Deseable — regresión fiable:** separar en `scripts/qa.mjs` CLS inicial de la fase de scroll, desactivar caché para LCP y aplicar el presupuesto móvil de 3.0 MB. Guardar attribution de layout shifts para evitar falsos “CLS 0”.

## Veredicto

**RECHAZADA — 7.7/10.** La obra es enseñable como dirección visual, pero no debe declararse final ni superior a los referentes hasta cerrar continuidad, CLS, peso móvil y accesibilidad táctil.
