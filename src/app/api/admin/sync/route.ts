import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_FEATURED_MACHINE,
  DEFAULT_VEHICLES,
  DEFAULT_SPONSORS,
  DEFAULT_ACHIEVEMENTS,
  VehicleRecord,
  extractSpotlightFromVehicles,
} from "@/src/data/cms_defaults";

export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fizxzmnvsbsjrmgthdqq.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createSupabaseClient(url, serviceKey || anonKey, {
    auth: { persistSession: false },
  });
}

// System Database Names
const DB_FLEET = "Fleet & Vehicles";
const DB_SPONSORS = "Corporate Sponsors";
const DB_ACHIEVEMENTS = "Hall of Fame & Achievements";
const DB_SETTINGS_EXT = "System Settings Extended";

// Helper: Upsert custom_databases record
async function upsertCustomDbRecord(supabase: any, dbName: string, description: string, records: any) {
  const { data: existing } = await supabase
    .from("custom_databases")
    .select("id")
    .eq("db_name", dbName)
    .maybeSingle();

  if (existing) {
    return await supabase
      .from("custom_databases")
      .update({
        records: records,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    return await supabase
      .from("custom_databases")
      .insert([
        {
          db_name: dbName,
          description,
          schema_definition: [],
          records: records,
        },
      ]);
  }
}

// GET: Unified System Snapshot
export async function GET() {
  try {
    const supabase = getAdminClient();

    // 1. Site Settings + Extended System Settings
    const [
      settingsRes,
      customDbsRes,
      machineRes,
      membersRes,
      expensesRes,
      recruitsRes,
      mediaRes,
      alumniRes,
    ] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      supabase.from("custom_databases").select("*").order("created_at", { ascending: true }),
      supabase.from("featured_machine").select("*").limit(1).maybeSingle(),
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("club_expenses").select("*").order("expense_date", { ascending: false }),
      supabase.from("recruitment_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("media_items").select("*").order("order_index", { ascending: true }),
      supabase.from("alumni").select("*").order("order_index", { ascending: true }),
    ]);

    const customDbs = customDbsRes.data || [];

    // Find system records
    const extDb = customDbs.find((d: any) => d.db_name === DB_SETTINGS_EXT);
    const fleetDb = customDbs.find((d: any) => d.db_name === DB_FLEET);
    const sponsorsDb = customDbs.find((d: any) => d.db_name === DB_SPONSORS);
    const achievementsDb = customDbs.find((d: any) => d.db_name === DB_ACHIEVEMENTS);

    const extRecord = extDb && Array.isArray(extDb.records) && extDb.records.length > 0 ? extDb.records[0] : (extDb?.records || {});
    const sData = settingsRes.data || {};

    // Merged unified site settings
    const unifiedSettings = {
      ...DEFAULT_SITE_SETTINGS,
      ...sData,
      ...extRecord,
      hero_title: extRecord?.hero_title || sData?.hero_title || DEFAULT_SITE_SETTINGS.hero_title,
      hero_subtitle: extRecord?.hero_subtitle || sData?.hero_subtitle || DEFAULT_SITE_SETTINGS.hero_subtitle,
      about_image_url: extRecord?.about_image_url || sData?.about_image_url || DEFAULT_SITE_SETTINGS.about_image_url,
      about_title: extRecord?.about_title || sData?.about_title || DEFAULT_SITE_SETTINGS.about_title,
      about_subtitle: extRecord?.about_subtitle || sData?.about_subtitle || DEFAULT_SITE_SETTINGS.about_subtitle,
      about_description: extRecord?.about_description || sData?.about_description || DEFAULT_SITE_SETTINGS.about_description,
      telemetry_stats: (extRecord?.telemetry_stats && extRecord.telemetry_stats.length > 0)
        ? extRecord.telemetry_stats
        : (sData?.telemetry_stats && sData.telemetry_stats.length > 0)
        ? sData.telemetry_stats
        : DEFAULT_SITE_SETTINGS.telemetry_stats,
      recruitment_custom_questions: (extRecord?.recruitment_custom_questions && extRecord.recruitment_custom_questions.length > 0)
        ? extRecord.recruitment_custom_questions
        : DEFAULT_SITE_SETTINGS.recruitment_custom_questions,
      recruitment_open: sData?.recruitment_open !== false && sData?.recruitment_form_enabled !== false,
      recruitment_form_enabled: sData?.recruitment_form_enabled !== false,
    };

    // Unified Fleet & Spotlight
    const vehicles: VehicleRecord[] =
      fleetDb && Array.isArray(fleetDb.records) && fleetDb.records.length > 0
        ? fleetDb.records
        : DEFAULT_VEHICLES;

    // Unified Featured Machine
    const mData = machineRes.data || {};
    const extractedSpotlight = extractSpotlightFromVehicles(vehicles);
    const unifiedMachine = {
      ...DEFAULT_FEATURED_MACHINE,
      ...extractedSpotlight,
      ...mData,
      cad_model_url: extRecord?.cad_model_url || mData?.cad_model_url || extractedSpotlight.cad_model_url || "/car-raw.glb",
    };

    // Unified Sponsors
    const sponsors =
      sponsorsDb && Array.isArray(sponsorsDb.records) && sponsorsDb.records.length > 0
        ? sponsorsDb.records
        : DEFAULT_SPONSORS;

    // Unified Achievements
    const achievements =
      achievementsDb && Array.isArray(achievementsDb.records) && achievementsDb.records.length > 0
        ? achievementsDb.records
        : DEFAULT_ACHIEVEMENTS;

    // Clean user custom dbs (filter out internal system namespaces)
    const systemNames = [DB_FLEET, DB_SPONSORS, DB_ACHIEVEMENTS, DB_SETTINGS_EXT];
    const userCustomDbs = customDbs.filter((d: any) => !systemNames.includes(d.db_name));

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      data: {
        settings: unifiedSettings,
        site_settings: unifiedSettings,
        machine: unifiedMachine,
        featured_machine: unifiedMachine,
        vehicles,
        sponsors,
        achievements,
        members: membersRes.data || [],
        expenses: expensesRes.data || [],
        recruits: recruitsRes.data || [],
        customDbs: userCustomDbs,
        custom_databases: userCustomDbs,
        media: mediaRes.data || [],
        alumni: alumniRes.data || [],
      },
    });
  } catch (err: any) {
    console.error("Control Center Sync Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch cloud state." },
      { status: 500 }
    );
  }
}

// POST: Save Updates to Cloud
export async function POST(req: Request) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    if (action === "save_settings") {
      // 1. Save standard site_settings table columns
      const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
      const standardPayload: any = {
        recruitment_cta_label: payload.recruitment_cta_label,
        recruitment_cta_url: payload.recruitment_cta_url,
        recruitment_cta_enabled: payload.recruitment_cta_enabled,
        announcement_badge_text: payload.announcement_badge_text,
        announcement_badge_enabled: payload.announcement_badge_enabled,
        contact_email: payload.contact_email,
        recruitment_form_enabled: payload.recruitment_form_enabled !== false && payload.recruitment_open !== false,
        recruitment_form_title: payload.recruitment_form_title || "Formula Student Electric 2026 - Official Recruitment",
        recruitment_form_deadline: payload.recruitment_form_deadline || "Season 2026 Phase 1 Induction",
        whatsapp_recruit_link: payload.whatsapp_recruit_link || "",
        onboarding_email_template: payload.onboarding_email_template || "",
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        await supabase.from("site_settings").update(standardPayload).eq("id", existing.id);
      } else {
        await supabase.from("site_settings").insert([standardPayload]);
      }

      // 2. Save extended settings (hero, about, telemetry, custom questions) to custom_databases
      const extendedRecord = {
        hero_title: payload.hero_title || DEFAULT_SITE_SETTINGS.hero_title,
        hero_subtitle: payload.hero_subtitle || DEFAULT_SITE_SETTINGS.hero_subtitle,
        about_image_url: payload.about_image_url || DEFAULT_SITE_SETTINGS.about_image_url,
        about_title: payload.about_title || DEFAULT_SITE_SETTINGS.about_title,
        about_subtitle: payload.about_subtitle || DEFAULT_SITE_SETTINGS.about_subtitle,
        about_description: payload.about_description || DEFAULT_SITE_SETTINGS.about_description,
        telemetry_stats: payload.telemetry_stats || DEFAULT_SITE_SETTINGS.telemetry_stats,
        recruitment_custom_questions: payload.recruitment_custom_questions || [],
        contact_email: payload.contact_email,
        updated_at: new Date().toISOString(),
      };

      await upsertCustomDbRecord(
        supabase,
        DB_SETTINGS_EXT,
        "Extended CMS settings including Hero, About, Telemetry and Custom Questions",
        [extendedRecord]
      );

      return NextResponse.json({ success: true, timestamp: Date.now() });
    }

    if (action === "save_vehicles") {
      const updatedVehicles: VehicleRecord[] = payload;
      // 1. Save to custom_databases Fleet & Vehicles
      await upsertCustomDbRecord(
        supabase,
        DB_FLEET,
        "Official Formula Student race cars and active spotlight selection",
        updatedVehicles
      );

      // 2. Sync spotlight to featured_machine table (safe sanitized payload without missing columns)
      const extractedSpotlight = extractSpotlightFromVehicles(updatedVehicles);
      const sanitizedMachine = {
        car_name: extractedSpotlight.car_name || DEFAULT_FEATURED_MACHINE.car_name,
        season_tag: extractedSpotlight.season_tag || DEFAULT_FEATURED_MACHINE.season_tag,
        description: extractedSpotlight.description || DEFAULT_FEATURED_MACHINE.description,
        cad_image_url: extractedSpotlight.cad_image_url || DEFAULT_FEATURED_MACHINE.cad_image_url,
        track_image_url: extractedSpotlight.track_image_url || DEFAULT_FEATURED_MACHINE.track_image_url,
        top_speed_val: String(extractedSpotlight.top_speed_val || DEFAULT_FEATURED_MACHINE.top_speed_val),
        accel_val: String(extractedSpotlight.accel_val || DEFAULT_FEATURED_MACHINE.accel_val),
        voltage_val: String(extractedSpotlight.voltage_val || DEFAULT_FEATURED_MACHINE.voltage_val),
        weight_val: String(extractedSpotlight.weight_val || DEFAULT_FEATURED_MACHINE.weight_val),
        powertrain_headline: extractedSpotlight.powertrain_headline || DEFAULT_FEATURED_MACHINE.powertrain_headline,
        powertrain_specs: extractedSpotlight.powertrain_specs || DEFAULT_FEATURED_MACHINE.powertrain_specs,
        accumulator_headline: extractedSpotlight.accumulator_headline || DEFAULT_FEATURED_MACHINE.accumulator_headline,
        accumulator_specs: extractedSpotlight.accumulator_specs || DEFAULT_FEATURED_MACHINE.accumulator_specs,
        chassis_headline: extractedSpotlight.chassis_headline || DEFAULT_FEATURED_MACHINE.chassis_headline,
        chassis_specs: extractedSpotlight.chassis_specs || DEFAULT_FEATURED_MACHINE.chassis_specs,
        aero_headline: extractedSpotlight.aero_headline || DEFAULT_FEATURED_MACHINE.aero_headline,
        aero_specs: extractedSpotlight.aero_specs || DEFAULT_FEATURED_MACHINE.aero_specs,
        updated_at: new Date().toISOString(),
      };

      const { data: existingMachine } = await supabase.from("featured_machine").select("id").limit(1).maybeSingle();
      if (existingMachine) {
        await supabase.from("featured_machine").update(sanitizedMachine).eq("id", existingMachine.id);
      } else {
        await supabase.from("featured_machine").insert([sanitizedMachine]);
      }

      // Also update cad_model_url in System Settings Extended
      if (extractedSpotlight.cad_model_url) {
        const { data: extDb } = await supabase.from("custom_databases").select("id, records").eq("db_name", DB_SETTINGS_EXT).maybeSingle();
        if (extDb) {
          const current = Array.isArray(extDb.records) && extDb.records.length > 0 ? extDb.records[0] : (extDb.records || {});
          await supabase.from("custom_databases").update({
            records: [{ ...current, cad_model_url: extractedSpotlight.cad_model_url }],
            updated_at: new Date().toISOString(),
          }).eq("id", extDb.id);
        }
      }

      return NextResponse.json({ success: true, timestamp: Date.now() });
    }

    if (action === "save_sponsors") {
      await upsertCustomDbRecord(
        supabase,
        DB_SPONSORS,
        "Official Title and Technical Partner Sponsors",
        payload
      );
      return NextResponse.json({ success: true, timestamp: Date.now() });
    }

    if (action === "save_achievements") {
      await upsertCustomDbRecord(
        supabase,
        DB_ACHIEVEMENTS,
        "Formula Student race achievements, podiums and awards",
        payload
      );
      return NextResponse.json({ success: true, timestamp: Date.now() });
    }

    if (action === "save_machine") {
      const sanitizedMachine = {
        car_name: payload.car_name || DEFAULT_FEATURED_MACHINE.car_name,
        season_tag: payload.season_tag || DEFAULT_FEATURED_MACHINE.season_tag,
        description: payload.description || DEFAULT_FEATURED_MACHINE.description,
        cad_image_url: payload.cad_image_url || DEFAULT_FEATURED_MACHINE.cad_image_url,
        track_image_url: payload.track_image_url || DEFAULT_FEATURED_MACHINE.track_image_url,
        top_speed_val: String(payload.top_speed_val || DEFAULT_FEATURED_MACHINE.top_speed_val),
        accel_val: String(payload.accel_val || DEFAULT_FEATURED_MACHINE.accel_val),
        voltage_val: String(payload.voltage_val || DEFAULT_FEATURED_MACHINE.voltage_val),
        weight_val: String(payload.weight_val || DEFAULT_FEATURED_MACHINE.weight_val),
        powertrain_headline: payload.powertrain_headline || DEFAULT_FEATURED_MACHINE.powertrain_headline,
        powertrain_specs: payload.powertrain_specs || DEFAULT_FEATURED_MACHINE.powertrain_specs,
        accumulator_headline: payload.accumulator_headline || DEFAULT_FEATURED_MACHINE.accumulator_headline,
        accumulator_specs: payload.accumulator_specs || DEFAULT_FEATURED_MACHINE.accumulator_specs,
        chassis_headline: payload.chassis_headline || DEFAULT_FEATURED_MACHINE.chassis_headline,
        chassis_specs: payload.chassis_specs || DEFAULT_FEATURED_MACHINE.chassis_specs,
        aero_headline: payload.aero_headline || DEFAULT_FEATURED_MACHINE.aero_headline,
        aero_specs: payload.aero_specs || DEFAULT_FEATURED_MACHINE.aero_specs,
        updated_at: new Date().toISOString(),
      };

      const { data: existingMachine } = await supabase.from("featured_machine").select("id").limit(1).maybeSingle();
      if (existingMachine) {
        await supabase.from("featured_machine").update(sanitizedMachine).eq("id", existingMachine.id);
      } else {
        await supabase.from("featured_machine").insert([sanitizedMachine]);
      }

      // Save cad_model_url in System Settings Extended
      if (payload.cad_model_url) {
        const { data: extDb } = await supabase.from("custom_databases").select("id, records").eq("db_name", DB_SETTINGS_EXT).maybeSingle();
        if (extDb) {
          const current = Array.isArray(extDb.records) && extDb.records.length > 0 ? extDb.records[0] : (extDb.records || {});
          await supabase.from("custom_databases").update({
            records: [{ ...current, cad_model_url: payload.cad_model_url }],
            updated_at: new Date().toISOString(),
          }).eq("id", extDb.id);
        }
      }

      return NextResponse.json({ success: true, timestamp: Date.now() });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    console.error("Control Center Save Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save cloud state." },
      { status: 500 }
    );
  }
}
