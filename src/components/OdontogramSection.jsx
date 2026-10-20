import React from 'react';
import InteractiveOdontogram from './InteractiveOdontogram';

export default function OdontogramSection() {
  return (
    <section id="odontograma" className="py-24 bg-[#EAE5DC]/30 border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="font-serif text-nacar-oro text-xl font-bold">04</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade uppercase">
              Diagnóstico Táctil
            </span>
          </div>

          <h2 className="font-serif font-light text-3xl sm:text-5xl text-nacar-tinta tracking-tight leading-[1.15] mb-5">
            ¿En qué zona sientes molestia o{' '}
            <span className="italic font-normal text-nacar-jade">
              deseas mejorar tu sonrisa?
            </span>
          </h2>

          <p className="font-sans text-base text-nacar-pizarra leading-relaxed font-light">
            Toca cualquier pieza o sector dental en el visor anatómico digital. Conoce de inmediato el
            procedimiento médico recomendado, el tiempo exacto en sillón y el protocolo de anestesia asistida sin dolor.
          </p>
        </div>

        {/* Visor Clínico */}
        <InteractiveOdontogram />
      </div>
    </section>
  );
}
