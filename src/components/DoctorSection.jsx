import React from 'react';
import { Award, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { flagshipClinic } from '../data/flagshipDemo';

export default function DoctorSection() {
  const { directora } = flagshipClinic;

  return (
    <section id="equipo" className="py-24 bg-white border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Fotografía de la Doctora Directora */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="border border-[#EAE5DC] bg-[#F6F3EE] shadow-nacar-lg overflow-hidden aspect-3/4">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                  alt={`Directora Clínica de ${flagshipClinic.nombre}`}
                  className="w-full h-full object-cover object-top filter saturate-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nacar-petroleo/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <p className="font-serif text-xl sm:text-2xl font-light">
                    {directora.nombre}
                  </p>
                  <p className="font-sans text-[11px] tracking-widest uppercase text-nacar-jade-claro mt-1">
                    {directora.cargo}
                  </p>
                </div>
              </div>

              {/* Badge flotante Cédula */}
              <div className="absolute -bottom-4 -right-4 bg-white p-3.5 border border-[#EAE5DC] shadow-nacar flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-nacar-jade" />
                <span className="text-[11px] font-mono text-nacar-tinta font-semibold">
                  {directora.cedula}
                </span>
              </div>
            </div>
          </div>

          {/* Biografía y Filosofía */}
          <div className="lg:col-span-7 space-y-7">
            <div className="flex items-center gap-3">
              <span className="font-serif text-nacar-oro text-xl font-bold">07</span>
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade uppercase">
                Quién te Atiende
              </span>
            </div>

            <h2 className="font-serif font-light text-3xl sm:text-5xl text-nacar-tinta tracking-tight leading-[1.15]">
              Manos especializadas,{' '}
              <span className="italic font-normal text-nacar-jade">
                trato humano y cero juicios.
              </span>
            </h2>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-nacar-tinta">
                {directora.nombre}
              </h3>
              <p className="font-sans text-xs font-semibold text-nacar-jade uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                {directora.universidad} · Especialidad en Prostodoncia
              </p>
            </div>

            <blockquote className="border-l-2 border-nacar-oro pl-5 py-1 italic font-serif text-xl sm:text-2xl text-nacar-tinta font-light leading-relaxed">
              "{directora.cita}"
            </blockquote>

            <p className="font-sans text-base text-nacar-pizarra leading-relaxed font-light">
              {directora.equipoNota}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-[#F6F3EE] border border-[#EAE5DC]">
                <p className="text-xs font-semibold text-nacar-tinta">Esterilización Hospitalaria</p>
                <p className="text-[11px] text-nacar-pizarra font-light mt-0.5">Autoclave Clase B</p>
              </div>
              <div className="p-4 bg-[#F6F3EE] border border-[#EAE5DC]">
                <p className="text-xs font-semibold text-nacar-tinta">Microscopía Clínica</p>
                <p className="text-[11px] text-nacar-pizarra font-light mt-0.5">Ajuste milimétrico</p>
              </div>
              <div className="p-4 bg-[#F6F3EE] border border-[#EAE5DC] col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-nacar-tinta">Presupuesto por Escrito</p>
                <p className="text-[11px] text-nacar-pizarra font-light mt-0.5">Sin cargos ocultos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
