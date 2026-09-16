/**
 * Los arcos estratificados — la imagen de la marca (ver DIRECCION.md).
 * Tres curvas anidadas (esmalte/dentina/nervio abstraídos) y una hilera de
 * puntos de medición sobre el arco exterior: instrumento de precisión, no
 * ilustración. Se usan como firma estática; la película v2 no los traza.
 */

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
