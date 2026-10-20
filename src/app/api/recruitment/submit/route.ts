import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/client";

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
      experience_summary,
      portfolio_url,
    } = body;

    if (!full_name || !email || !phone || !roll_no || !branch || !year_of_study || !primary_domain) {
      return NextResponse.json(
        { error: "Please fill in all mandatory application fields." },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Verify recruitment is actively open
    const { data: settings } = await supabase
      .from("site_settings")
      .select("recruitment_form_enabled")
      .limit(1)
      .maybeSingle();

    if (settings && settings.recruitment_form_enabled === false) {
      return NextResponse.json(
        { error: "Recruitment applications for Season 2026 are currently closed." },
        { status: 403 }
      );
    }

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
