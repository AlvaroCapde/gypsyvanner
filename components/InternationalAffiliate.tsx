import React from 'react';
import ImageCarousel from './ImageCarousel';
import Logo from './Logo';

const IMAGES = [
  "/horse_material/4.jpg",
  "/horse_material/2.jpg",
  "/horse_material/3.jpg"
];

export default function InternationalAffiliate() {
  return (
    <section className="bg-white pt-10 pb-20 md:pt-16 md:pb-32 relative border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo separador */}
        <div className="w-full flex justify-center mb-16 md:mb-24">
          <Logo variant="light" size="xl" className="" />
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

          {/* Texto y Contenido */}
          <div className="flex-1 space-y-10 lg:pr-8">
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-zinc-950 tracking-tight leading-tight">
              ¿Qué es la <span className="italic text-zinc-600">GVHS?</span>
            </h2>

            <div className="space-y-8">
              <p className="font-serif text-2xl md:text-3xl text-zinc-900 leading-snug">
                Autenticidad. Preservación. <br className="hidden md:block" />Legado Cultural.
              </p>

              <p className="font-sans text-lg md:text-xl text-zinc-700 leading-relaxed">
                La <strong>Gypsy Vanner Horse Society</strong> es el registro fundador dedicado a preservar, promover y proteger al auténtico caballo Gypsy Vanner. A través de un linaje verificado, estrictos estándares de raza y respeto cultural, apoyamos a criadores, propietarios y entusiastas que valoran la autenticidad y belleza de este caballo históricamente significativo realizando evaluaciones con jueces certificados para indicar la calidad de los caballos y otorgar premios.
              </p>

              <div className="border-l-4 border-red-700 pl-6 py-2">
                <p className="text-xl md:text-2xl text-zinc-900 font-serif leading-snug">
                  El único afiliado oficial de la <strong>GVHS</strong> en México.
                </p>
                <p className="text-zinc-600 text-base mt-2 font-medium">
                  Garantizamos la pureza y el estándar de excelencia de la raza a nivel nacional.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <a href="https://vanners.org" target="_blank" rel="noopener noreferrer" className="inline-block bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-medium px-8 py-3 rounded-md transition-colors shadow-sm">
                Conoce más sobre la GVHS
              </a>
            </div>
          </div>

          {/* Imagen Orgánica sin Card */}
          <div className="flex-1 w-full relative mt-16 lg:mt-0">

            {/* Decoración de fondo para dar profundidad */}
            <div className="absolute -inset-4 md:-inset-8 bg-zinc-50 rounded-3xl -z-10 transform md:rotate-2"></div>

            <div className="aspect-[4/5] lg:aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent z-10 pointer-events-none"></div>

              <div className="absolute inset-0 saturate-50 group-hover:saturate-100 transition-all duration-700">
                <ImageCarousel images={IMAGES} />
              </div>

              <div className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none">
                <p className="text-white font-serif text-3xl font-semibold">Excelencia y Pureza</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
