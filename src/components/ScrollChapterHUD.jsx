import React, { useState, useEffect } from 'react';

const CHAPTERS = [
  { id: 'inicio', num: '00', label: 'Inicio' },
  { id: 'filosofia', num: '01', label: 'Filosofía' },
  { id: 'recorrido', num: '02', label: 'El Recorrido' },
  { id: 'metodo', num: '03', label: 'El Método' },
  { id: 'especialidades', num: '04', label: 'Especialidades' },
  { id: 'odontograma', num: '05', label: 'Odontograma' },
  { id: 'presupuesto', num: '06', label: 'Presupuesto' },
  { id: 'pacientes', num: '07', label: 'Pacientes' },
  { id: 'visita', num: '08', label: 'Visita' }
];

export default function ScrollChapterHUD() {
  const [activeId, setActiveId] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(CHAPTERS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      aria-label="Indicador de capítulos de recorrido"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-2.5 select-none"
    >
      {CHAPTERS.map((ch) => {
        const isActive = activeId === ch.id;
        return (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            className="group flex items-center gap-2.5 py-1"
          >
            {/* Etiqueta expandible en hover o activa */}
            <span
              className={`font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                isActive
                  ? 'opacity-100 text-nacar-jade font-semibold translate-x-0'
                  : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-nacar-pizarra'
              }`}
            >
              {ch.num} · {ch.label}
            </span>

            {/* Píldora / Punto de estado */}
            <div
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-6 h-1.5 bg-nacar-jade shadow-sm'
                  : 'w-1.5 h-1.5 bg-[#A38E63]/40 group-hover:bg-[#A38E63]'
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
