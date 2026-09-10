"use client";

import React, { useState, useMemo } from "react";
import { COLOR_TESTS_CATALOG, ColorTestOption, COLOR_TEST_FEE_MXN } from "@/lib/horse-registration";
import { formatCurrencyMxn } from "@/lib/fees";

interface ColorTestingStepProps {
  selectedTests: string[];
  onChange: (selected: string[]) => void;
}

type CategoryFilter = "all" | "base_color" | "dilutions" | "white_patterns" | "modifiers";

export default function ColorTestingStep({
  selectedTests,
  onChange,
}: ColorTestingStepProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const toggleTest = (testId: string) => {
    if (selectedTests.includes(testId)) {
      onChange(selectedTests.filter((id) => id !== testId));
    } else {
      onChange([...selectedTests, testId]);
    }
  };

  const handleSelectAll = (testIds: string[]) => {
    const combined = Array.from(new Set([...selectedTests, ...testIds]));
    onChange(combined);
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const toggleDetails = (testId: string) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };

  // Filter tests based on category and search query
  const filteredTests = useMemo(() => {
    return COLOR_TESTS_CATALOG.filter((test) => {
      const matchesCategory =
        activeCategory === "all" || test.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        test.name.toLowerCase().includes(q) ||
        test.locus.toLowerCase().includes(q) ||
        test.summary.toLowerCase().includes(q) ||
        test.details.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalSelectedCostMxn = selectedTests.length * COLOR_TEST_FEE_MXN;

  return (
    <div className="space-y-8">
      {/* Header del Paso */}
      <div className="border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-red-700 font-semibold">
            Paso 4 de 5
          </span>
          <span className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-mono uppercase">
            Opcional
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-zinc-950">
          Pruebas Genéticas de Color y Patrones
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Selecciona las pruebas adicionales de color que deseas realizar para tu ejemplar. Cada prueba tiene una tarifa oficial de <strong>{formatCurrencyMxn(COLOR_TEST_FEE_MXN)}</strong> ($25 USD) y los resultados se certificarán en su pre-registro y registro oficial.
        </p>
      </div>

      {/* Banner de Estado de Selección */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0 text-zinc-700 shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-950 font-serif">
                {selectedTests.length === 0
                  ? "Sin pruebas de color adicionales seleccionadas"
                  : `${selectedTests.length} prueba${selectedTests.length > 1 ? "s" : ""} de color seleccionada${selectedTests.length > 1 ? "s" : ""}`}
              </span>
              {selectedTests.length > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  +{formatCurrencyMxn(totalSelectedCostMxn)}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {selectedTests.length === 0
                ? "Este paso es 100% opcional. Si no deseas pruebas de color, puedes continuar directamente al siguiente paso."
                : "Se añadirán al formato de ADN y se enviarán junto con las muestras capilares obligatorias."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          {selectedTests.length > 0 && (
            <button
              type="button"
              onClick={handleDeselectAll}
              className="text-xs text-red-700 hover:text-red-800 font-medium px-3 py-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
            >
              Desmarcar todas
            </button>
          )}
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Categorías */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all" as const, label: "Todas (18)" },
            { id: "base_color" as const, label: "Color Base (2)" },
            { id: "dilutions" as const, label: "Diluciones (5)" },
            { id: "white_patterns" as const, label: "Patrones Blancos (8)" },
            { id: "modifiers" as const, label: "Modificadores (3)" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative min-w-[200px] sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar prueba o gen..."
            className="w-full bg-white border border-zinc-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 placeholder:text-zinc-400"
          />
          <svg
            className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-xs text-zinc-400 hover:text-zinc-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid de 18 Pruebas de Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map((test) => {
          const isSelected = selectedTests.includes(test.id);
          const isExpanded = !!expandedDetails[test.id];

          return (
            <div
              key={test.id}
              onClick={() => toggleTest(test.id)}
              className={`border rounded-xl p-5 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-zinc-950 bg-zinc-950 text-white shadow-md ring-1 ring-zinc-950"
                  : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:shadow-xs"
              }`}
            >
              <div>
                {/* Fila superior: Checkbox, Nombre y Precio */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded mt-0.5 border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-white border-white text-zinc-950"
                          : "border-zinc-300 bg-zinc-50"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold leading-tight">
                        {test.name}
                      </h4>
                      <span
                        className={`inline-block font-mono text-[11px] mt-0.5 ${
                          isSelected ? "text-zinc-300" : "text-zinc-500"
                        }`}
                      >
                        {test.locus}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded font-mono flex-shrink-0 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-zinc-100 text-zinc-900 border border-zinc-200"
                    }`}
                  >
                    {formatCurrencyMxn(test.priceMxn)}
                  </span>
                </div>

                {/* Resumen corto */}
                <p
                  className={`text-xs leading-relaxed mt-2 ${
                    isSelected ? "text-zinc-200" : "text-zinc-600"
                  }`}
                >
                  {test.summary}
                </p>

                {/* Detalle ampliado si está abierto */}
                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`mt-3 pt-3 border-t text-xs leading-relaxed animate-fadeIn ${
                      isSelected
                        ? "border-white/20 text-zinc-300 bg-white/5 p-3 rounded"
                        : "border-zinc-200 text-zinc-700 bg-zinc-50 p-3 rounded"
                    }`}
                  >
                    <span className="font-semibold block mb-1">Efectos y Alelos Detectados:</span>
                    {test.details}
                  </div>
                )}
              </div>

              {/* Botón inferior para alternar explicación técnica */}
              <div className="mt-3 pt-2 border-t flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider ${
                    isSelected ? "text-zinc-400" : "text-zinc-400"
                  }`}
                >
                  {test.categoryLabel}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDetails(test.id);
                  }}
                  className={`text-xs underline transition-colors cursor-pointer ${
                    isSelected
                      ? "text-zinc-300 hover:text-white"
                      : "text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  {isExpanded ? "Ocultar detalles" : "Ver detalles genéticos"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-10 bg-zinc-50 border border-zinc-200 rounded-lg">
          <p className="text-sm text-zinc-500">
            No se encontraron pruebas que coincidan con &quot;{searchQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-2 text-xs text-red-700 underline font-medium"
          >
            Restablecer filtros
          </button>
        </div>
      )}
    </div>
  );
}
