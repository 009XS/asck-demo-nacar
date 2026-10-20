import React, { useEffect } from 'react';
import ScrollProgressBar from './components/ScrollProgressBar';
import ScrollChapterHUD from './components/ScrollChapterHUD';
import TopNavbar from './components/TopNavbar';
import HeroSection from './components/HeroSection';
import PhilosophySection from './components/PhilosophySection';
import HorizontalScrollShowcase from './components/HorizontalScrollShowcase';
import MethodSection from './components/MethodSection';
import ServicesSection from './components/ServicesSection';
import SmileComparisonSection from './components/SmileComparisonSection';
import OdontogramSection from './components/OdontogramSection';
import CalculatorSection from './components/CalculatorSection';
import IntersticioSection from './components/IntersticioSection';
import TestimonialsSection from './components/TestimonialsSection';
import DoctorSection from './components/DoctorSection';
import LocationSection from './components/LocationSection';
import FaqSection from './components/FaqSection';
import CtaSection from './components/CtaSection';
import FooterSection from './components/FooterSection';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { flagshipClinic } from './data/flagshipDemo';

export default function App() {
  useEffect(() => {
    document.title = `${flagshipClinic.nombre} · Estudio Dental de Precisión | Cero Miedo al Dentista`;
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#1B1A18] font-sans antialiased selection:bg-[#2E6B60] selection:text-[#F6F3EE] flex flex-col relative">
      {/* 1. Barra de Progreso de Lectura Fixed Top */}
      <ScrollProgressBar />

      {/* 2. Indicador Flotante de Capítulos (Scroll Spy HUD) */}
      <ScrollChapterHUD />

      {/* 3. Navegación Principal NÁCAR */}
      <TopNavbar />

      {/* Contenido Principal con Todos los Tipos de Scrolls Inmersivos */}
      <main className="flex-1 w-full">
        {/* Hero Section Monumental */}
        <HeroSection />

        {/* 01 · Filosofía Clínica (Tres Pilares Innegociables) */}
        <PhilosophySection />

        {/* 02 · El Recorrido de la Materia (Pinned Horizontal Scroll 400vh) */}
        <HorizontalScrollShowcase />

        {/* 03 · El Método: Tu Cita Minuto a Minuto (Pinned Sticky Timeline 340vh) */}
        <MethodSection />

        {/* 04 · Especialidades & Tratamientos de Alta Precisión */}
        <ServicesSection />

        {/* Interactivo Before & After: Armonización Dental con Slider */}
        <SmileComparisonSection />

        {/* 05 · Odontograma Anatómico Digital 3D Interactivo */}
        <OdontogramSection />

        {/* 06 · Presupuesto Transparente: Cotizador en Vivo con MSI */}
        <CalculatorSection />

        {/* Intersticio Editorial */}
        <IntersticioSection />

        {/* 07 · Prueba Social: 4.9★ en Google Maps & Historias Reales */}
        <TestimonialsSection />

        {/* Quién te Atiende: Dirección Médica Dra. Irene Salcedo (UNAM) */}
        <DoctorSection />

        {/* 08 · La Visita: Ubicación, Horarios y Trazador GPS */}
        <LocationSection />

        {/* 09 · Preguntas Frecuentes Médicas Anti-Miedo */}
        <FaqSection />

        {/* Cierre Monumental en Petróleo y Jade */}
        <CtaSection />
      </main>

      {/* Footer Oficial ASCK Software */}
      <FooterSection />

      {/* Botón Flotante de WhatsApp & Barra Móvil Inferior */}
      <FloatingWhatsApp />
    </div>
  );
}
