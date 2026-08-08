/**
 * Los arcos estratificados — la imagen de la marca (ver DIRECCION.md).
 * Tres curvas anidadas (esmalte/dentina/nervio abstraídos) y una hilera de
 * puntos de medición sobre el arco exterior: instrumento de precisión, no
 * ilustración. El acto los traza con el scroll; en modo quieto nacen trazados.
 */

type P = { x: number; y: number }

const cubica = (p0: P, p1: P, p2: P, p3: P, t: number): P => {
  const u = 1 - t
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  }
}

/** Un arco en U son dos cúbicas espejo; devuelve puntos muestreados. */
function muestrear(y0: number, yc: number, xIzq: number, xCtrl: number, n: number): P[] {
  const izq: [P, P, P, P] = [
    { x: xIzq, y: y0 },
    { x: xIzq, y: yc * 0.69 },
    { x: xCtrl, y: yc },
    { x: 400, y: yc },
  ]
  const der: [P, P, P, P] = [
    { x: 400, y: yc },
    { x: 800 - xCtrl, y: yc },
    { x: 800 - xIzq, y: yc * 0.69 },
    { x: 800 - xIzq, y: y0 },
  ]
  const pts: P[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    pts.push(t <= 0.5 ? cubica(...izq, t * 2) : cubica(...der, (t - 0.5) * 2))
  }
  return pts
}

const trazo = (y0: number, yc: number, xIzq: number, xCtrl: number): string =>
  `M${xIzq} ${y0} C${xIzq} ${Math.round(yc * 0.69)} ${xCtrl} ${yc} 400 ${yc} ` +
  `C${800 - xCtrl} ${yc} ${800 - xIzq} ${Math.round(yc * 0.69)} ${800 - xIzq} ${y0}`

/** Arco de firma sobre fondo claro: ancla visual, nunca protagonista. */
export function arcoFirma(clase: string): string {
  return `
    <svg class="${clase}" viewBox="0 0 800 640" fill="none" aria-hidden="true">
      <path d="${trazo(60, 580, 80, 216)}" stroke="#1B1A18" stroke-opacity="0.13" stroke-width="1.5" />
      <path d="${trazo(60, 486, 156, 260)}" stroke="#2E6B60" stroke-opacity="0.22" stroke-width="1.25" />
      <path d="${trazo(60, 392, 232, 306)}" stroke="#A38E63" stroke-opacity="0.3" stroke-width="1" />
    </svg>`
}

export function arcosActo(): string {
  const puntos = muestrear(60, 580, 80, 216, 15)
    .slice(1, -1)
    .map((p) => `<circle class="arco-pieza" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.4" />`)
    .join('')

  return `
    <svg class="acto__arco" viewBox="0 0 800 640" fill="none" aria-hidden="true">
      <path class="arco arco-a" d="${trazo(60, 580, 80, 216)}" stroke="#F6F3EE" stroke-opacity="0.2" stroke-width="1.5" />
      <path class="arco arco-b" d="${trazo(60, 486, 156, 260)}" stroke="#8FC4B7" stroke-opacity="0.5" stroke-width="1.25" />
      <path class="arco arco-c" d="${trazo(60, 392, 232, 306)}" stroke="#A38E63" stroke-opacity="0.6" stroke-width="1" />
      <g fill="#8FC4B7" fill-opacity="0.55">${puntos}</g>
    </svg>`
}
