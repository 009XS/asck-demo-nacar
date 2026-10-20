import React from 'react';
import { MessageCircle, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { flagshipClinic, getWhatsAppUrl } from '../data/flagshipDemo';

export default function CtaSection() {
  const waUrl = getWhatsAppUrl(
    'Hola NÁCAR, leí su sitio web completo y quiero dar el paso de agendar mi valoración sin dolor.'
  );

  return (
    <section className="py-28 sm:py-36 bg-[#10201C] text-[#F6F3EE] relative overflow-hidden">
      {/* Velo escénico de nácar sobre fondo oscuro */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-nacar-jade/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-nacar-oro/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-nacar-jade-claro text-[11px] font-sans font-semibold tracking-[0.25em] uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Atención Privada · Huixquilucan / Interlomas</span>
        </div>

        <h2 className="font-serif font-light text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Tu sonrisa lleva años{' '}
          <span className="italic font-normal text-nacar-jade-claro block sm:inline">
            esperando este mensaje.
          </span>
        </h2>

        <p className="font-sans text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
          Respondemos en menos de 15 minutos en horario de clínica. Sin compromiso: la valoración no tiene costo y el presupuesto te lo llevas por escrito.
        </p>

        {/* Botón Gigante */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-5 bg-nacar-jade hover:bg-nacar-jade-hover text-white font-sans font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-nacar-jade hover:scale-102 transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Escríbenos por WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Datos Clínicos de Respaldo */}
        <div className="pt-10 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-nacar-oro" />
            Atención Lunes a Sábado
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-nacar-oro" />
            Cédula DGP Verificada
          </span>
          <span>•</span>
          <span>WhatsApp directo: <strong>{flagshipClinic.telVisible}</strong></span>
        </div>
      </div>
    </section>
  );
}
