import Link from "next/link";
import Image from "next/image";

const BENEFITS = [
  "Acceso exclusivo al pre-registro en línea",
  "Elegibilidad para programas de la GVHS",
  "Recepción de la revista anual Vanner",
  "Inclusión en el directorio oficial de miembros"
];

export default function Membership() {
  return (
    <section id="membresia" className="relative w-full bg-zinc-50 overflow-hidden flex flex-col lg:flex-row border-b border-zinc-200">
      {/* Content Block 50% */}
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end px-6 sm:px-12 md:px-24 py-24 sm:py-32">
        <div className="w-full max-w-xl lg:pr-12">
          <h2 className="text-zinc-950 font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-12">
            Membresía Oficial.
          </h2>

          <ul className="flex flex-col gap-6 mb-16">
            {BENEFITS.map((benefit, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-700 mt-2.5" />
                <span className="text-zinc-700 font-sans text-lg leading-relaxed">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start gap-6">
            <p className="text-zinc-600 font-sans text-base max-w-sm">
              Obtén la membresía oficial y comienza el pre-registro de tu Gypsy Vanner hoy mismo.
            </p>
            <Link href="/membresia" className="group relative inline-flex items-center justify-center bg-zinc-950 text-white font-sans text-sm tracking-wider uppercase font-medium px-8 py-4 overflow-hidden transition-all duration-500 hover:bg-zinc-800">
              <span className="relative z-10 flex items-center gap-3">
                Hacerme miembro
                <svg
                  className="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
            <div className="mt-2 text-sm text-zinc-500 font-sans">
              ¿Ya tienes membresía? <Link href="/login" className="text-red-700 hover:text-red-800 font-medium underline underline-offset-4">Acceder a mi cuenta</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Block 50% */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent z-10 pointer-events-none lg:hidden"></div>
        <Image
          src="/horse_material/5.jpg"
          alt="Membresía Gypsy Vanner"
          fill
          className="object-cover object-center saturate-50 group-hover:saturate-100 transition-all duration-700"
          priority
        />
      </div>
    </section>
  );
}
