import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-zinc-950 flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/horse_material/_DSC4807c.jpg"
          alt="Gypsy Vanner Horse"
          fill
          className="object-cover object-center scale-[1.05] -translate-x-4 sm:-translate-x-20"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-zinc-950/90 via-zinc-950/60 to-transparent" />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-zinc-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-white font-serif text-xl tracking-wide font-medium">
            GVHS México
          </div>
          <Link
            href="/login"
            className="text-zinc-200 text-sm font-sans tracking-wide hover:text-white transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-24 md:pb-0 md:justify-center px-6 sm:px-12 md:px-24 w-full max-w-7xl mx-auto">
        <div className="max-w-2xl mt-auto md:mt-0 ml-auto md:text-right flex flex-col md:items-end">
          <div className="mb-6 relative inline-block">
            {/* Soft ambient backlight so background photo never clashes */}
            <div className="absolute -inset-6 bg-gradient-to-r from-amber-500/10 via-white/15 to-transparent blur-2xl rounded-full pointer-events-none" />
            <Logo variant="dark" size="lg" className="relative z-10 drop-shadow-xl" />
          </div>
          <h1 className="text-white font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] mb-12">
            El Estándar de<br />
            <span className="block mt-2">Excelencia.</span>
          </h1>

          <Link href="/registro" className="group relative inline-flex items-center justify-center bg-red-700 text-white font-sans text-sm tracking-wider uppercase font-medium px-8 py-4 overflow-hidden transition-all duration-500 hover:bg-red-800">
            <span className="relative z-10 flex items-center gap-3">
              Explorar el Pre-Registro
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
        </div>
      </div>
    </section>
  );
}
