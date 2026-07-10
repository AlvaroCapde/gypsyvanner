"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  
  const supabase = createClient();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // You can also pass captchaToken or data here if needed
          shouldCreateUser: false, // We only want existing members to log in
        },
      });

      if (error) throw error;

      setStep("otp");
      setMessage("Te hemos enviado un código de 6 dígitos a tu correo.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al enviar el código.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) throw error;

      // Successful login
      router.push("/"); // Redirect to members portal (you can change this to /portal)
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError("Código incorrecto o expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <header className="w-full bg-zinc-950 px-6 sm:px-12 py-6">
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
          <h1 className="text-3xl font-serif text-zinc-900 mb-2">Acceso a Miembros</h1>
          <p className="text-zinc-600 font-sans text-sm mb-8">
            {step === "email" 
              ? "Ingresa tu correo para recibir un código de acceso único."
              : "Ingresa el código de 6 dígitos enviado a tu correo."}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded text-sm text-left">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded text-sm text-left">
              {message}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="text-left">
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-zinc-950 text-white font-sans text-sm tracking-wider uppercase font-medium px-8 py-4 mt-2 transition-all hover:bg-zinc-800 disabled:bg-zinc-400"
              >
                {loading ? "Enviando..." : "Enviar Código"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="text-left">
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Código de 6 dígitos</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-1 focus:ring-zinc-950 font-sans text-zinc-950" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || otp.length < 6}
                className="w-full bg-zinc-950 text-white font-sans text-sm tracking-wider uppercase font-medium px-8 py-4 mt-2 transition-all hover:bg-zinc-800 disabled:bg-zinc-400"
              >
                {loading ? "Verificando..." : "Verificar Código"}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep("email")}
                className="mt-4 text-sm text-zinc-500 hover:text-zinc-800 underline underline-offset-4"
              >
                Usar otro correo
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
