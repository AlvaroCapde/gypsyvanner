import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import HorseRegistrationWizard from "@/components/horse-registration/HorseRegistrationWizard";

export const dynamic = "force-dynamic";

export default async function RegistroCaballoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch membership details to pre-fill owner name and verify member status
  let { data: membership } = await supabase
    .from("memberships")
    .select("*")
    .eq("id", user.id)
    .single();

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
  const memberEmail = membership?.email || user.email || user.user_metadata?.email || "";
  const farmName = membership?.farm_name || user.user_metadata?.farm_name || "";

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="w-full bg-zinc-950 h-20 flex items-center px-6 sm:px-12 md:px-24 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center">
              <Logo variant="dark" size="md" className="scale-75 origin-left" />
            </Link>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-zinc-400 border-l border-zinc-800 pl-6">
              Portal de Miembros
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Panel
            </Link>
            <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 sm:px-12 md:px-24 py-10">
        {/* Breadcrumbs & Title Header */}
        <div className="mb-8 pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono uppercase tracking-wider mb-2">
            <Link href="/dashboard" className="hover:text-zinc-900 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-red-700 font-semibold">Registro de Caballo</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-zinc-950 font-medium">
                Solicitud de Registro
              </h1>
            </div>

            {farmName && (
              <div className="bg-white border border-zinc-200 px-4 py-2 rounded text-xs font-sans text-zinc-700 shadow-xs self-start md:self-auto">
                <span className="text-zinc-400 block text-[10px] uppercase tracking-wider">Criadero / Rancho</span>
                <span className="font-semibold text-zinc-900">{farmName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Wizard Form */}
        <Suspense
          fallback={
            <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center max-w-xl mx-auto shadow-sm">
              <div className="w-10 h-10 border-3 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-zinc-500 text-xs">Cargando formulario de registro...</p>
            </div>
          }
        >
          <HorseRegistrationWizard
            initialOwnerName={memberName}
            userEmail={memberEmail}
          />
        </Suspense>
      </main>

      <footer className="w-full bg-zinc-900 py-6 border-t border-zinc-800 text-center mt-auto">
        <p className="text-zinc-500 font-sans text-xs">
          © {new Date().getFullYear()} Gypsy Vanner Horse Society México. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
