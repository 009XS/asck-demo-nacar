import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { getWhatsAppUrl } from '../data/flagshipDemo';

export default function SmileComparisonSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const waUrl = getWhatsAppUrl(
    'Hola NÁCAR, vi los casos clínicos de antes y después y me interesa una valoración estética.'
  );

  return (
    <section className="py-24 bg-[#EAE5DC]/40 border-b border-[#EAE5DC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="font-serif text-nacar-oro text-xl font-bold">★</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade uppercase">
              Evidencia Clínica en Vivo
            </span>
          </div>

          <h2 className="font-serif font-light text-3xl sm:text-5xl text-nacar-tinta tracking-tight leading-[1.15] mb-5">
            Lo natural no se impone:{' '}
            <span className="italic font-normal text-nacar-jade">
              se planea milimétricamente.
            </span>
          </h2>

          <p className="font-sans text-base text-nacar-pizarra leading-relaxed font-light">
            Arrastra el selector interactivo para apreciar la armonización dental mediante carillas de porcelana estratificadas y mock-up previo.
          </p>
        </div>

        {/* Visor Interactivo Before / After Slider */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            className="relative aspect-16/10 sm:aspect-21/10 bg-slate-900 overflow-hidden select-none cursor-ew-resize border border-[#EAE5DC] shadow-2xl"
          >
            {/* Imagen AFTER (Capa Completa de Fondo) */}
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=80"
              alt="Sonrisa Después del Tratamiento NÁCAR"
              className="absolute inset-0 w-full h-full object-cover object-center filter saturate-105"
            />
            <div className="absolute top-4 right-4 bg-nacar-petroleo/80 backdrop-blur-md px-3 py-1 border border-white/20 text-white font-sans text-xs tracking-wider uppercase">
              Después · Porcelana Estratificada
            </div>

            {/* Imagen BEFORE (Capa Recortada por el Slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1400&q=80"
                alt="Sonrisa Antes del Tratamiento"
                className="absolute inset-0 w-full h-full object-cover object-center filter grayscale contrast-125"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/20 text-slate-300 font-sans text-xs tracking-wider uppercase">
                Antes · Desgaste Dental
              </div>
            </div>

            {/* Barra Divisoria Interactiva */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-nacar-tinta shadow-xl flex items-center justify-center border border-slate-300">
                <ArrowLeftRight className="w-4 h-4 text-nacar-jade" />
              </div>
            </div>
          </div>

          <p className="font-mono text-xs text-nacar-pizarra text-center mt-4">
            ← Desliza hacia la izquierda o derecha para comparar →
          </p>
        </div>

        {/* Citas de Garantía Estética */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-5 border border-[#EAE5DC] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-nacar-jade shrink-0" />
            <span className="text-xs text-nacar-tinta font-medium">Mock-up en tu boca antes de tocar un diente</span>
          </div>
          <div className="bg-white p-5 border border-[#EAE5DC] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-nacar-jade shrink-0" />
            <span className="text-xs text-nacar-tinta font-medium">Guía de color VITA seleccionada a luz de día</span>
          </div>
          <div className="bg-white p-5 border border-[#EAE5DC] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-nacar-jade shrink-0" />
            <span className="text-xs text-nacar-tinta font-medium">Garantía por escrito en cerámicas dentales</span>
          </div>
        </div>
      </div>
    </section>
  );
}
