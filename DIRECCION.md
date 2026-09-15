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
| `--pizarra` | `#6D6C66` | Texto secundario |
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

Los cortes declarados son `c01-066 → c02-001`, `c02-066 → c03-001` y `c03-066 → c04-001`. El manifiesto conserva orden, capítulos y cortes para ambos sets. Los WebP existentes son 1440 px desktop / 800 px móvil, 10 fps; peso total medido: 7,512,862 B / 3,493,070 B. El modo `motion-off` mantiene las nueve JPG maestras como láminas fijas.

La comprobación perceptual detecta además picos internos (máximo tras el índice 95): razón 6.798 desktop y 6.752 móvil frente al límite 3.5. No se reclasifican como cortes porque el manifiesto solo admite los tres cambios de plano reales; queda como deuda de continuidad del material fuente.
