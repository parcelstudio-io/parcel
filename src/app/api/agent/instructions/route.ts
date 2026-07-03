import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";
import { loadInstructions, saveUserInstructions } from "@/lib/instructions/load";

export async function GET() {
  try {
    const user = await requireUser();
    const supabase = await createClient();
    const { data: agent } = await supabase.from("agents").select("*").eq("user_id", user.id).single();

    const instructions = await loadInstructions(user.id, {
      system: agent?.system_instruction_override,
      developer: agent?.developer_instruction_override,
    });

    return NextResponse.json({ instructions, agent });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireUser();
    const { system, developer } = await request.json();

    const supabase = await createClient();
    await supabase
      .from("agents")
      .update({
        system_instruction_override: system,
        developer_instruction_override: developer,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    await saveUserInstructions(user.id, system, developer);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
