import React from 'react';

export default function ContactCTA() {
  return (
    <section className="bg-zinc-50 py-16 md:py-24 border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-zinc-950 tracking-tight mb-6">
          ¿Quieres saber más?
        </h2>
        <p className="font-sans text-lg text-zinc-600 mb-10 max-w-2xl mx-auto">
          Únete a nuestra comunidad para recibir información exclusiva de la raza en México, o comunícate directamente con nuestro equipo.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <a href="#" className="group relative inline-flex items-center justify-center bg-red-700 text-white font-sans text-sm tracking-wider uppercase font-medium px-8 py-4 rounded-md overflow-hidden transition-all duration-300 hover:bg-red-800 shadow-sm w-full sm:w-auto">
            <span className="relative z-10 flex items-center gap-3">
              Unirse al Grupo de WhatsApp
              <svg 
                className="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-8 md:p-10 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8">
            O contacta directamente a nuestro equipo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="font-serif text-lg font-medium text-zinc-900">Roberto Mena</span>
              <a href="tel:+523312947594" className="font-sans text-zinc-500 hover:text-red-700 transition-colors mt-1">+52 33 1294 7594</a>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-lg font-medium text-zinc-900">Nicolás Campero</span>
              <a href="tel:+523316045548" className="font-sans text-zinc-500 hover:text-red-700 transition-colors mt-1">+52 33 1604 5548</a>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-lg font-medium text-zinc-900">Mónica Valle</span>
              <a href="tel:+523311471212" className="font-sans text-zinc-500 hover:text-red-700 transition-colors mt-1">+52 33 1147 1212</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
