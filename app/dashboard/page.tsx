import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import Logo from "@/components/Logo";
import RegisteredHorsesList from "@/components/dashboard/RegisteredHorsesList";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch membership details
  let { data: membership } = await supabase
    .from("memberships")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fallback by phone if ID lookup didn't match
  if (!membership && user.phone) {
    const { data: fallbackByPhone } = await supabase
      .from("memberships")
      .select("*")
      .eq("telephone", user.phone)
      .limit(1)
      .maybeSingle();
    membership = fallbackByPhone;
  }

  const memberName = membership?.name || user.user_metadata?.full_name || "Socio GVHS";
  const farmName = membership?.farm_name || user.user_metadata?.farm_name || "Sin especificar";
  const memberPhone = membership?.telephone || user.phone || "";
  const memberEmail = membership?.email || user.email || user.user_metadata?.email || "Sin correo asociado";
  const membershipStatus = membership?.status || "active";
  const membershipType = membership?.membership_type === "associate" ? "Membresía de Asociado" : "Membresía Oficial";

  // Fetch registered horses for this user
  let registeredHorses: any[] = [];
  try {
    const { data: horses, error: horsesError } = await supabase
      .from("horse_registrations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!horsesError && horses) {
      registeredHorses = horses;
    }
  } catch (e) {
    // Si la tabla aún no existe, continúa sin error
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="w-full bg-zinc-950 h-20 flex items-center px-6 sm:px-12 md:px-24 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center hover:opacity-90 transition-opacity"
              aria-label="Ir a la página principal"
            >
              <Logo variant="dark" size="md" className="scale-75 origin-left" />
            </Link>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-zinc-400 border-l border-zinc-800 pl-6">
              Portal de Miembros
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-white text-xs font-medium">{memberName}</span>
              <span className="text-zinc-400 text-[11px]">{memberPhone}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 sm:px-12 md:px-24 py-12">
        {/* Welcome Header */}
        <div className="mb-10 pb-6 border-b border-zinc-200 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-red-700 font-semibold block mb-1">
              Mi Cuenta
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-zinc-950">
              Bienvenido, {memberName}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs tracking-wider uppercase font-sans">
            <div className="bg-white border border-zinc-200 px-3.5 py-1.5 text-zinc-700 shadow-sm">
              <span className="text-zinc-400 mr-1.5">Rancho</span>
              <span className="font-medium text-zinc-950">{farmName}</span>
            </div>
            <div className="bg-white border border-zinc-200 px-3.5 py-1.5 text-zinc-700 shadow-sm">
              <span className="text-zinc-400 mr-1.5">Membresía</span>
              <span className="font-medium text-zinc-950">{membershipType}</span>
            </div>
          </div>
        </div>

        {/* Action Center: Pre-Registro de Caballos */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-200 pb-4">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-zinc-950">Pre-Registro de Ejemplares</h2>
              <p className="text-sm text-zinc-500 font-sans mt-0.5">
                Padrón oficial de caballos vinculados a tu membresía.
              </p>
            </div>

            <Link
              href="/dashboard/registro-caballo"
              className="inline-flex items-center justify-center gap-2 bg-red-700 text-white font-sans text-xs uppercase tracking-wider font-semibold px-6 py-3.5 hover:bg-red-800 transition-colors shadow-sm self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Iniciar Pre-Registro de Caballo
            </Link>
          </div>

          {/* Listado de Caballos o Estado Vacío */}
          {registeredHorses.length > 0 ? (
            <RegisteredHorsesList horses={registeredHorses} />
          ) : (
            /* Empty State / Standby Box */
            <div className="bg-white border border-zinc-200 p-10 md:p-14 text-center">
              <div className="w-16 h-16 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-zinc-900 mb-2">Aún no tienes caballos pre-registrados</h3>
              <p className="text-sm text-zinc-500 font-sans max-w-md mx-auto mb-6">
                Asegura el linaje de tus ejemplares para incluirlos en el padrón de caballos fundadores de GVHS México.
              </p>
              <Link
                href="/dashboard/registro-caballo"
                className="inline-flex items-center justify-center bg-zinc-950 text-white font-sans text-xs tracking-wider uppercase font-medium px-8 py-3.5 hover:bg-zinc-800 transition-colors"
              >
                Ver Requisitos e Iniciar Proceso
              </Link>
            </div>
          )}
        </div>

        {/* Member Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-zinc-200">
            <span className="text-[11px] font-sans uppercase tracking-wider text-zinc-400 block mb-2 font-semibold">
              Teléfono de Contacto
            </span>
            <span className="text-zinc-900 font-mono text-base font-medium">{memberPhone}</span>
            <p className="text-xs text-zinc-500 mt-1">Utilizado para tus inicios de sesión por SMS.</p>
          </div>

          <div className="bg-white p-6 border border-zinc-200">
            <span className="text-[11px] font-sans uppercase tracking-wider text-zinc-400 block mb-2 font-semibold">
              Correo Electrónico
            </span>
            <span className="text-zinc-900 font-sans text-base font-medium truncate block">{memberEmail}</span>
            <p className="text-xs text-zinc-500 mt-1">Recepción de certificados y notificaciones.</p>
          </div>

          <div className="bg-white p-6 border border-zinc-200">
            <span className="text-[11px] font-sans uppercase tracking-wider text-zinc-400 block mb-2 font-semibold">
              Estatus en el Padrón
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-zinc-900 font-sans text-base font-medium">Socio Vigente</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">Membresía anual activa para trámites y pre-registros.</p>
          </div>
        </div>
      </main>

      <footer className="w-full bg-zinc-900 py-6 border-t border-zinc-800 text-center mt-auto">
        <p className="text-zinc-500 font-sans text-xs">© {new Date().getFullYear()} GVHS México</p>
      </footer>
    </div>
  );
}
