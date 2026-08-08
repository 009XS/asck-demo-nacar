# NÁCAR — landing dental de conversión

Landing de UNA página para el sector dental, construida al nivel del kit UMBRAL
(`02_DEMOS_SECTOR/arquitectura` + skill `doctrina-diseno`). **Clínica ficticia de demo**:
el disclaimer va en el pie; la captación (WhatsApp/tel) apunta a ASCK.

Dirección de arte y guion de scroll: `DIRECCION.md` (mini-biblia — manda sobre el CSS).

## Qué es (y qué no)

- **Es** una landing de conversión: propuesta de valor → filosofía → método → servicios →
  prueba social → equipo → visita → cierre. Todo CTA lleva a `wa.me` con mensaje precargado.
- **No es** la demo dental completa (esa vive en `02_DEMOS_SECTOR/dental/clinica-marfil-demo`
  y no se toca desde aquí).

## Stack y decisiones

- **Vite 7 + TypeScript vanilla + GSAP ScrollTrigger.** Sin React a propósito: una landing
  sin estado no paga hidratación; menos JS, mejor LCP. El patrón de contenido es el de las
  demos ASCK: **todo el copy sale de `src/businessConfig.ts`** (única excepción: el hero
  vive en `index.html` porque es el LCP y debe pintar antes que el bundle).
- **Sin Lenis** (canon UMBRAL: scroll nativo + `scrub: 0.5`; jamás hijacking).
- **Sin fotografía en esta fase**: gflow tiene la sesión caducada. La imagen de marca son
  los arcos estratificados (`src/lib/arco.ts`). Si Kevin refresca `gflow auth login`,
  los huecos de fotografía están dirigidos en `DIRECCION.md`.
- **Movimiento en 3 estados** (auto/on/off): `src/lib/motion.ts`, píldora fija
  abajo-izquierda, `localStorage`, `?motion=on|off` para QA, respaldo CSS con `!important`
  colgado de `<html data-motion>`. El modo quieto es la MISMA obra apilada (doctrina).
- El acto pinneado usa **UN solo ScrollTrigger** y el `end` va **en píxeles de viewport
  como función** — lecciones pagadas del kit; no deshacer.

## Comandos

```bash
npm install
npm run dev        # http://localhost:5187
npm run build      # tsc + vite build -> dist/
npm run preview    # http://localhost:4187 — contra ESTE corre el QA
npm run typecheck
npm run qa         # consola, 404, overflow, CLS, peso, LCP y scroll-proof
                   # del acto, en ambos modos y 3 viewports; evidencia en qa/
```

## Depuración

```
?motion=on|off       fuerza el modo sin tocar el sistema
window.__BUILD_ID__  qué build está sirviendo producción realmente
```

## Publicado

**https://nacar.asck.tech** — app Coolify `nacar-dental` (`ar9athq8375g243vh3s7t49b`),
proyecto `demos-sector`, build pack `dockerfile`, repo `009XS/asck-demo-nacar`, rama `main`.
Cada push a `main` dispara despliegue por webhook.

⚠️ **No confundir con `dentista.asck.tech`**: ese subdominio sirve la demo **Clínica Marfil**
(repo `009XS/asck-demo-dental-landing`, carpeta `02_DEMOS_SECTOR/dental/clinica-marfil-demo`).
Son dos piezas distintas del mismo sector y ninguna sustituye a la otra.

### Rúbrica `doctrina-diseno` — 8.5 / 10 (medido contra producción, sin topes activos)

| Categoría | Peso | Nota | Evidencia |
|---|---|---|---|
| Concepto y narrativa | 15% | 8.5 | «capa por capa»; firma = el acto de los 45' |
| Tipografía | 15% | 8.5 | 2 familias subset; ratio 9.6:1; fallbacks métricos |
| Composición y espacio | 10% | 8 | 12 col, 0.42/0.58, numeración editorial |
| Color y atmósfera | 10% | 8.5 | tokens del mundo, acento avaro, grano de nácar |
| Movimiento y scroll | 15% | 8 | una pieza scrub que narra; catálogo cerrado |
| Fallback reduce + a11y | 10% | 9 | misma obra apilada, interruptor, foco, skip |
| Rendimiento | 10% | 9 | 270 KB · LCP 0.92 s · CLS 0.0023 en 6 escenarios |
| Detalle / craft | 10% | 8.5 | foco por contexto, velo en filas, 404 propio |
| Contenido y conversión | 5% | 9 | números concretos, CTA que dice qué pasa |

Contraste AA medido: pizarra 5.53 · jade 5.60 · tinta 15.71 · porcelana/petróleo 15.23.

## Cómo se publicó (Coolify, proyecto demos-sector)

Contenedor `Dockerfile` + nginx (mismo patrón que umbral-arquitectura: cabeceras en
`security-headers.conf` incluidas por location, `noindex` mientras sea demo).

1. Repo en GitHub (cuenta 009XS) con este contenido; rama que Coolify tenga configurada.
2. App nueva en Coolify (proyecto `demos-sector`, build pack `dockerfile`) apuntando al
   repo; el subdominio sale gratis por el comodín de `asck.tech`.
3. Push a la rama configurada → webhook → deploy. Verificar SIEMPRE contra lo publicado
   (`window.__BUILD_ID__`), no contra el estado de Coolify.
