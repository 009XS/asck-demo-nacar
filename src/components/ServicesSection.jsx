import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '../data/flagshipDemo';

export default function ServicesSection() {
  const services = [
    {
      indice: '01',
      tag: 'Estética Dental',
      nombre: 'Diseño de Sonrisa y Carillas',
      texto:
        'Porcelana estratificada a mano, tono elegido con guía a luz natural y prueba física en tu boca (mock-up) antes de tocar un solo diente.',
      nota: 'Mock-up previo en vivo • Guía de color VITA',
      consulta: 'Quiero información sobre diseño de sonrisa y carillas de porcelana.'
    },
    {
      indice: '02',
      tag: 'Cirugía de Precisión',
      nombre: 'Implantes Dentales Guiados 3D',
      texto:
        'Cirugía guiada por tomografía digital: la posición exacta se planifica en computadora antes del procedimiento. Menos tiempo en sillón, mínima invasión y mejor cicatrización.',
      nota: 'Planeación 3D • Titanio grado médico',
      consulta: 'Me interesa información sobre implantes dentales con cirugía guiada 3D.'
    },
    {
      indice: '03',
      tag: 'Alineación Invisible',
      nombre: 'Ortodoncia Invisible',
      texto:
        'Alineadores transparentes en serie con avance monitoreado por escaneo digital. Puedes ver la simulación tridimensional de tu resultado final antes de iniciar.',
      nota: 'Simulación digital previa • Cero alambres metálicos',
      consulta: 'Quiero cotizar el tratamiento de ortodoncia invisible con alineadores.'
    },
    {
      indice: '04',
      tag: 'Salud Integral',
      nombre: 'Rehabilitación & Odontología General',
      texto:
        'Coronas libres de metal, resinas biomiméticas, endodoncia microscópica suave y limpieza ultrasónica profunda. La base biológica indispensable de una sonrisa sana.',
      nota: 'Resinas biomiméticas • Urgencias el mismo día',
      consulta: 'Necesito una consulta de odontología general / rehabilitación.'
    }
  ];

  return (
    <section id="especialidades" className="py-24 bg-[#F6F3EE] border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-serif text-nacar-oro text-xl font-bold">03</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-nacar-jade uppercase">
              Especialidades
            </span>
          </div>

          <h2 className="font-serif font-light text-3xl sm:text-5xl text-nacar-tinta tracking-tight leading-[1.15] mb-5">
            Cuatro maneras de devolverte la sonrisa,{' '}
            <span className="italic font-normal text-nacar-jade">
              capa por capa.
            </span>
          </h2>

          <p className="font-sans text-base text-nacar-pizarra leading-relaxed font-light">
            Tratamientos odontológicos avanzados respaldados por especialistas certificados y materiales biomiméticos de grado clínico internacional.
          </p>
        </div>

        {/* Filas Editoriales de Servicios */}
        <div className="divide-y divide-[#EAE5DC] border-y border-[#EAE5DC]">
          {services.map((s) => {
            const itemWaUrl = getWhatsAppUrl(s.consulta);
            return (
              <div
                key={s.indice}
                className="py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group hover:bg-white/60 transition-colors px-4 -mx-4"
              >
                {/* Número y Tag */}
                <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between lg:justify-center gap-2">
                  <span className="font-serif text-4xl lg:text-5xl text-nacar-oro/60 group-hover:text-nacar-jade transition-colors">
                    {s.indice}
                  </span>
                  <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-nacar-jade">
                    {s.tag}
                  </span>
                </div>

                {/* Nombre y Descripción */}
                <div className="lg:col-span-7 space-y-2">
                  <h3 className="font-serif text-2xl lg:text-3xl text-nacar-tinta">
                    {s.nombre}
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-nacar-pizarra leading-relaxed font-light">
                    {s.texto}
                  </p>
                  <p className="font-sans text-xs text-nacar-oro font-medium tracking-wide pt-1">
                    {s.nota}
                  </p>
                </div>

                {/* Acción Directa */}
                <div className="lg:col-span-3 flex lg:justify-end">
                  <a
                    href={itemWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-[0.16em] uppercase text-nacar-jade hover:text-nacar-jade-hover border-b border-nacar-jade pb-1 transition-all group-hover:gap-3"
                  >
                    <span>Consultar caso</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
