/**
 * Construye el DOM de todo lo que va después del hero (el hero vive en
 * index.html porque es el LCP). Contenido: únicamente businessConfig.ts.
 */

import {
  cierre,
  equipo,
  footer,
  intersticio,
  manifiesto,
  metodo,
  nav,
  pacientes,
  servicios,
  visita,
  waUrl,
} from './businessConfig'
import { arcoFirma, arcosActo } from './lib/arco'

const ICONO_WA = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.65 15.02L2 22l5.13-1.32A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.18 15.26l-.3-.18-3.04.78.8-2.96-.2-.31A8.2 8.2 0 0 1 12 3.8Zm-3.12 4.1c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.35 5.18 4.56 2.56 1 3.08.8 3.64.75.55-.05 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.07a8.2 8.2 0 0 1-2.4-1.49 9 9 0 0 1-1.67-2.07c-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.19-.24-.57-.49-.5-.67-.5h-.58Z"/></svg>`

const numSec = (n: string, etiqueta: string, jade = false) => `
  <div class="num-sec">
    <span class="n" aria-hidden="true">${n}</span>
    <p class="label${jade ? ' label--jade' : ''}">${etiqueta}</p>
  </div>`

const navHtml = () => `
  <nav class="nav" aria-label="Principal">
    <div class="shell nav__fila">
      <a class="nav__marca" href="#hero">NÁCAR<small>Estudio dental</small></a>
      <div class="nav__enlaces">
        ${nav.enlaces.map((e) => `<a href="${e.href}">${e.texto}</a>`).join('')}
        <a class="nav__wa" href="${waUrl()}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </nav>`

const manifiestoHtml = () => `
  <section class="seccion manifiesto" id="filosofia" aria-labelledby="t-filosofia">
    <div class="shell">
      ${numSec(manifiesto.numero, manifiesto.etiqueta)}
      <div class="grid" data-reveal-group>
        <h2 class="lead manifiesto__lead reveal" id="t-filosofia">${manifiesto.lead}</h2>
        <p class="body manifiesto__cuerpo reveal">${manifiesto.cuerpo}</p>
      </div>
      <div class="principios" data-reveal-group>
        ${manifiesto.principios
          .map(
            (p) => `
        <article class="principio reveal">
          <div class="rule" aria-hidden="true"></div>
          <h3>${p.titulo}</h3>
          <p>${p.texto}</p>
        </article>`,
          )
          .join('')}
      </div>
    </div>
  </section>`

const actoHtml = () => `
  <section class="seccion seccion--oscura acto" id="metodo" aria-labelledby="t-metodo">
    <div class="acto__pin">
      ${arcosActo()}
      <div class="shell acto__cabeza">
        ${numSec(metodo.numero, metodo.etiqueta)}
        <h2 class="display d-md" id="t-metodo">${metodo.titulo}</h2>
        <p class="body" style="margin-top:1rem">${metodo.intro}</p>
      </div>
      <div class="shell acto__pasos">
        ${metodo.pasos
          .map(
            (p, i) => `
        <article class="paso" data-paso="${i}">
          <div>
            <div class="paso__num" aria-hidden="true">0${i + 1}</div>
            <p class="label paso__minutos">Minuto ${p.desde} — ${p.hasta}</p>
          </div>
          <div>
            <h3 class="display d-md paso__titulo">${p.titulo}</h3>
            <p class="body paso__texto">${p.texto}</p>
          </div>
        </article>`,
          )
          .join('')}
      </div>
      <div class="shell acto__cta-fila">
        <p class="acto__cierre">${metodo.cierre}</p>
        <a class="boton" href="${waUrl()}" target="_blank" rel="noopener">${ICONO_WA} ${metodo.cta}</a>
      </div>
      <div class="shell acto__rail" aria-hidden="true">
        <span class="label r-min" data-minuto>0'</span>
        <div class="rail__pista"><div class="rail__avance"></div></div>
        <span class="label">45'</span>
      </div>
    </div>
  </section>`
void actoHtml

const capitulos = [
  ['Materia', 'Capa por capa.', 'El nácar no se pinta: se forma. Una sonrisa bien hecha, también.'],
  ['Diagnóstico', 'Mirar antes de tocar.', 'Escuchamos, medimos y mostramos lo que vemos. Nada empieza sin contexto.'],
  ['Esmalte', 'Lo natural no se impone.', 'Forma, tono y función se planean para que el resultado parezca inevitable.'],
  ['Llegada', 'Un espacio que baja el pulso.', 'Luz cálida, tiempos reales y una visita sin prisa.'],
  ['Consulta', 'Tu primera cita, minuto a minuto.', '0–10 escuchar · 10–25 escanear · 25–40 planear · 40–45 decidir.'],
  ['Plan', 'Ves lo que vemos.', 'Tu boca en pantalla, cada opción en orden y el costo completo por escrito.'],
  ['Precisión', 'La diferencia vive en milímetros.', 'Instrumental impecable y manos especializadas para cada capa del tratamiento.'],
  ['Claridad', 'Sin letra chica.', 'Sales con tratamientos, sesiones, fechas y precio cerrado. Tú decides.'],
  ['Cierre', 'Volver a sonreír sin pensarlo.', 'La valoración no tiene costo. El primer paso es un mensaje.'],
]

const tramos = [
  [0, 0.12], [0.105, 0.23], [0.215, 0.34], [0.325, 0.45], [0.435, 0.56],
  [0.545, 0.67], [0.655, 0.78], [0.765, 0.89], [0.875, 1],
]

const filmHtml = () => `
  <section class="film" id="metodo" aria-labelledby="film-title" aria-label="Recorrido de nueve capítulos: del nácar al estudio dental y de vuelta a la materia">
    <canvas width="1600" height="900" aria-hidden="true"></canvas><img class="film__poster" src="/film/poster.jpg" width="960" height="540" alt="Capas de nácar iluminadas en tonos porcelana, jade y oro" />
    <div class="film__scrim" aria-hidden="true"></div>
    <div class="film__hud"><span><b data-film-count>01</b> / 09</span><span>NÁCAR — RECORRIDO</span><i></i></div>
    <div class="film__cards">
      ${capitulos.map((c,i)=>`<article class="film-card" data-film-card="${i}" data-from="${tramos[i][0]}" data-to="${tramos[i][1]}"><p class="label">${String(i+1).padStart(2,'0')} — ${c[0]}</p><h2 class="display d-lg" ${i===0?'id="film-title"':''}>${c[1]}</h2><p>${c[2]}</p><a class="film-card__cta" href="${i === 8 ? waUrl() : '#servicios'}" ${i === 8 ? 'target="_blank" rel="noopener"' : ''}>${i === 8 ? 'Agendar valoración' : 'Conocer tratamientos'} <span aria-hidden="true">→</span></a></article>`).join('')}
    </div>
    <ol class="visually-hidden">${capitulos.map(c=>`<li>${c[0]}: ${c[1]} ${c[2]}</li>`).join('')}</ol>
  </section>`

const serviciosHtml = () => `
  <section class="seccion servicios" id="servicios" aria-labelledby="t-servicios">
    <div class="shell">
      ${numSec(servicios.numero, servicios.etiqueta)}
      <h2 class="display d-lg servicios__intro" id="t-servicios"><span class="reveal-mask"><span>${servicios.titulo}</span></span></h2>
      <div class="filas">
        ${servicios.items
          .map(
            (s, i) => `
        <article class="fila" data-fila="${i}" data-reveal-group>
          <div class="fila__velo" aria-hidden="true"></div>
          <span class="fila__indice reveal" aria-hidden="true">${s.indice}</span>
          <div class="fila__centro">
            <h3 class="fila__nombre"><span class="reveal-mask"><span>${s.nombre}</span></span></h3>
            <p class="label reveal">${s.tag}</p>
          </div>
          <div class="fila__lado reveal">
            <p class="fila__texto">${s.texto}</p>
            <p class="fila__nota">${s.nota}</p>
          </div>
        </article>`,
          )
          .join('')}
      </div>
    </div>
  </section>`

const intersticioHtml = () => `
  <aside class="intersticio" aria-label="Nota de la directora clínica" data-reveal-group>
    <div class="shell" data-parallax-lento>
      <!-- Sin reveal-mask a propósito: la máscara recorta bloques de varias
           líneas. Aquí manda el parallax lento + un fade-up. -->
      <blockquote class="intersticio__cita reveal">${intersticio.cita}</blockquote>
      <p class="label intersticio__pie reveal">${intersticio.pie}</p>
    </div>
  </aside>`

const pacientesHtml = () => `
  <section class="seccion seccion--arena pacientes" id="pacientes" aria-labelledby="t-pacientes">
    <div class="shell">
      ${numSec(pacientes.numero, pacientes.etiqueta)}
      <div class="pacientes__cabeza" data-reveal-group>
        <h2 class="display d-md pacientes__titulo reveal" id="t-pacientes">${pacientes.titulo}</h2>
        <div class="pacientes__resumen reveal">
          <div class="resumen__nota">${pacientes.resumen.calificacion}<small> / 5</small></div>
          <p class="label">${pacientes.resumen.reseñas}</p>
        </div>
      </div>
      <div class="cifras" data-reveal-group>
        ${pacientes.cifras
          .map(
            (c) => `
        <div class="cifra reveal">
          <div class="cifra__valor"><span data-contador="${c.valor}">${c.valor.toLocaleString('es-MX')}</span>${c.sufijo}</div>
          <p class="cifra__unidad">${c.unidad}</p>
        </div>`,
          )
          .join('')}
      </div>
      <div class="testimonios" data-reveal-group>
        ${pacientes.testimonios
          .map(
            (t, i) => `
        <article class="testimonio reveal" data-testimonio="${i}">
          <blockquote>«${t.cita}»</blockquote>
          <footer><b>${t.nombre}</b>${t.tratamiento}</footer>
        </article>`,
          )
          .join('')}
      </div>
    </div>
  </section>`

const equipoHtml = () => `
  <section class="seccion equipo" id="equipo" aria-labelledby="t-equipo">
    ${arcoFirma('equipo__arco')}
    <div class="shell">
      ${numSec(equipo.numero, equipo.etiqueta)}
      <div class="grid" data-reveal-group>
        <div class="equipo__ficha reveal">
          <h2 class="display d-lg equipo__nombre" id="t-equipo">${equipo.nombre}</h2>
          <p class="equipo__cargo">${equipo.cargo}</p>
          <p class="equipo__cred">${equipo.credenciales}</p>
        </div>
        <div class="equipo__voz reveal">
          <p class="lead">«${equipo.cita}»</p>
          <p class="body equipo__nota">${equipo.equipoNota}</p>
        </div>
      </div>
    </div>
  </section>`

const visitaHtml = () => `
  <section class="seccion seccion--arena visita" id="visita" aria-labelledby="t-visita">
    <div class="shell">
      ${numSec(visita.numero, visita.etiqueta)}
      <div class="grid" data-reveal-group>
        <div class="visita__info reveal">
          <h2 class="display d-md" id="t-visita">${visita.titulo}</h2>
          <p class="visita__dir">${visita.direccion}</p>
          <p class="visita__ciudad">${visita.ciudad}</p>
          <p class="visita__ref">${visita.referencias}</p>
        </div>
        <div class="visita__horario reveal">
          ${visita.horario
            .map(
              (h) => `
          <div class="horario__fila"><span class="h-dias">${h.dias}</span><span class="h-horas">${h.horas}</span></div>`,
            )
            .join('')}
        </div>
      </div>
    </div>
  </section>`

const cierreHtml = () => `
  <section class="seccion seccion--oscura cierre" id="contacto" aria-labelledby="t-cierre">
    <div class="shell" data-reveal-group>
      <h2 class="display d-lg cierre__titulo reveal" id="t-cierre">${cierre.titulo}</h2>
      <p class="body cierre__texto reveal">${cierre.texto}</p>
      <div class="cierre__acciones reveal">
        <a class="boton" href="${waUrl()}" target="_blank" rel="noopener">${ICONO_WA} ${cierre.cta}</a>
        <a class="cierre__tel" href="tel:+525514879836">o llama: +52 55 1487 9836</a>
      </div>
    </div>
  </section>`

const footerHtml = () => `
  <footer class="footer">
    <div class="shell footer__fila">
      <div>
        <p class="footer__marca">NÁCAR</p>
        <p class="footer__credito">© ${footer.anio} · Interlomas, Edo. de México</p>
      </div>
      <div>
        <p class="footer__legal"><strong>Demo.</strong> ${footer.disclaimer}</p>
        <p class="footer__credito">${footer.credito} · <a href="mailto:${footer.contactoDemo}">${footer.contactoDemo}</a></p>
      </div>
    </div>
  </footer>`

const flotantesHtml = () => `
  <a class="wa-pill" data-oculta href="${waUrl()}" target="_blank" rel="noopener" aria-label="Agendar valoración por WhatsApp">
    ${ICONO_WA}<span>WhatsApp</span>
  </a>
  <button class="motion-pill" type="button" data-motion-toggle aria-live="polite" aria-pressed="false"></button>`

export function render(root: HTMLElement): void {
  root.innerHTML = `
    ${navHtml()}
    <main id="contenido">
      ${manifiestoHtml()}
      ${filmHtml()}
      ${serviciosHtml()}
      ${intersticioHtml()}
      ${pacientesHtml()}
      ${equipoHtml()}
      ${visitaHtml()}
      ${cierreHtml()}
    </main>
    ${footerHtml()}
    ${flotantesHtml()}
  `
}
