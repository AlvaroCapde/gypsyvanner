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
    <div className="w-full bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden border-t-2 border-t-red-700">
      {/* Header */}
      <div className="bg-zinc-50 text-zinc-900 p-5 border-b border-zinc-200">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-700 font-semibold block mb-1">
          Tarifas Oficiales
        </span>
        <h4 className="font-serif text-lg font-semibold text-zinc-950">
          Desglose del Pre-Registro
        </h4>
      </div>

      {/* Desglose de Costos */}
      <div className="p-5 space-y-3.5 text-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-zinc-900 block font-medium">Tarifa Base de Pre-Registro</span>
            <span className="text-[11px] text-zinc-500 font-sans">
              {feeBreakdown.isHardship ? "Nacido en 2017 o antes (Hardship)" : `Según edad: ${feeBreakdown.ageFormatted}`}
            </span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-zinc-950 font-mono block">{formatCurrencyMxn(feeBreakdown.baseFeeMxn)}</span>
          </div>
        </div>

        <div className="flex justify-between items-start pt-2.5 border-t border-zinc-100">
          <div>
            <span className="text-zinc-900 block font-medium">Prueba de ADN Obligatoria</span>
            <span className="text-[11px] text-zinc-500 font-sans">Tipificación y linaje parental</span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-zinc-950 font-mono block">{formatCurrencyMxn(feeBreakdown.dnaFeeMxn)}</span>
          </div>
        </div>

        <div className="flex justify-between items-start pt-2.5 border-t border-zinc-100">
          <div>
            <span className="text-zinc-900 block font-medium">Pruebas PSSM1 y FIS</span>
            <span className="text-[11px] text-zinc-500 font-sans">Panel genético oficial estatutario</span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-zinc-950 font-mono block">{formatCurrencyMxn(feeBreakdown.pssmFisFeeMxn)}</span>
          </div>
        </div>

        {feeBreakdown.colorTestsCount > 0 && (
          <div className="flex justify-between items-start pt-2.5 border-t border-zinc-100">
            <div>
              <span className="text-zinc-900 block font-medium">
                Pruebas de Color ({feeBreakdown.colorTestsCount})
              </span>
              <span className="text-[11px] text-zinc-500 font-sans">
                Análisis oficial de capas ($450 MXN c/u)
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-zinc-950 font-mono block">
                {formatCurrencyMxn(feeBreakdown.colorTestsFeeMxn)}
              </span>
            </div>
          </div>
        )}

        {feeBreakdown.isPurchasingPrefix && (
          <div className="flex justify-between items-start pt-2.5 border-t border-zinc-100">
            <div>
              <span className="text-zinc-900 block font-medium">
                Registro de Prefijo Oficial
              </span>
              <span className="text-[11px] text-zinc-500 font-sans">
                {feeBreakdown.farmPrefix ? `Prefijo: ${feeBreakdown.farmPrefix}` : "Adquisición y protección GVHS"} ($200 USD)
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-red-700 font-mono block">
                {formatCurrencyMxn(feeBreakdown.prefixFeeMxn)}
              </span>
            </div>
          </div>
        )}

        {/* Total Oficial */}
        <div className="pt-4 border-t border-zinc-200 flex justify-between items-baseline">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">
              Total Oficial a Pagar
            </span>
            <span className="text-[11px] text-zinc-400 font-sans">
              Moneda nacional (MXN)
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-serif font-bold text-zinc-950 block">
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
        <span className="font-sans">
          El formato oficial para la toma de muestras de pelo (ADN) se expedirá una vez revisada la solicitud.
        </span>
      </div>
    </div>
  );
}
