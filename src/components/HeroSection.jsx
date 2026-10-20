import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, ShieldCheck, CheckCircle2, MessageCircle, ArrowDown, Sparkles } from 'lucide-react';
import { flagshipClinic, getWhatsAppUrl } from '../data/flagshipDemo';

export default function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const badgeY1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const badgeY2 = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  const waUrl = getWhatsAppUrl(
    'Hola NÁCAR, me interesa agendar una primera cita de valoración con escaneo 3D.'
  );

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#F6F3EE]"
    >
      {/* Velo Nácar Sutil (Gradiente radial hiper-tenue <8% opacidad) */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-teal-200/15 via-rose-200/10 to-amber-200/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div style={{ opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Columna Izquierda: Mensaje Editorial y Promesa Comercial */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Etiqueta de Marca */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE5DC]/80 border border-[#EAE5DC] text-nacar-jade text-[11px] font-sans font-semibold tracking-[0.2em] uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Estudio Dental de Precisión · Huixquilucan / Interlomas</span>
            </div>

            {/* Titular Editorial en Cormorant Garamond */}
            <h1 className="font-serif font-normal text-4xl sm:text-6xl lg:text-[4.25rem] text-nacar-tinta tracking-tight leading-[1.08]">
              El nácar no se pinta:{' '}
              <span className="italic font-light text-nacar-jade block sm:inline">
                se forma capa por capa.
              </span>{' '}
              Una sonrisa bien hecha, también.
            </h1>

            {/* Subtítulo Clínico */}
            <p className="font-sans text-base sm:text-lg text-nacar-pizarra leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
              Eliminamos el miedo al dentista con odontología empática: presupuestos cerrados por escrito antes
              de empezar, escaneo intraoral 3D sin pastas molestas y citas reales de 60 minutos sin prisas.
            </p>

            {/* Tres Garantías Innegociables */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="bg-white/80 border border-[#EAE5DC] p-3 rounded-none shadow-nacar-sm hover:border-nacar-jade transition-colors">
                <span className="text-nacar-oro font-serif text-lg font-bold block">01</span>
                <p className="text-xs font-semibold text-nacar-tinta mt-0.5">Sin dolor</p>
                <p className="text-[11px] text-nacar-pizarra mt-0.5">Anestesia tópica asistida y control total.</p>
              </div>
              <div className="bg-white/80 border border-[#EAE5DC] p-3 rounded-none shadow-nacar-sm hover:border-nacar-jade transition-colors">
                <span className="text-nacar-oro font-serif text-lg font-bold block">02</span>
                <p className="text-xs font-semibold text-nacar-tinta mt-0.5">Sin sorpresas</p>
                <p className="text-[11px] text-nacar-pizarra mt-0.5">Precio cerrado por escrito desde el día 1.</p>
              </div>
              <div className="bg-white/80 border border-[#EAE5DC] p-3 rounded-none shadow-nacar-sm hover:border-nacar-jade transition-colors">
                <span className="text-nacar-oro font-serif text-lg font-bold block">03</span>
                <p className="text-xs font-semibold text-nacar-tinta mt-0.5">Sin prisa</p>
                <p className="text-[11px] text-nacar-pizarra mt-0.5">Sesiones completas de 45 a 60 minutos.</p>
              </div>
            </div>

            {/* Botones de Conversión */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-none bg-nacar-jade hover:bg-nacar-jade-hover text-nacar-porcelana font-sans font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase flex items-center justify-center gap-2.5 shadow-nacar-jade hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Agendar Valoración por WhatsApp</span>
              </a>

              <a
                href="#recorrido"
                className="w-full sm:w-auto px-7 py-4 rounded-none bg-white hover:bg-[#EAE5DC]/50 text-nacar-tinta font-sans font-semibold text-xs sm:text-sm tracking-[0.14em] uppercase border border-[#EAE5DC] shadow-nacar-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Iniciar Recorrido Inmersivo</span>
                <ArrowDown className="w-3.5 h-3.5 text-nacar-oro" />
              </a>
            </div>

            {/* Micro Social Proof Verificado */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 text-xs text-nacar-pizarra">
              <div className="flex text-nacar-oro">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-nacar-oro" />
                ))}
              </div>
              <span>
                <strong>{flagshipClinic.rating} en Google Maps</strong> ({flagshipClinic.reviews} reseñas verificadas en {flagshipClinic.zona})
              </span>
            </div>
          </div>

          {/* Columna Derecha: Imagen Clínica Editorial con Badges en Paralaje */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Marco Fotográfico de Lujo */}
              <div className="relative overflow-hidden border border-[#EAE5DC] bg-white shadow-nacar-lg aspect-4/5">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
                  alt="Instalaciones del Estudio Dental NÁCAR"
                  className="w-full h-full object-cover object-center filter saturate-[0.95] contrast-[1.03]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nacar-petroleo/50 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-nacar-jade-claro">
                    Estudio Interlomas
                  </p>
                  <p className="font-serif text-xl sm:text-2xl font-light text-white mt-0.5">
                    Un espacio diseñado para bajar el pulso.
                  </p>
                </div>
              </div>

              {/* Badge Flotante 1: Pacientes y Años (Paralaje) */}
              <motion.div
                style={{ y: badgeY1 }}
                className="absolute -bottom-5 -left-4 sm:-left-6 bg-white p-4 shadow-nacar border border-[#EAE5DC] flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-nacar-porcelana flex items-center justify-center text-nacar-jade">
                  <span className="material-symbols-outlined text-2xl">dentistry</span>
                </div>
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-nacar-pizarra">Experiencia</p>
                  <p className="font-serif text-lg font-bold text-nacar-tinta">+2,400 Tratamientos</p>
                </div>
              </motion.div>

              {/* Badge Flotante 2: Garantía Sin Dolor (Paralaje opuesto) */}
              <motion.div
                style={{ y: badgeY2 }}
                className="absolute -top-4 -right-3 bg-white/95 backdrop-blur-md px-4 py-2 border border-[#EAE5DC] shadow-nacar-sm flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-nacar-oro" />
                <span className="text-[11px] font-sans font-semibold tracking-wider uppercase text-nacar-tinta">
                  100% Sin Dolor
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
