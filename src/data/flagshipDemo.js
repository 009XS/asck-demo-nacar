/**
 * Configuración Maestra de la Demo Flagship ASCK: NÁCAR · Estudio Dental de Precisión
 * Diseñada para impacto comercial inmediato y conversión directa en WhatsApp.
 */

export const flagshipClinic = {
  id: 'nacar-estudio-dental',
  nombre: 'NÁCAR',
  giro: 'Estudio Dental de Precisión',
  subtitulo: 'La sonrisa que ya es tuya.',
  zona: 'Interlomas / Polanco, CDMX',
  direccion: 'Blvd. Interlomas 88, Piso 3, Huixquilucan / Polanco',
  referencias: 'Estacionamiento con valet parking sin costo • Acceso directo con elevador',
  whatsapp: '525514879836',
  telVisible: '+52 55 1487 9836',
  rating: 4.9,
  reviews: 187,
  tagline: 'El nácar no se pinta: se forma capa por capa. Una buena sonrisa, también.',
  beneficioClave: 'Presupuesto cerrado por escrito, anestesia asistida y citas reales de 60 minutos.',
  directora: {
    nombre: 'Dra. Irene Salcedo',
    cargo: 'Directora Clínica • Prostodoncia & Estética Dental',
    universidad: 'Universidad Nacional Autónoma de México (UNAM)',
    cedula: 'Céd. Prof. 1234567 (DGP Verificada)',
    cita: 'Mi trabajo no es que salgas con dientes nuevos: es que se te olvide taparte la boca al reír.',
    equipoNota: 'Equipo multidisciplinario de cinco especialistas: ortodoncia invisible, endodoncia microscópica, cirugía maxilofacial e higienista certificada.'
  },
  estadisticas: [
    { valor: '12', sufijo: '+', etiqueta: 'Años de práctica clínica' },
    { valor: '2,400', sufijo: '+', etiqueta: 'Tratamientos terminados' },
    { valor: '98', sufijo: '%', etiqueta: 'Pacientes nos recomiendan' },
    { valor: '100', sufijo: '%', etiqueta: 'Presupuesto cerrado sin sorpresas' }
  ]
};

export const WA_NUMBER = flagshipClinic.whatsapp;

export function getWhatsAppUrl(mensaje = 'Hola, vengo del sitio web de NÁCAR. Me gustaría agendar una valoración sin dolor.') {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}
