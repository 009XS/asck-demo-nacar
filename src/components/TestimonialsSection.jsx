import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { flagshipClinic } from '../data/flagshipDemo';

export default function TestimonialsSection() {
  const testimonials = [
    {
      nombre: 'Mariana G., 34 años',
      tratamiento: 'Carillas de Porcelana',
      cita: 'Llegué con pánico literal al ruido de la fresa por una mala experiencia en mi adolescencia. Me explicaron cada paso antes de hacerlo y por primera vez en mi vida terminé una cita sin taquicardia.',
      rating: 5
    },
    {
      nombre: 'Rodrigo T., 51 años',
      tratamiento: 'Implantes Guiados 3D',
      cita: 'Dos implantes sin un solo día de dolor fuerte. Lo que más agradecí: el precio que me dieron el primer día por escrito fue exactamente el que pagué al final, sin cargos sorpresa.',
      rating: 5
    },
    {
      nombre: 'Paola V., 42 años',
      tratamiento: 'Ortodoncia Invisible',
      cita: 'Mi hija usó los alineadores catorce meses. En cada visita le enseñaban su avance en pantalla; nunca hubo un "ya casi" sin evidencia. El seguimiento por WhatsApp fue impecable.',
      rating: 5
    }
  ];

  return (
    <section id="pacientes" className="py-24 bg-[#F6F3EE] border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif text-nacar-oro text-xl font-bold">06</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade uppercase">
              Pacientes NÁCAR
            </span>
          </div>

          <h2 className="font-serif font-light text-3xl sm:text-5xl text-nacar-tinta tracking-tight leading-[1.15] mb-5">
            Lo difícil no es que vengas.{' '}
            <span className="italic font-normal text-nacar-jade">
              Es que dejes de temerle al dentista.
            </span>
          </h2>

          <p className="font-sans text-base text-nacar-pizarra leading-relaxed font-light">
            Historias reales de personas en Interlomas y Polanco que recuperaron la libertad de sonreír sin pena ni dolor.
          </p>

          {/* Badge Rating Google Maps */}
          <div className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-[#EAE5DC] shadow-nacar-sm">
            <div className="flex text-nacar-oro">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-nacar-oro" />
              ))}
            </div>
            <span className="font-serif font-bold text-base text-nacar-tinta">
              {flagshipClinic.rating} / 5.0
            </span>
            <span className="text-[#EAE5DC]">|</span>
            <span className="text-xs font-sans text-nacar-pizarra">
              {flagshipClinic.reviews} reseñas verificadas en Google Maps
            </span>
          </div>
        </div>

        {/* 3 Cifras de Impacto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {flagshipClinic.estadisticas.map((st, i) => (
            <div key={i} className="bg-white p-6 border border-[#EAE5DC] shadow-nacar-sm text-center">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-nacar-jade">
                {st.valor}{st.sufijo}
              </p>
              <p className="font-sans text-xs text-nacar-pizarra font-light mt-1">
                {st.etiqueta}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonios Editoriales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <article
              key={idx}
              className="bg-white p-8 border border-[#EAE5DC] shadow-nacar-sm flex flex-col justify-between group hover:shadow-nacar transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAE5DC]">
                  <div className="flex text-nacar-oro">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-nacar-oro" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold tracking-wider uppercase text-nacar-jade bg-nacar-jade-suave px-2 py-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Verificado
                  </span>
                </div>

                <p className="font-serif text-base text-nacar-tinta italic leading-relaxed mb-6 font-light">
                  "{t.cita}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE5DC]">
                <h4 className="font-sans font-semibold text-xs tracking-wider uppercase text-nacar-tinta">
                  {t.nombre}
                </h4>
                <p className="font-sans text-[11px] text-nacar-pizarra font-light">
                  Tratamiento: {t.tratamiento}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
