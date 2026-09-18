"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [memberName, setMemberName] = useState("");

  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (!sessionId) {
      setError("No se encontró el identificador de sesión de pago.");
      setLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "No se pudo verificar el pago.");
        }

        setVerifiedPhone(data.phone);
        setMaskedPhone(data.maskedPhone || data.phone);
        setMemberName(data.name || "Socio");
      } catch (err: any) {
        console.error("Error verificando checkout:", err);
        setError(err.message || "Ocurrió un error al verificar tu pago.");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  // Cooldown timer for resending SMS
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6 || !verifiedPhone) return;

    try {
      setVerifyingOtp(true);
      setOtpError("");

      const { data, error: verifyErr } = await supabase.auth.verifyOtp({
        phone: verifiedPhone,
        token: otp.trim(),
        type: "sms",
      });

      if (verifyErr) {
        throw verifyErr;
      }

      setOtpSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (err: any) {
      console.error("Error verificando OTP:", err);
      setOtpError("Código incorrecto o expirado. Por favor solicita uno nuevo si es necesario.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !verifiedPhone || resending) return;

    try {
      setResending(true);
      setOtpError("");
      setResendMessage("");

      const { error: resendErr } = await supabase.auth.signInWithOtp({
        phone: verifiedPhone,
      });

      if (resendErr) throw resendErr;

      setResendMessage("Te hemos enviado un nuevo código SMS.");
      setResendCooldown(60);
    } catch (err: any) {
      console.error("Error reenviando OTP:", err);
      setOtpError(err.message || "No se pudo reenviar el código SMS.");
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-10 md:p-14 text-center max-w-lg mx-auto shadow-sm ring-1 ring-zinc-200">
        <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-serif text-zinc-950 mb-2">Confirmando tu pago...</h2>
        <p className="text-zinc-600 font-sans text-sm">
          Estamos verificando tu pago y preparando tu cuenta de socio.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-10 md:p-14 text-center max-w-lg mx-auto shadow-sm ring-1 ring-zinc-200">
        <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-zinc-950 mb-3">No pudimos verificar tu pago</h2>
        <p className="text-zinc-600 font-sans text-sm mb-8">{error}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/membresia"
            className="inline-flex items-center justify-center bg-zinc-950 text-white font-sans text-xs tracking-wider uppercase font-medium px-6 py-3 hover:bg-zinc-800 transition-colors"
          >
            Volver al Formulario
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center border border-zinc-300 text-zinc-800 font-sans text-xs tracking-wider uppercase font-medium px-6 py-3 hover:bg-zinc-100 transition-colors"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 text-center max-w-lg mx-auto shadow-sm ring-1 ring-zinc-200">
      {/* Icono de Confirmación */}
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold tracking-wider uppercase rounded-full mb-3">
        Membresía Activada
      </div>

      <h1 className="text-3xl font-serif text-zinc-950 mb-2">¡Pago Confirmado!</h1>
      <p className="text-zinc-600 font-sans text-sm mb-6">
        Bienvenido a GVHS México, <span className="font-semibold text-zinc-900">{memberName}</span>. Tu membresía anual oficial ha sido dada de alta exitosamente.
      </p>

      {/* Tarjeta de Código SMS */}
      <div className="bg-zinc-50 border border-zinc-200 p-6 text-left mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-serif text-base text-zinc-950 font-medium">Accede a tu cuenta</h3>
            <p className="text-xs text-zinc-600 font-sans mt-0.5">
              Enviamos un código SMS de 6 dígitos al número:{" "}
              <span className="font-semibold text-zinc-900">{maskedPhone}</span>
            </p>
          </div>
        </div>

        {otpError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded">
            {otpError}
          </div>
        )}

        {resendMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-sans rounded">
            {resendMessage}
          </div>
        )}

        {otpSuccess ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-sans text-sm font-medium rounded">
            ¡Código verificado! Ingresando a tu panel de socio...
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium text-zinc-700 uppercase tracking-wider mb-2">
                Código de 6 dígitos
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                autoFocus
                required
                className="w-full bg-white border border-zinc-300 px-4 py-3 text-center text-2xl tracking-[0.35em] font-mono focus:outline-none focus:ring-1 focus:ring-zinc-950 text-zinc-950"
              />
            </div>

            <button
              type="submit"
              disabled={verifyingOtp || otp.length < 6}
              className="w-full bg-red-700 text-white font-sans text-xs tracking-wider uppercase font-medium px-6 py-3.5 hover:bg-red-800 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifyingOtp ? "Verificando..." : "Ingresar a mi Cuenta"}
              {!verifyingOtp && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>

            <div className="text-center pt-2">
              {resendCooldown > 0 ? (
                <span className="text-xs text-zinc-400 font-sans">
                  Reenviar código en {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-xs text-red-700 hover:text-red-800 font-sans font-medium underline underline-offset-4"
                >
                  {resending ? "Enviando..." : "¿No recibiste el SMS? Reenviar código"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <p className="text-xs text-zinc-500 font-sans">
        También podrás ingresar en cualquier momento desde{" "}
        <Link href="/login" className="text-zinc-900 underline underline-offset-4 font-medium">
          Iniciar Sesión
        </Link>{" "}
        usando tu número de teléfono celular.
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans">
      <header className="w-full bg-zinc-950 px-6 sm:px-12 py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white font-serif text-2xl tracking-wider">
              GVHS<span className="text-red-600">.</span>
            </Link>
            <span className="hidden sm:inline-block text-xs text-zinc-400 border-l border-zinc-700/80 pl-4 font-sans tracking-wide">
              El Registro Oficial del Caballo Gypsy Vanner en México
            </span>
          </div>
          <Link href="/" className="text-zinc-400 text-sm tracking-wide hover:text-white transition-colors shrink-0">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-12">
        <Suspense
          fallback={
            <div className="bg-white p-12 text-center max-w-lg mx-auto shadow-sm ring-1 ring-zinc-200">
              <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-zinc-600 text-sm font-sans">Cargando...</p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>

      <footer className="w-full bg-zinc-900 py-6 border-t border-zinc-800 text-center">
        <p className="text-zinc-500 font-sans text-xs">© {new Date().getFullYear()} GVHS México</p>
      </footer>
    </div>
  );
}
