import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { email } = await req.json();
  const { id } = params;
  // Fetch current collaborators
  const { data, error: fetchError } = await supabase
    .from("lists")
    .select("collaborators")
    .eq("id", id)
    .single();
  if (fetchError)
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  const collaborators = data?.collaborators || [];
  if (!collaborators.includes(email)) collaborators.push(email);
  const { error } = await supabase
    .from("lists")
    .update({ collaborators })
    .eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
