import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const PANELS = [
  {
    num: '01',
    etiqueta: 'La Materia',
    titulo: 'Capa por capa.',
    descripcion:
      'El nácar no se pinta: se forma con el tiempo. Una sonrisa de alta precisión, también. Porcelana estratificada artesanalmente con gradaciones de opacidad idénticas al diente humano.',
    imagen: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    detalle: 'Porcelana feldespática • Tono VITA a luz natural'
  },
  {
    num: '02',
    etiqueta: 'Diagnóstico 3D',
    titulo: 'Mirar antes de tocar.',
    descripcion:
      'Tu boca completa en alta definición en minutos. Cero pastas de impresión frías que provocan arcadas ni náuseas. Ves cada milímetro en la pantalla junto con la doctora.',
    imagen: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
    detalle: 'Escáner intraoral óptico • Precisión de 20 micras'
  },
  {
    num: '03',
    etiqueta: 'El Espacio',
    titulo: 'Un estudio que baja el pulso.',
    descripcion:
      'Luz natural filtrada por lino, piedra travertino y aromas sutiles. Diseñamos la clínica para desconectar la respuesta de estrés amigdalina antes de que empiece la cita.',
    imagen: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    detalle: 'Sala privada • Aislamiento acústico hospitalario'
  },
  {
    num: '04',
    etiqueta: 'Micro-Precisión',
    titulo: 'La diferencia vive en milímetros.',
    descripcion:
      'Ajustes marginales invisibles a simple vista. Trabajamos bajo microscopía y lupas de magnificación para preservar el 100% de tu esmalte sano.',
    imagen: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    detalle: 'Cirugía guiada por computadora • Cero dolor'
  }
];

export default function HorizontalScrollShowcase() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Movimiento horizontal suave con resortes físicos de alta fidelidad
  const rawX = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);
  const smoothX = useSpring(rawX, { stiffness: 90, damping: 25, restDelta: 0.001 });
  const progressPercent = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="recorrido"
      ref={containerRef}
      className="relative h-[360vh] bg-[#10201C] text-[#F6F3EE]"
    >
      {/* Contenedor Pinned en Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-10 px-4 sm:px-8 lg:px-16">
        {/* Barra Superior del Recorrido Pinned */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 z-20">
          <div className="flex items-center gap-3">
            <span className="font-serif text-nacar-oro text-xl font-bold">02</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade-claro uppercase">
              El Recorrido de la Materia
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span>Desplaza hacia abajo para deslizar la galería horizontal</span>
            <div className="w-28 h-1.5 bg-white/10 overflow-hidden rounded-full">
              <motion.div
                style={{ width: progressPercent }}
                className="h-full bg-gradient-to-r from-nacar-jade-claro to-nacar-oro"
              />
            </div>
          </div>
        </div>

        {/* Pista Horizontal Móvil Suave */}
        <div className="flex-1 flex items-center overflow-hidden my-auto">
          <motion.div
            style={{ x: smoothX }}
            className="flex gap-8 sm:gap-12 lg:gap-16 items-center will-change-transform"
          >
            {PANELS.map((p, idx) => (
              <div
                key={p.num}
                className="w-[85vw] sm:w-[65vw] lg:w-[48vw] max-w-[720px] shrink-0 bg-white/5 border border-white/15 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row gap-8 items-center backdrop-blur-md group hover:border-nacar-jade-claro/50 transition-colors"
              >
                {/* Imagen del Panel con micro-paralaje */}
                <div className="w-full md:w-1/2 aspect-4/3 sm:aspect-square overflow-hidden bg-slate-900 shrink-0 relative">
                  <img
                    src={p.imagen}
                    alt={p.titulo}
                    className="w-full h-full object-cover object-center filter saturate-90 brightness-95 transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono tracking-widest uppercase text-nacar-jade-claro bg-black/70 px-2 py-0.5 backdrop-blur-sm border border-white/10">
                    {p.num} / 04
                  </span>
                </div>

                {/* Contenido Editorial */}
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-nacar-jade-claro">
                      {p.etiqueta}
                    </span>
                    <span className="font-serif text-2xl text-nacar-oro font-bold">
                      {p.num}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
                    {p.titulo}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {p.descripcion}
                  </p>

                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[11px] font-mono text-nacar-oro">
                      {p.detalle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Guía Inferior de Scroll */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400 font-mono z-20">
          <span className="flex items-center gap-1.5 text-nacar-jade-claro">
            <Sparkles className="w-3.5 h-3.5" />
            NÁCAR · Estudio Dental de Precisión
          </span>
          <span className="hidden sm:inline">Continúa deslizando para entrar al Método minuto a minuto ↓</span>
        </div>
      </div>
    </section>
  );
}
