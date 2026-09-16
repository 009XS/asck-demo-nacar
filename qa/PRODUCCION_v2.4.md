# NÁCAR v2.4 en producción — verificación en vivo

**Fecha:** 2026-09-15
**URL:** https://nacar.asck.tech
**Commit desplegado:** `c86ca8f` (merge de `v2.4/contraste-quieto-2026-09-15` en `main`; el trabajo
está en `3200fde`)
**Respaldo previo:** tag `respaldo-main-antes-v2.4-2026-09-15` → `d21a4e2` (el `main` de antes)
**Despliegue:** `python scripts/c19-deploy.py` → `deployment=wwrumyauibbuzqdpakyisqlj`,
`status=finished` a los 25 s. `build_pack=dockerfile` y `custom_nginx_configuration` vacío
comprobados antes de encolar: el `nginx.conf` que manda sigue siendo el del repo.

## 0. Que lo servido es lo construido

| Comprobación | Resultado |
|---|---|
| CSS referenciado por `GET /` | `assets/index-CiVCAn6w.css` — **mismo nombre que el build local** |
| `sha256` del CSS servido vs. `dist/assets/index-CiVCAn6w.css` | `eba7d3d9…83d90` = `eba7d3d9…83d90` — **idéntico byte a byte** |
| Regla del scrim quieto en el CSS servido | `html[data-motion=off] .film-card:before{…background:linear-gradient(90deg,#10201c9e,#10201c80 38%,#10201c29 66%,#10201c00 88%),linear-gradient(0deg,#10201cbd,#10201c52 48%,#10201c14 78%,#10201c00)}` |
| Regla de la nav táctil en el CSS servido | presente: `@media (pointer:coarse)and (min-width:821px)` |
| `min-height:44px` en el CSS servido | 8 apariciones |
| Cabeceras de `GET /` | `200`, `Cache-Control: no-cache, must-revalidate`, CSP completa, `Referrer-Policy`, `X-Frame-Options`, `X-Robots-Tag: noindex, nofollow` |

## 1. `npm run qa` contra producción: **APROBADO**

```
QA_BASE=https://nacar.asck.tech QA_STEP_MS=600 npm run qa   # exit 0, failures: []
```

Log íntegro en `qa/PRODUCCION_v2.4/qa-remoto.log`; métricas en
`qa/PRODUCCION_v2.4/metrics.json`. Los 108 recortes de `qa/v2.4/contrast/` versionados son **los
de esta pasada contra producción**, no los de la pasada local.

| Modo | Viewport | LCP | CLS carga | CLS barrido | Entrada (cuerpo real) | Presupuesto | Overflow | Cambios |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| on | 390×844 (CPU 4×, 1.6 Mbps) | 3 664 ms (frío) | 0 | 0 | 2 462 177 B | 2 500 000 | 0 | 45 |
| on | 667×375 | 852 ms | 0 | 0 | 2 462 177 B | 2 500 000 | 0 | 45 |
| on | 768×1024 | 828 ms | 0 | 0 | 2 462 177 B | 2 500 000 | 0 | 45 |
| on | 1024×768 | 876 ms | 0 | 0 | 7 524 239 B | 8 000 000 | 0 | 45 |
| on | 1440×900 | 1 124 ms | 0 | 0 | 7 524 239 B | 8 000 000 | 0 | 45 |
| on | 1920×1080 | 1 024 ms | 0 | 0 | 7 524 239 B | 8 000 000 | 0 | 45 |
| off | 390×844 | 1 180 ms | 0 | — | 1 034 880 B | 2 500 000 | 0 | — |
| off | 1440×900 | 728 ms | 0 | — | 1 256 839 B | 8 000 000 | 0 | — |

LCP 390×844 con CPU 4×: **frío 3 664 ms**, repeticiones 1 076 / 1 144 / 1 216 ms, **mediana
1 144 ms** (presupuesto 2 500 ms, tope en frío 4 000 ms). Esa primera cifra es el arranque en frío
del contenedor que R1e no pudo reproducir «sin desplegar»: **aquí sí se reproduce**, medido justo
después del despliegue, y queda dentro del tope de 4 s pero muy lejos de la mediana. El síntoma
sigue vivo; no se cierra con esta misión.

## 2. El bloqueante de R1e, medido en producción

Instrumento: `medirContrastes` de `scripts/qa.mjs`, densidad ×2, estado real (sin forzar
`visibility`, `opacity` ni `color` más allá del truco de dos capturas), texto contra el fondo que
hay detrás de esos mismos píxeles.

**Capítulo 03, modo quieto, 1440×900** — el punto exacto que R1e denunció:

| Elemento | Tamaño | Núcleo de glifo | Antes (v2.3) | **Ahora en producción** | Umbral |
|---|---:|---:|---:|---:|---:|
| `h2` «Lo natural no se impone.» | 92 px | 29 049 px | **2.62 : 1** | **6.26 : 1** | 3.0 |
| Párrafo | 18 px | 8 930 px | **4.18 : 1** | **6.79 : 1** | 4.5 |
| `.label` «03 — ESMALTE» | 11 px | 852 px | 7.64 : 1 | 7.64 : 1 | 4.5 |

Las tres con la tarjeta en `visibility: visible` y `opacity: 1`. Captura:
`qa/PRODUCCION_v2.4/prod-off-1440-cap03.png`.

**Mínimos de las 108 medidas en producción** (9 capítulos × 2 modos × 2 anchos × 3 textos):

| Elemento | on 390 | on 1440 | off 390 | off 1440 |
|---|---:|---:|---:|---:|
| `.label` | 7.39 | 7.40 | 7.49 | 7.64 |
| `h2` | 4.95 | 5.67 | 6.05 | 6.26 |
| párrafo | 6.02 | 5.90 | 6.50 | 6.79 |

**108 de 108 por encima de 4.5 : 1**, incluido el titular, al que la norma sólo le exige 3.0 por
tamaño. `failures: []`.

## 3. Nav con puntero grueso, en producción

`hasTouch: true` y comprobado en la propia página que `matchMedia('(pointer: coarse)')` es `true`
(si la emulación no se aplicara, la puerta falla en vez de pasar en vacío).

| Ancho | Enlaces visibles | Por debajo de 44 px | Alto de la fila | Overflow |
|---|---:|---:|---:|---:|
| 390×844 | 1 (sólo WhatsApp, por diseño) | 0 | 79 px | 0 |
| 820×1180 | 1 | 0 | 79 px | 0 |
| 1024×768 | 5 | **0** (antes 4 a 18 px) | 79 px | 0 |
| 1280×800 | 5 | **0** (antes 4 a 18 px) | 79 px | 0 |
| 1440×900 | 5 | **0** (antes 4 a 18 px) | 79 px | 0 |

## 4. Lo que no cambió y se vuelve a confirmar en vivo

- 0 errores de consola, 0 `pageerror`, 0 respuestas ≥ 400 y 0 respuestas 200 sin cuerpo en los 12 perfiles.
- CLS de carga y de barrido **0.0000** en los seis viewports y en los dos modos.
- 45/45 cambios de fotograma en los seis anchos; 9/9 láminas visibles en modo quieto.
- 13/13 CTA `wa.me` alcanzables con Tab en 1440×900 y 390×844; 9/9 CTA de capítulo reciben el clic.
- Interruptor de movimiento con `aria-pressed` correcto en los dos estados y ≥ 44 px.
- Sin overflow horizontal en ninguno de los perfiles medidos.

## 5. Lo que sigue abierto

- Arranque en frío: **3 664 ms** de LCP en la primera visita tras el despliegue (tope 4 000 ms).
- Al conmutar el movimiento se pierde la posición de lectura.
- `/film/**` responde `immutable` también sin `?v=` o con un `?v=` inventado.
- La película se ve blanda en DPR 2 (ampliación ≈ ×4.1 en móvil sobre un master de 1344×768):
  aceptado por escrito en `DIRECCION.md`.
- Composición repetida en los nueve capítulos; par tipográfico heredado de UMBRAL.

## 6. Cómo reproducir

```
curl -sS https://nacar.asck.tech/ | grep -o 'assets/index-[A-Za-z0-9_-]*\.css'
curl -sS https://nacar.asck.tech/assets/index-CiVCAn6w.css | sha256sum
QA_BASE=https://nacar.asck.tech QA_STEP_MS=600 npm run qa
```
