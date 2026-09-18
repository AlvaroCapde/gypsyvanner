import MembershipForm from "@/components/MembershipForm";
import Link from "next/link";

export default function MembresiaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* Header simple */}
      <header className="w-full bg-zinc-950 px-6 sm:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white font-serif text-2xl tracking-wider">
              GVHS<span className="text-red-600">.</span>
            </Link>
            <span className="hidden sm:inline-block text-xs text-zinc-400 border-l border-zinc-700/80 pl-4 font-sans tracking-wide">
              El Registro Oficial del Caballo Gypsy Vanner en México
            </span>
          </div>
          <Link href="/" className="text-zinc-400 text-sm tracking-wide hover:text-white transition-colors shrink-0">
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow flex flex-col items-center py-16 px-6 sm:px-12">
        <div className="w-full max-w-4xl text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif text-zinc-900 mb-4">
            Solicitud de Membresía
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Únete a la Gypsy Vanner Horse Society México y forma parte de la preservación y promoción de esta increíble raza.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <MembershipForm />
        </div>
      </main>
    </div>
  );
}
