import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { flagshipClinic } from '../data/flagshipDemo';

export default function FooterSection() {
  return (
    <footer className="bg-[#10201C] text-slate-400 py-16 border-t border-white/10 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Marca */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-col justify-center">
              <span className="font-sans font-semibold text-lg tracking-[0.32em] text-white uppercase leading-none">
                NÁCAR
              </span>
              <span className="font-sans text-[10px] font-medium tracking-[0.25em] text-nacar-jade-claro uppercase mt-1">
                Estudio Dental · Interlomas
              </span>
            </div>

            <p className="text-slate-400 font-light leading-relaxed max-w-md text-xs sm:text-sm">
              "{flagshipClinic.tagline}". Odontología de alta precisión, sin dolor, con escaneo 3D digital y presupuestos cerrados por escrito en Huixquilucan e Interlomas.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="inline-flex items-center gap-1 text-nacar-oro font-semibold">
                <Star className="w-3.5 h-3.5 fill-nacar-oro" />
                {flagshipClinic.rating} en Google Maps
              </span>
              <span>•</span>
              <span>{flagshipClinic.reviews} reseñas verificadas</span>
            </div>
          </div>

          {/* Navegación */}
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-white tracking-wider uppercase text-xs">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-light">
              <li><a href="#filosofia" className="hover:text-white transition-colors">01 · Filosofía</a></li>
              <li><a href="#recorrido" className="hover:text-white transition-colors">02 · El Recorrido</a></li>
              <li><a href="#metodo" className="hover:text-white transition-colors">03 · El Método</a></li>
              <li><a href="#especialidades" className="hover:text-white transition-colors">04 · Especialidades</a></li>
              <li><a href="#odontograma" className="hover:text-white transition-colors">05 · Odontograma 3D</a></li>
              <li><a href="#presupuesto" className="hover:text-white transition-colors">06 · Presupuesto</a></li>
              <li><a href="#pacientes" className="hover:text-white transition-colors">07 · Pacientes</a></li>
              <li><a href="#visita" className="hover:text-white transition-colors">08 · Visita</a></li>
            </ul>
          </div>

          {/* Contacto Directo */}
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-white tracking-wider uppercase text-xs">
              Contacto Directo
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-light">
              <li className="text-slate-300 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{flagshipClinic.direccion}</span>
              </li>
              <li>WhatsApp: <strong className="text-white font-mono">{flagshipClinic.telVisible}</strong></li>
              <li>Directora: {flagshipClinic.directora.nombre}</li>
              <li className="pt-2 text-[11px] text-nacar-oro">{flagshipClinic.referencias}</li>
            </ul>
          </div>
        </div>

        {/* Separador y Créditos ASCK Software */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-center md:text-left text-[11px]">
          <div>
            <p className="text-slate-400">
              © {new Date().getFullYear()} NÁCAR · Estudio Dental de Precisión.
            </p>
            <p className="mt-1 text-slate-500 font-light max-w-xl">
              Sitio de demostración comercial desarrollado por <strong>ASCK Software</strong>. NÁCAR es una clínica de exhibición comercial: nombres, cifras y credenciales corresponden al estándar de producto tecnológico ASCK.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="https://dental.asck.tech/admin" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 rounded text-emerald-300 hover:text-emerald-200 transition-colors inline-flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Portal Clínico (Dentalprinter) ↗</span>
            </a>
            <a href="#inicio" className="text-nacar-jade-claro hover:text-white transition-colors">Subir al Inicio ↑</a>
            <span>•</span>
            <a href="mailto:asck7986@gmail.com" className="hover:text-white transition-colors">Contacto ASCK</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
