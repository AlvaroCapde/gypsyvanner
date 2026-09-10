"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

const FAQS: FAQItem[] = [
  {
    id: "estatus",
    question: "¿Cómo puedo ver el estatus de mi trámite?",
    answer: (
      <p>
        Puedes consultar el estatus en tiempo real ingresando al{" "}
        <Link
          href="/login"
          className="text-red-700 hover:text-red-800 font-medium underline underline-offset-4"
        >
          Portal de Miembros
        </Link>{" "}
        con tu número de teléfono registrado. En la sección de tus ejemplares podrás dar seguimiento a cada fase del expediente.
      </p>
    ),
  },
  {
    id: "tiempo",
    question: "¿Cuánto es el tiempo de espera del trámite de pre-registro?",
    answer: (
      <p>
        El tiempo de espera estimado del trámite es de <strong className="font-semibold text-zinc-900">2 meses</strong>. Este periodo contempla la revisión morfológica de fotografías, la recepción y análisis de muestras para ADN, PSSM1 y FIS en laboratorio especializado.
      </p>
    ),
  },
  {
    id: "whatsapp",
    question: "¿Qué sucede si se necesitan más datos de mi ejemplar?",
    answer: (
      <p>
        <strong className="font-semibold text-zinc-900">En caso de necesitar más datos</strong> o aclaraciones sobre las fotografías o información de tu ejemplar, nuestro equipo técnico se pondrá en contacto directo contigo <strong className="font-semibold text-zinc-900">vía WhatsApp</strong> al teléfono registrado en tu cuenta.
      </p>
    ),
  },
  {
    id: "membresia",
    question: "¿Es obligatoria la membresía para pre-registrar un caballo?",
    answer: (
      <p>
        Sí. Contar con una{" "}
        <Link
          href="/membresia"
          className="text-red-700 hover:text-red-800 font-medium underline underline-offset-4"
        >
          Membresía Oficial activa
        </Link>{" "}
        de GVHS México es indispensable para poder pre-registrar ejemplares y acceder a los libros genealógicos de la raza.
      </p>
    ),
  },
  {
    id: "certificacion-inspeccion",
    question: "¿El pago de membresía y pre-registro asegura que mi caballo será certificado como Gypsy Vanner?",
    answer: (
      <p>
        <strong className="font-semibold text-zinc-900">No.</strong> El pago cubre los derechos de gestión del trámite, análisis de laboratorio y evaluación del expediente. La determinación y decisión de si el ejemplar califica como <strong className="font-semibold text-zinc-900">Gypsy Vanner</strong> y puede ser certificado la realizarán exclusivamente los <strong className="font-semibold text-zinc-900">jueces oficiales de GVHS</strong> en la <strong className="font-semibold text-zinc-900">inspección oficial en Mexico en Marzo 2027</strong>, tras la revisión de sus pruebas genéticas y morfológicas.
      </p>
    ),
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("estatus");

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section id="faq" className="w-full bg-white py-20 sm:py-24 border-b border-zinc-200">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        {/* Encabezado Editorial */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-red-700 font-semibold mb-3">
            Preguntas Frecuentes
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-zinc-950">
            Dudas comunes sobre el pre-registro
          </h2>
        </div>

        {/* Lista Minimalista de Pregunta y Respuesta */}
        <div className="divide-y divide-zinc-200 border-t border-b border-zinc-200">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-5 sm:py-6">
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-lg sm:text-xl text-zinc-950 group-hover:text-red-700 transition-colors">
                    {faq.question}
                  </span>
                  <span className="text-zinc-400 group-hover:text-zinc-900 transition-colors flex-shrink-0 text-xl font-light w-6 text-center select-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-3 pr-8 text-zinc-600 font-sans text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
