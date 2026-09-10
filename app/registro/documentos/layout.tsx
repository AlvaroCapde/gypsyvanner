import Link from "next/link";
import Logo from "@/components/Logo";

export default function DocumentosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <Link href="/registro" className="text-zinc-400 text-sm tracking-wide hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Volver a Pre-Registro
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12">
        <div className="max-w-4xl w-full px-6">
          {children}
        </div>
      </main>

      <footer className="w-full bg-zinc-900 py-8 border-t-2 border-red-700 text-center">
        <p className="text-zinc-500 font-sans text-sm">© {new Date().getFullYear()} GVHS México</p>
      </footer>
    </div>
  );
}
