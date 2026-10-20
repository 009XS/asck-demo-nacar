import React from 'react';
import { Sparkles, Shield, Clock, FileCheck } from 'lucide-react';

export default function PhilosophySection() {
  const principles = [
    {
      num: '01',
      title: 'Sin dolor',
      subtitle: 'El miedo también se trata',
      text: 'Anestesia tópica con sabor frutal y anestesia asistida por computadora. Si en cualquier momento sientes molestia o tensión, levantas la mano y nos detenemos al segundo.',
      icon: 'healing'
    },
    {
      num: '02',
      title: 'Sin sorpresas',
      subtitle: 'Presupuesto cerrado por escrito',
      text: 'Recibes el desglose exacto antes de empezar. Ese costo total no cambia a mitad de camino. Si algo clínico imprevisto surge, se pausa el tratamiento y se discute contigo.',
      icon: 'verified'
    },
    {
      num: '03',
      title: 'Sin prisa',
      subtitle: 'Citas reales de 60 minutos',
      text: 'Tu boca no se atiende en los huecos apresurados que deja otro paciente. Cada sesión está agendada con tiempo holgado para trabajar con precisión milimétrica.',
      icon: 'schedule'
    }
  ];

  return (
    <section id="filosofia" className="py-24 bg-[#EAE5DC]/30 border-y border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera Editorial */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif text-nacar-oro text-xl font-bold">01</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade uppercase">
              Filosofía Clínica
            </span>
          </div>

          <h2 className="font-serif font-light text-3xl sm:text-5xl text-nacar-tinta tracking-tight leading-[1.15] mb-5">
            Por eso aquí nada se improvisa:{' '}
            <span className="italic font-normal text-nacar-jade">
              escuchar, medir, planear y tratar.
            </span>
          </h2>

          <p className="font-sans text-base text-nacar-pizarra leading-relaxed font-light">
            En ese orden estricto, sin saltarse ninguna capa. Eliminamos la incertidumbre que provoca ansiedad
            estableciendo reglas claras desde el primer saludo en el consultorio.
          </p>
        </div>

        {/* 3 Columnas Editoriales NÁCAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((p) => (
            <article
              key={p.num}
              className="bg-white p-8 sm:p-10 border border-[#EAE5DC] shadow-nacar-sm hover:shadow-nacar transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAE5DC]/80">
                  <span className="font-serif text-3xl font-bold text-nacar-oro group-hover:text-nacar-jade transition-colors">
                    {p.num}
                  </span>
                  <span className="material-symbols-outlined text-2xl text-nacar-jade">
                    {p.icon}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-normal text-nacar-tinta mb-1">
                  {p.title}
                </h3>

                <p className="font-sans text-xs font-semibold tracking-wider text-nacar-jade uppercase mb-4">
                  {p.subtitle}
                </p>

                <p className="font-sans text-sm text-nacar-pizarra leading-relaxed font-light">
                  {p.text}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#EAE5DC]/50 flex items-center gap-2 text-[11px] font-sans tracking-widest uppercase text-nacar-pizarra">
                <span className="w-1.5 h-1.5 rounded-full bg-nacar-jade" />
                <span>Norma clínica NÁCAR</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
