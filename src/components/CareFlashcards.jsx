import React, { useState } from 'react';
import { Check, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';

const INITIAL_CARE_ITEMS = [
  {
    id: 'hielo',
    title: 'Frío Local en Intervalos',
    instruction: 'Aplica una compresa fría sobre la mejilla por 10 a 15 minutos con pausas. Ayuda a desinflamar de forma natural.',
    tag: 'Primeras 12 horas',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  {
    id: 'dieta',
    title: 'Dieta Blanda y Fresca',
    instruction: 'Nieve de limón, puré de manzana, yogurt o gelatina fría. Evita alimentos calientes o muy condimentados hoy.',
    tag: 'Dieta 24 horas',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'popote',
    title: 'Cero Popotes o Succión',
    instruction: 'Bebe directamente del vaso. La fuerza de succión puede desalojar el coágulo protector que cicatriza la encía.',
    tag: 'Regla de Oro',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  {
    id: 'cepillado',
    title: 'Higiene Suave y Cuidadosa',
    instruction: 'Cepilla tus demás piezas normalmente y pasa despacio cerca de la zona intervenida sin aplicar presión.',
    tag: 'Higiene Diaria',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'almohada',
    title: 'Descanso con Cabeza Elevada',
    instruction: 'Coloca una doble almohada para descansar esta noche. La gravedad disminuye la sensación de pulsación.',
    tag: 'Esta Noche',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200'
  }
];

export default function CareFlashcards({ clinic }) {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="py-4">
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-stitch">
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono-ui font-semibold text-stitch-secondary uppercase tracking-wider">
              Protocolo de Recuperación
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {completedCount} de {INITIAL_CARE_ITEMS.length} cumplidos
            </span>
          </div>
          <h2 className="font-headline font-bold text-xl text-stitch-primary">
            Cuidados Post-Tratamiento
          </h2>
          <p className="text-xs text-slate-500">
            Sigue estos pasos sencillos en casa para una recuperación rápida y cómoda.
          </p>
        </div>

        <div className="space-y-2">
          {INITIAL_CARE_ITEMS.map((item) => {
            const isDone = !!checkedItems[item.id];

            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-headline font-semibold text-xs text-slate-900">
                      {item.title}
                    </span>
                    <span className={`text-[10px] font-mono-ui font-semibold px-2 py-0.2 rounded-full border ${item.badgeClass}`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {item.instruction}
                  </p>
                </div>

                <div className="shrink-0 mt-0.5">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'border-slate-300 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="text-[10px]">✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nota Médica Empática */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
          <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            En <strong>{clinic.nombre}</strong> damos seguimiento post-cita. Ante cualquier duda o síntoma inusual, escribe de inmediato a nuestro WhatsApp médico.
          </p>
        </div>
      </div>
    </div>
  );
}
