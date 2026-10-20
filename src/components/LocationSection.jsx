import React from 'react';
import { MapPin, Clock, Navigation, Car, Accessibility, MessageCircle } from 'lucide-react';
import { flagshipClinic, getWhatsAppUrl } from '../data/flagshipDemo';

export default function LocationSection() {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${flagshipClinic.nombre} ${flagshipClinic.direccion}`
  )}`;

  const waUrl = getWhatsAppUrl(
    'Hola NÁCAR, me gustaría recibir la ubicación por WhatsApp para llegar al consultorio.'
  );

  return (
    <section id="visita" className="py-24 bg-[#EAE5DC]/30 border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif text-nacar-oro text-xl font-bold">08</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade uppercase">
              La Visita
            </span>
          </div>

          <h2 className="font-serif font-light text-3xl sm:text-5xl text-nacar-tinta tracking-tight leading-[1.15] mb-5">
            Más fácil llegar que{' '}
            <span className="italic font-normal text-nacar-jade">
              posponerlo otro año.
            </span>
          </h2>

          <p className="font-sans text-base text-nacar-pizarra leading-relaxed font-light">
            Instalaciones privadas en Interlomas, diseñadas para brindarte confort, silencio y atención puntual.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Tarjeta de Dirección & Horarios */}
          <div className="lg:col-span-6 bg-white p-8 sm:p-10 border border-[#EAE5DC] shadow-nacar-sm flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#F6F3EE] flex items-center justify-center text-nacar-jade shrink-0 border border-[#EAE5DC]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-nacar-tinta">
                    {flagshipClinic.nombre} · Estudio Dental
                  </h3>
                  <p className="font-sans text-sm text-nacar-pizarra font-light mt-1">
                    {flagshipClinic.direccion}
                  </p>
                  <p className="font-sans text-xs text-nacar-oro font-medium mt-1">
                    {flagshipClinic.referencias}
                  </p>
                </div>
              </div>

              {/* Horarios */}
              <div className="pt-6 border-t border-[#EAE5DC] space-y-2.5">
                <div className="flex justify-between text-xs sm:text-sm text-nacar-tinta">
                  <span className="text-nacar-pizarra font-light">Lunes a viernes:</span>
                  <strong className="font-mono">9:00 — 20:00 hrs</strong>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-nacar-tinta">
                  <span className="text-nacar-pizarra font-light">Sábados:</span>
                  <strong className="font-mono">9:00 — 14:00 hrs</strong>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-rose-700 font-semibold">
                  <span>Urgencias Dentales:</span>
                  <span>Mismo día por WhatsApp</span>
                </div>
              </div>

              {/* Comodidades */}
              <div className="pt-4 border-t border-[#EAE5DC] grid grid-cols-2 gap-3 text-xs text-nacar-pizarra">
                <div className="flex items-center gap-2 p-2.5 bg-[#F6F3EE] border border-[#EAE5DC]">
                  <Car className="w-4 h-4 text-nacar-jade" />
                  <span>Valet parking sin costo</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-[#F6F3EE] border border-[#EAE5DC]">
                  <Accessibility className="w-4 h-4 text-nacar-jade" />
                  <span>Acceso con elevador</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="pt-6 border-t border-[#EAE5DC] flex flex-col sm:flex-row gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 bg-nacar-jade hover:bg-nacar-jade-hover text-nacar-porcelana font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Abrir en Google Maps</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 bg-white hover:bg-[#F6F3EE] border border-nacar-jade text-nacar-jade font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enviar Ubicación</span>
              </a>
            </div>
          </div>

          {/* Tarjeta Visual de Mapa Minimalista */}
          <div className="lg:col-span-6 bg-slate-900 border border-[#EAE5DC] shadow-nacar-sm relative min-h-[360px] flex items-center justify-center p-8 overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

            <div className="relative z-10 text-center p-8 bg-[#F6F3EE]/95 border border-[#EAE5DC] shadow-2xl max-w-sm mx-auto space-y-3">
              <div className="w-12 h-12 bg-nacar-jade/10 text-nacar-jade mx-auto flex items-center justify-center">
                <MapPin className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="font-serif text-2xl text-nacar-tinta">
                NÁCAR · Estudio Dental
              </h4>
              <p className="font-sans text-xs text-nacar-pizarra leading-relaxed">
                Blvd. Interlomas 88, Piso 3, Huixquilucan, EdoMex / Polanco
              </p>
              <div className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-nacar-jade text-white text-[11px] font-sans font-semibold tracking-wider uppercase"
                >
                  <span>Trazar Ruta GPS</span>
                  <Navigation className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
