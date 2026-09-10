import Logo from "@/components/Logo";
import Link from "next/link";
import Image from "next/image";

export default function RegistroPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      <header className="w-full bg-zinc-950 h-20 flex items-center px-6 sm:px-12 md:px-24 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
            aria-label="Ir a la página principal"
          >
            <Logo variant="dark" size="md" className="scale-75 origin-left" />
          </Link>
          <Link href="/" className="text-zinc-400 text-sm tracking-wide hover:text-white transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center">

        {/* Landing Hero Section */}
        <section className="relative w-full bg-zinc-950 text-white overflow-hidden py-16 md:py-20">
          {/* Background Image / Overlay */}
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/horse_material/_DSC4807c.jpg"
              alt="Fondo de caballos"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-700/20 border border-red-500/30 text-red-400 text-xs sm:text-sm font-medium tracking-wide uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Oportunidad Única • Hasta Marzo 2027
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight mb-6">
                Sé de los caballos <span className="italic text-zinc-400">fundadores</span> de GVHS México.
              </h1>

              <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light mb-10 max-w-2xl">
                Asegura el linaje de tu ejemplar y conviértete en parte de la historia. Empieza a pre-registrar tu caballo hoy y obtén el prestigio y los beneficios del pre-registro oficial inicial en México.
              </p>

              <a href="#formulario-registro" className="inline-block bg-white text-zinc-950 font-medium px-8 py-4 uppercase tracking-wider text-sm hover:bg-zinc-200 transition-colors">
                Iniciar Pre-Registro Ahora
              </a>
            </div>
          </div>
        </section>

        {/* Important Information Section */}
        <section className="w-full bg-zinc-100 py-16 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Información Importante */}
              <div className="lg:w-2/3 flex flex-col">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-200 flex-grow">
                  <h2 className="text-3xl font-serif text-zinc-900 mb-4">Información Importante</h2>
                  <p className="text-zinc-500 mb-8">Lee cuidadosamente esta información antes de iniciar tu proceso de pre-registro oficial.</p>

                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                      </div>
                      <p className="text-zinc-700 leading-relaxed">
                        <strong>Pruebas de ADN obligatorias:</strong> Las pruebas de ADN son requeridas para todas las yeguas, sementales y potros.
                      </p>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                      </div>
                      <p className="text-zinc-700 leading-relaxed">
                        Los resultados del <strong>genotipo de color, PSSM1 y FIS</strong> se incluirán en el certificado de registro.
                      </p>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                      </div>
                      <p className="text-zinc-700 leading-relaxed">
                        <strong>Elegibilidad física:</strong> No se admiten caballos con problemas testiculares y de mandíbula (prognata y agnata).
                      </p>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                      </div>
                      <p className="text-zinc-700 leading-relaxed">
                        <strong>Todas las tarifas no son reembolsables.</strong>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Documentos Relacionados */}
              <div className="lg:w-1/3 flex flex-col">
                <h3 className="text-2xl font-serif text-zinc-900 mb-6 px-2">Documentos de Pre-Registro</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { title: "Reglas de Pre-Registro", href: "/registro/documentos/reglas", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "bg-blue-50 text-blue-700", hover: "hover:border-blue-200" },
                    { title: "Certificado de Cría", href: "/registro/documentos/certificado-cria", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", color: "bg-emerald-50 text-emerald-700", hover: "hover:border-emerald-200" },
                    { title: "Test Genético y Colores", href: "/registro/documentos/genetica-color", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", color: "bg-purple-50 text-purple-700", hover: "hover:border-purple-200" },
                    { title: "Guía de Fotografías", href: "/registro/documentos/guia-fotos", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z", color: "bg-pink-50 text-pink-700", hover: "hover:border-pink-200" }
                  ].map((doc, i) => (
                    <Link key={i} href={doc.href} className={`bg-white border border-zinc-200 rounded-2xl p-5 transition-all hover:shadow-md ${doc.hover} group flex items-center gap-5 text-left`}>
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full ${doc.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={doc.icon}></path></svg>
                      </div>
                      <div className="flex-grow">
                        <span className="block font-medium text-zinc-800 leading-snug">{doc.title}</span>
                        <span className="text-xs text-zinc-400 flex items-center gap-1 group-hover:text-red-700 transition-colors mt-1">
                          Leer documento
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-white py-24 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif text-zinc-900 mb-4">El valor de la Autenticidad</h2>

              <div className="my-6">
                <blockquote className="text-2xl sm:text-3xl font-serif text-zinc-950 font-medium">
                  Sin certificado de registro no es Gypsy Vanner.
                </blockquote>
                <p className="text-zinc-500 font-sans text-base sm:text-lg mt-1 font-medium">
                  Sé parte de la marca registrada Gypsy Vanner.
                </p>
              </div>

              <p className="text-zinc-500 font-sans max-w-2xl mx-auto">Conoce por qué pre-registrar a tu caballo con la GVHS no solo asegura su linaje, sino que protege e incrementa dramáticamente su valor.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Sin Papeles */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </div>
                  <h3 className="text-2xl font-serif text-zinc-800">Caballo Sin Papeles</h3>
                </div>

                <ul className="space-y-6">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-zinc-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                    <span className="text-zinc-600"><strong>Valor en duda:</strong> Sin un documento oficial, el valor de reventa en el mercado decae considerablemente.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-zinc-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                    <span className="text-zinc-600"><strong>Exclusión de eventos:</strong> Imposibilidad de participar en eventos oficiales, exposiciones y competencias de la GVHS.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-zinc-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                    <span className="text-zinc-600"><strong>Cría no reconocida:</strong> Los potros nacidos de ejemplares sin registro no pueden ser certificados como pura sangre Gypsy Vanner.</span>
                  </li>
                </ul>
              </div>

              {/* Con Papeles */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-700/20 blur-3xl rounded-full"></div>
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-red-700 flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl font-serif text-white">Caballo Registrado (GVHS)</h3>
                </div>

                <ul className="space-y-6 relative z-10">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-zinc-300"><strong>Pureza Garantizada:</strong> Certificación oficial mediante pruebas de ADN que respaldan la genética del caballo.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-zinc-300"><strong>Mayor Valor:</strong> Los ejemplares registrados cotizan drásticamente más alto en el mercado nacional e internacional.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-zinc-300"><strong>Acceso Total:</strong> Derecho a competir en shows oficiales y asegurar que la descendencia sea reconocida mundialmente.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Membresia Section */}
        <section id="formulario-registro" className="w-full bg-zinc-50 py-24 border-b border-zinc-100">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-4xl font-serif text-zinc-950 mb-6">El primer paso: Tu Membresía</h2>
            <p className="text-zinc-600 text-lg mb-10 leading-relaxed">
              Para pre-registrar a tu caballo y garantizar su linaje como parte de los fundadores en México, el requisito indispensable es ser miembro activo de la GVHS.
            </p>
            <Link
              href="/#membresia"
              className="inline-flex items-center justify-center bg-red-700 text-white font-medium px-8 py-4 uppercase tracking-wider text-sm hover:bg-red-800 transition-colors shadow-lg hover:shadow-xl rounded-md"
            >
              Obtener mi Membresía Oficial
            </Link>
          </div>
        </section>

      </main>

      <footer className="w-full bg-zinc-900 py-8 border-t-2 border-red-700 text-center">
        <p className="text-zinc-500 font-sans text-sm">© {new Date().getFullYear()} GVHS México</p>
      </footer>
    </div>
  );
}
