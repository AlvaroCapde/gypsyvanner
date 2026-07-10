import Link from "next/link";


export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <header className="w-full bg-zinc-950 px-6 sm:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-serif text-2xl tracking-wider">
            GVHS<span className="text-red-600">.</span>
          </Link>
          <Link href="/" className="text-zinc-400 text-sm tracking-wide hover:text-white transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="bg-white p-12 text-center max-w-lg mx-auto shadow-sm ring-1 ring-zinc-200">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif text-zinc-900 mb-4">¡Pago Exitoso!</h1>
          <p className="text-zinc-600 font-sans text-lg mb-8">
            Tu solicitud de membresía ha sido procesada correctamente. Hemos recibido tu información y tu pago.
          </p>
          <Link 
            href="/"
            className="group relative inline-flex items-center justify-center bg-zinc-950 text-white font-sans text-sm tracking-wider uppercase font-medium px-8 py-4 overflow-hidden transition-all duration-500 hover:bg-zinc-800"
          >
            <span className="relative z-10">Regresar al Inicio</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
