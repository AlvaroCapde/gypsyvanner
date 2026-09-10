"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  calculateHorseFee,
  DNA_FEE_MXN,
  PSSM_FIS_FEE_MXN,
  COLOR_TESTS_CATALOG,
  COMMON_COAT_COLORS,
  COMMON_COAT_PATTERNS,
  COMMON_COUNTRIES,
  GVHS_POLICIES_TEXT,
  HorseRegistrationFormData,
} from "@/lib/horse-registration";
import { formatCurrencyMxn } from "@/lib/fees";
import LiveFeeSummary from "./LiveFeeSummary";
import PhotoUploadGuide from "./PhotoUploadGuide";
import ColorTestingStep from "./ColorTestingStep";

interface HorseRegistrationWizardProps {
  initialOwnerName: string;
  userEmail: string;
}

export default function HorseRegistrationWizard({
  initialOwnerName,
  userEmail,
}: HorseRegistrationWizardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isCanceled = searchParams?.get("canceled") === "true";
  const draftIdParam = searchParams?.get("draft_id");

  const storageKey = `gvhs_horse_reg_draft_${userEmail ? encodeURIComponent(userEmail) : "default"}`;

  // Wizard Step (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);
  const [draftId, setDraftId] = useState<string | null>(draftIdParam || null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<HorseRegistrationFormData>>({
    horseName: "",
    ownerName: initialOwnerName || "",
    acquisitionDate: "",
    gender: "stallion",
    birthDate: "",
    countryOfBirth: "México",
    currentHeight: "",
    currentHeightDate: "",
    expectedHeight: "",
    hasPassport: false,
    importDate: "",
    passportNumber: "",
    coatColor: "",
    coatPattern: "",
    colorDetails: "",
    microchipOrIdentifiers: "",
    photoLeft: "",
    photoRight: "",
    photoFront: "",
    photoRear: "",
    selectedColorTests: [],
    acknowledgePolicies: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdRegistrationId, setCreatedRegistrationId] = useState<string | null>(null);
  const [activeReviewPhoto, setActiveReviewPhoto] = useState<{ url: string; label: string } | null>(null);

  // Restauración inicial del borrador (LocalStorage + Supabase autoritativo)
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // 1. Restaurar primero de LocalStorage de forma inmediata
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.formData && typeof parsed.formData === "object") {
          setFormData((prev) => ({
            ...prev,
            ...parsed.formData,
            selectedColorTests: Array.isArray(parsed.formData.selectedColorTests)
              ? parsed.formData.selectedColorTests
              : [],
            ownerName: parsed.formData.ownerName || initialOwnerName || "",
          }));
          if (parsed.draftId) {
            setDraftId(parsed.draftId);
          }
          if (isCanceled) {
            setCurrentStep(5);
          } else if (parsed.currentStep && parsed.currentStep > 1) {
            setCurrentStep(parsed.currentStep);
          }
          setHasRestoredDraft(true);
        }
      }
    } catch (e) {
      console.warn("No se pudo leer borrador local:", e);
    }

    // 2. Si viene de cancelación o hay un draft_id en URL, cargar versión autoritativa desde la base de datos
    if (isCanceled || draftIdParam) {
      setIsLoadingDraft(true);
      const endpoint = draftIdParam
        ? `/api/horse-registrations/draft?id=${draftIdParam}`
        : `/api/horse-registrations/draft`;

      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
          if (data?.draft) {
            setFormData((prev) => ({
              ...prev,
              ...data.draft,
              selectedColorTests: Array.isArray(data.draft.selectedColorTests)
                ? data.draft.selectedColorTests
                : [],
              ownerName: data.draft.ownerName || initialOwnerName || "",
            }));
            if (data.draftId) {
              setDraftId(data.draftId);
            }
            if (isCanceled || draftIdParam) {
              setCurrentStep(5);
            }
            setHasRestoredDraft(true);
          }
        })
        .catch((err) => {
          console.warn("No se pudo obtener borrador remoto:", err);
        })
        .finally(() => {
          setIsLoadingDraft(false);
        });
    }
  }, [isCanceled, draftIdParam, storageKey, initialOwnerName]);

  // Guardar automáticamente en LocalStorage cuando cambien los datos o el paso
  useEffect(() => {
    // Si el formulario está totalmente vacío en el paso 1, no guardar
    if (!formData.horseName && !formData.birthDate && currentStep === 1) {
      return;
    }

    try {
      const payload = {
        formData,
        currentStep,
        draftId,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (quotaErr) {
      // Si las fotos base64 excedieron el límite de almacenamiento del navegador, guardar solo texto
      try {
        const { photoLeft, photoRight, photoFront, photoRear, ...textOnly } = formData;
        const fallback = {
          formData: textOnly,
          currentStep,
          draftId,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(fallback));
      } catch (innerErr) {
        console.warn("No fue posible guardar borrador local reducido:", innerErr);
      }
    }
  }, [formData, currentStep, draftId, storageKey]);

  // Descartar borrador y limpiar todo
  const handleDiscardDraft = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas descartar este borrador y comenzar una solicitud limpia desde el inicio?"
      )
    ) {
      try {
        localStorage.removeItem(storageKey);
      } catch {}
      setDraftId(null);
      setHasRestoredDraft(false);
      setFormData({
        horseName: "",
        ownerName: initialOwnerName || "",
        acquisitionDate: "",
        gender: "stallion",
        birthDate: "",
        countryOfBirth: "México",
        hasPassport: false,
        importDate: "",
        passportNumber: "",
        coatColor: "",
        coatPattern: "",
        colorDetails: "",
        microchipOrIdentifiers: "",
        photoLeft: "",
        photoRight: "",
        photoFront: "",
        photoRear: "",
        selectedColorTests: [],
        acknowledgePolicies: false,
      });
      setCurrentStep(1);
      setErrors({});
      setSubmitError("");
      router.replace("/dashboard/registro-caballo");
    }
  };

  // Real-time Fee calculation (incluye pruebas de color)
  const feeBreakdown = useMemo(() => {
    return calculateHorseFee(formData.birthDate || "", formData.selectedColorTests || []);
  }, [formData.birthDate, formData.selectedColorTests]);

  // Handle generic input changes
  const handleInputChange = (
    field: keyof HorseRegistrationFormData,
    value: HorseRegistrationFormData[keyof HorseRegistrationFormData] | string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error if present
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Validate step before advancing
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.horseName?.trim()) {
        newErrors.horseName = "El nombre solicitado del caballo es requerido.";
      }
      if (!formData.ownerName?.trim()) {
        newErrors.ownerName = "El nombre del propietario(s) es requerido.";
      }
      if (!formData.gender) {
        newErrors.gender = "Selecciona el género del ejemplar.";
      }
      if (!formData.birthDate) {
        newErrors.birthDate = "La fecha de nacimiento es requerida para calcular la tarifa.";
      }
      if (!formData.acquisitionDate) {
        newErrors.acquisitionDate = "La fecha de adquisición es requerida.";
      }
      if (!formData.countryOfBirth?.trim()) {
        newErrors.countryOfBirth = "El país de nacimiento es requerido.";
      }
      if (!formData.currentHeight?.trim()) {
        newErrors.currentHeight = "La estatura actual del caballo es requerida.";
      }
      if (!formData.currentHeightDate) {
        newErrors.currentHeightDate = "La fecha de estatura actual es requerida.";
      }
      if (!formData.expectedHeight?.trim()) {
        newErrors.expectedHeight = "La estatura esperada del caballo es requerida.";
      }
    }

    if (step === 2 && formData.hasPassport) {
      if (!formData.passportNumber?.trim()) {
        newErrors.passportNumber = "El número de pasaporte es requerido.";
      }
      if (!formData.coatColor?.trim()) {
        newErrors.coatColor = "El color de capa/pelaje es requerido.";
      }
      if (!formData.coatPattern?.trim()) {
        newErrors.coatPattern = "El patrón de capa es requerido.";
      }
    }

    if (step === 3) {
      if (!formData.photoLeft) newErrors.photoLeft = "La foto de perfil izquierdo es requerida.";
      if (!formData.photoRight) newErrors.photoRight = "La foto de perfil derecho es requerida.";
      if (!formData.photoFront) newErrors.photoFront = "La foto de frente es requerida.";
      if (!formData.photoRear) newErrors.photoRear = "La foto trasera es requerida.";
    }

    // Paso 4 (Pruebas de Color) es opcional, no tiene campos bloqueantes

    if (step === 5) {
      if (!formData.acknowledgePolicies) {
        newErrors.acknowledgePolicies = "Debes aceptar las políticas y directrices de la GVHS.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Seguridad estricta: Solo permitir checkout si el usuario está físicamente en el Paso 5
    if (currentStep !== 5) {
      return;
    }

    // Validar pasos críticos y políticas
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(5)) {
      if (!validateStep(5)) {
        // errors.acknowledgePolicies se mostrará junto al checkbox
      } else {
        setSubmitError("Por favor verifica que todos los campos y fotografías obligatorios estén completos en los pasos anteriores.");
      }
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("/api/horse-registrations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          draftId: draftId || formData.draftId || undefined,
          feeBreakdown,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo generar la orden de pago para el pre-registro.");
      }

      if (!result.url) {
        throw new Error("No se recibió la dirección de la pasarela de pago.");
      }

      // Guardar id del borrador localmente antes de redirigir a Stripe
      if (result.registrationId) {
        setDraftId(result.registrationId);
        setFormData((prev) => ({ ...prev, draftId: result.registrationId }));
        try {
          const payload = {
            formData: { ...formData, draftId: result.registrationId },
            currentStep: 5,
            draftId: result.registrationId,
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem(storageKey, JSON.stringify(payload));
        } catch {}
      }

      // Redirigir a la pasarela de pago oficial de Stripe
      window.location.href = result.url;
    } catch (err: unknown) {
      console.error("Error submitting horse registration checkout:", err);
      const msg = err instanceof Error ? err.message : "Ocurrió un error al preparar el pago de la solicitud.";
      setSubmitError(msg);
      setIsSubmitting(false);
    }
  };

  // Pantalla de Éxito
  if (isSuccess) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white border border-zinc-200 p-8 sm:p-12 shadow-sm my-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold block mb-2">
          Solicitud Recibida con Éxito
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-zinc-950 mb-2">
          {formData.horseName} ha sido registrado para revisión
        </h2>
        {createdRegistrationId && (
          <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-600 font-mono text-xs rounded mb-4">
            Folio Oficial: #{createdRegistrationId.slice(0, 8).toUpperCase()}
          </span>
        )}
        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
          Hemos generado el expediente de pre-registro para tu ejemplar con la categoría{" "}
          <strong>{feeBreakdown.categoryLabel}</strong>. Nuestro equipo verificará las fotografías y datos ingresados.
        </p>

        {/* Resumen Card */}
        <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg text-left max-w-md mx-auto mb-8 text-sm space-y-3">
          <div className="flex justify-between pb-2 border-b border-zinc-200">
            <span className="text-zinc-500">Propietario(s):</span>
            <span className="font-medium text-zinc-900">{formData.ownerName}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-zinc-200">
            <span className="text-zinc-500">Género:</span>
            <span className="font-medium text-zinc-900">
              {formData.gender === "stallion" ? "Semental" : "Yegua"}
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-zinc-200">
            <span className="text-zinc-500">Total de Tarifas Oficiales:</span>
            <span className="font-bold text-zinc-950">
              ${feeBreakdown.subtotalFeeMxn.toLocaleString()} MXN
            </span>
          </div>
          <div className="pt-1 text-xs text-zinc-500 leading-relaxed">
            Te notificaremos por correo electrónico (<strong>{userEmail}</strong>) en cuanto tu kit oficial de muestra de pelo (ADN) esté listo para ser enviado.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-zinc-950 text-white text-xs uppercase tracking-wider font-semibold px-8 py-4 hover:bg-zinc-800 transition-colors"
          >
            Volver al Portal de Miembros
          </Link>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem(storageKey);
              } catch {}
              setDraftId(null);
              setHasRestoredDraft(false);
              setIsSuccess(false);
              setCurrentStep(1);
              setFormData({
                horseName: "",
                ownerName: initialOwnerName || "",
                acquisitionDate: "",
                gender: "stallion",
                birthDate: "",
                countryOfBirth: "México",
                hasPassport: false,
                importDate: "",
                passportNumber: "",
                coatColor: "",
                coatPattern: "",
                colorDetails: "",
                microchipOrIdentifiers: "",
                photoLeft: "",
                photoRight: "",
                photoFront: "",
                photoRear: "",
                selectedColorTests: [],
                acknowledgePolicies: false,
              });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-zinc-300 text-zinc-800 text-xs uppercase tracking-wider font-semibold px-8 py-4 hover:bg-zinc-50 transition-colors"
          >
            Registrar Otro Ejemplar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      {/* Stepper Progress Header */}
      <div className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {[
            { step: 1, title: "1. Identidad del Ejemplar", optional: false },
            { step: 2, title: "2. Pasaporte e Identificación", optional: false },
            { step: 3, title: "3. Fotografías Reglamentarias", optional: false },
            { step: 4, title: "4. Pruebas de Color", optional: true },
            { step: 5, title: "5. Revisión Final", optional: false },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                if (item.step < currentStep) setCurrentStep(item.step);
              }}
              disabled={item.step > currentStep}
              className={`text-left p-3.5 border transition-all ${currentStep === item.step
                ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                : currentStep > item.step
                  ? "bg-zinc-100 text-zinc-900 border-zinc-300 hover:bg-zinc-200 cursor-pointer"
                  : "bg-white text-zinc-400 border-zinc-200 cursor-not-allowed opacity-60"
                }`}
            >
              <span className="text-[11px] font-mono tracking-wider uppercase block opacity-80">
                Paso {item.step} {item.optional ? "• Opcional" : ""}
              </span>
              <span className="font-serif text-sm font-medium truncate block">
                {item.title.split(". ")[1]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {isCanceled && (
        <div className="mb-8 p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-amber-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold text-amber-950">El proceso de pago fue cancelado.</p>
              <p className="text-amber-800">Tus datos continúan listos para reintentar cuando gustes.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDiscardDraft}
            className="text-[11px] font-semibold uppercase tracking-wider text-amber-900 hover:text-red-700 bg-amber-100 hover:bg-amber-200/80 px-3.5 py-2 rounded transition-colors self-start sm:self-auto cursor-pointer flex-shrink-0"
          >
            Descartar borrador y empezar de nuevo
          </button>
        </div>
      )}

      {isLoadingDraft && (
        <div className="mb-6 p-3.5 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-md text-xs flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span>Restaurando los datos guardados de tu solicitud de pre-registro...</span>
        </div>
      )}

      {!isCanceled && draftIdParam && (
        <div className="mb-8 p-4 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-blue-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-blue-950">Continuando solicitud de pre-registro: {formData.horseName || "Ejemplar"}</p>
              <p className="text-blue-800">Tus datos y fotografías reglamentarias han sido recuperados. Puedes revisar los detalles y proceder al pago.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDiscardDraft}
            className="text-[11px] font-semibold uppercase tracking-wider text-blue-900 hover:text-red-700 bg-blue-100 hover:bg-blue-200/80 px-3.5 py-2 rounded transition-colors self-start sm:self-auto cursor-pointer flex-shrink-0"
          >
            Descartar borrador
          </button>
        </div>
      )}

      {!isCanceled && !draftIdParam && hasRestoredDraft && formData.horseName && (
        <div className="mb-6 p-3.5 bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-lg text-xs flex items-center justify-between">
          <span>
            Borrador guardado recuperado: <strong>{formData.horseName}</strong>.
          </span>
          <button
            type="button"
            onClick={handleDiscardDraft}
            className="text-zinc-500 hover:text-red-700 underline text-[11px] font-medium ml-3 cursor-pointer"
          >
            Limpiar y empezar nuevo
          </button>
        </div>
      )}

      {submitError && (
        <div className="mb-8 p-4 bg-red-50 text-red-800 border border-red-200 rounded-md text-sm flex items-center justify-between">
          <span>{submitError}</span>
          <button type="button" onClick={() => setSubmitError("")} className="text-red-700 font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Form Container */}
      <div className="w-full bg-white border border-zinc-200 p-6 sm:p-10 shadow-sm">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* PASO 1: IDENTIDAD Y LINAJE */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="border-b border-zinc-200 pb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-red-700 font-semibold">
                  Paso 1 de 5
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-zinc-950 mt-1">
                  Identidad y Datos Básicos
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Ingresa los datos generales del caballo tal como deseas que aparezcan en el certificado oficial.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Requested Horse Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                    Nombre Solicitado para el Caballo *
                  </label>
                  <input
                    type="text"
                    value={formData.horseName || ""}
                    onChange={(e) => handleInputChange("horseName", e.target.value)}
                    placeholder="Ej. Royal Sovereign of GVHS"
                    className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                  />
                  {errors.horseName && (
                    <p className="text-xs text-red-600 mt-1.5">{errors.horseName}</p>
                  )}
                </div>

                {/* Name of Owner(s) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                    Nombre del Propietario(s) *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName || ""}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    placeholder="Nombre del propietario o copropietarios"
                    className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Prellenado con el nombre de tu cuenta de socio. Puedes editarlo si está en copropiedad.
                  </p>
                  {errors.ownerName && (
                    <p className="text-xs text-red-600 mt-1.5">{errors.ownerName}</p>
                  )}
                </div>

                {/* Gender Radio Cards */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-800 mb-2">
                    Género del Ejemplar *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`border p-4 flex items-center gap-3 cursor-pointer transition-all ${formData.gender === "stallion"
                        ? "border-zinc-950 bg-zinc-900 text-white shadow-sm"
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 text-zinc-800"
                        }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="stallion"
                        checked={formData.gender === "stallion"}
                        onChange={() => handleInputChange("gender", "stallion")}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.gender === "stallion"
                          ? "border-white"
                          : "border-zinc-400"
                          }`}
                      >
                        {formData.gender === "stallion" && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <span className="block text-sm font-serif font-semibold">
                          Semental
                        </span>

                      </div>
                    </label>

                    <label
                      className={`border p-4 flex items-center gap-3 cursor-pointer transition-all ${formData.gender === "mare"
                        ? "border-zinc-950 bg-zinc-900 text-white shadow-sm"
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 text-zinc-800"
                        }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="mare"
                        checked={formData.gender === "mare"}
                        onChange={() => handleInputChange("gender", "mare")}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.gender === "mare"
                          ? "border-white"
                          : "border-zinc-400"
                          }`}
                      >
                        {formData.gender === "mare" && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <span className="block text-sm font-serif font-semibold">
                          Yegua
                        </span>
                      </div>
                    </label>
                  </div>
                  {errors.gender && (
                    <p className="text-xs text-red-600 mt-1.5">{errors.gender}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={formData.birthDate || ""}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Determina la tarifa base automáticamente.
                  </p>
                  {formData.birthDate && (
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded text-xs text-zinc-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
                      <span>Edad estimada: <strong>{feeBreakdown.ageFormatted}</strong></span>
                    </div>
                  )}
                  {errors.birthDate && (
                    <p className="text-xs text-red-600 mt-1.5">{errors.birthDate}</p>
                  )}
                </div>

                {/* Date acquired */}
                <div>
                  <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                    Fecha de Adquisición *
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={formData.acquisitionDate || ""}
                    onChange={(e) => handleInputChange("acquisitionDate", e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Fecha en que pasó a ser de tu propiedad.
                  </p>
                  {errors.acquisitionDate && (
                    <p className="text-xs text-red-600 mt-1.5">{errors.acquisitionDate}</p>
                  )}
                </div>

                {/* Country of Birth */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                    País de Nacimiento *
                  </label>
                  <select
                    value={formData.countryOfBirth || "México"}
                    onChange={(e) => handleInputChange("countryOfBirth", e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                  >
                    {COMMON_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.countryOfBirth && (
                    <p className="text-xs text-red-600 mt-1.5">{errors.countryOfBirth}</p>
                  )}
                </div>

                {/* Estatura y Medidas del Ejemplar */}
                <div className="md:col-span-2 pt-4 border-t border-zinc-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                      Estatura y Medidas del Ejemplar
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Estatura Actual */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                        Estatura Actual *
                      </label>
                      <input
                        type="text"
                        value={formData.currentHeight || ""}
                        onChange={(e) => handleInputChange("currentHeight", e.target.value)}
                        placeholder="Ej. 14.2 hh ó 148 cm"
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">
                        En manos (hh) o centímetros.
                      </p>
                      {errors.currentHeight && (
                        <p className="text-xs text-red-600 mt-1.5">{errors.currentHeight}</p>
                      )}
                    </div>

                    {/* Fecha de Estatura Actual */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                        Fecha de Estatura Actual *
                      </label>
                      <input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        value={formData.currentHeightDate || ""}
                        onChange={(e) => handleInputChange("currentHeightDate", e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Fecha en que se midió.
                      </p>
                      {errors.currentHeightDate && (
                        <p className="text-xs text-red-600 mt-1.5">{errors.currentHeightDate}</p>
                      )}
                    </div>

                    {/* Estatura Esperada */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                        Estatura Esperada *
                      </label>
                      <input
                        type="text"
                        value={formData.expectedHeight || ""}
                        onChange={(e) => handleInputChange("expectedHeight", e.target.value)}
                        placeholder="Ej. 14.2 hh ó 150 cm"
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Estatura estimada a la madurez.
                      </p>
                      {errors.expectedHeight && (
                        <p className="text-xs text-red-600 mt-1.5">{errors.expectedHeight}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: PASAPORTE E IDENTIFICACIÓN (CONDICIONAL) */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="border-b border-zinc-200 pb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-red-700 font-semibold">
                  Paso 2 de 5
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-zinc-950 mt-1">
                  Pasaporte e Identificación del Ejemplar
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Indica si el caballo cuenta con pasaporte oficial internacional emitido y señas particulares.
                </p>
              </div>

              {/* Has passport Checkbox Card */}
              <div
                className={`p-5 border transition-all cursor-pointer rounded-lg ${formData.hasPassport
                  ? "bg-red-50/40 border-red-200"
                  : "bg-zinc-50 border-zinc-200"
                  }`}
                onClick={() => handleInputChange("hasPassport", !formData.hasPassport)}
              >
                <label className="flex items-start gap-3.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.hasPassport}
                    onChange={(e) => handleInputChange("hasPassport", e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-red-700 rounded border-zinc-300 focus:ring-red-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-base font-serif font-semibold text-zinc-950 block">
                      ¿Tu caballo cuenta con Pasaporte Equino Internacional?
                    </span>
                    <span className="text-xs text-zinc-500 leading-relaxed block mt-1">
                      Marca esta casilla si el caballo fue importado o posee pasaporte oficial de la Unión Europea, EE. UU. u otra asociación internacional reconocida.
                    </span>
                  </div>
                </label>
              </div>

              {/* Campos Condicionales de Pasaporte */}
              {formData.hasPassport ? (
                <div className="p-6 bg-white border border-zinc-200 rounded-lg space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-2 text-zinc-950 font-serif text-lg border-b border-zinc-200 pb-3">
                    <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Datos del Pasaporte y Características
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Number of passport */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                        Número de Pasaporte (UELN) *
                      </label>
                      <input
                        type="text"
                        value={formData.passportNumber || ""}
                        onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                        placeholder="Ej. 826073001234567"
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                      />
                      {errors.passportNumber && (
                        <p className="text-xs text-red-600 mt-1.5">{errors.passportNumber}</p>
                      )}
                    </div>

                    {/* Date of import */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                        Fecha de Importación a México
                      </label>
                      <input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        value={formData.importDate || ""}
                        onChange={(e) => handleInputChange("importDate", e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                      />
                    </div>

                    {/* Coat Color */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                        Color de Capa / Pelaje *
                      </label>
                      <select
                        value={formData.coatColor || ""}
                        onChange={(e) => handleInputChange("coatColor", e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                      >
                        <option value="">-- Selecciona el color de pelaje --</option>
                        {COMMON_COAT_COLORS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {errors.coatColor && (
                        <p className="text-xs text-red-600 mt-1.5">{errors.coatColor}</p>
                      )}
                    </div>

                    {/* Coat Pattern */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                        Patrón de Capa *
                      </label>
                      <select
                        value={formData.coatPattern || ""}
                        onChange={(e) => handleInputChange("coatPattern", e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                      >
                        <option value="">-- Selecciona el patrón de capa --</option>
                        {COMMON_COAT_PATTERNS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      {errors.coatPattern && (
                        <p className="text-xs text-red-600 mt-1.5">{errors.coatPattern}</p>
                      )}
                    </div>

                    {/* Additional color info */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                        Descripción e Información Adicional de Color
                      </label>
                      <textarea
                        rows={3}
                        value={formData.colorDetails || ""}
                        onChange={(e) => handleInputChange("colorDetails", e.target.value)}
                        placeholder="Describe detalles como caretos, luceros, calzados en patas o características específicas del pelaje."
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                      />
                    </div>

                    {/* Microchip / Identifiers */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-800 mb-1.5">
                        Número de Microchip y/o Señas Particulares
                      </label>
                      <input
                        type="text"
                        value={formData.microchipOrIdentifiers || ""}
                        onChange={(e) => handleInputChange("microchipOrIdentifiers", e.target.value)}
                        placeholder="Número de microchip, cicatrices o marcas"
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans"
                      />
                      <p className="text-xs text-zinc-500 mt-1">
                        Si tiene microchip implantado, indícalo aquí para su verificación con el pasaporte.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-zinc-50 border border-dashed border-zinc-200 rounded-lg text-center">
                  <p className="text-sm text-zinc-600">
                    Has indicado que el ejemplar <strong>no cuenta con pasaporte internacional previo</strong>.
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    El registro oficial de la GVHS México emitirá su primer certificado oficial de linaje una vez aprobadas las pruebas de ADN.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PASO 3: GUÍA Y CARGA DE FOTOGRAFÍAS */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="border-b border-zinc-200 pb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-red-700 font-semibold">
                  Paso 3 de 5
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-zinc-950 mt-1">
                  Fotografías Reglamentarias del Caballo
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Sube las 4 tomas requeridas para el padrón oficial y el certificado impreso.
                </p>
              </div>

              <PhotoUploadGuide
                photos={{
                  photoLeft: formData.photoLeft || "",
                  photoRight: formData.photoRight || "",
                  photoFront: formData.photoFront || "",
                  photoRear: formData.photoRear || "",
                }}
                onPhotoChange={(key, dataUrl) => handleInputChange(key, dataUrl)}
                errors={errors}
              />
            </div>
          )}

          {/* PASO 4: PRUEBAS GENÉTICAS DE COLOR (OPCIONAL) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <ColorTestingStep
                selectedTests={formData.selectedColorTests || []}
                onChange={(tests) => handleInputChange("selectedColorTests", tests)}
              />
            </div>
          )}

          {/* PASO 5: PRUEBAS OBLIGATORIAS, POLÍTICAS GVHS Y REVISIÓN */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="border-b border-zinc-200 pb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-red-700 font-semibold">
                  Paso 5 de 5
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-zinc-950 mt-1">
                  Revisión Final
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Revisa las pruebas diagnósticas, los datos del ejemplar y las condiciones de certificación de la sociedad.
                </p>
              </div>

              {/* Pruebas Obligatorias Card */}
              <div className="bg-white border border-zinc-200 p-6 rounded-xl space-y-4 shadow-sm">
                <div>
                  <h4 className="font-serif text-lg font-medium text-zinc-950">Panel Diagnóstico Obligatorio</h4>
                  <p className="text-xs text-zinc-500">Requisito estatutario para la autenticación de linaje</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200/80">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-medium text-sm text-zinc-900">Prueba de ADN Obligatoria</span>
                      <span className="font-semibold text-sm text-zinc-900">{formatCurrencyMxn(DNA_FEE_MXN)}</span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Verifica el parentesco genético y el perfil de marcadores de raza.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200/80">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-medium text-sm text-zinc-900">Pruebas PSSM1 y FIS</span>
                      <span className="font-semibold text-sm text-zinc-900">{formatCurrencyMxn(PSSM_FIS_FEE_MXN)}</span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Detección de Miopatía por Almacenamiento de Polisacáridos y Síndrome de Inmunodeficiencia del Potro.
                    </p>
                  </div>
                </div>
              </div>

              {/* Políticas e Información Oficial */}
              <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
                <ul className="space-y-2.5 text-xs text-zinc-700 leading-relaxed">
                  <li className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200/60">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{GVHS_POLICIES_TEXT.dnaFormNotice}</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200/60">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{GVHS_POLICIES_TEXT.resultsNotice}</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200/60">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{GVHS_POLICIES_TEXT.privacyNotice}</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200/60">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span><strong>{GVHS_POLICIES_TEXT.certificatePrintNotice}</strong></span>
                  </li>
                </ul>
              </div>

              {/* Resumen Final de Datos */}
              <div className="bg-white border border-zinc-200 p-6 rounded-lg text-sm space-y-4">
                <h4 className="font-serif text-base font-semibold text-zinc-950 pb-2 border-b border-zinc-200">
                  Revisión de Datos del Ejemplar
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-600">
                  <div>
                    <span className="text-zinc-400 block">Nombre del Caballo:</span>
                    <strong className="text-zinc-900 text-sm">{formData.horseName}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Propietario Registrado:</span>
                    <strong className="text-zinc-900 text-sm">{formData.ownerName}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Género:</span>
                    <strong className="text-zinc-900">
                      {formData.gender === "stallion" ? "Semental" : "Yegua"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Fecha de Nacimiento y Categoría:</span>
                    <strong className="text-zinc-900">
                      {formData.birthDate} ({feeBreakdown.categoryLabel})
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">País de Origen:</span>
                    <strong className="text-zinc-900">{formData.countryOfBirth}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Pasaporte Internacional:</span>
                    <strong className="text-zinc-900">
                      {formData.hasPassport ? `Sí (No. ${formData.passportNumber})` : "No posee"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Estatura Actual:</span>
                    <strong className="text-zinc-900">
                      {formData.currentHeight || "No especificada"}
                      {formData.currentHeightDate ? ` (Medida el ${formData.currentHeightDate})` : ""}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Estatura Esperada:</span>
                    <strong className="text-zinc-900">
                      {formData.expectedHeight || "No especificada"}
                    </strong>
                  </div>
                </div>

                {/* Pruebas de Color Seleccionadas en la Revisión */}
                <div className="pt-3 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                      Pruebas Genéticas de Color ({(formData.selectedColorTests || []).length} seleccionadas):
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-[11px] text-zinc-600 hover:text-zinc-950 font-medium underline cursor-pointer"
                    >
                      Modificar pruebas
                    </button>
                  </div>
                  {formData.selectedColorTests && formData.selectedColorTests.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {formData.selectedColorTests.map((tId) => {
                        const info = COLOR_TESTS_CATALOG.find((c) => c.id === tId);
                        return (
                          <span
                            key={tId}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-800"
                          >
                            <span className="font-mono text-[10px] text-zinc-500 font-semibold">
                              {info?.locus || "DNA"}
                            </span>
                            <span className="font-medium">{info?.name || tId}</span>
                            <span className="text-[11px] font-semibold text-zinc-900">
                              ${formatCurrencyMxn(450)}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">
                      No se han seleccionado pruebas de color adicionales. (Paso opcional).
                    </p>
                  )}
                </div>

                {/* Miniaturas de fotografías adjuntas */}
                {(formData.photoLeft || formData.photoRight || formData.photoFront || formData.photoRear) && (
                  <div className="pt-3 border-t border-zinc-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                        Fotografías Reglamentarias ({[formData.photoLeft, formData.photoRight, formData.photoFront, formData.photoRear].filter(Boolean).length} de 4 cargadas):
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-[11px] text-zinc-600 hover:text-zinc-950 font-medium underline cursor-pointer"
                      >
                        Modificar fotos
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { key: "photoLeft", label: "Perfil Izquierdo", url: formData.photoLeft },
                        { key: "photoRight", label: "Perfil Derecho", url: formData.photoRight },
                        { key: "photoFront", label: "Frente Directo", url: formData.photoFront },
                        { key: "photoRear", label: "Parte Trasera", url: formData.photoRear },
                      ].map((p) => (
                        <div
                          key={p.key}
                          className="relative aspect-[4/3] bg-zinc-950 rounded-md border border-zinc-800 overflow-hidden flex items-center justify-center group shadow-xs"
                        >
                          {p.url ? (
                            <>
                              <img
                                src={p.url}
                                alt={p.label}
                                className="w-full h-full object-contain p-1 select-none"
                              />
                              <button
                                type="button"
                                onClick={() => setActiveReviewPhoto({ url: p.url!, label: p.label })}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-medium transition-opacity cursor-pointer gap-1"
                              >
                                <span>🔍</span>
                                <span>Ver completa</span>
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500 font-mono bg-zinc-900">
                              Sin cargar
                            </div>
                          )}
                          <span className="absolute bottom-0 inset-x-0 bg-zinc-950/85 text-[10px] text-white text-center py-0.5 font-mono truncate px-1 border-t border-zinc-800 pointer-events-none">
                            {p.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Desglose Oficial de Tarifas (Solo en el Paso 5) */}
              <LiveFeeSummary
                horseName={formData.horseName}
                birthDate={formData.birthDate}
                gender={formData.gender}
                feeBreakdown={feeBreakdown}
                currentStep={currentStep}
              />

              {/* Checkbox Aceptación de Políticas */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!formData.acknowledgePolicies}
                    onChange={(e) => handleInputChange("acknowledgePolicies", e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-800 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-700 leading-relaxed">
                    He leído y acepto los términos de pre-registro, el envío del kit de muestra capilar y la inclusión de los resultados genéticos en el expediente y certificado de la GVHS México.
                  </span>
                </label>
                {errors.acknowledgePolicies && (
                  <p className="text-xs text-red-600 mt-1.5">{errors.acknowledgePolicies}</p>
                )}
              </div>
            </div>
          )}

          {/* Controles de Navegación del Stepper */}
          <div className="mt-10 pt-6 border-t border-zinc-200 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-6 py-3.5 bg-zinc-100 text-zinc-800 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                ← Paso Anterior
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-wider"
              >
                Cancelar
              </Link>
            )}

            {currentStep < 5 ? (
              <button
                key={`btn-next-step-${currentStep}`}
                type="button"
                onClick={handleNext}
                className="px-8 py-3.5 bg-zinc-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Continuar al Paso {currentStep + 1} →
              </button>
            ) : (
              <button
                key="btn-submit-registration"
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-4 bg-red-700 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-800 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Conectando con la pasarela de pago seguro...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pagar Pre-Registro y Enviar Solicitud
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal de Inspección Completa de Foto en el Resumen */}
      {activeReviewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setActiveReviewPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900 text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-serif font-semibold text-sm sm:text-base">
                  {activeReviewPhoto.label} - Vista Completa (100% Sin Recortes)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveReviewPhoto(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 bg-zinc-950 min-h-[300px]">
              <img
                src={activeReviewPhoto.url}
                alt={activeReviewPhoto.label}
                className="max-h-[75vh] max-w-full object-contain rounded select-none"
              />
            </div>
            <div className="px-5 py-2.5 bg-zinc-900 border-t border-zinc-800 text-right">
              <button
                type="button"
                onClick={() => setActiveReviewPhoto(null)}
                className="text-xs text-zinc-300 hover:text-white underline cursor-pointer"
              >
                Cerrar vista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
