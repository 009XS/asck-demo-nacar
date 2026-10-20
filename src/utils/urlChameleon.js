import prospectosDentales from '../data/prospectosDentales.json';

/**
 * Obtiene la clínica activa a partir de los query parameters de la URL.
 * Soporta:
 * - ?id=slug (ej. ?id=leal-dental)
 * - ?p=slug (ej. ?p=sonrisa-integral)
 * - Parámetros directos: ?clinica=...&wa=...&reviews=...&zona=...&rating=...&esp=...
 */
export function getActiveClinicFromUrl() {
  if (typeof window === 'undefined') {
    return prospectosDentales[0];
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('id') || params.get('p') || params.get('c');

  // 1. Búsqueda por slug en la base auditada
  if (slug) {
    const found = prospectosDentales.find(
      (p) => p.id.toLowerCase() === slug.toLowerCase()
    );
    if (found) {
      updateDocumentMetadata(found);
      return found;
    }
  }

  // 2. Parámetros directos en la URL
  const clinicaParam = params.get('clinica') || params.get('nombre');
  if (clinicaParam) {
    const customClinic = {
      id: 'custom-' + encodeURIComponent(clinicaParam.toLowerCase().replace(/\s+/g, '-')),
      nombre: clinicaParam,
      whatsapp: params.get('wa') || params.get('tel') || '525540104450',
      rating: parseFloat(params.get('rating') || '4.9'),
      reviews: parseInt(params.get('reviews') || '120', 10),
      zona: params.get('zona') || 'Área Metropolitana',
      direccion: params.get('dir') || 'Zona Metropolitana CDMX / EdoMex',
      especialidadPrincipal: params.get('esp') || 'Odontología Integral & Estética',
      tipoModo: params.get('modo') === '3' ? 'MODO_3' : 'MODO_2',
      tagline: params.get('tagline') || 'Cuidado dental cálido, humano y 100% sin dolor',
      beneficioClave: 'Atención personalizada sin dolor y citas puntuales'
    };
    updateDocumentMetadata(customClinic);
    return customClinic;
  }

  // 3. Fallback por defecto: Leal Dental
  const defaultClinic = prospectosDentales[0];
  updateDocumentMetadata(defaultClinic);
  return defaultClinic;
}

/**
 * Actualiza el título del documento y meta tags
 */
export function updateDocumentMetadata(clinic) {
  if (typeof document === 'undefined') return;
  document.title = `${clinic.nombre} — Clínica Dental en ${clinic.zona} | Cero Miedo al Dentista`;
}

/**
 * Construye el enlace para compartir al doctor
 */
export function buildClinicShareUrl(clinicId) {
  if (typeof window === 'undefined') return `?id=${clinicId}`;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?id=${clinicId}`;
}

/**
 * Genera el enlace directo a WhatsApp con el mensaje codificado
 */
export function generateWhatsAppUrl(phoneNumber, message) {
  const cleanNumber = (phoneNumber || '525540104450').toString().replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
