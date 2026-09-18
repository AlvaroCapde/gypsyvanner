"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Step {
  number: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  dateBadge?: string;
  highlights?: string[];
  prerequisiteNote?: string;
  hasCost?: boolean;
  ctaText?: string;
  ctaHref?: string;
  isExternal?: boolean;
}

const STEPS: Step[] = [
  {
    number: "01",
    tag: "Paso 1",
    title: "Pagar la membresía",
    description:
      "Adquiere tu membresía oficial anual, requisito indispensable para tener acceso al padrón y pre-registrar caballos.",
    highlights: [
      "Membresía anual activa",
      "Acceso al padrón oficial de criadores",
      "Habilita el inicio de pre-registro de ejemplares",
    ],
    hasCost: true,
    image: "/horse_material/1.jpg",
    ctaText: "Solicitar membresía",
    ctaHref: "/membresia",
  },
  {
    number: "02",
    tag: "Paso 2",
    title: "Pruebas de ADN y pre-registro",
    description:
      "Con tu membresía, comienza a pre-registrar tus caballos, pagando sus pruebas de ADN y enviando la solicitud.",
    highlights: [
      "Pruebas genéticas de salud PSSM1 y FIS",
      "Cotejo de 4 fotografías reglamentarias",
      "Envío de muestras de folículo capilar",
    ],
    hasCost: true,
    image: "/horse_material/6.jpg",
    ctaText: "Ver reglas de pre-registro",
    ctaHref: "/registro",
  },
  {
    number: "03",
    tag: "Paso 3",
    title: "Inserción del microchip",
    description:
      "El equipo se encargará de gestionar contigo la inserción del microchip reglamentario para la plena identificación de tu ejemplar.",
    highlights: [
      "Identificación electrónica inalterable",
      "Gestión y acompañamiento técnico",
      "Requisito reglamentario para inspección",
    ],
    hasCost: false,
    image: "/horse_material/4.jpg",
    ctaText: "Ver proceso de pre-registro",
    ctaHref: "/registro",
  },
  {
    number: "04",
    tag: "Paso 4",
    title: "Inspección Oficial GVHS",
    dateBadge: "9 Mar 2026",
    description:
      "Una vez que te lleguen los documentos, guárdalos y mantente atento para cuando inicie la inscripción registrarte en la inspección oficial.",
    prerequisiteNote:
      "Es necesario concluir todos los pasos anteriores (membresía, pruebas de ADN, pre-registro de caballos) para que documentos y caballos estén listos para la inspección oficial del 9 de marzo de 2026, realizada por jueces oficiales de GVHS. En esta inspección se determinará si el caballo califica como Gypsy Vanner y puede entrar a los libros de registro.",
    hasCost: true,
    image: "/horse_material/5.jpg",
    ctaText: "Preparar pre-registro",
    ctaHref: "/registro",
  },
];

type CostModalTab = "step1" | "step2" | "step4";

export default function RegistrationProcessFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [costModalOpen, setCostModalOpen] = useState<boolean>(false);
  const [costModalTab, setCostModalTab] = useState<CostModalTab>("step1");

  // Manejo de tecla ESC para cerrar modales
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCertificateModal(false);
        setCostModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openCostModal = (tab: CostModalTab = "step1", e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCostModalTab(tab);
    setCostModalOpen(true);
  };

  const handleSelectStep = (idx: number) => {
    setActiveStep(idx);
    const el = document.getElementById(`flujo-paso-${STEPS[idx].number}`);
    if (el && typeof window !== "undefined" && window.innerWidth < 1024) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <section id="proceso-registro" className="w-full bg-zinc-50 py-24 md:py-32 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* Encabezado Editorial con Muestra de Certificado al Lado y Botón de Costos */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-3 flex-wrap">
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-red-700 font-semibold">
                Flujo de Pre-Registro
              </p>
              <span className="text-zinc-300 hidden sm:inline">•</span>
              <button
                type="button"
                onClick={(e) => openCostModal("step1", e)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-white border border-zinc-200 hover:border-zinc-400 px-3 py-1 rounded-full shadow-2xs transition-colors cursor-pointer"
              >
                <span>Ver costos aproximados</span>
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-zinc-950 leading-tight">
              Sé parte de los caballos <span className="text-red-700">fundadores</span>, comienza el pre-registro.
            </h2>
          </div>

          {/* Imagen de certificado en chico al lado del título */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowCertificateModal(true)}
              className="relative w-32 sm:w-36 aspect-[4/3] bg-white p-1 rounded border border-zinc-300 shadow-sm hover:shadow-md hover:border-zinc-400 transition-all cursor-pointer group text-left"
              title="Click para ampliar ejemplo"
            >
              <div className="relative w-full h-full overflow-hidden rounded-xs bg-zinc-100">
                <Image
                  src="/horse_material/2.jpg"
                  alt="Ejemplo del Certificado Oficial GVHS"
                  fill
                  sizes="150px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                  <span className="text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded">
                    <span>🔍</span> Ampliar
                  </span>
                </div>
                <span className="absolute bottom-1 inset-x-1 bg-zinc-950/85 text-[8px] text-white text-center py-0.5 font-sans uppercase tracking-wider font-semibold rounded-xs pointer-events-none">
                  Certificado Oficial
                </span>
              </div>
            </button>
            <span className="text-[10px] text-zinc-500 mt-1 font-light tracking-tight">
              Ejemplo de certificado
            </span>
          </div>
        </div>

        {/* Navegador interactivo de pasos */}
        <div className="grid grid-cols-4 max-w-3xl mx-auto mb-12 border-b border-zinc-200">
          {STEPS.map((step, idx) => (
            <button
              key={step.number}
              type="button"
              onClick={() => handleSelectStep(idx)}
              className={`pb-4 text-center font-sans text-xs uppercase tracking-wider font-semibold transition-all relative flex items-center justify-center gap-2 cursor-pointer ${
                activeStep === idx
                  ? "text-zinc-950"
                  : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  activeStep === idx
                    ? "bg-red-700 text-white"
                    : "bg-zinc-200 text-zinc-600"
                }`}
              >
                {idx + 1}
              </span>
              <span className="hidden sm:inline">{step.tag}</span>
              {activeStep === idx && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-700" />
              )}
            </button>
          ))}
        </div>

        {/* Galería Visual Interactiva de 4 Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => {
            const isActive = activeStep === index;
            const stepTabKey: CostModalTab =
              index === 0 ? "step1" : index === 1 ? "step2" : "step4";

            return (
              <div
                key={step.number}
                id={`flujo-paso-${step.number}`}
                onMouseEnter={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
                className={`group relative bg-white border transition-all duration-500 overflow-hidden cursor-pointer flex flex-col rounded-sm ${
                  isActive
                    ? "border-zinc-950 shadow-xl -translate-y-2 ring-1 ring-zinc-950/10"
                    : "border-zinc-200 hover:border-zinc-400 shadow-sm"
                }`}
              >
                {/* Imagen del Caballo */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover object-center transition-all duration-700 ease-out ${
                      isActive ? "scale-105 saturate-100" : "saturate-[0.85] group-hover:scale-105 group-hover:saturate-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                  <span className="absolute top-4 left-4 font-serif text-2xl font-medium text-white drop-shadow-md">
                    {step.number}
                  </span>
                  {step.dateBadge && (
                    <span className="absolute top-4 right-4 font-sans text-[10px] uppercase tracking-wider font-bold bg-red-700 text-white px-2 py-0.5 rounded shadow-sm">
                      {step.dateBadge}
                    </span>
                  )}
                </div>

                {/* Contenido Editorial */}
                <div className="p-6 flex flex-col flex-grow justify-between bg-white">
                  <div className="space-y-3">
                    <span className="text-[11px] font-sans uppercase tracking-widest text-red-700 font-semibold block">
                      {step.tag}
                    </span>

                    <h3 className="font-serif text-xl sm:text-2xl text-zinc-950 leading-snug">
                      {step.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
                      {step.description}
                    </p>

                    {/* Highlights / Puntos clave */}
                    {step.highlights && step.highlights.length > 0 && (
                      <ul className="space-y-1.5 pt-2 border-t border-zinc-100">
                        {step.highlights.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 font-light">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-700 mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Nota de Requisito Previo (Paso 4) */}
                    {step.prerequisiteNote && (
                      <div className="mt-3 p-3 rounded bg-amber-50/80 border border-amber-200/70 text-[11px] text-zinc-800 leading-relaxed">
                        <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[10px] uppercase tracking-wider mb-1">
                          <svg className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>Requisito Indispensable</span>
                        </div>
                        <p className="font-light text-zinc-700">
                          {step.prerequisiteNote}
                        </p>
                      </div>
                    )}

                    {/* Botón Simple de Ver Desglose de Costos (Pasos 1, 2 y 4) */}
                    {step.hasCost && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => openCostModal(stepTabKey, e)}
                          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 font-medium transition-colors cursor-pointer py-1 group/cost"
                        >
                          <svg className="w-3.5 h-3.5 text-zinc-400 group-hover/cost:text-red-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="underline decoration-zinc-300 underline-offset-2 group-hover/cost:decoration-zinc-950">
                            Ver costos de este paso
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Enlace CTA */}
                  {step.ctaText && step.ctaHref && (
                    <div className="pt-4 mt-4 border-t border-zinc-100">
                      {step.isExternal ? (
                        <a
                          href={step.ctaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-wider font-semibold text-red-700 hover:text-red-800 transition-colors"
                        >
                          {step.ctaText}
                          <svg
                            className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          href={step.ctaHref}
                          className={`inline-flex items-center gap-2 text-xs font-sans uppercase tracking-wider font-semibold transition-colors ${
                            isActive
                              ? "text-red-700 hover:text-red-800"
                              : "text-zinc-900 group-hover:text-red-700"
                          }`}
                        >
                          {step.ctaText}
                          <svg
                            className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner Informativo Destacado de Inspección Oficial */}
        <div className="mt-12 bg-white border border-zinc-200 rounded-sm p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200/60 px-2.5 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-red-700 animate-pulse" />
                  Inspección Oficial GVHS
                </span>
                <span className="text-xs font-semibold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200">
                  9 de Marzo de 2026
                </span>
              </div>
              <h4 className="font-serif text-xl sm:text-2xl text-zinc-950">
                Preparación para la Inspección Presencial de Jueces GVHS
              </h4>
              <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
                Para que tus caballos y documentos estén listos para la evaluación presencial del <strong>9 de marzo de 2026</strong>, es indispensable concluir los 3 pasos previos: membresía anual activa, panel genético de ADN y pre-registro de caballos. En la inspección se determinará si el ejemplar califica como Gypsy Vanner y puede ingresar a los libros oficiales.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0">
              <Link
                href="/membresia"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-700 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-800 transition-colors text-center"
              >
                Comenzar Paso 1
              </Link>
              <button
                type="button"
                onClick={(e) => openCostModal("step1", e)}
                className="inline-flex items-center justify-center px-6 py-3 border border-zinc-300 text-zinc-800 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-100 transition-colors text-center cursor-pointer"
              >
                Ver Costos
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Simple y Conciso de Desglose de Costos */}
      {costModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setCostModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-xl w-full bg-white rounded-lg border border-zinc-200 shadow-xl overflow-hidden my-auto cursor-default flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-wider text-red-700 font-bold block">
                  Tarifas Oficiales GVHS
                </span>
                <h3 className="font-serif text-lg font-bold text-zinc-950">
                  Costos Aproximados del Proceso
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCostModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Pestañas de Pasos */}
            <div className="grid grid-cols-3 border-b border-zinc-200 bg-white text-xs font-sans font-medium px-4 pt-2 gap-2 text-center">
              <button
                type="button"
                onClick={() => setCostModalTab("step1")}
                className={`pb-2 px-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  costModalTab === "step1"
                    ? "border-red-700 text-red-700 font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                }`}
              >
                1. Membresía
              </button>
              <button
                type="button"
                onClick={() => setCostModalTab("step2")}
                className={`pb-2 px-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  costModalTab === "step2"
                    ? "border-red-700 text-red-700 font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                }`}
              >
                2. ADN y Registro
              </button>
              <button
                type="button"
                onClick={() => setCostModalTab("step4")}
                className={`pb-2 px-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  costModalTab === "step4"
                    ? "border-red-700 text-red-700 font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                }`}
              >
                4. Inspección GVHS
              </button>
            </div>

            {/* Contenido Simple y Limpio */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-sans text-zinc-700">
              
              {/* PASO 1 */}
              {costModalTab === "step1" && (
                <div className="p-4 rounded border border-zinc-200 bg-zinc-50/70 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">Paso 1</span>
                      <h4 className="font-serif text-sm font-bold text-zinc-950">Membresía Anual</h4>
                    </div>
                    <span className="font-semibold text-zinc-950 text-sm">$900 MXN</span>
                  </div>
                  <p className="text-zinc-600 font-light leading-relaxed">
                    Cuota anual obligatoria de criador/asociado. Habilita el pre-registro ilimitado de caballos y acceso al padrón oficial.
                  </p>
                </div>
              )}

              {/* PASO 2 */}
              {costModalTab === "step2" && (
                <div className="p-4 rounded border border-zinc-200 bg-zinc-50/70 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">Paso 2</span>
                      <h4 className="font-serif text-sm font-bold text-zinc-950">Pruebas de ADN y Pre-Registro</h4>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-white p-3 rounded border border-zinc-200/80">
                    <span className="font-semibold text-zinc-900 block text-[11px]">1. Pruebas Genéticas Obligatorias:</span>
                    <div className="flex justify-between text-zinc-600 pl-2">
                      <span>• Panel de salud PSSM1 y FIS:</span>
                      <span className="font-medium text-zinc-900">$3,240 MXN</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 pl-2">
                      <span>• Marcadores de ADN y paternidad:</span>
                      <span className="font-medium text-zinc-900">$1,440 MXN</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-white p-3 rounded border border-zinc-200/80">
                    <span className="font-semibold text-zinc-900 block text-[11px]">2. Tarifa Base por Edad:</span>
                    <div className="flex justify-between text-zinc-600 pl-2">
                      <span>• 0 a 6 meses:</span>
                      <span className="font-medium text-zinc-900">$1,350 MXN</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 pl-2">
                      <span>• 6 meses a &lt;3 años:</span>
                      <span className="font-medium text-zinc-900">$1,800 MXN</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 pl-2">
                      <span>• 3 años en adelante:</span>
                      <span className="font-medium text-zinc-900">$2,250 MXN</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 pl-2">
                      <span>• Hardship (≤2017 sin papeles):</span>
                      <span className="font-medium text-zinc-900">$4,500 MXN</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 italic pl-1">
                    * Pruebas de color opcionales: $450 MXN c/u.
                  </p>
                </div>
              )}

              {/* PASO 4 */}
              {costModalTab === "step4" && (
                <div className="p-4 rounded border border-zinc-200 bg-zinc-50/70 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">Paso 4</span>
                      <h4 className="font-serif text-sm font-bold text-zinc-950">Inspección Oficial GVHS (9 Mar 2026)</h4>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-white p-3 rounded border border-zinc-200/80">
                    <div className="flex justify-between text-zinc-700">
                      <span>Menores de 3 años:</span>
                      <span className="font-bold text-zinc-950">$2,500 MXN</span>
                    </div>
                    <div className="flex justify-between text-zinc-700">
                      <span>Mayores de 3 años:</span>
                      <span className="font-bold text-zinc-950">$4,000 MXN</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 italic">
                    + Costo administrativo de emisión del certificado al calificar.
                  </p>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-3 bg-zinc-100 border-t border-zinc-200 flex justify-end">
              <button
                type="button"
                onClick={() => setCostModalOpen(false)}
                className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vista Completa del Certificado de Ejemplo */}
      {showCertificateModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowCertificateModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-md border border-zinc-300 shadow-2xl p-5 sm:p-6 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-700 block">
                  Gypsy Vanner Horse Society
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-zinc-900">
                  Muestra de Certificado Oficial
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-[4/3] w-full bg-zinc-100 rounded overflow-hidden border border-zinc-200 shadow-inner">
              <Image
                src="/horse_material/2.jpg"
                alt="Muestra de Certificado Oficial GVHS"
                fill
                sizes="(max-width: 640px) 90vw, 500px"
                className="object-cover object-center"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-zinc-950/85 backdrop-blur-sm text-white text-[11px] px-3 py-1.5 rounded text-center">
                Documento oficial expedido al culminar registro e inspección
              </div>
            </div>

            <p className="text-xs text-zinc-500 mt-3 text-center italic">
              Imagen de muestra provisional. Será sustituida por el formato oficial definitivo.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}


