"use client";

import React from "react";
import { HorseFeeBreakdown } from "@/lib/horse-registration";
import { formatCurrencyMxn } from "@/lib/fees";

interface LiveFeeSummaryProps {
  horseName?: string;
  birthDate?: string;
  gender?: "stallion" | "mare" | "";
  feeBreakdown: HorseFeeBreakdown;
  currentStep: number;
}

export default function LiveFeeSummary({
  horseName,
  birthDate,
  gender,
  feeBreakdown,
  currentStep,
}: LiveFeeSummaryProps) {
  return (
    <div className="w-full bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-50 text-zinc-900 p-5 border-b border-zinc-200">
        <h4 className="font-serif text-base font-semibold text-zinc-950">
          Desglose Oficial de Tarifas
        </h4>
      </div>

      {/* Desglose de Costos */}
      <div className="p-5 space-y-3.5 text-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-zinc-800 block font-medium">Tarifa Base de Pre-Registro</span>
            <span className="text-[11px] text-zinc-500">
              {feeBreakdown.isHardship ? "Nacido en 2017 o antes" : `Según edad: ${feeBreakdown.ageFormatted}`}
            </span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-zinc-900 block">{formatCurrencyMxn(feeBreakdown.baseFeeMxn)}</span>
          </div>
        </div>

        <div className="flex justify-between items-start pt-2 border-t border-zinc-100">
          <div>
            <span className="text-zinc-800 block font-medium">Prueba de ADN Obligatoria</span>
            <span className="text-[11px] text-zinc-500">Tipificación y linaje parental</span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-zinc-900 block">{formatCurrencyMxn(feeBreakdown.dnaFeeMxn)}</span>
          </div>
        </div>

        <div className="flex justify-between items-start pt-2 border-t border-zinc-100">
          <div>
            <span className="text-zinc-800 block font-medium">Pruebas PSSM1 y FIS</span>
            <span className="text-[11px] text-zinc-500">Panel genético oficial GVHS</span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-zinc-900 block">{formatCurrencyMxn(feeBreakdown.pssmFisFeeMxn)}</span>
          </div>
        </div>

        {feeBreakdown.colorTestsCount > 0 && (
          <div className="flex justify-between items-start pt-2 border-t border-zinc-100">
            <div>
              <span className="text-zinc-800 block font-medium">
                Pruebas de Color ({feeBreakdown.colorTestsCount} seleccionada{feeBreakdown.colorTestsCount > 1 ? "s" : ""})
              </span>
              <span className="text-[11px] text-zinc-500">
                Análisis oficial de capas y patrones ($450 MXN c/u)
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-zinc-900 block">
                {formatCurrencyMxn(feeBreakdown.colorTestsFeeMxn)}
              </span>
            </div>
          </div>
        )}

        {/* Total Oficial */}
        <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
          <div>
            <span className="text-sm font-semibold text-zinc-900 block">
              Total Oficial a Pagar
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-zinc-950 block">
              {formatCurrencyMxn(feeBreakdown.subtotalFeeMxn)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="bg-zinc-50 p-4 border-t border-zinc-200 text-zinc-600 text-xs leading-relaxed flex items-start gap-2.5">
        <svg className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          El formato oficial para la toma de muestras de pelo (ADN) se expedirá una vez revisada la solicitud.
        </span>
      </div>
    </div>
  );
}
