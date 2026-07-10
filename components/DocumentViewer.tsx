"use client";

import { ReactNode } from "react";
import Logo from "@/components/Logo";

interface DocumentViewerProps {
  title: string;
  filename: string;
  children: ReactNode;
}

export default function DocumentViewer({ title, filename, children }: DocumentViewerProps) {
  const handlePrint = () => {
    // Para asegurar que el título del documento sea el filename temporalmente
    const originalTitle = document.title;
    document.title = filename.replace('.pdf', '');
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-6">
        <h1 className="text-3xl font-serif text-zinc-900">{title}</h1>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition-colors shadow-sm print:hidden"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Descargar / Imprimir PDF
        </button>
      </div>

      <div 
        className="bg-white border border-zinc-200 shadow-sm rounded-xl p-8 sm:p-12 prose prose-zinc max-w-none prose-headings:font-serif prose-h1:text-3xl prose-h2:text-2xl prose-a:text-red-700 hover:prose-a:text-red-800"
      >
        <div id="printable-document" className="pdf-content">
          <div className="mb-8 flex flex-col items-center text-center pb-8 border-b border-zinc-100">
            <Logo variant="dark" size="lg" className="mb-6 scale-90" />
            <h2 className="text-2xl font-serif text-zinc-900 !mt-0 !mb-2">{title}</h2>
            <p className="text-zinc-500 text-sm">GVHS México Oficial</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
