import React from 'react';
import { Star, MapPin, ShieldCheck, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

export default function NotebookHeader({
  clinic,
  activeTab,
  setActiveTab,
  onOpenLeadModal
}) {
  const tabs = [
    { id: 'odontograma', label: '1. Odontograma', icon: 'dentistry' },
    { id: 'tratamientos', label: '2. Tratamientos', icon: 'medical_services' },
    { id: 'presupuesto', label: '3. Cotizador', icon: 'receipt_long' },
    { id: 'cuidados', label: '4. Cuidados Post-Cita', icon: 'healing' }
  ];

  return (
    <header className="relative bg-white border-b border-slate-200/80">
      {/* Top Clinical Bar (Stitch Stepper Navigation) */}
      <div className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stitch-primary text-white flex items-center justify-center shadow-stitch-sm">
            <span className="material-symbols-outlined text-lg">dentistry</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-bold text-sm text-stitch-primary tracking-tight">
                {clinic.nombre}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>{clinic.zona}</span>
              <span>•</span>
              <span className="inline-flex items-center text-amber-600 font-medium">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
                {clinic.rating} ({clinic.reviews} reseñas)
              </span>
            </div>
          </div>
        </div>

        {/* Botón discreto para abrir el Selector de Clínicas ASCK (Alt + K) */}
        <button
          onClick={onOpenLeadModal}
          title="Selector de Prospectos ASCK (Alt + K)"
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Banner Stitch Dental Core */}
      <div className="stitch-hero-gradient px-4 pt-5 pb-4">
        {/* Badge de Verificación Médica */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-medium mb-2.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Odontología Certificada • Cero Miedo al Dentista</span>
        </div>

        <h1 className="font-headline font-bold text-2xl text-stitch-primary leading-snug mb-1.5">
          Atención dental honesta, <br />
          <span className="text-stitch-secondary highlight-mint">100% sin dolor</span> y directa en tu celular.
        </h1>

        <p className="text-xs text-slate-600 leading-relaxed max-w-sm mb-3">
          "{clinic.tagline}". Presupuestos transparentes sin sorpresas y seguimiento directo con el doctor por WhatsApp.
        </p>

        {/* Mini Garantías Clínicas */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/60 shadow-stitch-sm mb-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Anestesia tópica frutal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Tú pausas con la mano</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Cero agujas a la vista</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Citas puntuales</span>
          </div>
        </div>

        {/* Pestañas de Navegación Segmentada (Stitch Stepper Tabs) */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-stitch-primary text-white border-stitch-primary shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
