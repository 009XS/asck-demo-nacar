# DIRECCIÓN — NÁCAR · Estudio Dental (mini-biblia)

Patrón `VISUAL_BIBLE.md` de UMBRAL, reducido a una página. El CSS reproduce esto token por
token. Si una decisión visual contradice este documento, se corrige o se anota aquí con motivo.

## Concepto en una frase

**El nácar se forma capa por capa; una sonrisa bien hecha, también.**
La landing convierte ese principio en mecánica: todo se revela por capas, y la pieza
central es la primera cita contada minuto a minuto — porque lo que impide agendar no es
el precio: es el miedo y la desconfianza.

## Marca

- Wordmark: `NÁCAR`, mayúsculas, tracking 0.32em, peso 600 sans. Sin isotipo.
- Firma: `NÁCAR — Estudio dental · Interlomas`.
- **Clínica FICTICIA de demo.** Cifras y reseñas ilustrativas; el disclaimer va en el pie.
  Único dato real: WhatsApp/tel de ASCK (a donde llega la captación).

## Paleta (el negro puro no existe)

| Token | Hex | Uso |
|---|---|---|
| `--porcelana` | `#F6F3EE` | Fondo principal |
| `--arena` | `#EAE5DC` | Fondos secundarios, velos de hover |
| `--tinta` | `#1B1A18` | Texto principal |
| `--pizarra` | `#63625C` | Texto secundario |
| `--jade` | `#2E6B60` | Acento (con avaricia): CTA, etiquetas, notas |
| `--jade-claro` | `#8FC4B7` | Etiquetas y raíl sobre fondo oscuro |
| `--oro` | `#A38E63` | Numerales editoriales, tercer arco |
| `--petroleo` | `#10201C` | Secciones oscuras (método, cierre) — la excepción, no la norma |

Velo nácar: 3 radiales (aqua/rosa/lila) < 8 % de opacidad aparente. Es niebla, no protagonista.

## Tipografía

- Display: **Cormorant Garamond 300** (+400, +300 itálica para citas). Serif editorial:
  precisión artesanal, no "clínica de franquicia".
- Texto/UI: **Inter Variable**. Autoalojadas, woff2, subset latin/latin-ext.
- Escala canónica del kit (d-xl 3.25→10rem · lead · body · label 0.6875/0.28em).

## Imaginería

**No hay fotografía en esta fase** (gflow con sesión caducada — pendiente; los huecos ya
están dirigidos). La imagen de la marca es dibujo de precisión: **arcos dentales
estratificados** (3 curvas anidadas: tinta/jade/oro = esmalte/dentina/nervio abstraídos),
trazados con línea de 1–1.5 px. Nada de dientes caricatura, nada de stock, nada de caras IA.

## PROHIBIDO

Dientes cartoon · sonrisas stock · caras generadas · negro/blanco puros · rebotes y
rotaciones · glass sin intención · gradientes protagonistas · cifras médicas inventadas que
parezcan verificables de un negocio real (todo marcado demo en el pie) · cédula
verosímil-real (va marcada `(demo)`).

## Guion de scroll (estructura A/B/C del kit)

- **A — Hero estático** (1 pantalla): porcelana + velo nácar + arcos tenues. LCP = `<h1>`
  pintado inline desde `index.html`. Sin scrub: la calma es el mensaje.
- **B — UNA pieza pinneada**: `02 — El método`, "Tu primera cita, minuto a minuto".
  Pin de 340vh sobre petróleo. Un solo ScrollTrigger (pin + arcos + tarjetas + raíl):
  los 3 arcos se trazan 0→100 %, el raíl avanza 0'→45', y 4 pasos entran/salen por
  crossfade+rise en tramos propios. El tiempo de la cita ES el progreso del scroll.
- **C — Coda editorial** (porcelana/arena): servicios en filas, prueba social con
  contadores, equipo, visita, cierre oscuro con CTA. Reveals una vez, parallax ±6 % máx.

## Reduced motion (doctrina "misma obra, otra mecánica")

Kevin (y cualquier Windows con efectos apagados) ve `reduce`: los 4 pasos del método se
apilan a página completa con los arcos ya trazados — mismo copy, misma jerarquía, cero
scrub. 3 estados auto/on/off con píldora fija abajo-izquierda, localStorage con try/catch,
evento global, `?motion=on|off` para QA, respaldo CSS con `data-motion` en `<html>`.

## Conversión (por qué cada sección existe)

hero: promesa + CTA inmediato → filosofía: mata miedo/sorpresa/prisa → método: enseña
exactamente qué pasará (la objeción #1) → servicios: qué vendemos, con beneficio →
pacientes: prueba → equipo: quién responde → visita: fricción cero → cierre: CTA final.
WhatsApp es el único canal de captación (píldora flotante + 4 CTAs). Sin formularios
falsos: todo CTA lleva a `wa.me` con mensaje precargado.

## V2 — El recorrido de la materia

La firma deja de ser dibujo y se vuelve película: macro de nácar → esmalte → umbral → sala → sillón → instrumental → radiografía abstracta → nácar iluminado. Son nueve capítulos sobre una secuencia real de 264 fotogramas por tamaño dentro de una sola pieza pinneada de 22.5 pantallas. El canvas usa `round(progreso × 263)` y solo funde durante 3 fotogramas tras cada corte (1.14% del recorrido), con `smoothstep` y sombra máxima de 35%.

El capítulo central conserva la promesa comercial: **Tu primera cita, minuto a minuto** (escuchar, escanear, planear, decidir). El modo quieto sirve las mismas nueve imágenes y el mismo copy como láminas de 88svh. Fuentes, paleta y prohibiciones originales permanecen intactas.

### Producción de clips y cortes

- `c01` — **nácar → esmalte**: macro continua de estratos translúcidos; avance de cámara hacia una superficie de esmalte pulido, misma luz y grado.
- `c02` — **umbral → sala**: la cámara cruza físicamente el marco de roble hacia un estudio dental vacío; travertino, cortina de lino y luz cálida, sin doble exposición.
- `c03` — **sillón → instrumental**: travelling cercano desde el sillón jade hacia instrumental de precisión sobre piedra; latón envejecido y fondo petróleo.
- `c04` — **radiografía → nácar oro**: la pantalla abstracta se resuelve en arcos luminosos y capas de nácar encendidas desde dentro con oro antiguo.

Los cortes declarados son `c01-066 → c02-001`, `c02-066 → c03-001` y `c03-066 → c04-001`. El manifiesto conserva orden, capítulos y cortes para ambos sets, y sirve cada fotograma con `?v=<huella del set>` (sha256 de los 264 binarios) para que `Cache-Control: immutable` sea seguro con nombres estables.

Desde la v2.3 los dos sets se extraen con **los mismos parámetros para los cuatro clips** — nada de mezclar calidades por clip:

```
ffmpeg -i <clip>.mp4 -vf "fps=10,scale=1440:-2" -c:v libwebp -quality 44 -compression_level 6 -fps_mode passthrough  # desktop
ffmpeg -i <clip>.mp4 -vf "fps=10,scale=720:-2"  -c:v libwebp -quality 20 -compression_level 6 -fps_mode passthrough  # móvil
```

Fuentes: `assets-src/clip/clip-01.mp4`, `assets-src/clip-v2/clip-02-cand-b.mp4`, `clip-03.mp4` y `clip-04.mp4` (1344×768, 24 fps, 6.583 s). Los WebP resultantes son 1440×822 desktop / 720×412 móvil, 10 fps; peso total medido: **7,140,240 B / 2,078,178 B** (antes 7,983,510 / 2,980,502 con calidades desiguales). El modo `motion-off` mantiene las nueve JPG maestras como láminas fijas.

La comprobación perceptual v2.3 mide un máximo interno de 25.365 desktop y 25.199 móvil en el set completo. El clip 02 elegido tiene pico 9.894 y razón máxima 1.466, sin sustitución de objetos. La puerta absoluta vigente es `0.75 × REF_SALTO = 32.33175`; los únicos saltos excluidos siguen siendo los tres cortes declarados.

### Scrim y contraste (v2.4)

El texto sobre imagen se apoya en **dos ejes**, no en uno. Hasta la v2.3 el modo quieto llevaba un único degradado vertical (`0deg`, `rgba(16,32,28,.9) → .12` al 70 %) y el titular y el párrafo viven al **40–60 % de la altura** de la lámina, no pegados al borde inferior: sobre `still-03.jpg` —la curva de porcelana más clara del set— eso daba **h2 2.62 : 1 y párrafo 4.23 : 1 a 1440×900**, por debajo de WCAG AA. Desde la v2.4:

- **Escritorio (modo quieto)**: cortina `90deg` (`.62 → .50 → .16 → 0` al 88 %) sobre degradado `0deg` (`.74 → .32 → .08 → 0`). La cortina repite la gramática del scrim animado (`.film__scrim`) y se apaga antes del 88 % del ancho para que la lámina siga respirando a la derecha.
- **Móvil (modo quieto, misma consulta de medios que las láminas `mobile-*`)**: manda el eje vertical (`.84 → .62 → .26 → .05`) con una cortina lateral de apoyo (`.24 → .10 → 0`), porque con el recorte vertical el texto ocupa casi todo el ancho.
- **Modo animado en ≤ 640 px**: el scrim pasa de dos paradas a cuatro (`.90 → .62 → .24 → .04`) para densificar la banda del texto sin ensuciar el cielo del fotograma.

Todo con `--petroleo` y alfa: **ni blanco ni negro puros**. La puerta de `scripts/qa.mjs` mide desde la v2.4 la **etiqueta, el titular y el párrafo** de los nueve capítulos en los dos modos y los dos anchos (108 medidas, densidad ×2, estado real sin forzar estilos), con umbral 4.5 : 1 para texto normal y 3.0 : 1 para texto grande (≥ 24 px computados; por debajo se le exige 4.5).

### Resolución real de la película — limitación conocida, no defecto

El master es **1344×768 @ 24 fps** (`assets-src/clip/clip-01.mp4` y hermanos), así que el set «desktop» de 1440×822 **ya es un reescalado**. En pantalla, con `object-fit: cover` sobre un lienzo que se dibuja a `min(devicePixelRatio, 2)`:

| Viewport | Lienzo (px de dispositivo) | Fotograma servido | Ampliación |
|---|---|---|---:|
| 390×844 DPR 2 | 780 × 1688 | 720 × 412 | **≈ ×4.1** |
| 1440×900 DPR 2 | 2880 × 1800 | 1440 × 822 | ≈ ×2.2 |

Es decir: en un teléfono retina el fotograma móvil se dibuja **ampliado unas cuatro veces**, y una franja central de ~176 px del original ocupa toda la altura. La película se ve blanda en DPR 2 y **eso está aceptado por escrito**: subir el set a la densidad real multiplicaría el peso y el presupuesto de entrada móvil (2.5 MB) ya va con ~1.5 % de margen. No se cambia sin volver a grabar el metraje a ≥ 2160 px de ancho. Ninguna afirmación de calidad de la landing debe apoyarse en mirar los WebP «a 1:1»: **1:1 no es lo que ve nadie**.
