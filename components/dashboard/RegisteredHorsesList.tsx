"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrencyMxn, calculatePlatformFee } from "@/lib/fees";
import { COLOR_TESTS_CATALOG } from "@/lib/horse-registration";

interface HorseRegistration {
  id: string;
  user_id: string;
  horse_name: string;
  farm_prefix?: string | null;
  is_purchasing_prefix?: boolean;
  prefix_fee_usd?: number | null;
  prefix_fee_mxn?: number | null;
  owner_name: string;
  acquisition_date: string;
  gender: "stallion" | "mare";
  birth_date: string;
  country_of_birth: string;
  current_height?: string | null;
  current_height_date?: string | null;
  expected_height?: string | null;
  has_passport: boolean;
  import_date?: string | null;
  passport_number?: string | null;
  coat_color?: string | null;
  coat_pattern?: string | null;
  color_details?: string | null;
  microchip_or_identifiers?: string | null;
  photo_left_url?: string | null;
  photo_right_url?: string | null;
  photo_front_url?: string | null;
  photo_rear_url?: string | null;
  selected_color_tests?: string[] | null;
  color_tests_fee_usd?: number | null;
  color_tests_fee_mxn?: number | null;
  age_category: string;
  base_fee_usd: number;
  dna_fee_usd: number;
  pssm_fis_fee_usd: number;
  total_fee_usd: number;
  base_fee_mxn: number;
  dna_fee_mxn: number;
  pssm_fis_fee_mxn: number;
  subtotal_fee_mxn?: number | null;
  platform_fee_mxn?: number | null;
  total_fee_mxn: number;
  payment_status?: string | null;
  stripe_session_id?: string | null;
  paid_at?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface RegisteredHorsesListProps {
  horses: HorseRegistration[];
}

export default function RegisteredHorsesList({ horses }: RegisteredHorsesListProps) {
  const [horsesList, setHorsesList] = useState<HorseRegistration[]>(horses);
  const [selectedHorse, setSelectedHorse] = useState<HorseRegistration | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    setHorsesList(horses);
  }, [horses]);

  const handleDeleteDraft = async (horse: HorseRegistration) => {
    const isPending = horse.payment_status === "unpaid" || horse.status === "pending_payment";
    if (!isPending) {
      alert("Solo se pueden eliminar solicitudes con pago pendiente.");
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar el borrador de pre-registro para "${horse.horse_name}"?\n\nEsta acción cancelará la solicitud preliminar de forma permanente.`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setDeleteError("");

      const res = await fetch(`/api/horse-registrations/draft?id=${horse.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo eliminar la solicitud de pre-registro.");
      }

      // Quitar de la lista local
      setHorsesList((prev) => prev.filter((h) => h.id !== horse.id));
      setSelectedHorse(null);

      // Limpiar borrador local del navegador si correspondía a este registro
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("gvhs_horse_reg_draft")) {
            localStorage.removeItem(key);
          }
        }
      } catch {}

      setActionSuccess(`La solicitud de pre-registro para "${horse.horse_name}" ha sido eliminada.`);
    } catch (err: any) {
      console.error("Error eliminando borrador:", err);
      setDeleteError(err.message || "Ocurrió un error al eliminar el borrador.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string, paymentStatus?: string | null) => {
    if (paymentStatus === "unpaid" || status === "pending_payment") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-100 text-zinc-950 border border-zinc-300 text-[10px] font-mono uppercase tracking-wider shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-red-700 animate-pulse" />
          Pago Pendiente
        </span>
      );
    }

    switch (status) {
      case "submitted":
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-950 text-white text-[10px] font-mono uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            En Revisión Oficial
          </span>
        );
      case "dna_kit_sent":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-100 text-zinc-900 border border-zinc-200 text-[10px] font-mono uppercase tracking-wider shadow-2xs">
            Kit ADN Enviado
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-100 text-zinc-950 border border-zinc-300 text-[10px] font-mono uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
            Aprobado y Registrado
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-900 border border-red-200 text-[10px] font-mono uppercase tracking-wider shadow-2xs">
            Rechazado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 text-[10px] font-mono uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  const formatGender = (gender: string) => {
    return gender === "stallion" ? "Semental" : "Yegua";
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (!horsesList || horsesList.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-serif text-zinc-900 mb-2">No tienes caballos pre-registrados</h3>
        <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
          Inicia hoy el pre-registro de tus ejemplares para garantizar su autenticidad, linaje oficial y valor como fundadores en México.
        </p>
        <Link
          href="/dashboard/registro-caballo"
          className="inline-flex items-center justify-center px-6 py-3 bg-red-700 hover:bg-red-800 text-white text-xs font-medium uppercase tracking-wider rounded transition-colors shadow-sm"
        >
          Iniciar Nuevo Pre-Registro
        </Link>
      </div>
    );
  }

  return (
    <>
      {actionSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess("")} className="text-emerald-700 font-bold ml-3">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {horsesList.map((horse) => {
          const isPending = horse.payment_status === "unpaid" || horse.status === "pending_payment";
          const displayName = horse.farm_prefix ? `${horse.farm_prefix} ${horse.horse_name}` : horse.horse_name;

          return (
            <div
              key={horse.id}
              onClick={() => setSelectedHorse(horse)}
              className="group bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col cursor-pointer"
            >
              {/* Foto principal */}
              <div className="relative aspect-video bg-zinc-100 border-b border-zinc-100 overflow-hidden">
                {horse.photo_left_url ? (
                  <img
                    src={horse.photo_left_url}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(horse.status, horse.payment_status)}
                </div>
              </div>

              {/* Información de la Tarjeta */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-serif text-lg font-bold text-zinc-950 truncate group-hover:text-red-700 transition-colors">
                      {displayName}
                    </h3>
                    <span className="text-xs text-zinc-500 font-sans flex-shrink-0">
                      {formatGender(horse.gender)}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 mb-3">
                    Propietario: <span className="text-zinc-800 font-medium">{horse.owner_name}</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5 text-[11px] text-zinc-600 mb-4">
                    <span className="bg-zinc-100 px-2 py-0.5 rounded">
                      Nacimiento: {horse.birth_date}
                    </span>
                    {horse.has_passport && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200/60">
                        Pasaporte {horse.passport_number ? `#${horse.passport_number}` : ""}
                      </span>
                    )}
                    {horse.coat_color && (
                      <span className="bg-zinc-100 px-2 py-0.5 rounded">
                        {horse.coat_color}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botón de acción para ver detalle / continuar trámite */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  {isPending ? (
                    <>
                      <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pago Pendiente • Ver / Continuar
                      </span>
                      <span className="text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform">
                        →
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-zinc-600 group-hover:text-zinc-950 transition-colors font-medium flex items-center gap-1.5">
                        Ver detalle y desglose pagado
                      </span>
                      <span className="text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all">
                        →
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Detalle de Solicitud y Desglose de Pago */}
      {selectedHorse && (() => {
        const isPending =
          selectedHorse.payment_status === "unpaid" || selectedHorse.status === "pending_payment";

        return (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedHorse(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del Modal */}
              <div className="sticky top-0 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                      Folio: #REG-{selectedHorse.id.slice(0, 8).toUpperCase()}
                    </span>
                    {getStatusBadge(selectedHorse.status, selectedHorse.payment_status)}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-zinc-950">
                    {selectedHorse.farm_prefix
                      ? `${selectedHorse.farm_prefix} ${selectedHorse.horse_name}`
                      : selectedHorse.horse_name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHorse(null)}
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Cerrar ventana"
                >
                  ✕
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-6">
                {/* Aviso para Pagos Pendientes */}
                {isPending && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
                    <div className="flex items-start gap-2.5">
                      <svg className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-amber-950">Solicitud en Borrador (Pago Pendiente)</p>
                        <p className="text-amber-800 mt-0.5">
                          Tus datos y fotos están guardados. Puedes continuar para enviar la solicitud o eliminar este borrador si ya no lo requieres.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {deleteError && (
                  <div className="p-3.5 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs flex items-center justify-between">
                    <span>{deleteError}</span>
                    <button type="button" onClick={() => setDeleteError("")} className="text-red-700 font-bold ml-2">
                      ✕
                    </button>
                  </div>
                )}

                {/* Fotografías Reglamentarias */}
                <div>
                  <h4 className="font-serif text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3">
                    Fotografías Reglamentarias del Ejemplar
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Perfil Izquierdo", url: selectedHorse.photo_left_url },
                      { label: "Perfil Derecho", url: selectedHorse.photo_right_url },
                      { label: "Frontal", url: selectedHorse.photo_front_url },
                      { label: "Posterior", url: selectedHorse.photo_rear_url },
                    ].map((photo, i) => (
                      <div
                        key={i}
                        className="bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-center"
                      >
                        <span className="block text-[10px] text-zinc-500 font-medium mb-1 truncate">
                          {photo.label}
                        </span>
                        {photo.url ? (
                          <button
                            type="button"
                            onClick={() => setActivePhoto(photo.url!)}
                            className="w-full aspect-[4/3] rounded overflow-hidden bg-zinc-950 hover:opacity-90 transition-opacity block cursor-zoom-in p-1 border border-zinc-800"
                          >
                            <img
                              src={photo.url}
                              alt={photo.label}
                              className="w-full h-full object-contain"
                            />
                          </button>
                        ) : (
                          <div className="w-full aspect-[4/3] rounded bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-400">
                            Sin foto
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Datos de Identidad y Linaje */}
                <div className="bg-zinc-50/70 border border-zinc-200 rounded-lg p-5">
                  <h4 className="font-serif text-sm font-semibold text-zinc-900 mb-3 border-b border-zinc-200/70 pb-2">
                    Datos de Pre-Registro e Identidad
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Propietario(s):</span>
                      <strong className="text-zinc-900 text-sm">{selectedHorse.owner_name}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Género:</span>
                      <strong className="text-zinc-900 text-sm">
                        {selectedHorse.gender === "stallion" ? "Semental" : "Yegua"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Fecha de Nacimiento:</span>
                      <strong className="text-zinc-900">{selectedHorse.birth_date}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Categoría de Pre-Registro:</span>
                      <strong className="text-zinc-900">{selectedHorse.age_category}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">País de Origen:</span>
                      <strong className="text-zinc-900">{selectedHorse.country_of_birth}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Fecha de Adquisición:</span>
                      <strong className="text-zinc-900">{selectedHorse.acquisition_date}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Estatura Actual:</span>
                      <strong className="text-zinc-900">
                        {selectedHorse.current_height || "No registrada"}
                        {selectedHorse.current_height_date ? ` (Medida: ${selectedHorse.current_height_date})` : ""}
                      </strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Estatura Esperada:</span>
                      <strong className="text-zinc-900">
                        {selectedHorse.expected_height || "No registrada"}
                      </strong>
                    </div>
                    {selectedHorse.has_passport && (
                      <>
                        <div>
                          <span className="text-zinc-400 block text-[11px]">Número de Pasaporte (UELN):</span>
                          <strong className="text-zinc-900">{selectedHorse.passport_number || "Sí"}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[11px]">Fecha de Importación:</span>
                          <strong className="text-zinc-900">{selectedHorse.import_date || "N/A"}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[11px]">Color y Patrón de Capa:</span>
                          <strong className="text-zinc-900">
                            {selectedHorse.coat_color || "N/A"}
                            {selectedHorse.coat_pattern ? ` • ${selectedHorse.coat_pattern}` : ""}
                          </strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[11px]">Microchip / Señas:</span>
                          <strong className="text-zinc-900">{selectedHorse.microchip_or_identifiers || "N/A"}</strong>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Pruebas de Color Solicitadas */}
                {selectedHorse.selected_color_tests && selectedHorse.selected_color_tests.length > 0 && (
                  <div className="bg-zinc-50/70 border border-zinc-200 rounded-lg p-5">
                    <div className="flex items-center justify-between border-b border-zinc-200/70 pb-2 mb-3">
                      <h4 className="font-serif text-sm font-semibold text-zinc-900">
                        Pruebas Genéticas de Color ({selectedHorse.selected_color_tests.length})
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-500 font-medium">
                        $450 MXN c/u
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedHorse.selected_color_tests.map((tId) => {
                        const info = COLOR_TESTS_CATALOG.find((c) => c.id === tId);
                        return (
                          <div
                            key={tId}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-md text-xs text-zinc-800 shadow-2xs"
                          >
                            <span className="font-mono text-[10px] text-zinc-500 font-semibold px-1 py-0.5 bg-zinc-100 rounded">
                              {info?.locus || "DNA"}
                            </span>
                            <span className="font-medium">{info?.name || tId}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Desglose de Tarifas */}
                {(() => {
                  const baseMxn = Number(selectedHorse.base_fee_mxn) || 0;
                  const dnaMxn = Number(selectedHorse.dna_fee_mxn) || 0;
                  const pssmMxn = Number(selectedHorse.pssm_fis_fee_mxn) || 0;
                  const prefixMxn = selectedHorse.is_purchasing_prefix
                    ? Number(selectedHorse.prefix_fee_mxn) || 3600
                    : 0;
                  const colorTestsMxn =
                    selectedHorse.color_tests_fee_mxn !== undefined && selectedHorse.color_tests_fee_mxn !== null
                      ? Number(selectedHorse.color_tests_fee_mxn)
                      : (selectedHorse.selected_color_tests?.length || 0) * 450;
                  const subtotal =
                    selectedHorse.subtotal_fee_mxn !== undefined && selectedHorse.subtotal_fee_mxn !== null
                      ? Number(selectedHorse.subtotal_fee_mxn)
                      : baseMxn + dnaMxn + pssmMxn + prefixMxn + colorTestsMxn;

                  const { platformFeeMxn: calcFee, totalMxn: calcTotal } = calculatePlatformFee(subtotal);
                  const platformFee =
                    selectedHorse.platform_fee_mxn !== undefined && selectedHorse.platform_fee_mxn !== null
                      ? Number(selectedHorse.platform_fee_mxn)
                      : calcFee;

                  const totalDisplay =
                    Number(selectedHorse.total_fee_mxn) || calcTotal;

                  return (
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
                        <h4 className="font-serif text-sm font-semibold text-zinc-950">
                          {isPending ? "Desglose de Tarifas Pendientes" : "Desglose Oficial de lo Pagado"}
                        </h4>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-950 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-700 animate-pulse" />
                            Pendiente de Pago
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-950 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
                            Pago Acreditado
                          </span>
                        )}
                      </div>

                      <div className="space-y-2.5 text-xs font-sans">
                        <div className="flex justify-between items-center text-zinc-700">
                          <span>Tarifa Base de Pre-Registro ({selectedHorse.age_category})</span>
                          <span className="font-medium text-zinc-950 font-mono">{formatCurrencyMxn(baseMxn)}</span>
                        </div>

                        <div className="flex justify-between items-center text-zinc-700">
                          <span>Prueba de ADN Obligatoria (Linaje de Raza)</span>
                          <span className="font-medium text-zinc-950 font-mono">{formatCurrencyMxn(dnaMxn)}</span>
                        </div>

                        <div className="flex justify-between items-center text-zinc-700">
                          <span>Panel Diagnóstico Obligatorio (PSSM1 y FIS)</span>
                          <span className="font-medium text-zinc-950 font-mono">{formatCurrencyMxn(pssmMxn)}</span>
                        </div>

                        {prefixMxn > 0 && (
                          <div className="flex justify-between items-center text-zinc-700">
                            <span>Registro de Prefijo Oficial ({selectedHorse.farm_prefix})</span>
                            <span className="font-medium text-red-700 font-mono">{formatCurrencyMxn(prefixMxn)}</span>
                          </div>
                        )}

                        {colorTestsMxn > 0 && (
                          <div className="flex justify-between items-center text-zinc-700">
                            <span>
                              Pruebas Genéticas de Color ({selectedHorse.selected_color_tests?.length || Math.round(colorTestsMxn / 450)})
                            </span>
                            <span className="font-medium text-zinc-950 font-mono">{formatCurrencyMxn(colorTestsMxn)}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-baseline pt-3.5 border-t border-zinc-200">
                          <div>
                            <span className="text-xs uppercase tracking-wider font-bold text-zinc-950 block font-mono">
                              {isPending ? "Total Oficial a Pagar" : "Total Oficial Pagado"}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-sans">
                              {isPending
                                ? `Iniciado: ${formatDate(selectedHorse.created_at)}`
                                : `Fecha de pago: ${formatDate(selectedHorse.paid_at || selectedHorse.created_at)}`}
                            </span>
                          </div>
                          <span className="text-xl font-serif font-bold text-zinc-950">
                            {formatCurrencyMxn(subtotal, true)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer de Acciones del Modal */}
              <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                {isPending ? (
                  <>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDeleteDraft(selectedHorse)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:text-red-700 bg-white hover:bg-zinc-100 border border-zinc-300 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Eliminando borrador...
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar Solicitud Pendiente
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedHorse(null)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-white border border-zinc-300 text-zinc-700 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-100 transition-colors rounded-md cursor-pointer text-center"
                      >
                        Cerrar
                      </button>
                      <Link
                        href={`/dashboard/registro-caballo?draft_id=${selectedHorse.id}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-red-700 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-800 transition-colors rounded-md shadow-xs text-center"
                      >
                        Continuar Solicitud y Pagar →
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-zinc-500 font-sans">
                      Estatus: <strong className="text-zinc-950 font-medium">{selectedHorse.status}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedHorse(null)}
                      className="px-6 py-2.5 bg-zinc-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors rounded-md cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal para Visualizar Foto en Grande */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-transparent">
            <img
              src={activePhoto}
              alt="Vista ampliada de fotografía"
              className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-2 right-2 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
