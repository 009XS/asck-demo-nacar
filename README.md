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

## Publicación (Coolify, proyecto demos-sector)

Contenedor `Dockerfile` + nginx (mismo patrón que umbral-arquitectura: cabeceras en
`security-headers.conf` incluidas por location, `noindex` mientras sea demo).

1. Repo en GitHub (cuenta 009XS) con este contenido; rama que Coolify tenga configurada.
2. App nueva en Coolify (proyecto `demos-sector`, build pack `dockerfile`) apuntando al
   repo; el subdominio sale gratis por el comodín de `asck.tech`.
3. Push a la rama configurada → webhook → deploy. Verificar SIEMPRE contra lo publicado
   (`window.__BUILD_ID__`), no contra el estado de Coolify.
