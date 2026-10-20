import React, { useState } from 'react';
import { Check, MessageCircle, ArrowRight, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { flagshipClinic, getWhatsAppUrl } from '../data/flagshipDemo';

const PROCEDURES = [
  {
    id: 'valoracion',
    name: 'Valoración Completa con Escaneo Intraoral 3D',
    price: 0,
    priceLabel: 'Cortesía (Sin costo)',
    time: '45 min',
    desc: 'Escaneo digital, diagnóstico en pantalla y plan por escrito.'
  },
  {
    id: 'limpieza',
    name: 'Limpieza Ultrasónica Profunda y Profilaxis',
    price: 950,
    priceLabel: '$950 MXN',
    time: '35 min',
    desc: 'Remoción de sarro con agua tibia y pulido de esmalte.'
  },
  {
    id: 'resina',
    name: 'Resina Biomimética Estética de Alta Resistencia',
    price: 1400,
    priceLabel: '$1,400 MXN',
    time: '40 min',
    desc: 'Reconstrucción del tono exacto de tu diente sin metales.'
  },
  {
    id: 'blanqueamiento',
    name: 'Blanqueamiento Dental Láser en Consultorio',
    price: 3200,
    priceLabel: '$3,200 MXN',
    time: '60 min',
    desc: 'Aclara hasta 4 tonos sin provocar sensibilidad dental.'
  },
  {
    id: 'carilla',
    name: 'Carilla de Porcelana Estratificada a Mano',
    price: 5800,
    priceLabel: '$5,800 MXN',
    time: '60 min',
    desc: 'Porcelana feldespática con prueba estética mock-up en vivo.'
  },
  {
    id: 'alineadores',
    name: 'Ortodoncia Invisible (Alineadores Transparentes)',
    price: 1850,
    priceLabel: '$1,850 MXN/mes',
    time: 'Control 30 min',
    desc: 'Simulación 3D de resultados previa y guardas removibles.'
  },
  {
    id: 'juicio',
    name: 'Extracción Guiada de Muela del Juicio',
    price: 2800,
    priceLabel: '$2,800 MXN',
    time: '40 min',
    desc: 'Mínima invasión con tomografía previa. Cero dolor.'
  },
  {
    id: 'implante',
    name: 'Implante Dental con Cirugía Guiada 3D',
    price: 14500,
    priceLabel: '$14,500 MXN',
    time: '60 min',
    desc: 'Titanio grado médico y colocación milimétrica por tomografía.'
  }
];

export default function TransparentCalculator() {
  const [selectedIds, setSelectedIds] = useState(['valoracion', 'limpieza']);
  const [preferredTime, setPreferredTime] = useState('manana');
  const [patientName, setPatientName] = useState('');

  const toggleProcedure = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedIds.reduce((sum, id) => {
    const item = PROCEDURES.find((p) => p.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const selectedItemsNames = selectedIds
    .map((id) => PROCEDURES.find((p) => p.id === id)?.name)
    .filter(Boolean);

  const scheduleLabels = {
    manana: 'Mañana (9:00 - 13:00 hrs)',
    tarde: 'Tarde (14:00 - 19:00 hrs)',
    sabado: 'Sábado (9:00 - 14:00 hrs)'
  };

  const formattedMsg = `Hola NÁCAR, estuve armando mi presupuesto en su cotizador web:
${patientName ? `• Paciente: ${patientName}\n` : ''}• Tratamientos de interés:
${selectedItemsNames.map((name) => `  - ${name}`).join('\n')}
• Total estimado de referencia: $${totalPrice.toLocaleString('es-MX')} MXN
• Horario preferido para mi cita: ${scheduleLabels[preferredTime]}
¿Tienen disponibilidad esta semana?`;

  const waUrl = getWhatsAppUrl(formattedMsg);

  return (
    <div className="bg-white p-6 sm:p-10 border border-[#EAE5DC] shadow-nacar-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Columna Izquierda: Lista de Tratamientos con Checkboxes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
            <h4 className="font-serif text-xl sm:text-2xl text-nacar-tinta">
              Selecciona los tratamientos de tu interés
            </h4>
            <span className="text-xs font-sans text-nacar-pizarra">
              {selectedIds.length} elegidos
            </span>
          </div>

          <div className="space-y-2.5">
            {PROCEDURES.map((p) => {
              const isChecked = selectedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => toggleProcedure(p.id)}
                  className={`p-4 border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    isChecked
                      ? 'bg-[#F6F3EE] border-nacar-jade shadow-2xs'
                      : 'bg-white border-[#EAE5DC] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-none border mt-0.5 flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-nacar-jade border-nacar-jade text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="font-sans text-xs sm:text-sm font-semibold text-nacar-tinta">
                        {p.name}
                      </p>
                      <p className="font-sans text-[11px] text-nacar-pizarra font-light mt-0.5">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs sm:text-sm font-bold text-nacar-jade">
                      {p.priceLabel}
                    </span>
                    <span className="block text-[10px] text-nacar-pizarra font-mono">
                      ⏱️ {p.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Resumen de Cotización, Horario y WhatsApp */}
        <div className="lg:col-span-5 bg-[#F6F3EE] p-6 sm:p-8 border border-[#EAE5DC] flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#EAE5DC]">
              <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-nacar-jade">
                Resumen de Valoración
              </span>
              <h4 className="font-serif text-2xl text-nacar-tinta mt-0.5">
                Presupuesto Cerrado
              </h4>
            </div>

            {/* Input Nombre */}
            <div>
              <label className="block text-xs font-sans font-semibold text-nacar-tinta uppercase tracking-wider mb-2">
                Tu Nombre Completo (Opcional)
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Ej. Mariana González"
                className="w-full px-4 py-2.5 bg-white border border-[#EAE5DC] text-xs sm:text-sm text-nacar-tinta placeholder-slate-400 focus:outline-none focus:border-nacar-jade transition-colors"
              />
            </div>

            {/* Selector de Horario */}
            <div>
              <label className="block text-xs font-sans font-semibold text-nacar-tinta uppercase tracking-wider mb-2">
                Turno Preferido para tu Cita
              </label>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { id: 'manana', label: 'Mañana', sub: '9 - 13 h' },
                  { id: 'tarde', label: 'Tarde', sub: '14 - 19 h' },
                  { id: 'sabado', label: 'Sábado', sub: '9 - 14 h' }
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setPreferredTime(slot.id)}
                    className={`py-2 px-1 border transition-all ${
                      preferredTime === slot.id
                        ? 'bg-nacar-jade text-white border-nacar-jade font-semibold'
                        : 'bg-white text-nacar-pizarra border-[#EAE5DC] hover:border-slate-300'
                    }`}
                  >
                    <span className="block font-medium">{slot.label}</span>
                    <span className="text-[10px] opacity-75">{slot.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desglose de Totales & MSI */}
            <div className="pt-4 border-t border-[#EAE5DC] space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-sans text-nacar-pizarra">Total de Referencia:</span>
                <span className="font-serif text-3xl font-bold text-nacar-tinta">
                  ${totalPrice.toLocaleString('es-MX')}{' '}
                  <small className="text-xs font-sans font-normal text-nacar-pizarra">MXN</small>
                </span>
              </div>

              {totalPrice > 0 && (
                <div className="p-3 bg-white border border-[#EAE5DC] space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-nacar-jade">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Opciones a Meses Sin Intereses:</span>
                  </div>
                  <p className="text-nacar-pizarra text-[11px] font-light">
                    • 3 pagos de <strong>${Math.round(totalPrice / 3).toLocaleString('es-MX')} MXN</strong><br />
                    • 6 pagos de <strong>${Math.round(totalPrice / 6).toLocaleString('es-MX')} MXN</strong><br />
                    • 12 pagos de <strong>${Math.round(totalPrice / 12).toLocaleString('es-MX')} MXN</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botón WhatsApp Compilado */}
          <div className="space-y-3 pt-4 border-t border-[#EAE5DC]">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-nacar-jade hover:bg-nacar-jade-hover text-nacar-porcelana font-sans font-semibold text-xs tracking-[0.18em] uppercase flex items-center justify-center gap-2 shadow-nacar-jade hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Enviar Presupuesto al WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-nacar-pizarra">
              <ShieldCheck className="w-3.5 h-3.5 text-nacar-jade" />
              <span>El precio acordado se congela por escrito.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
