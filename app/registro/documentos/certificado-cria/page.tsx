export default function CertificateOfBreedingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-serif text-zinc-900 mb-4">Próximamente</h2>
      <p className="text-zinc-500 font-sans max-w-md mx-auto">
        El documento del Certificado de Cría (Certificate of Breeding) estará disponible muy pronto para su descarga y visualización.
      </p>
    </div>
  );
}
