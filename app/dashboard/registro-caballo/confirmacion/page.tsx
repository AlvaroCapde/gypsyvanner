"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface RegistrationDetails {
  id?: string;
  horseName?: string;
  ownerName?: string;
  gender?: "stallion" | "mare" | "";
  birthDate?: string;
  ageCategory?: string;
  countryOfBirth?: string;
  subtotalFeeMxn?: number;
  platformFeeMxn?: number;
  totalFeeMxn?: number;
  paymentStatus?: string;
  status?: string;
  createdAt?: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState<RegistrationDetails | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No se proporcionó el identificador de sesión de pago (session_id).");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/horse-registrations/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "No se pudo verificar el pago de la solicitud.");
        }

        setDetails({
          id: data.registrationId || data.registration?.id,
          horseName: data.horseName || data.registration?.horse_name,
          ownerName: data.ownerName || data.registration?.owner_name,
          gender: data.gender || data.registration?.gender,
          birthDate: data.birthDate || data.registration?.birth_date,
          ageCategory: data.ageCategory || data.registration?.age_category,
          countryOfBirth: data.countryOfBirth || data.registration?.country_of_birth,
          subtotalFeeMxn: data.subtotalFeeMxn || data.registration?.subtotal_fee_mxn,
          platformFeeMxn: data.platformFeeMxn || data.registration?.platform_fee_mxn,
          totalFeeMxn: data.totalFeeMxn || data.registration?.total_fee_mxn || data.amountTotalMxn,
          paymentStatus: data.paymentStatus || data.registration?.payment_status,
          status: data.status || data.registration?.status,
          createdAt: data.createdAt || data.registration?.created_at,
        });

        // Limpiar cualquier borrador de registro en localStorage tras pago exitoso
        try {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("gvhs_horse_reg_draft")) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((k) => localStorage.removeItem(k));
        } catch {}
      } catch (err: any) {
        console.error("Error verificando registro:", err);
        setError(err.message || "Ocurrió un error al verificar tu sesión de pago.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return "$0 MXN";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-10 md:p-14 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-14 h-14 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
        <h2 className="text-xl font-serif text-zinc-950 mb-2">Verificando tu pago...</h2>
        <p className="text-zinc-500 text-xs sm:text-sm">
          Estamos confirmando tu pago y preparando el expediente oficial de tu ejemplar.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-10 md:p-14 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-14 h-14 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-zinc-950 mb-2">No se pudo verificar el registro</h2>
        <p className="text-zinc-600 text-xs sm:text-sm mb-6">{error}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/registro-caballo"
            className="px-6 py-3 bg-zinc-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
          >
            Volver al Formulario
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-zinc-300 text-zinc-800 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-100 transition-colors"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const folio = details?.id ? `#REG-${details.id.slice(0, 8).toUpperCase()}` : "En trámite";

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Encabezado de Éxito */}
      <div className="bg-white border border-zinc-200 rounded-xl p-8 sm:p-10 shadow-sm text-center">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[11px] font-semibold tracking-wider uppercase rounded-full mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          Pago Confirmado • Solicitud en Revisión
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-zinc-950 mb-2">
          ¡Solicitud de Registro Enviada con Éxito!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
          Tu pago ha sido acreditado correctamente y el expediente oficial del ejemplar ha ingresado a revisión técnica de la Gypsy Vanner Horse Society México.
        </p>

        <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-center gap-3 text-xs text-zinc-500">
          <span>Folio de Trámite:</span>
          <strong className="font-mono text-zinc-900 text-sm bg-zinc-100 px-2.5 py-1 rounded">
            {folio}
          </strong>
        </div>
      </div>

      {/* Aviso Importante sobre el Trámite y Contacto WhatsApp */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-3 flex-grow">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-serif text-base font-bold text-zinc-950">
                Información Clave de tu Trámite
              </h4>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Seguimiento Oficial
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-white/95 rounded-lg border border-emerald-200/60 shadow-xs">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contacto vía WhatsApp
                </span>
                <p className="text-xs text-zinc-700 leading-relaxed">
                  En caso de necesitar más datos o detalles de tu ejemplar, nuestro equipo se pondrá en contacto contigo <strong>vía WhatsApp</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-white/95 rounded-lg border border-emerald-200/60 shadow-xs">
                <span className="text-[11px] font-semibold text-zinc-800 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tiempo de Espera
                </span>
                <p className="text-xs text-zinc-700 leading-relaxed">
                  Tiempo de espera del trámite: <strong>2 meses</strong> aproximadamente para recepción de muestras, pruebas de ADN/PSSM1/FIS y emisión oficial.
                </p>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2 text-xs text-zinc-600">
              <svg className="w-4 h-4 text-emerald-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Puedes consultar el estatus en tiempo real de tu trámite en tu{" "}
                <Link href="/dashboard" className="text-emerald-900 font-semibold underline underline-offset-2 hover:text-emerald-950">
                  Portal de Miembros
                </Link>.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de Revisión de Datos del Ejemplar */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-semibold text-zinc-950 pb-3 border-b border-zinc-200">
          Resumen Oficial del Ejemplar Registrado
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
          <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200/70">
            <span className="text-zinc-400 block text-[11px] uppercase tracking-wider mb-0.5">
              Nombre del Ejemplar
            </span>
            <strong className="text-zinc-950 text-base">{details?.horseName || "Sin especificar"}</strong>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200/70">
            <span className="text-zinc-400 block text-[11px] uppercase tracking-wider mb-0.5">
              Propietario Registrado
            </span>
            <strong className="text-zinc-950 text-base">{details?.ownerName || "Socio"}</strong>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200/70">
            <span className="text-zinc-400 block text-[11px] uppercase tracking-wider mb-0.5">
              Género y Categoría
            </span>
            <strong className="text-zinc-900">
              {details?.gender === "stallion" ? "Semental" : "Yegua"}
              {details?.ageCategory ? ` • ${details.ageCategory}` : ""}
            </strong>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200/70">
            <span className="text-zinc-400 block text-[11px] uppercase tracking-wider mb-0.5">
              Fecha y País de Nacimiento
            </span>
            <strong className="text-zinc-900">
              {details?.birthDate || "Pendiente"} ({details?.countryOfBirth || "México"})
            </strong>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200/70">
            <span className="text-zinc-400 block text-[11px] uppercase tracking-wider mb-0.5">
              Estatus del Expediente
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              En Revisión Técnica Oficial
            </span>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200/70">
            <span className="text-zinc-400 block text-[11px] uppercase tracking-wider mb-0.5">
              Total Oficial Pagado
            </span>
            <strong className="text-zinc-950 font-semibold text-sm">
              {formatCurrency(details?.totalFeeMxn || details?.subtotalFeeMxn)}
            </strong>
            <span className="text-[11px] text-emerald-700 ml-1.5 font-medium">✓ Pago Acreditado</span>
          </div>
        </div>
      </div>

      {/* Próximos Pasos Institucionales */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-4">
        <h4 className="font-serif text-base font-semibold text-zinc-950">
          Próximos Pasos para tu Certificación
        </h4>

        <div className="space-y-3.5 text-xs text-zinc-700 leading-relaxed">
          <div className="flex items-start gap-3 p-3.5 bg-white rounded-lg border border-zinc-200/70">
            <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 font-semibold flex items-center justify-center flex-shrink-0 text-xs">
              1
            </span>
            <div>
              <strong className="text-zinc-900 block mb-0.5">Inspección de Fotografías Reglamentarias</strong>
              Nuestro equipo técnico verificará las 4 vistas fotográficas subidas (perfiles, frontal y posterior) para cotejar la morfología del ejemplar. En caso de requerir precisiones o mejores tomas, te contactaremos directamente vía WhatsApp.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-white rounded-lg border border-zinc-200/70">
            <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 font-semibold flex items-center justify-center flex-shrink-0 text-xs">
              2
            </span>
            <div>
              <strong className="text-zinc-900 block mb-0.5">Envío del Kit y Formato de ADN</strong>
              Te notificaremos con el formato oficial para la toma de muestra capilar (pelo con raíz). El tiempo de espera del trámite es de aproximadamente 2 meses mientras se procesan los análisis genéticos en laboratorio.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-white rounded-lg border border-zinc-200/70">
            <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 font-semibold flex items-center justify-center flex-shrink-0 text-xs">
              3
            </span>
            <div>
              <strong className="text-zinc-900 block mb-0.5">Emisión del Certificado Oficial GVHS</strong>
              Al concluir los análisis genéticos de ADN, PSSM1 y FIS, se expedirá tu Certificado Oficial de Registro con las pruebas asentadas al reverso. Podrás consultar el estatus en todo momento en tu Portal de Miembros.
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Navegación Final */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-8 py-4 bg-zinc-950 text-white text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-colors text-center shadow-sm"
        >
          Ver mis caballos en el Dashboard
        </Link>
        <Link
          href="/dashboard/registro-caballo"
          className="w-full sm:w-auto px-6 py-4 bg-white border border-zinc-300 text-zinc-800 text-xs uppercase tracking-wider font-semibold hover:bg-zinc-50 transition-colors text-center"
        >
          Registrar otro ejemplar
        </Link>
      </div>
    </div>
  );
}

export default function RegistrationConfirmationPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-wider flex items-center gap-1.5"
          >
            ← Volver al Dashboard
          </Link>
          <span className="text-xs font-serif text-zinc-400">GVHS México</span>
        </div>

        <Suspense
          fallback={
            <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center max-w-xl mx-auto shadow-sm">
              <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-zinc-500 text-xs">Cargando confirmación...</p>
            </div>
          }
        >
          <ConfirmationContent />
        </Suspense>
      </div>
    </div>
  );
}
