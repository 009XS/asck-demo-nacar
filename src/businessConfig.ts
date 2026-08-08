/**
 * TODO el contenido de la landing sale de aquí (patrón de demos ASCK).
 * NÁCAR es una clínica FICTICIA: nombres, cifras y reseñas son ilustrativos.
 * El único dato real es el WhatsApp/tel de ASCK, que es a donde debe llegar
 * la captación de la demo. Excepción deliberada: el copy del hero vive en
 * index.html porque es el LCP y debe pintar antes que cualquier JS.
 */

export const marca = {
  nombre: 'NÁCAR',
  giro: 'Estudio dental',
  zona: 'Interlomas',
  eslogan: 'La sonrisa que ya es tuya.',
}

export const whatsapp = {
  numero: '525514879836',
  mensaje: 'Hola, vengo del sitio de NÁCAR. Quiero agendar una valoración.',
  telVisible: '+52 55 1487 9836',
}

export const waUrl = () =>
  `https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(whatsapp.mensaje)}`

export const nav = {
  enlaces: [
    { href: '#metodo', texto: 'Método' },
    { href: '#servicios', texto: 'Servicios' },
    { href: '#pacientes', texto: 'Pacientes' },
    { href: '#visita', texto: 'Visita' },
  ],
}

export const manifiesto = {
  numero: '01',
  etiqueta: 'Filosofía',
  lead: 'El nácar no se pinta: se forma capa por capa. Una buena sonrisa, también.',
  cuerpo:
    'Por eso aquí nada se improvisa. Escuchamos, medimos, planeamos y hasta entonces tratamos — en ese orden, sin saltarse ninguna capa.',
  principios: [
    {
      titulo: 'Sin dolor',
      texto:
        'Anestesia asistida por computadora y sedación consciente para quien llega con miedo. El miedo también se trata.',
    },
    {
      titulo: 'Sin sorpresas',
      texto:
        'Presupuesto cerrado por escrito antes de empezar. Si algo cambia en el camino, se detiene el trabajo y se habla contigo.',
    },
    {
      titulo: 'Sin prisa',
      texto:
        'Citas reales de 60 minutos. Tu boca no se atiende en los huecos que deja otro paciente.',
    },
  ],
}

export const metodo = {
  numero: '02',
  etiqueta: 'El método',
  titulo: 'Tu primera cita, minuto a minuto.',
  intro: '45 minutos. Sin letra chica. Así es, exactamente:',
  duracionTotal: 45,
  pasos: [
    {
      desde: 0,
      hasta: 10,
      titulo: 'Te escuchamos',
      texto:
        'Antes de abrir la boca, hablamos. Qué te duele, qué te da miedo, qué esperas. La historia clínica empieza por la historia.',
    },
    {
      desde: 10,
      hasta: 25,
      titulo: 'Escaneo 3D, sin moldes',
      texto:
        'Escáner intraoral: tu boca completa en pantalla en minutos, sin pasta de impresión ni arcadas. Radiografía digital sólo si hace falta.',
    },
    {
      desde: 25,
      hasta: 40,
      titulo: 'El plan, contigo en pantalla',
      texto:
        'Ves lo que vemos: cada pieza, cada opción, en qué orden y por qué. Preguntas todo. Decides tú.',
    },
    {
      desde: 40,
      hasta: 45,
      titulo: 'Precio cerrado y fechas',
      texto:
        'Sales con tu plan por escrito: tratamientos, sesiones, costo total y forma de pago. Ese número no cambia a mitad del camino.',
    },
  ],
  cierre: 'La valoración no tiene costo. Salir con un plan, tampoco.',
  cta: 'Agendar mi valoración',
}

export const servicios = {
  numero: '03',
  etiqueta: 'Especialidades',
  titulo: 'Cuatro maneras de devolverte la sonrisa.',
  items: [
    {
      indice: '01',
      tag: 'Estética',
      nombre: 'Diseño de sonrisa y carillas',
      texto:
        'Porcelana estratificada a mano, tono elegido con guía a luz natural y prueba en tu boca antes de tocar un solo diente.',
      nota: 'Mock-up previo · guía de color VITA',
    },
    {
      indice: '02',
      tag: 'Cirugía',
      nombre: 'Implantes dentales',
      texto:
        'Cirugía guiada por computadora: la posición se planea en 3D antes de entrar a quirófano. Menos tiempo en sillón, mejor cicatrización.',
      nota: 'Planeación 3D · titanio grado médico',
    },
    {
      indice: '03',
      tag: 'Ortodoncia',
      nombre: 'Ortodoncia invisible',
      texto:
        'Alineadores en serie con avance monitoreado por escaneo. Ves la simulación de tu resultado antes de empezar.',
      nota: 'Simulación previa · control por escaneo',
    },
    {
      indice: '04',
      tag: 'General',
      nombre: 'Rehabilitación y odontología general',
      texto:
        'Coronas, endodoncia, limpieza profunda y urgencias el mismo día. La base silenciosa de todo lo demás.',
      nota: 'Urgencias mismo día',
    },
  ],
}

export const pacientes = {
  numero: '04',
  etiqueta: 'Pacientes',
  titulo: 'Lo difícil no es que vengas. Es que dejes de temerle al dentista.',
  resumen: { calificacion: '4.9', reseñas: '187 reseñas' },
  cifras: [
    { valor: 12, sufijo: '', unidad: 'años de práctica' },
    { valor: 2400, sufijo: '+', unidad: 'tratamientos terminados' },
    { valor: 98, sufijo: '%', unidad: 'de pacientes nos recomienda' },
  ],
  testimonios: [
    {
      cita: 'Llegué con pánico literal al ruido de la fresa. Me explicaron cada paso antes de hacerlo y por primera vez terminé una cita sin taquicardia.',
      nombre: 'Mariana G., 34',
      tratamiento: 'Carillas de porcelana',
    },
    {
      cita: 'Dos implantes sin un solo día de dolor fuerte. Lo que más agradecí: el precio que me dieron el primer día fue el que pagué al final.',
      nombre: 'Rodrigo T., 51',
      tratamiento: 'Implantes',
    },
    {
      cita: 'Mi hija usó los alineadores catorce meses. En cada visita le enseñaban su avance en pantalla; nunca hubo un «ya casi» sin evidencia.',
      nombre: 'Paola V., 42',
      tratamiento: 'Ortodoncia invisible',
    },
  ],
}

export const equipo = {
  numero: '05',
  etiqueta: 'Quién te atiende',
  nombre: 'Dra. Irene Salcedo',
  cargo: 'Directora clínica · Prostodoncia y estética dental',
  credenciales: 'Cirujana dentista (UNAM) · Especialidad en prostodoncia · Céd. prof. 1234567 (demo)',
  cita: 'Mi trabajo no es que salgas con dientes nuevos: es que se te olvide taparte la boca al reír.',
  equipoNota:
    'Detrás de cada caso hay un equipo de cinco: ortodoncista, endodoncista, cirujano maxilofacial e higienista certificada.',
}

export const visita = {
  numero: '06',
  etiqueta: 'La visita',
  titulo: 'Más fácil llegar que posponerlo.',
  direccion: 'Blvd. Interlomas 88, piso 3',
  ciudad: 'Huixquilucan, Estado de México',
  referencias: 'Estacionamiento con valet sin costo · acceso con elevador',
  horario: [
    { dias: 'Lunes a viernes', horas: '9:00 – 20:00' },
    { dias: 'Sábado', horas: '9:00 – 14:00' },
    { dias: 'Urgencias', horas: 'mismo día, por WhatsApp' },
  ],
}

export const cierre = {
  titulo: 'Tu sonrisa lleva años esperando este mensaje.',
  texto: 'Respondemos en menos de 15 minutos en horario de clínica. Sin compromiso: la valoración no tiene costo.',
  cta: 'Escríbenos por WhatsApp',
}

export const footer = {
  credito: 'Sitio de demostración desarrollado por ASCK Software — Tecnología que funciona para tu negocio.',
  disclaimer:
    'NÁCAR es una clínica ficticia creada como demo comercial: nombres, cifras, reseñas y credenciales son ilustrativos y no corresponden a un negocio real.',
  contactoDemo: 'asck7986@gmail.com',
  anio: '2026',
}
