import DocumentViewer from "@/components/DocumentViewer";

export default function HowToTakePhotosPage() {
  return (
    <DocumentViewer title="Cómo Tomar Fotos para el Registro" filename="guia_fotos_registro.pdf">
      <p>
        Este es uno de los pasos importantes al registrar su Caballo Gypsy Vanner. Se requiere que envíe <strong>4 fotos</strong> de su caballo; una de cada lado, una directamente de frente y una directamente de la parte trasera.
      </p>
      
      <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 border-l-4 border-l-zinc-950 my-8 shadow-xs">
        <ul className="text-zinc-700 font-sans text-sm m-0 space-y-2">
          <li><strong>Las fotos deben ser nítidas y en alta resolución.</strong></li>
          <li>El caballo debe ocupar la mayor parte del espacio de la foto sin recortes en orejas o cascos.</li>
          <li>Las fotos se utilizan para la aprobación del registro y para la identificación oficial del ejemplar.</li>
          <li>Las tomas laterales aparecerán grabadas e impresas en el certificado de registro oficial.</li>
          <li>Las fotografías deben ser actuales y recientes.</li>
        </ul>
      </div>

      <h3 className="text-center mt-12 mb-6">EJEMPLO de fotos laterales</h3>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center my-8">
        <div className="relative w-full max-w-md aspect-[4/3] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-300 shadow-sm flex items-center justify-center p-2">
          <img src="/horse_material/ejemplo_lado_izq.png" alt="Ejemplo lado izquierdo" className="object-contain w-full h-full m-0 select-none" />
        </div>
        <div className="relative w-full max-w-md aspect-[4/3] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-300 shadow-sm flex items-center justify-center p-2">
          <img src="/horse_material/ejemplo_lado_der.png" alt="Ejemplo lado derecho" className="object-contain w-full h-full m-0 select-none" />
        </div>
      </div>

      <p>
        Se muestra el caballo completo de arriba a abajo, ninguna parte del caballo está cortada u oculta en las fotos. El caballo está de pie sobre una superficie que muestra adecuadamente las plumas de las patas (feather), no oculto en hierba alta o nieve. 
      </p>
      <p>
        No es necesario que el caballo esté arreglado para espectáculo, pero debe estar razonablemente limpio para poder mostrar sus plumas y marcas. En un caballo adulto con una cola larga y gruesa, la cola debe apartarse del camino en la foto trasera para que se puedan ver las marcas de las patas. La cola también puede estar trenzada o amarrada en su lugar.
      </p>

      <h3 className="text-center mt-12 mb-6">EJEMPLO de fotos frontales y traseras</h3>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center my-8">
        <div className="relative w-full max-w-[280px] aspect-[3/4] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-300 shadow-sm flex items-center justify-center p-2">
          <img src="/horse_material/ejemplo_frente.png" alt="Ejemplo de frente" className="object-contain w-full h-full m-0 select-none" />
        </div>
        <div className="relative w-full max-w-[280px] aspect-[3/4] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-300 shadow-sm flex items-center justify-center p-2">
          <img src="/horse_material/ejemplo_trasera.png" alt="Ejemplo de parte trasera" className="object-contain w-full h-full m-0 select-none" />
        </div>
      </div>
    </DocumentViewer>
  );
}
