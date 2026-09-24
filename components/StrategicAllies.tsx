import React from 'react';
import Image from 'next/image';

interface AllyItem {
  id: number;
  name: string;
  logo?: string;
}

const ALLIES: AllyItem[] = [
  { id: 1, name: "Rancho El Descanso", logo: "/logoCRD.jpeg" },
  { id: 2, name: "Logo Aliado 2" },
  { id: 3, name: "Logo Aliado 3" },
  { id: 4, name: "Logo Aliado 4" },
  { id: 5, name: "Logo Aliado 5" },
  { id: 6, name: "Logo Aliado 6" },
];

export default function StrategicAllies() {
  return (
    <section className="bg-white py-16 md:py-24 border-b border-zinc-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">

        <p className="font-serif text-2xl md:text-3xl text-zinc-900">
          Aliados Estratégicos
        </p>
      </div>

      <div className="relative w-full flex overflow-hidden group">
        {/* Sombras difuminadas en los bordes para dar efecto de profundidad al carrusel */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-infinite-scroll w-max hover:[animation-play-state:paused]">
          {/* Duplicamos el array para crear la ilusión de scroll infinito perfecto */}
          {[...ALLIES, ...ALLIES, ...ALLIES].map((ally, index) => (
            <div
              key={`${ally.id}-${index}`}
              className="flex items-center justify-center w-48 md:w-64 h-24 mx-4 md:mx-6 transition-all duration-300 cursor-default hover:scale-105"
            >
              {ally.logo ? (
                <div className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center p-3 shadow-sm relative overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={ally.logo}
                      alt={ally.name}
                      fill
                      unoptimized
                      className="object-contain p-1"
                      sizes="(max-width: 768px) 192px, 256px"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="font-sans font-semibold text-zinc-400 uppercase tracking-widest text-sm">{ally.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CSS inyectado para la animación específica de este carrusel */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes infinite-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-33.3333%); }
          }
          .animate-infinite-scroll {
            animation: infinite-scroll 35s linear infinite;
          }
        `
      }} />
    </section>
  );
}
