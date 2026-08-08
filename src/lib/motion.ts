/**
 * Decide si la página anima, y deja que el usuario lo cambie (doctrina del kit:
 * "misma obra, otra mecánica"). `prefers-reduced-motion: reduce` NO es raro:
 * en Windows basta con apagar los efectos del sistema y Chrome lo reporta.
 *
 *  - por defecto se respeta la preferencia del sistema;
 *  - `?motion=on|off` la fuerza para QA sin tocar la configuración;
 *  - la elección explícita se recuerda en localStorage (con try/catch);
 *  - el estado vive en `<html data-motion>` para que el CSS haga de respaldo.
 */

export type MotionChoice = 'auto' | 'on' | 'off'

const CLAVE = 'nacar:motion'
export const EVENTO = 'nacar:motion-change'

const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

function leerGuardado(): MotionChoice {
  try {
    const v = localStorage.getItem(CLAVE)
    return v === 'on' || v === 'off' ? v : 'auto'
  } catch {
    return 'auto'
  }
}

let choice: MotionChoice = (() => {
  const url = new URLSearchParams(location.search).get('motion')
  return url === 'on' || url === 'off' ? url : leerGuardado()
})()

export function animar(): boolean {
  return choice === 'on' ? true : choice === 'off' ? false : !mq.matches
}

export function eleccion(): MotionChoice {
  return choice
}

/** Refleja el estado resuelto en <html>, ANTES de pintar nada dependiente. */
export function aplicarEstado(): void {
  document.documentElement.dataset.motion = animar() ? 'on' : 'off'
}

export function elegir(c: MotionChoice): void {
  choice = c
  try {
    if (c === 'auto') localStorage.removeItem(CLAVE)
    else localStorage.setItem(CLAVE, c)
  } catch {
    /* modo privado: la elección vive sólo en memoria */
  }
  aplicarEstado()
  window.dispatchEvent(new CustomEvent(EVENTO))
}

/** La preferencia es de la PÁGINA: todos los módulos se rehacen al cambiar. */
export function alCambiar(cb: () => void): void {
  window.addEventListener(EVENTO, cb)
  mq.addEventListener('change', () => {
    if (choice === 'auto') {
      aplicarEstado()
      cb()
    }
  })
}
