import fs from "fs";
import path from "path";
import { SupabaseClient } from "@supabase/supabase-js";

export interface AssetValidationResult {
  valid: boolean;
  exists: boolean;
  resolvedUrl: string;
  suggestedFix?: string;
  reason?: string;
}

export interface AssetIssue {
  id: string;
  location: string;
  field: string;
  currentValue: string;
  suggestedFix?: string;
  reason: string;
}

export interface AssetAuditReport {
  timestamp: string;
  totalChecked: number;
  healthy: number;
  brokenCount: number;
  issues: AssetIssue[];
}

/**
 * Validates a static or remote asset path.
 * If local (starts with /), checks against the public directory on disk.
 * If missing, intelligently discovers alternative extensions or sibling files.
 */
export function validateAsset(pathOrUrl: string): AssetValidationResult {
  if (!pathOrUrl || typeof pathOrUrl !== "string") {
    return {
      valid: false,
      exists: false,
      resolvedUrl: "/members/default-avatar.svg",
      reason: "Empty or invalid asset path provided.",
    };
  }

  const clean = pathOrUrl.trim();

  // 1. Remote URLs (http/https)
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    if (clean.includes("localhost:") || clean.includes("example.com")) {
      return {
        valid: false,
        exists: false,
        resolvedUrl: clean,
        reason: "Placeholder or local development URL found in production reference.",
      };
    }
    return {
      valid: true,
      exists: true,
      resolvedUrl: clean,
    };
  }

  // 2. Data URIs or Relative imports
  if (clean.startsWith("data:") || clean.startsWith("blob:")) {
    return { valid: true, exists: true, resolvedUrl: clean };
  }

  // 3. Local filesystem check against public/
  const publicDir = path.resolve(process.cwd(), "public");
  const relativePath = clean.replace(/^\//, "").split("?")[0].replace(/\//g, path.sep);
  const fullPath = path.join(publicDir, relativePath);

  if (fs.existsSync(fullPath)) {
    return {
      valid: true,
      exists: true,
      resolvedUrl: clean,
    };
  }

  // File does NOT exist on disk. Perform intelligent heuristic resolution.
  const parsed = path.parse(fullPath);
  const parentDir = parsed.dir;
  const baseNameWithoutExt = parsed.name;

  if (fs.existsSync(parentDir)) {
    try {
      const siblings = fs.readdirSync(parentDir);
      // Case A: Same basename, different extension (e.g. .png vs .jpg vs .webp)
      const extMatch = siblings.find((file) => {
        const sibParsed = path.parse(file);
        return sibParsed.name.toLowerCase() === baseNameWithoutExt.toLowerCase();
      });

      if (extMatch) {
        const publicRelative = path.relative(publicDir, path.join(parentDir, extMatch)).replace(/\\/g, "/");
        const suggested = `/${publicRelative}`;
        return {
          valid: false,
          exists: false,
          resolvedUrl: suggested,
          suggestedFix: suggested,
          reason: `File extension mismatch. Found '${extMatch}' on disk.`,
        };
      }

      // Case B: Partial match / sibling in the same folder
      const partialMatch = siblings.find((file) => {
        const lower = file.toLowerCase();
        return (
          lower.includes(baseNameWithoutExt.toLowerCase().split("-")[0]) &&
          /\.(jpg|jpeg|png|webp|svg|glb)$/i.test(file)
        );
      });

      if (partialMatch) {
        const publicRelative = path.relative(publicDir, path.join(parentDir, partialMatch)).replace(/\\/g, "/");
        const suggested = `/${publicRelative}`;
        return {
          valid: false,
          exists: false,
          resolvedUrl: suggested,
          suggestedFix: suggested,
          reason: `File not found. Closest matching asset is '${suggested}'.`,
        };
      }
    } catch {
      // ignore
    }
  }

  // Fallback safe defaults by category
  let defaultFallback = "/members/default-avatar.svg";
  if (clean.startsWith("/cars/")) {
    defaultFallback = "/cars/aether-spotlight.jpg";
  } else if (clean.startsWith("/sponsors/")) {
    defaultFallback = "/sponsors/crosshead.svg";
  } else if (clean.startsWith("/achievements/")) {
    defaultFallback = "/achievements/formula-imperial-2025.jpg";
  }

  return {
    valid: false,
    exists: false,
    resolvedUrl: defaultFallback,
    suggestedFix: defaultFallback,
    reason: `Asset '${clean}' does not exist in the public directory.`,
  };
}

/**
 * Scans all database and custom_databases entries for static asset references
 * and validates them against the filesystem.
 */
export async function auditAllDatabaseAssets(supabase: SupabaseClient): Promise<AssetAuditReport> {
  const issues: AssetIssue[] = [];
  let totalChecked = 0;

  // 1. site_settings
  try {
    const { data: settings } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    if (settings) {
      for (const field of ["team_logo_url", "hero_bg_image"]) {
        const val = settings[field];
        if (typeof val === "string" && val.trim()) {
          totalChecked++;
          const res = validateAsset(val);
          if (!res.exists) {
            issues.push({
              id: settings.id || "site_settings_1",
              location: "site_settings",
              field,
              currentValue: val,
              suggestedFix: res.suggestedFix,
              reason: res.reason || "Asset missing from public directory",
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Audit error site_settings:", err);
  }

  // 2. featured_machine
  try {
    const { data: machines } = await supabase.from("featured_machine").select("*");
    if (machines) {
      for (const m of machines) {
        for (const field of ["cad_image_url", "image_url"]) {
          const val = m[field];
          if (typeof val === "string" && val.trim()) {
            totalChecked++;
            const res = validateAsset(val);
            if (!res.exists) {
              issues.push({
                id: m.id || "featured_machine",
                location: "featured_machine",
                field,
                currentValue: val,
                suggestedFix: res.suggestedFix,
                reason: res.reason || "Asset missing from public directory",
              });
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Audit error featured_machine:", err);
  }

  // 3. members
  try {
    const { data: members } = await supabase.from("members").select("id, name, image_url");
    if (members) {
      for (const mem of members) {
        const val = mem.image_url;
        if (typeof val === "string" && val.trim()) {
          totalChecked++;
          const res = validateAsset(val);
          if (!res.exists) {
            issues.push({
              id: mem.id,
              location: `members (${mem.name})`,
              field: "image_url",
              currentValue: val,
              suggestedFix: res.suggestedFix,
              reason: res.reason || "Member photo missing from disk",
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Audit error members:", err);
  }

  // 4. alumni
  try {
    const { data: alumni } = await supabase.from("alumni").select("id, name, image_url");
    if (alumni) {
      for (const a of alumni) {
        const val = a.image_url;
        if (typeof val === "string" && val.trim()) {
          totalChecked++;
          const res = validateAsset(val);
          if (!res.exists) {
            issues.push({
              id: a.id,
              location: `alumni (${a.name})`,
              field: "image_url",
              currentValue: val,
              suggestedFix: res.suggestedFix,
              reason: res.reason || "Alumni photo missing from disk",
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Audit error alumni:", err);
  }

  // 5. custom_databases
  try {
    const { data: customDbs } = await supabase.from("custom_databases").select("*");
    if (customDbs) {
      for (const db of customDbs) {
        if (Array.isArray(db.records)) {
          db.records.forEach((rec: any, idx: number) => {
            for (const key of ["image", "cad_image", "cad_model_url", "logo_url", "photo_url", "file_url"]) {
              const val = rec[key];
              if (typeof val === "string" && val.trim()) {
                totalChecked++;
                const res = validateAsset(val);
                if (!res.exists) {
                  issues.push({
                    id: `${db.id}:${idx}:${key}`,
                    location: `custom_databases [${db.db_name}] #${idx} (${rec.name || rec.title || "Record"})`,
                    field: key,
                    currentValue: val,
                    suggestedFix: res.suggestedFix,
                    reason: res.reason || "Custom DB asset missing from disk",
                  });
                }
              }
            }
          });
        }
      }
    }
  } catch (err) {
    console.error("Audit error custom_databases:", err);
  }

  return {
    timestamp: new Date().toISOString(),
    totalChecked,
    healthy: totalChecked - issues.length,
    brokenCount: issues.length,
    issues,
  };
}

/**
 * Automatically repairs broken asset references in Supabase with their verified suggested fixes.
 */
export async function healDatabaseAssets(
  supabase: SupabaseClient
): Promise<{ healedCount: number; healedItems: any[] }> {
  const audit = await auditAllDatabaseAssets(supabase);
  const healedItems: any[] = [];

  for (const issue of audit.issues) {
    if (!issue.suggestedFix) continue;

    // A. site_settings
    if (issue.location === "site_settings") {
      await supabase
        .from("site_settings")
        .update({ [issue.field]: issue.suggestedFix, updated_at: new Date().toISOString() })
        .eq("id", issue.id);
      healedItems.push({ location: issue.location, field: issue.field, old: issue.currentValue, new: issue.suggestedFix });
    }

    // B. featured_machine
    if (issue.location === "featured_machine") {
      await supabase
        .from("featured_machine")
        .update({ [issue.field]: issue.suggestedFix, updated_at: new Date().toISOString() })
        .eq("id", issue.id);
      healedItems.push({ location: issue.location, field: issue.field, old: issue.currentValue, new: issue.suggestedFix });
    }

    // C. members
    if (issue.location.startsWith("members")) {
      await supabase
        .from("members")
        .update({ image_url: issue.suggestedFix, updated_at: new Date().toISOString() })
        .eq("id", issue.id);
      healedItems.push({ location: issue.location, field: issue.field, old: issue.currentValue, new: issue.suggestedFix });
    }

    // D. custom_databases
    if (issue.location.startsWith("custom_databases")) {
      const [dbId, recordIdxStr, fieldKey] = issue.id.split(":");
      const recIndex = parseInt(recordIdxStr, 10);
      const { data: db } = await supabase.from("custom_databases").select("*").eq("id", dbId).maybeSingle();
      if (db && Array.isArray(db.records) && db.records[recIndex]) {
        const records = [...db.records];
        records[recIndex] = {
          ...records[recIndex],
          [fieldKey]: issue.suggestedFix,
        };
        await supabase
          .from("custom_databases")
          .update({ records, updated_at: new Date().toISOString() })
          .eq("id", dbId);
        healedItems.push({ location: issue.location, field: fieldKey, old: issue.currentValue, new: issue.suggestedFix });
      }
    }
  }

  return {
    healedCount: healedItems.length,
    healedItems,
  };
}
