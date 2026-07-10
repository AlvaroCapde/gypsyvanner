export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-zinc-900 border-t-2 border-red-700">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
          
          <div className="flex flex-col space-y-4">
             <div className="text-white font-serif text-2xl tracking-wide">
               GVHS México
             </div>
             <p className="text-zinc-500 font-sans text-sm leading-relaxed max-w-xs">
               Preservando el estándar de excelencia de la raza Gypsy Vanner a nivel nacional.
             </p>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-zinc-100 font-sans text-xs font-bold uppercase tracking-wider">Contacto Directo</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-sans">
              <li>Roberto Mena: <a href="tel:+523312947594" className="hover:text-white transition-colors">+52 33 1294 7594</a></li>
              <li>Nicolás Campero: <a href="tel:+523316045548" className="hover:text-white transition-colors">+52 33 1604 5548</a></li>
              <li>Mónica Valle: <a href="tel:+523311471212" className="hover:text-white transition-colors">+52 33 1147 1212</a></li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="text-zinc-100 font-sans text-xs font-bold uppercase tracking-wider">Legal & Enlaces</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-sans">
              <li><a href="#terminos" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
              <li><a href="#privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</a></li>
              <li><a href="#registro" className="hover:text-white transition-colors">Registro de Membresía</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 font-sans text-xs">
            © {year} Gypsy Vanner Horse Society México. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
