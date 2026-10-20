import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/flagshipDemo';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: '¿Duele la primera consulta de valoración?',
      a: 'Absolutamente no. Tu primera cita es 100% de diagnóstico visual y escaneo 3D digital. Platicamos en el escritorio antes de tocar cualquier instrumento, digitalizamos tu boca sin pastas molestas y analizamos tus alternativas en pantalla. No se realiza ningún procedimiento sin tu consentimiento previo.'
    },
    {
      q: '¿Qué pasa si me pongo nervioso o siento ansiedad en el sillón?',
      a: 'Tú tienes el control total en todo momento. Establecemos una señal con la mano: si sientes la menor molestia o simplemente deseas un descanso de dos minutos, levantas la mano y nos detenemos de inmediato. Además, aplicamos anestesia tópica previa con sabor frutal para que ni siquiera sientas la aplicación anestésica.'
    },
    {
      q: '¿Cómo garantizan que el precio no subirá a mitad del tratamiento?',
      a: 'Te entregamos un presupuesto cerrado por escrito desde tu primera visita. El costo total incluye todas las citas, fases y materiales certificados. Ese número no se modifica. Si clínicamente surge algo imprevisto, se detiene el tratamiento y se habla contigo de manera transparente antes de hacer nada.'
    },
    {
      q: '¿Aceptan seguros médicos o meses sin intereses?',
      a: 'Sí. Aceptamos todas las tarjetas de crédito y débito, transferencias bancarias y efectivo. Contamos con planes de 3, 6 y 12 Meses Sin Intereses con tarjetas participantes y ofrecemos facilidades de pago diferido por fases de tratamiento.'
    },
    {
      q: '¿Atienden urgencias dentales el mismo día?',
      a: 'Sí. Si tienes dolor agudo, sufriste un golpe, se fracturó una pieza o se te cayó una corona, escríbenos directamente por WhatsApp. Tenemos espacios prioritarios de guardia todos los días para atender urgencias en menos de dos horas.'
    }
  ];

  const waUrl = getWhatsAppUrl(
    'Hola NÁCAR, tengo una pregunta antes de agendar mi valoración.'
  );

  return (
    <section id="faq" className="py-24 bg-white border-b border-[#EAE5DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="max-w-2xl mb-16 text-center mx-auto">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="font-serif text-nacar-oro text-xl font-bold">09</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade uppercase">
              Preguntas Frecuentes
            </span>
          </div>

          <h2 className="font-serif font-light text-3xl sm:text-5xl text-nacar-tinta tracking-tight leading-[1.15] mb-5">
            Claridad total,{' '}
            <span className="italic font-normal text-nacar-jade">
              cero dudas antes de venir.
            </span>
          </h2>

          <p className="font-sans text-base text-nacar-pizarra leading-relaxed font-light">
            Respuestas médicas honestas para que tomes el control de tu salud dental con total tranquilidad.
          </p>
        </div>

        {/* Acordeón Editorial */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-[#EAE5DC] bg-[#F6F3EE]/50 transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif text-xl sm:text-2xl text-nacar-tinta font-normal">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border border-[#EAE5DC] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-nacar-jade text-white' : 'text-nacar-pizarra bg-white'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-nacar-pizarra leading-relaxed font-sans font-light border-t border-[#EAE5DC]/60">
                    <p className="pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Banner Pregunta Directa */}
        <div className="mt-12 p-8 bg-[#F6F3EE] border border-[#EAE5DC] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-serif text-2xl text-nacar-tinta">
              ¿Tienes una duda sobre tu caso particular?
            </h4>
            <p className="font-sans text-xs text-nacar-pizarra mt-1 font-light">
              Nuestro equipo médico te responde directamente por WhatsApp en menos de 15 minutos.
            </p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-nacar-jade hover:bg-nacar-jade-hover text-nacar-porcelana font-sans font-semibold text-xs tracking-wider uppercase shrink-0 transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hablar con el Equipo</span>
          </a>
        </div>
      </div>
    </section>
  );
}
