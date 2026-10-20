import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getWhatsAppUrl } from '../data/flagshipDemo';

const METHOD_STEPS = [
  {
    step: '01',
    minute: '00 — 10 min',
    title: 'Te escuchamos',
    tag: 'Sin Instrumental a la Vista',
    copy: 'Antes de abrir la boca, hablamos en el escritorio. Qué te duele, qué te da miedo, qué esperas lograr o qué malas experiencias viviste en el pasado. Tu tranquilidad es el primer paso diagnóstico.',
    stat: '10 minutos dedicados a escucharte'
  },
  {
    step: '02',
    minute: '10 — 25 min',
    title: 'Escaneo 3D sin pastas',
    tag: 'Tecnología Intraoral Digital',
    copy: 'Tu boca completa digitalizada en pantalla en minutos. Nada de pastas frías que provocan náuseas ni arcadas. Modelo digital tridimensional de alta definición con radiografía panorámica de baja radiación.',
    stat: 'Cero náuseas • Modelo tridimensional'
  },
  {
    step: '03',
    minute: '25 — 40 min',
    title: 'El plan, contigo en pantalla',
    tag: 'Tú Tienes el Control',
    copy: 'Ves exactamente lo que vemos los especialistas: cada pieza dental, cada opción viable, en qué orden y por qué. Preguntas todo con absoluta libertad. Decides tú, sin ninguna presión comercial.',
    stat: 'Explicación médica visual y transparente'
  },
  {
    step: '04',
    minute: '40 — 45 min',
    title: 'Precio cerrado y fechas',
    tag: 'Sin Sorpresas',
    copy: 'Sales con tu plan por escrito en mano: tratamientos, sesiones requeridas, costo total garantizado y alternativas de pago. Ese número no se modifica a mitad del camino.',
    stat: 'Presupuesto garantizado por escrito'
  }
];

export default function MethodSection() {
  const targetRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  });

  // Trazado del arco dental guiado por scroll (0% a 100%)
  const arcLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      // 4 pasos distribuidos homogéneamente en [0, 1]
      const step = Math.min(3, Math.max(0, Math.floor(v * 4)));
      setActiveStep(step);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const waUrl = getWhatsAppUrl(
    'Hola NÁCAR, me gustaría agendar mi primera cita de 45 minutos con escaneo 3D.'
  );

  return (
    <section
      id="metodo"
      ref={targetRef}
      className="relative h-[340vh] bg-[#10201C] text-[#F6F3EE]"
    >
      {/* Contenedor Fijo Pinned en Pantalla */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-12 px-4 sm:px-8 lg:px-16">
        {/* Encabezado Superior */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-4 border-b border-white/10 z-20">
          <div className="flex items-center gap-3">
            <span className="font-serif text-nacar-oro text-xl font-bold">03</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade-claro uppercase">
              El Método · Tu Cita Minuto a Minuto
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-nacar-oro" />
            <span>45 minutos reales sin prisas</span>
          </div>
        </div>

        {/* Zona Central: Arco Dental Estratificado + Tarjeta Activa Pinned */}
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 my-auto z-10">
          {/* Lado Izquierdo: Visualizador de Arcos Dentales Animados por Scroll */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative">
            <svg
              viewBox="0 0 320 320"
              className="w-64 h-64 sm:w-80 sm:h-80 select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Círculo Guía Base */}
              <circle cx="160" cy="160" r="140" fill="none" stroke="#2E6B60" strokeOpacity="0.15" strokeWidth="1" />

              {/* Arco 1: Esmalte (Tinta) */}
              <motion.circle
                cx="160"
                cy="160"
                r="135"
                fill="none"
                stroke="#F6F3EE"
                strokeWidth="1.5"
                strokeDasharray="880"
                style={{ pathLength: arcLength }}
                className="origin-center -rotate-90"
              />

              {/* Arco 2: Dentina (Jade) */}
              <motion.circle
                cx="160"
                cy="160"
                r="115"
                fill="none"
                stroke="#8FC4B7"
                strokeWidth="2"
                strokeDasharray="720"
                style={{ pathLength: arcLength }}
                className="origin-center -rotate-90"
              />

              {/* Arco 3: Pulpa / Núcleo (Oro) */}
              <motion.circle
                cx="160"
                cy="160"
                r="95"
                fill="none"
                stroke="#A38E63"
                strokeWidth="2.5"
                strokeDasharray="600"
                style={{ pathLength: arcLength }}
                className="origin-center -rotate-90"
              />

              {/* Centro de Cronómetro Dinámico */}
              <text x="160" y="155" textAnchor="middle" fill="#FFFFFF" fontFamily="Cormorant Garamond" fontSize="38" fontWeight="300">
                {METHOD_STEPS[activeStep].minute.split('—')[1]?.trim() || "45'"}
              </text>
              <text x="160" y="180" textAnchor="middle" fill="#8FC4B7" fontFamily="Inter" fontSize="10" letterSpacing="3">
                PASO {activeStep + 1} / 04
              </text>
            </svg>

            <p className="font-mono text-xs text-slate-400 mt-2 text-center">
              Desplaza verticalmente: el tiempo avanza con tu scroll (Paso {activeStep + 1} de 4).
            </p>
          </div>

          {/* Lado Derecho: Tarjeta Activa Pinned */}
          <div className="w-full lg:w-1/2 relative min-h-[340px] flex items-center">
            {METHOD_STEPS.map((s, idx) => {
              const isVisible = activeStep === idx;
              return (
                <div
                  key={s.step}
                  className={`bg-white/10 backdrop-blur-md border border-white/20 p-8 sm:p-10 shadow-2xl w-full transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0 scale-100 block' : 'opacity-0 translate-y-8 scale-95 hidden'
                  }`}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <span className="font-mono text-xs font-semibold tracking-wider text-nacar-jade-claro">
                      {s.minute}
                    </span>
                    <span className="font-serif text-3xl font-bold text-nacar-oro">
                      Paso {s.step} / 04
                    </span>
                  </div>

                  <span className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-nacar-jade-claro mb-2 block">
                    {s.tag}
                  </span>

                  <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal mb-4">
                    {s.title}
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-slate-200 leading-relaxed font-light mb-6">
                    {s.copy}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{s.stat}</span>
                    <CheckCircle2 className="w-4 h-4 text-nacar-jade-claro" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cierre Inferior Pinned */}
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-300 font-sans z-20">
          <span>La valoración no tiene costo. Salir con un plan por escrito, tampoco.</span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-nacar-jade-claro hover:text-white font-semibold flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span>Agendar ahora por WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
