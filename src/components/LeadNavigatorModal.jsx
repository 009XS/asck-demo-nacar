import React, { useState } from 'react';
import prospectosDentales from '../data/prospectosDentales.json';
import { buildClinicShareUrl } from '../utils/urlChameleon';
import {
  Search,
  Copy,
  Check,
  Star,
  MapPin,
  X,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';

export default function LeadNavigatorModal({
  isOpen,
  onClose,
  currentClinic,
  onSelectClinic
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const filteredClinics = prospectosDentales.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.zona.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.especialidadPrincipal.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'MODO_2') return c.tipoModo === 'MODO_2';
    if (activeFilter === 'MODO_3') return c.tipoModo === 'MODO_3';
    return true;
  });

  const handleCopyLink = (clinicId) => {
    const url = buildClinicShareUrl(clinicId);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedId(clinicId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const modo2Count = prospectosDentales.filter((c) => c.tipoModo === 'MODO_2').length;
  const modo3Count = prospectosDentales.filter((c) => c.tipoModo === 'MODO_3').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera del Modal */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stitch-primary text-white flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-slate-900">
                Directorio de Clínicas Dentales ASCK
              </h3>
              <p className="text-[11px] text-slate-500">
                Cambio instantáneo por URL & Enlaces personalizados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador & Filtros */}
        <div className="p-3 bg-white border-b border-slate-100 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar clínica, zona o especialidad..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-stitch-primary/30 focus:border-stitch-primary bg-slate-50/50"
            />
          </div>

          <div className="flex gap-1.5 text-xs">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-stitch-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({prospectosDentales.length})
            </button>
            <button
              onClick={() => setActiveFilter('MODO_2')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeFilter === 'MODO_2'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Web ~$2,000 - $2,900 ({modo2Count})
            </button>
            <button
              onClick={() => setActiveFilter('MODO_3')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeFilter === 'MODO_3'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              Especialidad $5,000 ({modo3Count})
            </button>
          </div>
        </div>

        {/* Lista de Clínicas */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredClinics.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No se encontraron clínicas.
            </div>
          ) : (
            filteredClinics.map((clinic) => {
              const isCurrent = currentClinic?.id === clinic.id;
              const isCopied = copiedId === clinic.id;

              return (
                <div
                  key={clinic.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/60 border-stitch-primary shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline font-semibold text-xs text-slate-900">
                          {clinic.nombre}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-100 text-stitch-primary">
                            Activo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="inline-flex items-center text-amber-600 font-medium">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
                          {clinic.rating} ({clinic.reviews})
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center">
                          <MapPin className="w-3 h-3 text-red-500 mr-0.5" />
                          {clinic.zona}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono-ui font-semibold px-2 py-0.5 rounded-full border ${
                        clinic.tipoModo === 'MODO_2'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}
                    >
                      {clinic.tipoModo === 'MODO_2' ? 'Web ~$2,900' : 'Especialidad'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-2">
                    {clinic.especialidadPrincipal}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleCopyLink(clinic.id)}
                      className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>¡Enlace Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copiar Link para Doctor</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onSelectClinic(clinic);
                        onClose();
                      }}
                      className="py-1.5 px-3 rounded-lg bg-stitch-primary hover:bg-stitch-primary-container text-white text-xs font-medium flex items-center gap-1 shadow-sm transition-all"
                    >
                      <span>Ver en Vivo</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Atajo rápido: Presiona <strong>Alt + K</strong> en cualquier momento.
        </div>
      </div>
    </div>
  );
}
