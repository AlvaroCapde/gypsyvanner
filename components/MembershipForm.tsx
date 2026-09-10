"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { parsePhoneNumberFromString, AsYouType, CountryCode } from "libphonenumber-js";

const COUNTRIES: { code: CountryCode; label: string; dialCode: string }[] = [
  { code: "MX", label: "México", dialCode: "+52" },
  { code: "US", label: "Estados Unidos", dialCode: "+1" },
  { code: "CA", label: "Canadá", dialCode: "+1" },
  { code: "ES", label: "España", dialCode: "+34" },
  { code: "CO", label: "Colombia", dialCode: "+57" },
  { code: "AR", label: "Argentina", dialCode: "+54" },
  { code: "CL", label: "Chile", dialCode: "+56" },
  { code: "GT", label: "Guatemala", dialCode: "+502" },
];

const formSchema = z.object({
  applicationType: z.literal("new"),
  membershipType: z.literal("associate"),
  name: z.string().min(2, "El nombre completo es requerido."),
  farmName: z.string().optional(),
  email: z.string().email("Debe ser un correo electrónico válido."),
  telephone: z.string().min(1, "El teléfono celular es requerido."),
  street: z.string().min(3, "La calle y número son requeridos."),
  colonia: z.string().min(2, "La colonia es requerida."),
  postalCode: z.string().min(4, "El código postal es requerido."),
  city: z.string().min(2, "La ciudad es requerida."),
  state: z.string().min(2, "El estado es requerido."),
  acknowledgeRules: z.boolean().refine((val) => val === true, {
    message: "Debe reconocer y aceptar las reglas de la sociedad.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function MembershipForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("MX");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationType: "new",
      membershipType: "associate",
      telephone: "",
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const asYouType = new AsYouType(selectedCountry);
    const formatted = asYouType.input(rawVal);
    setPhoneDisplay(formatted);
    setPhoneError("");

    // Validate phone number
    const parsed = parsePhoneNumberFromString(rawVal, selectedCountry);
    if (parsed && parsed.isValid()) {
      setValue("telephone", parsed.format("E.164"), { shouldValidate: true });
    } else {
      setValue("telephone", rawVal, { shouldValidate: false });
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value as CountryCode;
    setSelectedCountry(newCountry);
    // Reformat existing input if present
    if (phoneDisplay) {
      const asYouType = new AsYouType(newCountry);
      const formatted = asYouType.input(phoneDisplay);
      setPhoneDisplay(formatted);
      const parsed = parsePhoneNumberFromString(phoneDisplay, newCountry);
      if (parsed && parsed.isValid()) {
        setValue("telephone", parsed.format("E.164"), { shouldValidate: true });
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage("");
      setPhoneError("");

      // Final strict E.164 validation before submission
      const parsed = parsePhoneNumberFromString(data.telephone, selectedCountry);
      if (!parsed || !parsed.isValid()) {
        const errorMsg = "Por favor ingresa un número de teléfono celular válido para recibir el código SMS de acceso.";
        setPhoneError(errorMsg);
        return;
      }

      const canonicalPhone = parsed.format("E.164");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          telephone: canonicalPhone,
          applicationType: "new",
          membershipType: "associate",
        }),
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

      {/* Membresía */}
      <div className="mb-12">
        <h3 className="font-serif text-2xl text-zinc-950 border-b border-zinc-200 pb-4 mb-6">Membresía</h3>
        <div className="p-5 border border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-red-700 flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="font-sans font-medium text-zinc-950 text-base">
              Membresía de Asociado
            </div>
          </div>
          <div className="font-sans font-semibold text-zinc-950 text-base">
            $900 MXN <span className="text-xs text-zinc-500 font-normal">/ Anual</span>
          </div>
          <input 
            type="hidden" 
            value="associate" 
            {...register("membershipType")} 
          />
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
            <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Teléfono Celular *</label>
            <div className="flex border border-zinc-300 bg-zinc-50 focus-within:ring-1 focus-within:ring-zinc-950">
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                className="bg-zinc-100 text-zinc-800 text-sm font-sans px-3 py-3 border-r border-zinc-300 focus:outline-none cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.dialCode} ({c.code})
                  </option>
                ))}
              </select>
              <input 
                type="tel" 
                value={phoneDisplay}
                onChange={handlePhoneChange}
                placeholder={selectedCountry === "MX" ? "55 1234 5678" : "Número celular"}
                className="w-full bg-transparent px-4 py-3 focus:outline-none font-sans text-zinc-950" 
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500 font-sans">
              Recibirás un código de acceso por SMS a este número al completar tu pago.
            </p>
            {(phoneError || errors.telephone) && (
              <p className="mt-1 text-sm text-red-600">{phoneError || errors.telephone?.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Domicilio */}
      <div className="mb-12">
        <h3 className="font-serif text-2xl text-zinc-950 border-b border-zinc-200 pb-4 mb-6">Domicilio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Calle y Número *</label>
            <input 
              type="text" 
              placeholder="Calle, número exterior e interior"
              {...register("street")} 
              className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" 
            />
            {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Colonia *</label>
            <input 
              type="text" 
              placeholder="Colonia o fraccionamiento"
              {...register("colonia")} 
              className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" 
            />
            {errors.colonia && <p className="mt-1 text-sm text-red-600">{errors.colonia.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Código Postal *</label>
            <input 
              type="text" 
              placeholder="C.P."
              {...register("postalCode")} 
              className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" 
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Ciudad *</label>
            <input 
              type="text" 
              placeholder="Ciudad o municipio"
              {...register("city")} 
              className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" 
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Estado *</label>
            <input 
              type="text" 
              placeholder="Estado"
              {...register("state")} 
              className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" 
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
          </div>
        </div>
      </div>

      {/* Acuerdos Legales */}
      <div className="mb-8 bg-zinc-50 p-6 ring-1 ring-zinc-200">
        <label className="flex items-start gap-4 cursor-pointer">
          <input type="checkbox" {...register("acknowledgeRules")} className="mt-1 w-5 h-5 accent-red-700 flex-shrink-0" />
          <div className="font-sans text-sm text-zinc-700 leading-relaxed">
            Reconozco que he leído la Historia, Misión y Objetivos de la Gypsy Vanner Horse Society, y comprendo las reglas relativas a la membresía, derechos de voto y beneficios de los miembros. Por la presente envío mi solicitud de membresía.
          </div>
        </label>
        {errors.acknowledgeRules && <p className="mt-3 text-sm text-red-600">{errors.acknowledgeRules.message}</p>}
      </div>

      {/* Aviso sutil de registro de ejemplares */}
      <div className="mb-8 p-4 bg-amber-50/50 border border-amber-200/70 rounded-sm text-xs text-zinc-600 flex items-start gap-3 leading-relaxed">
        <svg className="w-4 h-4 text-amber-600/90 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>
          <strong className="text-zinc-800 font-medium">Nota sobre registro de ejemplares:</strong> Si adquieres tu membresía para el registro de caballos, ten en cuenta que no se admiten ejemplares con problemas testiculares y de mandíbula (prognata y agnata).
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="group relative inline-flex items-center justify-center bg-red-700 text-white font-sans text-xs sm:text-sm tracking-wider uppercase font-medium px-8 sm:px-10 py-4 overflow-hidden transition-all duration-500 hover:bg-red-800 disabled:bg-zinc-400 disabled:cursor-not-allowed shadow-md cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-3">
            {isSubmitting ? (
              "Conectando con la pasarela de pago seguro..."
            ) : (
              <>
                <span>Pagar Membresía</span>
                <svg className="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
