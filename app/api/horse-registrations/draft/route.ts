import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/lib/memberships";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para consultar borradores." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get("id");

    let query = supabaseAdmin
      .from("horse_registrations")
      .select("*")
      .eq("user_id", user.id);

    if (draftId) {
      query = query.eq("id", draftId);
    } else {
      query = query.eq("payment_status", "unpaid").order("created_at", { ascending: false });
    }

    const { data: record, error } = await query.limit(1).maybeSingle();

    if (error) {
      console.error("Error al buscar borrador de registro:", error);
      return NextResponse.json(
        { error: "No se pudo recuperar el borrador de registro." },
        { status: 500 }
      );
    }

    if (!record) {
      return NextResponse.json({ draft: null });
    }

    // Mapear campos de la base de datos al formato HorseRegistrationFormData
    const draftData = {
      horseName: record.horse_name || "",
      ownerName: record.owner_name || "",
      acquisitionDate: record.acquisition_date || "",
      gender: (record.gender === "mare" ? "mare" : "stallion") as "stallion" | "mare",
      birthDate: record.birth_date || "",
      countryOfBirth: record.country_of_birth || "México",
      hasPassport: Boolean(record.has_passport),
      importDate: record.import_date || "",
      passportNumber: record.passport_number || "",
      coatColor: record.coat_color || "",
      coatPattern: record.coat_pattern || "",
      colorDetails: record.color_details || "",
      microchipOrIdentifiers: record.microchip_or_identifiers || "",
      photoLeft: record.photo_left_url || "",
      photoRight: record.photo_right_url || "",
      photoFront: record.photo_front_url || "",
      photoRear: record.photo_rear_url || "",
      selectedColorTests: Array.isArray(record.selected_color_tests) ? record.selected_color_tests : [],
      acknowledgePolicies: false,
      draftId: record.id,
    };

    return NextResponse.json({
      draft: draftData,
      draftId: record.id,
      paymentStatus: record.payment_status,
      status: record.status,
      createdAt: record.created_at,
    });
  } catch (err: any) {
    console.error("Error inesperado en GET /api/horse-registrations/draft:", err);
    return NextResponse.json(
      { error: err.message || "Error interno al recuperar borrador." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para eliminar una solicitud." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get("id");

    if (!draftId) {
      return NextResponse.json(
        { error: "Se requiere el identificador de la solicitud (id)." },
        { status: 400 }
      );
    }

    // Verificar que el registro exista, pertenezca al usuario y sea de pago pendiente
    const { data: record, error: findError } = await supabaseAdmin
      .from("horse_registrations")
      .select("id, horse_name, payment_status, status")
      .eq("id", draftId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (findError) {
      console.error("Error al buscar registro para eliminar:", findError);
      return NextResponse.json(
        { error: "Error al validar la solicitud a eliminar." },
        { status: 500 }
      );
    }

    if (!record) {
      return NextResponse.json(
        { error: "No se encontró la solicitud de registro o no tienes permiso para gestionarla." },
        { status: 404 }
      );
    }

    // Seguridad estricta: Solo permitir eliminar registros con pago pendiente
    const isPendingPayment =
      record.payment_status === "unpaid" || record.status === "pending_payment";

    if (!isPendingPayment) {
      return NextResponse.json(
        {
          error:
            "No es posible eliminar una solicitud que ya ha sido pagada o que se encuentra en proceso oficial.",
        },
        { status: 403 }
      );
    }

    // Eliminar el registro preliminar de la base de datos
    const { error: deleteError } = await supabaseAdmin
      .from("horse_registrations")
      .delete()
      .eq("id", draftId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error eliminando registro de caballo:", deleteError);
      return NextResponse.json(
        { error: "No se pudo eliminar la solicitud de registro." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `La solicitud para "${record.horse_name}" ha sido eliminada exitosamente.`,
      deletedId: draftId,
    });
  } catch (err: any) {
    console.error("Error inesperado en DELETE /api/horse-registrations/draft:", err);
    return NextResponse.json(
      { error: err.message || "Error interno al procesar la eliminación." },
      { status: 500 }
    );
  }
}
