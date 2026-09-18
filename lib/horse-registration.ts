import * as z from "zod";
import { calculatePlatformFee } from "./fees";

export const USD_TO_MXN_RATE = 18;
export const DNA_FEE_USD = 80;
export const DNA_FEE_MXN = DNA_FEE_USD * USD_TO_MXN_RATE; // 1,440 MXN
export const PSSM_FIS_FEE_USD = 180;
export const PSSM_FIS_FEE_MXN = PSSM_FIS_FEE_USD * USD_TO_MXN_RATE; // 3,240 MXN
export const COLOR_TEST_FEE_USD = 25;
export const COLOR_TEST_FEE_MXN = COLOR_TEST_FEE_USD * USD_TO_MXN_RATE; // 450 MXN
export const PREFIX_FEE_USD = 200; // Tarifa oficial de adquisición y registro de prefijo de rancho (USD)
export const PREFIX_FEE_MXN = PREFIX_FEE_USD * USD_TO_MXN_RATE; // 3,600 MXN

export interface ColorTestOption {
  id: string;
  name: string;
  locus: string;
  category: "base_color" | "dilutions" | "white_patterns" | "modifiers";
  categoryLabel: string;
  priceUsd: number;
  priceMxn: number;
  summary: string;
  details: string;
}

export const COLOR_TESTS_CATALOG: ColorTestOption[] = [
  {
    id: "e_locus",
    name: "E-locus (Factor Rojo / Negro)",
    locus: "Locus E (Extension)",
    category: "base_color",
    categoryLabel: "Color Base",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Determina si el color base es negro/castaño o alazán recesivo.",
    details: "Identifica los alelos e/e (alazán/rojo), E/e (porta rojo y negro) y E/E (homocigoto negro, no produce descendencia roja).",
  },
  {
    id: "agouti",
    name: "Agouti (Bay / Castaño)",
    locus: "Locus A (ASIP)",
    category: "base_color",
    categoryLabel: "Color Base",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Restringe el pigmento negro a extremidades, crin y cola.",
    details: "En capas con pigmento negro, A/A o A/a generan color castaño/bayo (bay), mientras que a/a distribuye el negro uniformemente.",
  },
  {
    id: "tobiano",
    name: "Tobiano",
    locus: "Locus TO (KIT)",
    category: "white_patterns",
    categoryLabel: "Patrones Blancos",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Patrón dominante de manchas blancas grandes cruzando la línea dorsal.",
    details: "Los ejemplares homocigotos (T/T) transmitirán el patrón tobiano al 100% de sus descendientes sin importar la pareja.",
  },
  {
    id: "sabino",
    name: "Sabino 1 (SB1)",
    locus: "Locus SB1 (KIT)",
    category: "white_patterns",
    categoryLabel: "Patrones Blancos",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Bordes irregulares, calzados altos y roaning en vientre y flancos.",
    details: "n/SB1 produce marcas blancas irregulares con salpicado; SB1/SB1 genera el fenotipo 'sabino máximo', con pelaje casi completamente blanco.",
  },
  {
    id: "grey",
    name: "Gris / Tordo (Grey)",
    locus: "Locus G (STX17)",
    category: "modifiers",
    categoryLabel: "Modificadores",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Gen dominante que produce la despigmentación progresiva con la edad.",
    details: "El ejemplar nace de su color base y encanece gradualmente. Los ejemplares Gr/Gr transmiten el gen gris al 100% de sus crías.",
  },
  {
    id: "silver_dapple",
    name: "Silver Dapple (Plata)",
    locus: "Locus Z (PMEL17)",
    category: "dilutions",
    categoryLabel: "Diluciones",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Aclara crin y cola a lino o plateado y el cuerpo negro a chocolate.",
    details: "Afecta exclusivamente el pigmento negro. En capas castañas produce patas aclaradas y crines rubias.",
  },
  {
    id: "champagne",
    name: "Champaña (Champagne)",
    locus: "Locus Ch (SLC36A1)",
    category: "dilutions",
    categoryLabel: "Diluciones",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Pelaje diluido con brillo metálico sedoso y piel moteada con pecas.",
    details: "Gen dominante. Aclara el negro a Classic Champagne y el alazán a Gold Champagne con ojos de tonalidad avellana/ámbar.",
  },
  {
    id: "cream_dilution",
    name: "Dilución Crema (Cream)",
    locus: "Locus Cr (SLC45A2)",
    category: "dilutions",
    categoryLabel: "Diluciones",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Produce Palomino, Bayo/Buckskin, Cremello, Perlino y Smoky Black.",
    details: "Una copia (n/Cr) diluye alazán a palomino y castaño a buckskin. Doble copia (Cr/Cr) genera doble dilución cremello o perlino con ojos azules.",
  },
  {
    id: "dun",
    name: "Dilución Dun",
    locus: "Locus D (TBX3)",
    category: "dilutions",
    categoryLabel: "Diluciones",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Dilución corporal uniforme con marcas primitivas (raya de mulo y cebraduras).",
    details: "Gen dominante. Un ejemplar D/D transmitirá la dilución dun al 100% de sus crías.",
  },
  {
    id: "non_dun1",
    name: "Non-Dun 1 (nd1)",
    locus: "Locus nd1 (TBX3)",
    category: "dilutions",
    categoryLabel: "Diluciones",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Presencia de marcas primitivas en dorso y extremidades sin dilución dun corporal.",
    details: "Permite diferenciar caballos con marcas primitivas ancestrales de aquellos con verdadera dilución dun.",
  },
  {
    id: "splash_white_1",
    name: "Splash White 1 (Blagdon / SW1)",
    locus: "Locus SW1 (MITF)",
    category: "white_patterns",
    categoryLabel: "Patrones Blancos",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Patrón clásico Blagdon con apariencia de salpicado blanco desde el vientre.",
    details: "Típico en Gypsy Vanners. Produce caretos anchos, ojos azules frecuentes y vientre blanco.",
  },
  {
    id: "splash_white_2",
    name: "Splash White 2 (SW2)",
    locus: "Locus SW2 (PAX3)",
    category: "white_patterns",
    categoryLabel: "Patrones Blancos",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Variante de patrón salpicado blanco identificada en líneas genéticas específicas.",
    details: "Mutación en el gen PAX3 asociada a manchas blancas extensas en cabeza y miembros.",
  },
  {
    id: "splash_white_3",
    name: "Splash White 3 (SW3)",
    locus: "Locus SW3 (PAX3)",
    category: "white_patterns",
    categoryLabel: "Patrones Blancos",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Variante de patrón salpicado blanco; sospecha de no viabilidad homocigota.",
    details: "Importante para criadores para evitar cruzas de riesgo entre portadores de SW3.",
  },
  {
    id: "patn1",
    name: "PATN1 (Patrón Leopardo 1)",
    locus: "Locus PATN1 (RFWD3)",
    category: "white_patterns",
    categoryLabel: "Patrones Blancos",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Modificador que amplía las manchas blancas en presencia del gen LP.",
    details: "Junto con LP, incrementa drásticamente la extensión del patrón leopardo o manta en el ejemplar.",
  },
  {
    id: "lp",
    name: "LP (Complejo Leopardo / Appaloosa)",
    locus: "Locus LP (TRPM1)",
    category: "white_patterns",
    categoryLabel: "Patrones Blancos",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Gen responsable de manchas moteadas, esclerótica blanca visible y cascos rayados.",
    details: "Gen dominante. La ceguera nocturna congénita (CSNB) está ligada al estado homocigoto LP/LP.",
  },
  {
    id: "w20",
    name: "W20 (Blanco Dominante 20)",
    locus: "Locus W20 (KIT)",
    category: "white_patterns",
    categoryLabel: "Patrones Blancos",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Modificador que potencia e incrementa la extensión de manchas y marcas blancas.",
    details: "Aumenta la expresión fenotípica del blanco corporal sin los riesgos de letalidad asociados a otras variantes W.",
  },
  {
    id: "roan",
    name: "Roan (Ruano)",
    locus: "Locus Rn (Marcador asociado)",
    category: "modifiers",
    categoryLabel: "Modificadores",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Mezcla uniforme de pelos blancos con el pelaje base corporal, cabeza oscura.",
    details: "Prueba de cigosidad basada en marcadores genéticos asociados al locus Rn dominante.",
  },
  {
    id: "pearl",
    name: "Pearl (Perla / Barlink)",
    locus: "Locus Prl (SLC45A2)",
    category: "dilutions",
    categoryLabel: "Diluciones",
    priceUsd: COLOR_TEST_FEE_USD,
    priceMxn: COLOR_TEST_FEE_MXN,
    summary: "Dilución recesiva que produce tonos albaricoque y brillo perla con gen crema.",
    details: "Un ejemplar n/Prl no muestra cambio visible salvo que coincida con gen crema (pseudodoble dilución) o sea homocigoto Prl/Prl.",
  },
];

export type AgeCategory =
  | "under_6_months"
  | "six_months_to_three_years"
  | "three_years_and_over"
  | "hardship";

export interface HorseFeeBreakdown {
  ageCategory: AgeCategory;
  categoryLabel: string;
  ageFormatted: string;
  isHardship: boolean;
  baseFeeUsd: number;
  baseFeeMxn: number;
  dnaFeeUsd: number;
  dnaFeeMxn: number;
  pssmFisFeeUsd: number;
  pssmFisFeeMxn: number;
  colorTestsCount: number;
  colorTestsFeeUsd: number;
  colorTestsFeeMxn: number;
  selectedColorTests: string[];
  hasExistingPrefix?: boolean;
  isPurchasingPrefix?: boolean;
  farmPrefix?: string;
  prefixFeeUsd: number;
  prefixFeeMxn: number;
  subtotalFeeMxn: number;
  platformFeeMxn: number;
  totalFeeUsd: number;
  totalFeeMxn: number;
}

/**
 * Calculates the horse registration fee based on the date of birth, optional color tests,
 * and optional ranch prefix purchase ($200 USD / $3,600 MXN).
 *
 * Rules:
 * - Born in 2017 or earlier: Hardship base fee of $250 USD ($4,500 MXN)
 * - Born after 2017:
 *   - 0 - 6 months: $75 USD ($1,350 MXN)
 *   - over 6 months to under 3 years: $100 USD ($1,800 MXN)
 *   - 3 years and over: $125 USD ($2,250 MXN)
 * - Mandatory DNA testing: $80 USD ($1,440 MXN)
 * - Mandatory PSSM1 & FIS testing: $180 USD ($3,240 MXN)
 * - Optional Color testing: $25 USD ($450 MXN) per test selected
 * - Optional Ranch Prefix Registration: $200 USD ($3,600 MXN)
 * - Exchange rate: $18 MXN / USD
 */
export function calculateHorseFee(
  birthDateStr: string,
  selectedColorTests: string[] = [],
  isPurchasingPrefix: boolean = false,
  farmPrefix: string = ""
): HorseFeeBreakdown {
  const colorTestsCount = selectedColorTests.length;
  const colorTestsFeeUsd = colorTestsCount * COLOR_TEST_FEE_USD;
  const colorTestsFeeMxn = colorTestsCount * COLOR_TEST_FEE_MXN;

  const prefixFeeUsd = isPurchasingPrefix ? PREFIX_FEE_USD : 0;
  const prefixFeeMxn = isPurchasingPrefix ? PREFIX_FEE_MXN : 0;

  if (!birthDateStr) {
    // Default fallback breakdown (0-6 months)
    const baseFeeUsd = 75;
    const baseFeeMxn = baseFeeUsd * USD_TO_MXN_RATE;
    const subtotalFeeMxn =
      baseFeeMxn + DNA_FEE_MXN + PSSM_FIS_FEE_MXN + colorTestsFeeMxn + prefixFeeMxn;
    const { platformFeeMxn, totalMxn } = calculatePlatformFee(subtotalFeeMxn);

    return {
      ageCategory: "under_6_months",
      categoryLabel: "Potro lactante (0 a 6 meses)",
      ageFormatted: "Fecha no especificada",
      isHardship: false,
      baseFeeUsd,
      baseFeeMxn,
      dnaFeeUsd: DNA_FEE_USD,
      dnaFeeMxn: DNA_FEE_MXN,
      pssmFisFeeUsd: PSSM_FIS_FEE_USD,
      pssmFisFeeMxn: PSSM_FIS_FEE_MXN,
      colorTestsCount,
      colorTestsFeeUsd,
      colorTestsFeeMxn,
      selectedColorTests,
      isPurchasingPrefix,
      farmPrefix,
      prefixFeeUsd,
      prefixFeeMxn,
      subtotalFeeMxn,
      platformFeeMxn,
      totalFeeUsd:
        baseFeeUsd + DNA_FEE_USD + PSSM_FIS_FEE_USD + colorTestsFeeUsd + prefixFeeUsd,
      totalFeeMxn: totalMxn,
    };
  }

  // Parse date safely (YYYY-MM-DD)
  const parts = birthDateStr.split("-").map(Number);
  const birthYear = parts[0];
  const birthMonth = (parts[1] || 1) - 1;
  const birthDay = parts[2] || 1;
  const birthDate = new Date(birthYear, birthMonth, birthDay);

  const today = new Date();

  // Calculate total months of age
  let months =
    (today.getFullYear() - birthDate.getFullYear()) * 12 +
    (today.getMonth() - birthDate.getMonth());
  if (today.getDate() < birthDate.getDate()) {
    months -= 1;
  }
  if (months < 0) months = 0;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let ageFormatted = "";
  if (years === 0) {
    ageFormatted = `${months} ${months === 1 ? "mes" : "meses"}`;
  } else if (remainingMonths === 0) {
    ageFormatted = `${years} ${years === 1 ? "año" : "años"}`;
  } else {
    ageFormatted = `${years} ${years === 1 ? "año" : "años"} y ${remainingMonths} ${
      remainingMonths === 1 ? "mes" : "meses"
    }`;
  }

  let ageCategory: AgeCategory;
  let categoryLabel = "";
  let baseFeeUsd = 0;
  let isHardship = false;

  // Rule 1: Born in 2017 or earlier -> Hardship fee of $250 USD
  if (birthYear <= 2017) {
    ageCategory = "hardship";
    categoryLabel = "Pre-Registro Tardío / Hardship (Nacidos en 2017 o antes)";
    baseFeeUsd = 250;
    isHardship = true;
  } else if (months <= 6) {
    // Rule 2: 0 - 6 months -> $75 USD
    ageCategory = "under_6_months";
    categoryLabel = "Potro lactante (0 a 6 meses)";
    baseFeeUsd = 75;
  } else if (months < 36) {
    // Rule 3: over 6 months to under 3 years -> $100 USD
    ageCategory = "six_months_to_three_years";
    categoryLabel = "Joven en desarrollo (más de 6 meses a menos de 3 años)";
    baseFeeUsd = 100;
  } else {
    // Rule 4: 3 years and over (born post-2017) -> $125 USD
    ageCategory = "three_years_and_over";
    categoryLabel = "Adulto (3 años o más)";
    baseFeeUsd = 125;
  }

  const baseFeeMxn = baseFeeUsd * USD_TO_MXN_RATE;
  const subtotalFeeMxn =
    baseFeeMxn + DNA_FEE_MXN + PSSM_FIS_FEE_MXN + colorTestsFeeMxn + prefixFeeMxn;
  const { platformFeeMxn, totalMxn } = calculatePlatformFee(subtotalFeeMxn);
  const totalFeeUsd =
    baseFeeUsd + DNA_FEE_USD + PSSM_FIS_FEE_USD + colorTestsFeeUsd + prefixFeeUsd;
  const totalFeeMxn = totalMxn;

  return {
    ageCategory,
    categoryLabel,
    ageFormatted,
    isHardship,
    baseFeeUsd,
    baseFeeMxn,
    dnaFeeUsd: DNA_FEE_USD,
    dnaFeeMxn: DNA_FEE_MXN,
    pssmFisFeeUsd: PSSM_FIS_FEE_USD,
    pssmFisFeeMxn: PSSM_FIS_FEE_MXN,
    colorTestsCount,
    colorTestsFeeUsd,
    colorTestsFeeMxn,
    selectedColorTests,
    isPurchasingPrefix,
    farmPrefix,
    prefixFeeUsd,
    prefixFeeMxn,
    subtotalFeeMxn,
    platformFeeMxn,
    totalFeeUsd,
    totalFeeMxn,
  };
}

export const horseRegistrationSchema = z
  .object({
    // Step 1: Identidad y Prefijo de Rancho
    hasExistingPrefix: z.boolean().default(false),
    wantsToPurchasePrefix: z.boolean().default(false),
    farmPrefix: z.string().optional(),

    horseName: z
      .string()
      .min(2, "El nombre solicitado del caballo es requerido.")
      .max(60, "El nombre no debe superar los 60 caracteres."),
    ownerName: z
      .string()
      .min(2, "El nombre del propietario(s) es requerido."),
    acquisitionDate: z
      .string()
      .min(1, "La fecha de adquisición es requerida."),
    gender: z.enum(["stallion", "mare"], {
      message: "Selecciona el género del caballo.",
    }),
    birthDate: z
      .string()
      .min(1, "La fecha de nacimiento es requerida."),
    countryOfBirth: z
      .string()
      .min(2, "El país de nacimiento es requerido."),

    // Medidas de estatura y alzada (Paso 1)
    currentHeight: z
      .string()
      .min(1, "La estatura actual del caballo es requerida."),
    currentHeightDate: z
      .string()
      .min(1, "La fecha de estatura actual es requerida."),
    expectedHeight: z
      .string()
      .min(1, "La estatura esperada del caballo es requerida."),

    // Step 2: Pasaporte (Condicional)
    hasPassport: z.boolean().default(false),
    importDate: z.string().optional(),
    passportNumber: z.string().optional(),
    coatColor: z.string().optional(),
    coatPattern: z.string().optional(),
    colorDetails: z.string().optional(),
    microchipOrIdentifiers: z.string().optional(),

    // Step 3: Fotografías obligatorias
    photoLeft: z.string().min(1, "La foto de perfil izquierdo es obligatoria."),
    photoRight: z.string().min(1, "La foto de perfil derecho es obligatoria."),
    photoFront: z.string().min(1, "La foto de frente es obligatoria."),
    photoRear: z.string().min(1, "La foto trasera es obligatoria."),

    // Step 4: Pruebas genéticas de color opcionales
    selectedColorTests: z.array(z.string()).default([]),

    // Step 5: Aceptación de políticas oficiales
    acknowledgePolicies: z.boolean().refine((val) => val === true, {
      message: "Debe aceptar las políticas y directrices de pre-registro de GVHS.",
    }),
    draftId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.wantsToPurchasePrefix) {
      const cleanPrefix = data.farmPrefix?.trim() || "";
      if (cleanPrefix.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["farmPrefix"],
          message: "El prefijo oficial debe contener al menos 2 caracteres.",
        });
      } else if (cleanPrefix.length > 30) {
        ctx.addIssue({
          code: "custom",
          path: ["farmPrefix"],
          message: "El prefijo no debe superar los 30 caracteres.",
        });
      }
    }

    if (data.hasPassport) {
      if (!data.passportNumber || data.passportNumber.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["passportNumber"],
          message: "El número de pasaporte es requerido si cuenta con pasaporte.",
        });
      }
      if (!data.coatColor || data.coatColor.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["coatColor"],
          message: "El color de pelaje/capa es requerido si cuenta con pasaporte.",
        });
      }
      if (!data.coatPattern || data.coatPattern.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["coatPattern"],
          message: "El patrón de capa es requerido si cuenta con pasaporte.",
        });
      }
    }
  });

export type HorseRegistrationFormData = z.infer<typeof horseRegistrationSchema>;

export const GVHS_POLICIES_TEXT = {
  dnaFormNotice:
    "Una vez que hayamos procesado su solicitud y asignado un número de registro, le enviaremos un formato de ADN para enviar la muestra de pelo para pruebas de paternidad, color y PSSM1 según lo seleccionado.",
  resultsNotice:
    "Todos los resultados de las pruebas se enviarán a la GVHS y se le proporcionará una copia junto con su certificado de registro. Los resultados de las pruebas de color se registrarán en nuestro sistema y en su certificado de registro.",
  privacyNotice:
    "Al elegir la prueba de PSSM a través de la GVHS, nos reservamos el derecho de conservar esta información en nuestros registros para posibles estudios de investigación futuros. Ninguna prueba de PSSM se hará pública sin el permiso expreso del propietario registrado.",
  certificatePrintNotice:
    "Los resultados de PSSM1 y FIS se imprimirán en el reverso del certificado de registro.",
};

export const COMMON_COAT_COLORS = [
  "Negro",
  "Castaño",
  "Alazán",
  "Tordo / Canoso",
  "Bayo",
  "Palomino",
  "Ruano",
  "Dunalino",
  "Perlino / Cremello",
  "Otro",
];

export const COMMON_COAT_PATTERNS = [
  "Tobiano",
  "Overo",
  "Sabino",
  "Blagdon",
  "Sólido",
  "Tobero",
  "Splash White",
  "Otro",
];

export const COMMON_COUNTRIES = [
  "México",
  "Estados Unidos",
  "Reino Unido",
  "Irlanda",
  "Canadá",
  "España",
  "Países Bajos",
  "Alemania",
  "Francia",
  "Otro",
];
