import React from 'react';
import CareFlashcards from './CareFlashcards';

export default function CareSection({ clinic }) {
  return (
    <section id="cuidados" className="py-20 bg-gradient-to-b from-white to-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono-ui font-semibold uppercase tracking-wider mb-3">
            <span>10 — Cuidados Post-Tratamiento</span>
          </div>
          <h2 className="font-headline font-bold text-3xl sm:text-4xl text-stitch-primary tracking-tight mb-4">
            Mi receta en <span className="text-stitch-secondary">tarjetas interactivas.</span>
          </h2>
          <p className="font-body text-slate-600 text-base leading-relaxed">
            Consejos de recuperación claros, empáticos y fáciles de consultar desde tu celular después de tu visita a {clinic.nombre}:
          </p>
        </div>

        {/* Tarjetas Flashcards */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-stitch">
          <CareFlashcards clinic={clinic} />
        </div>
      </div>
    </section>
  );
}
