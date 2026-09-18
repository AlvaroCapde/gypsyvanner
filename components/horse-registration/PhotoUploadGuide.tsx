"use client";

import React, { useState, useEffect, useRef } from "react";

interface PhotoUploadGuideProps {
  photos: {
    photoLeft: string;
    photoRight: string;
    photoFront: string;
    photoRear: string;
  };
  onPhotoChange: (key: "photoLeft" | "photoRight" | "photoFront" | "photoRear", dataUrl: string) => void;
  errors?: Record<string, string>;
}

interface PhotoSlotConfig {
  key: "photoLeft" | "photoRight" | "photoFront" | "photoRear";
  title: string;
  subtitle: string;
  exampleImg: string;
  aspect: string;
  orientation: "landscape" | "portrait";
  orientationLabel: string;
  tip: string;
}

const PHOTO_SLOTS: PhotoSlotConfig[] = [
  {
    key: "photoLeft",
    title: "Perfil Lateral Izquierdo",
    subtitle: "Cuerpo entero del caballo desde su lado izquierdo (cabeza a cola, orejas a cascos).",
    exampleImg: "/horse_material/ejemplo_lado_izq.png",
    aspect: "aspect-[4/3]",
    orientation: "landscape",
    orientationLabel: "Horizontal (4:3 o 3:2)",
    tip: "Caballo completo de perfil; orejas erguidas, plumas y cascos sin cortar por pasto o lodo.",
  },
  {
    key: "photoRight",
    title: "Perfil Lateral Derecho",
    subtitle: "Cuerpo entero del caballo desde su lado derecho (cabeza a cola, orejas a cascos).",
    exampleImg: "/horse_material/ejemplo_lado_der.png",
    aspect: "aspect-[4/3]",
    orientation: "landscape",
    orientationLabel: "Horizontal (4:3 o 3:2)",
    tip: "Se imprimirá directamente en el certificado oficial de registro junto con el perfil izquierdo.",
  },
  {
    key: "photoFront",
    title: "Frente Directo",
    subtitle: "Vista frontal completa y centrada: cabeza, pecho, extremidades anteriores y cascos.",
    exampleImg: "/horse_material/ejemplo_frente.png",
    aspect: "aspect-[3/4]",
    orientation: "portrait",
    orientationLabel: "Vertical (3:4 o 9:16)",
    tip: "Toma vertical de cuerpo entero frente a la cámara para verificar simetría y manchas faciales.",
  },
  {
    key: "photoRear",
    title: "Parte Trasera",
    subtitle: "Vista posterior con la cola apartada o trenzada para registrar corvejones y patas.",
    exampleImg: "/horse_material/ejemplo_trasera.png",
    aspect: "aspect-[3/4]",
    orientation: "portrait",
    orientationLabel: "Vertical (3:4 o 9:16)",
    tip: "Apartar o amarrar la cola es indispensable para registrar las marcas de las patas traseras.",
  },
];

interface ActivePreviewState {
  url: string;
  title: string;
  subtitle?: string;
  isOfficialExample?: boolean;
}

export default function PhotoUploadGuide({
  photos,
  onPhotoChange,
  errors = {},
}: PhotoUploadGuideProps) {
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activePreview, setActivePreview] = useState<ActivePreviewState | null>(null);
  const [draggingSlot, setDraggingSlot] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Manejador para cerrar preview con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePreview(null);
        setShowGuideModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Helper para comprimir y redimensionar imagen en el cliente preservando aspecto al 100%
  const handleFileSelected = (
    key: "photoLeft" | "photoRight" | "photoFront" | "photoRear",
    file: File
  ) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX_DIM = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          onPhotoChange(key, e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        onPhotoChange(key, compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (
    key: "photoLeft" | "photoRight" | "photoFront" | "photoRear",
    e: React.DragEvent
  ) => {
    e.preventDefault();
    setDraggingSlot(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelected(key, file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Guía Banner */}
      <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-zinc-950 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-md bg-zinc-950 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-zinc-950 text-base">
              Guía Oficial para Fotografías Reglamentarias GVHS
            </h4>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed font-sans">
              Se requieren <strong>4 fotografías completas de orejas a cascos</strong>. El visor inspecciona el <strong>100% del encuadre sin recortes</strong> para garantizar que el ejemplar cumpla con los estándares de emisión del certificado.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowGuideModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white border border-zinc-300 text-zinc-900 text-xs font-semibold uppercase tracking-wider rounded-md shadow-xs hover:bg-zinc-50 transition-colors flex-shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver Ejemplos Oficiales
        </button>
      </div>

      {/* Grid de 4 Ranuras de Fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PHOTO_SLOTS.map((slot) => {
          const photoValue = photos[slot.key];
          const hasError = !!errors[slot.key];
          const isDragging = draggingSlot === slot.key;

          return (
            <div
              key={slot.key}
              className={`bg-white border rounded-xl p-6 transition-all flex flex-col justify-between shadow-xs ${
                hasError
                  ? "border-red-600 ring-1 ring-red-600"
                  : photoValue
                  ? "border-zinc-300 bg-white"
                  : isDragging
                  ? "border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div>
                {/* Cabecera del Slot */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <h5 className="font-serif text-base font-semibold text-zinc-950">
                      {slot.title}
                    </h5>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                      {slot.orientation === "landscape" ? "Horizontal" : "Vertical"}
                    </span>
                  </div>

                  {photoValue ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-950 text-white text-[10px] font-mono font-medium rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      Cargada
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-red-700 font-semibold">* Requerida</span>
                  )}
                </div>

                <p className="text-xs text-zinc-500 mb-4 leading-relaxed font-sans">{slot.subtitle}</p>

                {/* Input de archivo oculto para reuso en Subir y Cambiar */}
                <input
                  ref={(el) => {
                    fileInputRefs.current[slot.key] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelected(slot.key, file);
                    e.target.value = "";
                  }}
                />

                {/* Área de Visualización / Subida con Proporción Natural del Ángulo */}
                {photoValue ? (
                  <div className="space-y-2.5 mb-3">
                    {/* Contenedor Fotográfico con Visor Oscuro de Inspección Completa */}
                    <div
                      className={`relative group rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950 ${slot.aspect} flex items-center justify-center shadow-inner`}
                    >
                      {/* Imagen con object-contain para CERO recortes */}
                      <img
                        src={photoValue}
                        alt={slot.title}
                        className="w-full h-full object-contain p-1 select-none"
                      />

                      {/* Insignia Flotante de Verificación */}
                      <div className="absolute top-2 left-2 pointer-events-none">
                        <span className="inline-flex items-center gap-1 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/15 shadow-sm">
                          <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                          Vista Completa (100%)
                        </span>
                      </div>

                      {/* Overlay al hacer hover en escritorio con acceso rápido */}
                      <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                        <button
                          type="button"
                          onClick={() =>
                            setActivePreview({
                              url: photoValue,
                              title: slot.title,
                              subtitle: slot.subtitle,
                            })
                          }
                          className="px-3 py-1.5 bg-white text-zinc-950 rounded text-xs font-semibold hover:bg-zinc-100 shadow-md cursor-pointer transition-colors"
                        >
                          🔍 Ampliar
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[slot.key]?.click()}
                          className="px-3 py-1.5 bg-zinc-800 text-white rounded text-xs font-semibold hover:bg-zinc-700 shadow-md cursor-pointer transition-colors"
                        >
                          🔄 Cambiar
                        </button>
                        <button
                          type="button"
                          onClick={() => onPhotoChange(slot.key, "")}
                          className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 shadow-md cursor-pointer transition-colors"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>

                    {/* Barra de Acciones siempre visible (Garantiza usabilidad en Móviles y Tablets) */}
                    <div className="flex items-center justify-between gap-2 px-1">
                      <button
                        type="button"
                        onClick={() =>
                          setActivePreview({
                            url: photoValue,
                            title: slot.title,
                            subtitle: slot.subtitle,
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-zinc-950 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                        Ampliar foto
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[slot.key]?.click()}
                          className="text-xs font-medium text-zinc-600 hover:text-zinc-950 underline cursor-pointer"
                        >
                          Cambiar
                        </button>
                        <button
                          type="button"
                          onClick={() => onPhotoChange(slot.key, "")}
                          className="text-xs font-medium text-red-600 hover:text-red-700 underline cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Zona de Arrastre (Dropzone) adaptada a la orientación recomendada */
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDraggingSlot(slot.key);
                    }}
                    onDragLeave={() => setDraggingSlot(null)}
                    onDrop={(e) => handleDrop(slot.key, e)}
                    onClick={() => fileInputRefs.current[slot.key]?.click()}
                    className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${slot.aspect} mb-4 ${
                      isDragging
                        ? "border-zinc-900 bg-zinc-100/90 scale-[0.99]"
                        : "border-zinc-300 hover:border-zinc-500 bg-zinc-50/60 hover:bg-zinc-100/60"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-zinc-200 flex items-center justify-center text-zinc-500 mb-3 group-hover:scale-105 transition-transform">
                      {slot.orientation === "landscape" ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 text-center">
                      Subir {slot.title}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 mt-1 text-center">
                      Orientación: {slot.orientationLabel}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-1">
                      Haz clic o arrastra la foto aquí (JPG/PNG)
                    </span>
                  </div>
                )}
              </div>

              {hasError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1 mb-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors[slot.key]}</span>
                </div>
              )}

              {/* Botón de referencia de ejemplo oficial */}
              <button
                type="button"
                onClick={() =>
                  setActivePreview({
                    url: slot.exampleImg,
                    title: `Ejemplo Oficial: ${slot.title}`,
                    subtitle: slot.tip,
                    isOfficialExample: true,
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-700 font-medium mt-2 self-start cursor-pointer transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ver ejemplo oficial de este ángulo
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Guía Completa de Fotos con Visores Sin Recorte */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 sm:p-8 shadow-2xl border border-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-red-700 font-semibold">
                  Normativa Oficial GVHS
                </span>
                <h3 className="font-serif text-2xl text-zinc-950 mt-0.5">
                  Cómo Tomar las Fotografías Reglamentarias
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Puntos Clave */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs leading-relaxed text-zinc-700 space-y-2 font-sans">
                <p className="font-serif font-semibold text-zinc-950 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-700" />
                  Reglas Fundamentales:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-zinc-600">
                  <li>El caballo debe ocupar la mayor parte del encuadre <strong>sin recortar orejas ni cascos</strong>.</li>
                  <li>Parado sobre superficie limpia que deje ver claramente las <strong>plumas</strong> de las patas (evitar hierba alta o lodo).</li>
                  <li>Bien iluminado, de preferencia con luz natural lateral o frontal sin sombras duras.</li>
                </ul>
              </div>

              <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs leading-relaxed text-zinc-700 space-y-2 font-sans">
                <p className="font-serif font-semibold text-zinc-950 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-950" />
                  Encuadre de la Toma Trasera:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-zinc-600">
                  <li>En ejemplares con cola abundante, <strong>apartar o trenzar la cola</strong> temporalmente.</li>
                  <li>Esto es indispensable para registrar con exactitud las manchas y marcas de las extremidades posteriores.</li>
                  <li>Las tomas laterales serán las que se impriman en el certificado de registro.</li>
                </ul>
              </div>
            </div>

            {/* Ejemplos Visuales Divididos por Orientación Natural */}
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-lg text-zinc-950 font-semibold">
                    1. Vistas Laterales (Encuadre Horizontal)
                  </h4>
                  <span className="text-xs text-zinc-500 font-mono">
                    Perfil Izquierdo y Derecho (4:3 o 3:2)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PHOTO_SLOTS.filter((s) => s.orientation === "landscape").map((slot) => (
                    <div
                      key={slot.key}
                      className="bg-zinc-100 border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-zinc-950 flex items-center justify-center p-2">
                        <img
                          src={slot.exampleImg}
                          alt={slot.title}
                          className="w-full h-full object-contain select-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setActivePreview({
                              url: slot.exampleImg,
                              title: `Ejemplo Oficial: ${slot.title}`,
                              subtitle: slot.tip,
                              isOfficialExample: true,
                            })
                          }
                          className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/80 hover:bg-black text-white text-[11px] rounded font-medium shadow cursor-pointer transition-colors"
                        >
                          🔍 Ampliar
                        </button>
                      </div>
                      <div className="p-3.5 bg-white border-t border-zinc-200">
                        <span className="text-xs font-semibold text-zinc-950 block font-serif">
                          {slot.title}
                        </span>
                        <span className="text-[11px] text-zinc-500 block mt-0.5 font-sans">
                          {slot.tip}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-lg text-zinc-950 font-semibold">
                    2. Vistas Frontal y Trasera (Encuadre Vertical)
                  </h4>
                  <span className="text-xs text-zinc-500 font-mono">
                    De orejas a cascos (3:4 o 9:16)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PHOTO_SLOTS.filter((s) => s.orientation === "portrait").map((slot) => (
                    <div
                      key={slot.key}
                      className="bg-zinc-100 border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative aspect-[3/4] max-h-[380px] bg-zinc-950 flex items-center justify-center p-2">
                        <img
                          src={slot.exampleImg}
                          alt={slot.title}
                          className="w-full h-full object-contain select-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setActivePreview({
                              url: slot.exampleImg,
                              title: `Ejemplo Oficial: ${slot.title}`,
                              subtitle: slot.tip,
                              isOfficialExample: true,
                            })
                          }
                          className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/80 hover:bg-black text-white text-[11px] rounded font-medium shadow cursor-pointer transition-colors"
                        >
                          🔍 Ampliar
                        </button>
                      </div>
                      <div className="p-3.5 bg-white border-t border-zinc-200">
                        <span className="text-xs font-semibold text-zinc-950 block font-serif">
                          {slot.title}
                        </span>
                        <span className="text-[11px] text-zinc-500 block mt-0.5 font-sans">
                          {slot.tip}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right border-t border-zinc-200 pt-4">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-6 py-2.5 bg-zinc-950 text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                Entendido, Continuar con la Carga
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Ampliado en Alta Definición y 100% Sin Recortes */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 cursor-pointer"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra Superior del Modal */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-800 bg-zinc-900/90 text-white">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <h4 className="text-sm sm:text-base font-serif font-semibold text-white">
                    {activePreview.title}
                  </h4>
                  {activePreview.subtitle && (
                    <p className="text-[11px] text-zinc-400 truncate max-w-md">
                      {activePreview.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  100% Sin Recortes
                </span>
                <button
                  type="button"
                  onClick={() => setActivePreview(null)}
                  className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Visor de Imagen Completa */}
            <div className="flex-1 flex items-center justify-center p-3 sm:p-6 min-h-[300px] overflow-hidden bg-zinc-950">
              <img
                src={activePreview.url}
                alt={activePreview.title}
                className="max-h-[72vh] max-w-full object-contain rounded select-none shadow-lg"
              />
            </div>

            {/* Pie del Visor */}
            <div className="px-4 sm:px-6 py-2.5 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>
                {activePreview.isOfficialExample
                  ? "Referencia oficial proporcionada por la Gypsy Vanner Horse Society (GVHS)."
                  : "Fotografía cargada por el usuario tal como será evaluada y registrada."}
              </span>
              <button
                type="button"
                onClick={() => setActivePreview(null)}
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

