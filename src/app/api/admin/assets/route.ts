import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { validateAsset, auditAllDatabaseAssets, healDatabaseAssets } from "@/src/lib/assetSync";

export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fizxzmnvsbsjrmgthdqq.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createSupabaseClient(url, serviceKey || anonKey, {
    auth: { persistSession: false },
  });
}

// GET: Validate a single path or run complete system asset audit
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkPath = searchParams.get("checkPath");
    const doAudit = searchParams.get("audit");

    // Case 1: Check a single path (used for real-time validation in form inputs)
    if (checkPath) {
      const result = validateAsset(checkPath);
      return NextResponse.json({ success: true, result });
    }

    // Case 2: Run full database & filesystem asset audit
    if (doAudit === "true" || !checkPath) {
      const supabase = getAdminClient();
      const report = await auditAllDatabaseAssets(supabase);
      return NextResponse.json({ success: true, report });
    }

    return NextResponse.json({ success: false, error: "Invalid request parameters." }, { status: 400 });
  } catch (err: any) {
    console.error("Asset check error:", err);
    return NextResponse.json({ success: false, error: err.message || "Asset check failed." }, { status: 500 });
  }
}

// POST: Run automated healing on all broken database assets
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || "heal";

    if (action === "heal") {
      const supabase = getAdminClient();
      const healResult = await healDatabaseAssets(supabase);
      return NextResponse.json({
        success: true,
        message: `Asset auto-heal completed. Successfully repaired ${healResult.healedCount} broken references.`,
        healResult,
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action." }, { status: 400 });
  } catch (err: any) {
    console.error("Asset healing error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to auto-heal assets." }, { status: 500 });
  }
}
