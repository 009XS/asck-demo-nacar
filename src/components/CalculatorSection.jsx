import React from 'react';
import TransparentCalculator from './TransparentCalculator';

export default function CalculatorSection() {
  return (
    <section id="presupuesto" className="py-24 bg-[#F6F3EE] border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="font-serif text-nacar-oro text-xl font-bold">05</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade uppercase">
              Presupuesto Transparente
            </span>
          </div>

          <h2 className="font-serif font-light text-3xl sm:text-5xl text-nacar-tinta tracking-tight leading-[1.15] mb-5">
            Calcula tu cita sin letra chica,{' '}
            <span className="italic font-normal text-nacar-jade">
              directo en tu celular.
            </span>
          </h2>

          <p className="font-sans text-base text-nacar-pizarra leading-relaxed font-light">
            Selecciona los procedimientos requeridos, simula tus pagos a meses sin intereses y envía tu resumen directamente al WhatsApp de NÁCAR para consultar disponibilidad de horarios.
          </p>
        </div>

        {/* Tarjeta del Cotizador */}
        <TransparentCalculator />
      </div>
    </section>
  );
}
