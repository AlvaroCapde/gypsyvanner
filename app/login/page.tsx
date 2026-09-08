"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function LoginPage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("MX");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [canonicalPhone, setCanonicalPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const supabase = createClient();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const asYouType = new AsYouType(selectedCountry);
    const formatted = asYouType.input(val);
    setPhoneDisplay(formatted);
    setError("");
    setNotRegistered(false);

    const parsed = parsePhoneNumberFromString(val, selectedCountry);
    if (parsed && parsed.isValid()) {
      setCanonicalPhone(parsed.format("E.164"));
    } else {
      setCanonicalPhone("");
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value as CountryCode;
    setSelectedCountry(country);
    if (phoneDisplay) {
      const asYouType = new AsYouType(country);
      setPhoneDisplay(asYouType.input(phoneDisplay));
      const parsed = parsePhoneNumberFromString(phoneDisplay, country);
      if (parsed && parsed.isValid()) {
        setCanonicalPhone(parsed.format("E.164"));
      } else {
        setCanonicalPhone("");
      }
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotRegistered(false);
    setMessage("");

    const parsed = parsePhoneNumberFromString(phoneDisplay, selectedCountry);
    if (!parsed || !parsed.isValid()) {
      setError("Por favor ingresa un número de teléfono celular válido.");
      return;
    }

    const phoneE164 = parsed.format("E.164");
    setCanonicalPhone(phoneE164);
    setLoading(true);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: phoneE164,
        options: {
          shouldCreateUser: false, // Only existing members can sign in
        },
      });

      if (otpError) {
        const msg = otpError.message.toLowerCase();
        if (
          msg.includes("signups not allowed") ||
          msg.includes("user not found") ||
          msg.includes("invalid") ||
          (otpError as any).status === 400 ||
          (otpError as any).status === 422
        ) {
          setNotRegistered(true);
          setError(
            "Este número telefónico no está registrado como miembro activo de GVHS México."
          );
          return;
        }
        throw otpError;
      }

      setStep("otp");
      setMessage(`Hemos enviado un código de 6 dígitos vía SMS a tu número.`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al enviar el código de acceso.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: canonicalPhone,
        token: otp.trim(),
        type: "sms",
      });

      if (verifyError) throw verifyError;

      // Successful login -> Redirect to members dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      setError("Código SMS incorrecto o expirado. Verifica el código e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans">
      <header className="w-full bg-zinc-950 px-6 sm:px-12 py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-serif text-2xl tracking-wider">
            GVHS<span className="text-red-600">.</span>
          </Link>
          <Link href="/" className="text-zinc-400 text-sm tracking-wide hover:text-white transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 md:p-12 text-center w-full max-w-md mx-auto shadow-sm ring-1 ring-zinc-200">
          <h1 className="text-3xl font-serif text-zinc-950 mb-2">Acceso a Miembros</h1>
          <p className="text-zinc-600 font-sans text-sm mb-8">
            {step === "phone"
              ? "Ingresa tu número celular registrado para recibir un código de acceso por SMS."
              : "Ingresa el código de 6 dígitos enviado por SMS."}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded text-sm text-left">
              {error}
              {notRegistered && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <Link
                    href="/membresia"
                    className="inline-flex items-center gap-1.5 font-medium text-red-800 underline underline-offset-4 hover:text-red-950"
                  >
                    Adquirir Membresía Oficial GVHS
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-sm text-left">
              {message}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="text-left">
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">
                  Teléfono Celular
                </label>
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
                    required
                    autoFocus
                    className="w-full bg-transparent px-4 py-3 focus:outline-none font-sans text-zinc-950 text-base"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1.5">
                  El número debe coincidir con el proporcionado al adquirir tu membresía.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-950 text-white font-sans text-sm tracking-wider uppercase font-medium px-8 py-4 mt-2 transition-all hover:bg-zinc-800 disabled:bg-zinc-400"
              >
                {loading ? "Enviando SMS..." : "Enviar Código SMS"}
              </button>

              <div className="mt-4 text-xs text-zinc-500 text-center">
                ¿Aún no eres miembro?{" "}
                <Link href="/membresia" className="text-red-700 hover:text-red-800 font-medium underline underline-offset-4">
                  Solicita tu membresía aquí
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="text-left">
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">
                  Código de 6 dígitos
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  required
                  autoFocus
                  className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-center text-2xl tracking-[0.35em] font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 text-zinc-950"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-red-700 text-white font-sans text-sm tracking-wider uppercase font-medium px-8 py-4 mt-2 transition-all hover:bg-red-800 disabled:bg-zinc-300 disabled:cursor-not-allowed"
              >
                {loading ? "Verificando..." : "Ingresar al Portal"}
              </button>

              <div className="flex flex-col gap-2 mt-4 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError("");
                  }}
                  className="text-zinc-500 hover:text-zinc-800 underline underline-offset-4"
                >
                  Usar otro número
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="w-full bg-zinc-900 py-6 border-t border-zinc-800 text-center">
        <p className="text-zinc-500 font-sans text-xs">© {new Date().getFullYear()} GVHS México</p>
      </footer>
    </div>
  );
}
