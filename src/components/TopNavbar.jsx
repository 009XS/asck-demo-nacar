import React, { useState, useEffect } from 'react';
import { Star, MapPin, MessageCircle, Menu, X, ShieldCheck } from 'lucide-react';
import { flagshipClinic, getWhatsAppUrl } from '../data/flagshipDemo';

export default function TopNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Filosofía', href: '#filosofia' },
    { label: 'El Método', href: '#metodo' },
    { label: 'Especialidades', href: '#especialidades' },
    { label: 'Odontograma', href: '#odontograma' },
    { label: 'Presupuesto', href: '#presupuesto' },
    { label: 'Pacientes', href: '#pacientes' },
    { label: 'Visita', href: '#visita' },
    { label: 'FAQ', href: '#faq' },
  ];

  const waUrl = getWhatsAppUrl(
    'Hola NÁCAR, estuve revisando su sitio web y me gustaría agendar una valoración sin dolor.'
  );

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F6F3EE]/95 backdrop-blur-md shadow-nacar-sm border-b border-[#EAE5DC] py-3'
          : 'bg-[#F6F3EE]/80 backdrop-blur-sm border-b border-[#EAE5DC]/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Wordmark NÁCAR */}
        <a href="#inicio" className="group flex flex-col justify-center">
          <span className="font-sans font-semibold text-base sm:text-lg tracking-[0.32em] text-nacar-tinta uppercase leading-none">
            NÁCAR
          </span>
          <span className="font-sans text-[9px] sm:text-[10px] font-medium tracking-[0.25em] text-nacar-jade uppercase mt-1">
            Estudio Dental · Interlomas
          </span>
        </a>

        {/* Enlaces Desktop con tipografía editorial */}
        <div className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-sans font-medium tracking-[0.2em] text-nacar-pizarra hover:text-nacar-jade uppercase transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {/* Rating Badge Discreto */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE5DC]/60 text-xs text-nacar-pizarra">
            <Star className="w-3.5 h-3.5 fill-nacar-oro text-nacar-oro" />
            <span className="font-semibold text-nacar-tinta">{flagshipClinic.rating}</span>
            <span className="text-[11px]">({flagshipClinic.reviews} reseñas)</span>
          </div>

          {/* Botón WhatsApp Primario */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-none bg-nacar-jade hover:bg-nacar-jade-hover text-nacar-porcelana text-[11px] font-sans font-semibold tracking-[0.16em] uppercase shadow-sm transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
            <span className="hidden sm:inline">Agendar Valoración</span>
            <span className="sm:hidden">Agendar</span>
          </a>

          {/* Menú Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-nacar-tinta hover:text-nacar-jade"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F6F3EE] border-b border-[#EAE5DC] px-6 pt-4 pb-8 space-y-4 shadow-lg animate-fadeIn">
          <div className="grid grid-cols-2 gap-3 py-2 border-b border-[#EAE5DC]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-sans font-medium tracking-[0.18em] uppercase text-nacar-tinta hover:text-nacar-jade py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 flex items-center justify-between text-xs text-nacar-pizarra">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              {flagshipClinic.zona}
            </span>
            <span className="flex items-center gap-1 text-nacar-oro font-semibold">
              <Star className="w-3.5 h-3.5 fill-nacar-oro" />
              {flagshipClinic.rating} en Google Maps
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
