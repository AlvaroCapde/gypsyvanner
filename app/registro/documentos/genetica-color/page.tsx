import DocumentViewer from "@/components/DocumentViewer";

export default function GeneticTestColorsPage() {
  return (
    <DocumentViewer title="Genética, Color y Patrones Explicados" filename="genetica_color_patrones.pdf">
      <p>Comprender la genética de color de su Gypsy Vanner es crucial para un registro preciso y una planificación de cría adecuada. A continuación, se detallan las pruebas y los principales genes modificadores del color y patrón.</p>

      <h3>Miopatía por Almacenamiento de Polisacáridos (PSSM1) – Dominante</h3>
      <p>La presencia de PSSM1 puede causar que un caballo tenga episodios de agarrotamiento muscular, provocando incapacidad para moverse y daño muscular.</p>
      <ul>
        <li><strong>n/n:</strong> PSSM1 no detectado.</li>
        <li><strong>n/PSSM1:</strong> Se ha detectado un gen. Este caballo debe ser manejado cuidadosamente mediante dieta y ejercicio. Limite el azúcar en la dieta para ayudar a prevenir la aparición de la enfermedad. Se debe considerar no criar a este caballo para no perpetuar el trastorno.</li>
        <li><strong>PSSM1/PSSM1:</strong> Dos genes detectados. Este caballo debe ser manejado cuidadosamente mediante dieta y ejercicio. Limite el azúcar en la dieta. Este caballo <em>no debe ser criado</em> porque transmitirá un gen PSSM1 el 100% de las veces.</li>
      </ul>

      <h3>Síndrome de Inmunodeficiencia del Potro (FIS)</h3>
      <ul>
        <li><strong>n/n:</strong> Mutación FIS no detectada.</li>
        <li><strong>n/FIS:</strong> Una copia de la mutación FIS detectada. Se debe tener mucho cuidado de no cruzar un portador de FIS con otro portador de FIS. Si tanto el padre como la madre transmiten el gen FIS, el potro no sobrevivirá.</li>
        <li><strong>FIS/FIS:</strong> Dos copias de la mutación FIS detectadas. Cualquier potro que nazca homocigoto para FIS no sobrevivirá más de tres meses de edad. La mayoría son sacrificados humanitariamente antes de esa edad.</li>
      </ul>

      <h3>E-Loci (Factor Rojo/Negro)</h3>
      <ul>
        <li><strong>e/e:</strong> Solo genes rojos detectados. El color básico es alazán (chestnut) en ausencia de otros genes modificadores.</li>
        <li><strong>E/e:</strong> Se detectó tanto un gen negro como uno rojo. La E es dominante. El color básico es negro, castaño (bay) o marrón en ausencia de otros genes modificadores.</li>
        <li><strong>E/E:</strong> No se detectó gen rojo. El caballo no puede tener potros rojos sin importar el color de su pareja. El color básico es negro, castaño o marrón en ausencia de otros genes modificadores.</li>
      </ul>

      <h3>Agouti</h3>
      <ul>
        <li><strong>A/A:</strong> Pigmento negro distribuido en patrón de puntos (patas, crines, cola). El color básico es castaño (bay) o marrón en ausencia de genes modificadores.</li>
        <li><strong>A/a:</strong> Pigmento negro distribuido en patrón de puntos. El color básico es castaño o marrón.</li>
        <li><strong>a/a:</strong> Solo alelos recesivos detectados. El pigmento negro se distribuye uniformemente. El color básico es negro.</li>
      </ul>

      <h3>Crema (Cream)</h3>
      <ul>
        <li><strong>n/n:</strong> No se detecta dilución crema. El color básico es alazán, castaño o negro.</li>
        <li><strong>n/Cr:</strong> Dilución heterocigota, una copia del gen Crema detectada. Colores típicos serán palomino (ee, n/Cr), bayo o buckskin (Ee o EE, Aa o AA, n/Cr) o negro ahumado (smoky black) (Ee o EE, n/Cr).</li>
        <li><strong>Cr/Cr:</strong> Dilución doble, dos copias del gen Crema detectadas. Colores típicos serán cremello (aa, Cr/Cr), perlino (Ee o EE, Aa o AA, Cr/Cr) y crema ahumado (EE o Ee, Cr/Cr).</li>
      </ul>

      <h3>Perla (Pearl)</h3>
      <ul>
        <li><strong>n/n:</strong> Sin evidencia de dilución perla detectada.</li>
        <li><strong>n/Prl:</strong> Una copia del gen perla detectada. Si también está presente un gen crema, el color del pelaje se verá afectado.</li>
        <li><strong>Prl/Prl:</strong> Dos copias de la dilución detectadas. El caballo tendrá una apariencia de color diluido.</li>
      </ul>

      <h3>Dun – Gen dominante</h3>
      <ul>
        <li><strong>n/n:</strong> El caballo no porta un gen dun.</li>
        <li><strong>D/D:</strong> El caballo tiene el gen Dun (homocigoto) y expresará el color del pelaje. Toda la descendencia será dilución dun.</li>
        <li><strong>D/n:</strong> El caballo tiene una copia del gen Dun y expresará el color del pelaje. La probabilidad de transmitir el gen dun a la descendencia es del 50%.</li>
      </ul>

      <h3>Plata (Silver) – Gen dominante</h3>
      <ul>
        <li><strong>n/n:</strong> No se detectó gen plata.</li>
        <li><strong>n/Z:</strong> Una copia del gen plata detectada. Los caballos de base negra tendrán un cuerpo chocolate con crin y cola rubia (flaxen) o aclarada. Los caballos de base castaña (bay) tendrán patas aclaradas con crin y cola rubia. El gen plata no tiene efecto en el color alazán.</li>
        <li><strong>Z/Z:</strong> Dos copias del gen plata detectadas. El efecto de color es el mismo que n/Z, sin embargo, este caballo transmitirá un gen plata a su descendencia el 100% de las veces.</li>
      </ul>

      <h3>Gris (Gray) – Gen dominante</h3>
      <ul>
        <li><strong>n/n:</strong> No se detectó gen modificador gris. El caballo no se volverá gris.</li>
        <li><strong>n/Gr:</strong> Un gen gris detectado. El caballo comenzará con su color base y se volverá gris. El fenotipo final variará de gris acero a blanco completamente despigmentado.</li>
        <li><strong>Gr/Gr:</strong> Dos genes grises detectados. El caballo comenzará con su color base y se volverá gris. Este caballo transmitirá el gen el 100% de las veces, por lo que toda su descendencia se volverá gris.</li>
      </ul>

      <h3>Champaña (Champagne) – Gen dominante</h3>
      <ul>
        <li><strong>n/n:</strong> No se detectó gen champaña.</li>
        <li><strong>n/Ch:</strong> Una copia del gen champaña detectada. El caballo tendrá un color diluido, que depende de su color base.</li>
        <li><strong>Ch/Ch:</strong> Dos copias del gen detectadas. El caballo tendrá un color diluido. El gen champaña se transmitirá a la descendencia el 100% de las veces.</li>
      </ul>

      <h3>Patrón de pelaje Tobiano - Dominante</h3>
      <ul>
        <li><strong>t/t:</strong> No se detectó gen tobiano.</li>
        <li><strong>n/T:</strong> Una copia del gen tobiano detectada. El caballo tendrá un patrón de pelaje interrumpido que consiste en manchas del color base junto con manchas sin color (blanco). El color base también puede ser diluido o modificado por otros genes.</li>
        <li><strong>T/T:</strong> Dos copias del gen tobiano detectadas. Este caballo producirá crías con patrones de pelaje tobiano el 100% de las veces sin importar qué patrón tenga la pareja.</li>
      </ul>

      <h3>Patrón de Pelaje Leopardo (Appaloosa) – Dominante</h3>
      <ul>
        <li><strong>n/n:</strong> No se detectó gen LP.</li>
        <li><strong>n/LP:</strong> Un gen detectado. El caballo mostrará un patrón de manchas tipo appaloosa.</li>
        <li><strong>LP/LP:</strong> Dos genes detectados. El caballo mostrará un patrón de manchas tipo appaloosa y producirá descendencia Lp el 100% de las veces.</li>
      </ul>
      <p>La Ceguera Nocturna Estacionaria Congénita (CSNB) está ligada al gen LP.</p>

      <h3>Patrón 1 (PATN1)</h3>
      <ul>
        <li><strong>n/n:</strong> No se detectó gen PATN1.</li>
        <li><strong>n/PATN1:</strong> Un gen detectado. Cuando el LP también está presente, resultará en un patrón leopardo o casi leopardo. Si LP/LP también está presente, resultará en un patrón de leopardo de pocas manchas (few spot leopard).</li>
        <li><strong>PATN1/PATN1:</strong> Dos genes detectados. Cuando LP está presente, resultará en patrón leopardo o casi leopardo. Este caballo transmitirá el PATN1 a su descendencia el 100% de las veces.</li>
      </ul>

      <h3>Blanco Dominante (W20)</h3>
      <ul>
        <li><strong>n/n:</strong> No se detectó gen W20.</li>
        <li><strong>n/W20:</strong> Un gen detectado. El caballo mostrará desde pequeños parches blancos hasta un cuerpo casi completamente blanco. Los ojos suelen ser oscuros.</li>
        <li><strong>W20/W20:</strong> Dos genes detectados. El caballo transmitirá el W20 a su descendencia el 100% de las veces.</li>
      </ul>

      <h3>Blanco Letal Overo (Frame Overo) - Dominante</h3>
      <ul>
        <li><strong>n/n:</strong> No se detectó gen overo.</li>
        <li><strong>n/OLW:</strong> Una copia del gen detectada. El caballo mostrará un patrón de pelaje frame overo.</li>
        <li><strong>OLW/OLW:</strong> Si se cruzan dos caballos con n/OLW y ambos transmiten el gen OLW, resultará en un potro Blanco Letal (Lethal White). El potro morirá poco después del nacimiento y generalmente son sacrificados humanitariamente.</li>
      </ul>

      <h3>Sabino (SB1)</h3>
      <ul>
        <li><strong>n/n:</strong> No se detectó gen sabino.</li>
        <li><strong>n/SB1:</strong> El caballo tendrá un pelaje interrumpido con color y ausencia de color (blanco). Los bordes de las marcas serán irregulares y a menudo tendrán ruano (roaning). El blanco estará presente en diversos grados.</li>
        <li><strong>SB1/SB1:</strong> El caballo tiene dos genes sabino y será casi todo blanco, llamado sabino máximo (max sabino). El gen sabino se transmitirá a la descendencia el 100% de las veces.</li>
      </ul>

      <h3>Splash White (Blagdon)</h3>
      <ul>
        <li><strong>n/n:</strong> No se detectó gen splash white.</li>
        <li><strong>n/SW1:</strong> Un gen detectado. El caballo parecerá estar salpicado de blanco desde abajo. Puede tener cualquier grado, desde blanco alto en las patas (por encima de las rodillas/corvejones) hasta el vientre entero. Usualmente tienen blanco en la cara.</li>
        <li><strong>SW1/SW1:</strong> Dos genes detectados. Transmitirá el gen a la descendencia el 100% de las veces.</li>
        <li><strong>SW2:</strong> Igual que SW1, solo identificado en algunas razas.</li>
        <li><strong>SW3:</strong> Sospecha de ser letal para potros nacidos como SW3/SW3.</li>
        <li><strong>SW4:</strong> Sospecha de ser letal para potros nacidos como SW4/SW4.</li>
      </ul>

      <h3>Ruano (Roan) - Dominante</h3>
      <p>El Ruano se hereda como dominante pero la mutación específica aún no ha sido identificada, por lo que no hay prueba genética directa. La única prueba que se hace es una prueba de cigosidad basada en marcadores asociados.</p>
      <ul>
        <li><strong>n/n:</strong> No se detecta variante. Hay caballos que muestran características ruanas pero siguen siendo negativos. Este es un tipo diferente de ruano (pelos blancos a través del color base).</li>
        <li><strong>n/Rn:</strong> Una copia de la variante es detectada. El caballo mostrará el aspecto clásico de ruano con pelos blancos distribuidos uniformemente por todo el cuerpo. La cabeza y, a menudo, las patas permanecen oscuras. Un caballo de base negra con un gen Rn se llama Ruano Azul (Blue Roan).</li>
        <li><strong>Rn/Rn:</strong> Dos copias de la variante son detectadas. Este caballo solo producirá descendencia ruana.</li>
      </ul>
    </DocumentViewer>
  );
}
