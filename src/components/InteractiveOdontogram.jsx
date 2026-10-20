import React, { useState } from 'react';
import { Clock, ShieldCheck, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/flagshipDemo';

const CLINICAL_ZONES = [
  {
    id: 'incisivos',
    label: 'Dientes Anteriores',
    tag: 'Estética & Diseño',
    subtitulo: 'Incisivos Centrales y Laterales',
    tiempo: '45 - 60 min',
    confort: '100% Sin Dolor • Mockup previo en vivo',
    procedimiento: 'Diseño de Sonrisa & Carillas de Porcelana',
    explicacion:
      'Armonización de forma, proporción y luminosidad. Cada lámina de porcelana se estratifica a mano para imitar la translucidez natural del esmalte sin desgastar tu estructura dental.',
    materiales: 'Porcelana feldespática / Disilicato de litio VITA',
    anestesia: 'Anestesia tópica con sabor frutal. Cero agujas a la vista.'
  },
  {
    id: 'caninos',
    label: 'Caninos & Mordida',
    tag: 'Función & Desgaste',
    subtitulo: 'Guías Caninas y Desoclusión',
    tiempo: '30 - 45 min',
    confort: 'Procedimiento no invasivo',
    procedimiento: 'Reconstrucción de Guía Canina & Guarda Miorrelajante',
    explicacion:
      'Protección contra el bruxismo y rechinamiento nocturno. Restauramos las cúspides que guían la masticación para proteger el resto de tus dientes y la articulación mandibular.',
    materiales: 'Resina microhíbrida de alta resistencia al impacto',
    anestesia: 'No requiere anestesia invasiva.'
  },
  {
    id: 'premolares',
    label: 'Premolares',
    tag: 'Sensibilidad & Caries',
    subtitulo: 'Transición masticatoria',
    tiempo: '35 - 45 min',
    confort: 'Alivio inmediato de la sensibilidad',
    procedimiento: 'Resina Biomimética Estética',
    explicacion:
      'Eliminamos cavidades de caries o reemplazamos amalgamas oscuras antiguas por resina nanohíbrida del tono exacto de tu esmalte, sellada con luz LED de precisión.',
    materiales: 'Nanoresina biomimética sin bisfenol A (BPA Free)',
    anestesia: 'Cremita tópica frutal previa y bloqueo local suave.'
  },
  {
    id: 'molares',
    label: 'Molares Posteriores',
    tag: 'Fuerza & Endodoncia',
    subtitulo: 'Piezas de masticación pesada',
    tiempo: '50 - 60 min',
    confort: 'Alivio absoluto del dolor de raíz',
    procedimiento: 'Endodoncia Microscópica Suave & Corona Libre de Metal',
    explicacion:
      'Tratamiento de conductos suave asistido por microscopio dental para salvar la pieza natural. Se protege con una incrustación o corona de zirconio ultra resistente.',
    materiales: 'Zirconio translúcido / Cerámica pura libre de metal',
    anestesia: 'Anestesia computarizada asistida. Tú avisas con la mano para pausar.'
  },
  {
    id: 'juicio',
    label: 'Muelas del Juicio',
    tag: 'Cirugía Mínima Invasión',
    subtitulo: 'Terceros Molares',
    tiempo: '30 - 40 min',
    confort: 'Solo ligera presión, cero dolor',
    procedimiento: 'Extracción Guiada por Tomografía 3D',
    explicacion:
      'Planificación milimétrica previa mediante tomografía digital para evitar tocar nervios. Procedimiento rápido, cuidadoso y con protocolo de recuperación acelerada.',
    materiales: 'Sutura reabsorbible ultra fina',
    anestesia: 'Anestesia local profunda. Puedes escuchar tu música favorita.'
  },
  {
    id: 'periodonto',
    label: 'Encías & Periodonto',
    tag: 'Higiene Profunda',
    subtitulo: 'Soporte óseo y gingival',
    tiempo: '35 min',
    confort: 'Sensación fresca de agua tibia',
    procedimiento: 'Limpieza Ultrasónica Piezoeléctrica & Profilaxis',
    explicacion:
      'Remoción minuciosa de sarro subgingival y manchas de café/té mediante microvibraciones ultrasónicas y agua tibia, sin rayar ni maltratar el esmalte.',
    materiales: 'Pasta de pulido diamantada y flúor protector',
    anestesia: 'Procedimiento suave sin agujas.'
  }
];

export default function InteractiveOdontogram() {
  const [selectedId, setSelectedId] = useState('incisivos');
  const activeZone = CLINICAL_ZONES.find((z) => z.id === selectedId) || CLINICAL_ZONES[0];

  const waUrl = getWhatsAppUrl(
    `Hola NÁCAR, estuve explorando el odontograma interactivo y me interesa una valoración para: ${activeZone.label} (${activeZone.procedimiento}).`
  );

  return (
    <div className="space-y-8">
      {/* Selector de Zonas Clínicas */}
      <div className="flex flex-wrap gap-2 justify-center">
        {CLINICAL_ZONES.map((zone) => {
          const isSelected = selectedId === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedId(zone.id)}
              className={`px-4 py-2 text-xs font-sans font-medium tracking-wider uppercase transition-all border ${
                isSelected
                  ? 'bg-nacar-jade text-white border-nacar-jade shadow-nacar-sm'
                  : 'bg-white text-nacar-pizarra border-[#EAE5DC] hover:border-nacar-jade hover:text-nacar-tinta'
              }`}
            >
              {zone.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Arcada Anatómica Vectorial de Precisión (Visor Médico 3D Minimalista) */}
        <div className="lg:col-span-6 bg-[#F6F3EE] p-8 border border-[#EAE5DC] shadow-nacar-sm relative flex flex-col items-center justify-center">
          <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-nacar-pizarra mb-4">
            Arcada Dental Anatómica · Toque Táctil
          </p>

          <svg
            viewBox="0 0 360 260"
            className="w-full max-w-[340px] h-auto select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="archBackdrop" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#EAE5DC" stopOpacity="0.3" />
              </radialGradient>
            </defs>

            {/* Guía Anatómica en Arco */}
            <ellipse cx="180" cy="130" rx="140" ry="90" fill="url(#archBackdrop)" stroke="#EAE5DC" strokeWidth="1" strokeDasharray="4 4" />

            {/* 1. ZONA INCISIVOS (Frontales Centro Superior e Inferior) */}
            <g
              onClick={() => setSelectedId('incisivos')}
              className="cursor-pointer group"
            >
              {selectedId === 'incisivos' && (
                <rect x="150" y="32" width="60" height="26" rx="6" fill="#2E6B60" fillOpacity="0.15" stroke="#2E6B60" strokeWidth="1" />
              )}
              {/* Dientes Anteriores Superiores */}
              <rect x="156" y="36" width="10" height="18" rx="3" fill={selectedId === 'incisivos' ? '#2E6B60' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              <rect x="168" y="36" width="11" height="19" rx="3" fill={selectedId === 'incisivos' ? '#2E6B60' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              <rect x="181" y="36" width="11" height="19" rx="3" fill={selectedId === 'incisivos' ? '#2E6B60' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              <rect x="194" y="36" width="10" height="18" rx="3" fill={selectedId === 'incisivos' ? '#2E6B60' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
            </g>

            {/* 2. ZONA CANINOS (Laterales) */}
            <g
              onClick={() => setSelectedId('caninos')}
              className="cursor-pointer group"
            >
              {selectedId === 'caninos' && (
                <>
                  <circle cx="140" cy="52" r="14" fill="#A38E63" fillOpacity="0.2" stroke="#A38E63" strokeWidth="1" />
                  <circle cx="220" cy="52" r="14" fill="#A38E63" fillOpacity="0.2" stroke="#A38E63" strokeWidth="1" />
                </>
              )}
              <polygon points="135,60 145,60 140,44" fill={selectedId === 'caninos' ? '#A38E63' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              <polygon points="215,60 225,60 220,44" fill={selectedId === 'caninos' ? '#A38E63' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
            </g>

            {/* 3. ZONA PREMOLARES */}
            <g
              onClick={() => setSelectedId('premolares')}
              className="cursor-pointer group"
            >
              {selectedId === 'premolares' && (
                <>
                  <rect x="96" y="66" width="30" height="34" rx="4" fill="#2E6B60" fillOpacity="0.15" stroke="#2E6B60" strokeWidth="1" />
                  <rect x="234" y="66" width="30" height="34" rx="4" fill="#2E6B60" fillOpacity="0.15" stroke="#2E6B60" strokeWidth="1" />
                </>
              )}
              {/* Izquierda */}
              <rect x="102" y="70" width="11" height="13" rx="2" fill={selectedId === 'premolares' ? '#2E6B60' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              <rect x="115" y="76" width="11" height="13" rx="2" fill={selectedId === 'premolares' ? '#2E6B60' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              {/* Derecha */}
              <rect x="234" y="76" width="11" height="13" rx="2" fill={selectedId === 'premolares' ? '#2E6B60' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              <rect x="247" y="70" width="11" height="13" rx="2" fill={selectedId === 'premolares' ? '#2E6B60' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
            </g>

            {/* 4. ZONA MOLARES */}
            <g
              onClick={() => setSelectedId('molares')}
              className="cursor-pointer group"
            >
              {selectedId === 'molares' && (
                <>
                  <rect x="62" y="104" width="36" height="42" rx="4" fill="#A38E63" fillOpacity="0.2" stroke="#A38E63" strokeWidth="1" />
                  <rect x="262" y="104" width="36" height="42" rx="4" fill="#A38E63" fillOpacity="0.2" stroke="#A38E63" strokeWidth="1" />
                </>
              )}
              {/* Izquierda */}
              <rect x="68" y="108" width="14" height="16" rx="3" fill={selectedId === 'molares' ? '#A38E63' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              <rect x="84" y="118" width="14" height="16" rx="3" fill={selectedId === 'molares' ? '#A38E63' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              {/* Derecha */}
              <rect x="262" y="118" width="14" height="16" rx="3" fill={selectedId === 'molares' ? '#A38E63' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              <rect x="278" y="108" width="14" height="16" rx="3" fill={selectedId === 'molares' ? '#A38E63' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
            </g>

            {/* 5. ZONA MUELAS DEL JUICIO */}
            <g
              onClick={() => setSelectedId('juicio')}
              className="cursor-pointer group"
            >
              {selectedId === 'juicio' && (
                <>
                  <circle cx="58" cy="156" r="14" fill="#E11D48" fillOpacity="0.15" stroke="#E11D48" strokeWidth="1" />
                  <circle cx="302" cy="156" r="14" fill="#E11D48" fillOpacity="0.15" stroke="#E11D48" strokeWidth="1" />
                </>
              )}
              <rect x="50" y="148" width="16" height="16" rx="3" fill={selectedId === 'juicio' ? '#E11D48' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
              <rect x="294" y="148" width="16" height="16" rx="3" fill={selectedId === 'juicio' ? '#E11D48' : '#FFFFFF'} stroke="#1B1A18" strokeWidth="1.2" />
            </g>

            {/* 6. ZONA ENCÍAS / LÍNEA PERIODONTAL INFERIOR */}
            <g
              onClick={() => setSelectedId('periodonto')}
              className="cursor-pointer group"
            >
              <path
                d="M 80,185 Q 180,225 280,185"
                fill="none"
                stroke={selectedId === 'periodonto' ? '#2E6B60' : '#FDA4AF'}
                strokeWidth={selectedId === 'periodonto' ? '4' : '2'}
                strokeLinecap="round"
              />
            </g>
          </svg>

          <p className="text-[11px] font-sans text-nacar-pizarra mt-3 text-center">
            Pieza seleccionada: <strong className="text-nacar-tinta font-semibold">{activeZone.label}</strong>
          </p>
        </div>

        {/* Ficha Diagnóstica y Protocolo Clínico */}
        <div className="lg:col-span-6 bg-white p-8 border border-[#EAE5DC] shadow-nacar space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DC]">
            <div>
              <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-nacar-jade">
                {activeZone.tag}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-nacar-tinta mt-0.5">
                {activeZone.procedimiento}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F6F3EE] border border-[#EAE5DC] text-xs font-mono font-medium text-nacar-tinta">
              <Clock className="w-3.5 h-3.5 text-nacar-oro" />
              <span>{activeZone.tiempo}</span>
            </div>
          </div>

          <p className="font-sans text-sm text-nacar-pizarra leading-relaxed font-light">
            {activeZone.explicacion}
          </p>

          {/* Garantías Técnicas */}
          <div className="space-y-2.5 pt-2">
            <div className="p-3 bg-[#F6F3EE] border border-[#EAE5DC] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-nacar-jade shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-nacar-tinta">Protocolo de Confort</p>
                <p className="text-[11px] text-nacar-pizarra font-light">{activeZone.anestesia}</p>
              </div>
            </div>

            <div className="p-3 bg-[#F6F3EE] border border-[#EAE5DC] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-nacar-oro shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-nacar-tinta">Materiales Certificados</p>
                <p className="text-[11px] text-nacar-pizarra font-light">{activeZone.materiales}</p>
              </div>
            </div>
          </div>

          {/* Botón WhatsApp Directo para esta Pieza */}
          <div className="pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 bg-nacar-jade hover:bg-nacar-jade-hover text-nacar-porcelana font-sans font-semibold text-xs tracking-[0.16em] uppercase flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Cotizar esta pieza en WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
