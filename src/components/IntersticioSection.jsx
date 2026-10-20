import React from 'react';

export default function IntersticioSection() {
  return (
    <section className="py-24 sm:py-32 bg-[#EAE5DC]/60 border-b border-[#EAE5DC] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="font-serif text-nacar-oro text-4xl block leading-none select-none">
          “
        </span>

        <blockquote className="font-serif font-light text-3xl sm:text-5xl lg:text-6xl text-nacar-tinta tracking-tight leading-[1.2] max-w-4xl mx-auto italic">
          Nadie llega al dentista por los dientes.{' '}
          <span className="font-normal text-nacar-jade block sm:inline">
            Llega por lo que dejó de hacer con ellos.
          </span>
        </blockquote>

        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="w-8 h-[1px] bg-nacar-oro" />
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-nacar-pizarra font-medium">
            Dra. Irene Salcedo · Directora Clínica NÁCAR
          </p>
          <div className="w-8 h-[1px] bg-nacar-oro" />
        </div>
      </div>
    </section>
  );
}
