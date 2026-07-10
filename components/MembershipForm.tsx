"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  applicationType: z.enum(["new", "renewal"], {
    message: "Por favor seleccione un tipo de aplicación.",
  }),
  membershipType: z.enum(["general", "associate", "youth", "lifetime"], {
    message: "Por favor seleccione un tipo de membresía.",
  }),
  name: z.string().min(2, "El nombre completo es requerido."),
  farmName: z.string().optional(),
  email: z.string().email("Debe ser un correo electrónico válido."),
  telephone: z.string().min(8, "El teléfono de contacto es requerido."),
  acknowledgeRules: z.boolean().refine((val) => val === true, {
    message: "Debe reconocer y aceptar las reglas de la sociedad.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function MembershipForm() {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage("");
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ocurrió un error al procesar el pago.");
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setErrorMessage(error.message || "No se pudo iniciar el proceso de pago.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm ring-1 ring-zinc-200">
      {errorMessage && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
          {errorMessage}
        </div>
      )}

      {/* 1. Tipo de Aplicación */}
      <div className="mb-12">
        <h3 className="font-serif text-2xl text-zinc-950 border-b border-zinc-200 pb-4 mb-6">Tipo de Solicitud</h3>
        <div className="flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" value="new" {...register("applicationType")} className="w-4 h-4 text-red-700 focus:ring-red-700 accent-red-700" />
            <span className="font-sans text-zinc-800">Nuevo Miembro</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" value="renewal" {...register("applicationType")} className="w-4 h-4 text-red-700 focus:ring-red-700 accent-red-700" />
            <span className="font-sans text-zinc-800">Renovación</span>
          </label>
        </div>
        {errors.applicationType && <p className="mt-2 text-sm text-red-600">{errors.applicationType.message}</p>}
      </div>

      {/* 2. Tipo de Membresía */}
      <div className="mb-12">
        <h3 className="font-serif text-2xl text-zinc-950 border-b border-zinc-200 pb-4 mb-6">Tipo de Membresía</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-start gap-3 p-4 ring-1 ring-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
            <input type="radio" value="general" {...register("membershipType")} className="mt-1 w-4 h-4 accent-red-700" />
            <div>
              <div className="font-sans font-medium text-zinc-950">General ($80 Anual)</div>
              <div className="text-sm text-zinc-500 mt-1">Con derecho a voto, para propietarios de Gypsy Vanner.</div>
            </div>
          </label>
          <label className="flex items-start gap-3 p-4 ring-1 ring-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
            <input type="radio" value="associate" {...register("membershipType")} className="mt-1 w-4 h-4 accent-red-700" />
            <div>
              <div className="font-sans font-medium text-zinc-950">Asociado ($50 Anual)</div>
              <div className="text-sm text-zinc-500 mt-1">Sin derecho a voto, para amigos de la GVHS.</div>
            </div>
          </label>
          <label className="flex items-start gap-3 p-4 ring-1 ring-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
            <input type="radio" value="youth" {...register("membershipType")} className="mt-1 w-4 h-4 accent-red-700" />
            <div>
              <div className="font-sans font-medium text-zinc-950">Joven ($25 Anual)</div>
              <div className="text-sm text-zinc-500 mt-1">Membresía anual para jóvenes.</div>
            </div>
          </label>
          <label className="flex items-start gap-3 p-4 ring-1 ring-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
            <input type="radio" value="lifetime" {...register("membershipType")} className="mt-1 w-4 h-4 accent-red-700" />
            <div>
              <div className="font-sans font-medium text-zinc-950">Vitalicia ($1200)</div>
              <div className="text-sm text-zinc-500 mt-1">Membresía de por vida.</div>
            </div>
          </label>
        </div>
        {errors.membershipType && <p className="mt-2 text-sm text-red-600">{errors.membershipType.message}</p>}
      </div>

      {/* 3. Datos Personales */}
      <div className="mb-12">
        <h3 className="font-serif text-2xl text-zinc-950 border-b border-zinc-200 pb-4 mb-6">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Nombre Completo *</label>
            <input type="text" {...register("name")} className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Nombre de Granja / Rancho (Opcional)</label>
            <input type="text" {...register("farmName")} className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" />
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Correo Electrónico *</label>
            <input type="email" {...register("email")} className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Teléfono *</label>
            <input type="tel" {...register("telephone")} className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" />
            {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>}
          </div>
        </div>
      </div>

      {/* 4. Acuerdos Legales */}
      <div className="mb-12 bg-zinc-50 p-6 ring-1 ring-zinc-200">
        <label className="flex items-start gap-4 cursor-pointer">
          <input type="checkbox" {...register("acknowledgeRules")} className="mt-1 w-5 h-5 accent-red-700 flex-shrink-0" />
          <div className="font-sans text-sm text-zinc-700 leading-relaxed">
            Reconozco que he leído la Historia, Misión y Objetivos de la Gypsy Vanner Horse Society, y comprendo las reglas relativas a la membresía, derechos de voto y beneficios de los miembros. Por la presente envío mi solicitud de membresía.
          </div>
        </label>
        {errors.acknowledgeRules && <p className="mt-3 text-sm text-red-600">{errors.acknowledgeRules.message}</p>}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="group relative inline-flex items-center justify-center bg-red-700 text-white font-sans text-sm tracking-wider uppercase font-medium px-10 py-4 overflow-hidden transition-all duration-500 hover:bg-red-800 disabled:bg-zinc-400 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-3">
            {isSubmitting ? "Procesando..." : "Enviar Solicitud"}
            {!isSubmitting && (
              <svg className="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
