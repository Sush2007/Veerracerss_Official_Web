import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      full_name,
      email,
      phone,
      roll_no,
      branch,
      year_of_study,
      primary_domain,
      secondary_domain,
      pr_domain,
      experience_summary,
      portfolio_url,
    } = body;

    if (!full_name || !email || !phone || !roll_no || !branch || !year_of_study || !primary_domain) {
      return NextResponse.json(
        { error: "Please fill in all mandatory application fields." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fizxzmnvsbsjrmgthdqq.supabase.co";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const supabase = createSupabaseClient(supabaseUrl, serviceKey || anonKey, {
      auth: { persistSession: false },
    });

    // Verify recruitment is actively open
    const { data: settings } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (
      settings &&
      (settings.recruitment_form_enabled === false || (settings as any).recruitment_open === false)
    ) {
      return NextResponse.json(
        { error: "Recruitment applications for Season 2026 are currently closed." },
        { status: 403 }
      );
    }

    const prInterestNote = pr_domain && pr_domain !== "None (Technical Only)"
      ? `[PR / Media Interest: ${pr_domain}]`
      : "";

    // Insert application
    const { data, error } = await supabase
      .from("recruitment_applications")
      .insert([
        {
          full_name,
          email,
          phone,
          roll_no,
          branch,
          year_of_study,
          primary_domain,
          secondary_domain: secondary_domain || null,
          experience_summary: experience_summary || "",
          portfolio_url: portfolio_url || null,
          status: "Pending",
          interview_score: "Pending Review",
          notes: prInterestNote || null,
        },
      ])
      .select()
      .single();

    if (error) {
      // If table is not created yet in supabase, provide clean guidance
      console.error("Supabase insert recruitment error:", error);
      return NextResponse.json(
        { error: "Database error. Please ensure supabase-operations-setup.sql has been run." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! Our technical leads will review your profile.",
      data,
    });
  } catch (err: any) {
    console.error("Recruitment submit error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
