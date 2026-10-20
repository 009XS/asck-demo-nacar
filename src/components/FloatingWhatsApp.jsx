import React from 'react';
import { MessageCircle, Home, Layers, Sparkles, Receipt, MapPin } from 'lucide-react';
import { flagshipClinic, getWhatsAppUrl } from '../data/flagshipDemo';

export default function FloatingWhatsApp() {
  const waUrl = getWhatsAppUrl(
    'Hola NÁCAR, estuve revisando su sitio web y me gustaría hablar con una especialista para agendar valoración.'
  );

  return (
    <>
      {/* Botón Flotante de WhatsApp para Desktop */}
      <aside aria-label="Contacto flotante" className="fixed bottom-6 right-6 z-40 hidden md:block group">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans font-semibold text-xs tracking-wider uppercase shadow-2xl hover:scale-105 transition-all duration-300"
        >
          {/* Pulso Verde En Línea */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
          </span>

          <MessageCircle className="w-5 h-5 fill-white/20 shrink-0" />
          <div className="text-left">
            <span className="block text-[10px] font-normal leading-tight opacity-90">Especialista en línea</span>
            <span className="block text-xs font-bold leading-tight">WhatsApp NÁCAR</span>
          </div>
        </a>
      </aside>

      {/* Barra de Navegación Móvil Inferior Táctil (< 768px) */}
      <nav
        aria-label="Navegación móvil inferior"
        className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-[#F6F3EE]/95 backdrop-blur-md border-t border-[#EAE5DC] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-2 flex items-center justify-around text-[10px] font-sans font-medium text-nacar-pizarra"
      >
        <a
          href="#inicio"
          className="flex flex-col items-center gap-1 py-1 px-2 text-nacar-pizarra hover:text-nacar-jade"
        >
          <Home className="w-4 h-4" />
          <span>Inicio</span>
        </a>

        <a
          href="#recorrido"
          className="flex flex-col items-center gap-1 py-1 px-2 text-nacar-pizarra hover:text-nacar-jade"
        >
          <Layers className="w-4 h-4" />
          <span>Recorrido</span>
        </a>

        <a
          href="#odontograma"
          className="flex flex-col items-center gap-1 py-1 px-2 text-nacar-jade font-semibold"
        >
          <Sparkles className="w-4 h-4 text-nacar-jade animate-pulse" />
          <span>Odontograma</span>
        </a>

        <a
          href="#presupuesto"
          className="flex flex-col items-center gap-1 py-1 px-2 text-nacar-pizarra hover:text-nacar-jade"
        >
          <Receipt className="w-4 h-4" />
          <span>Cotizar</span>
        </a>

        {/* WhatsApp CTA Móvil */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white font-bold rounded-full shadow-sm text-xs"
        >
          <MessageCircle className="w-4 h-4 fill-white/20" />
          <span>WhatsApp</span>
        </a>
      </nav>
    </>
  );
}
