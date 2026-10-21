import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const to = body.to || body.candidate_email || body.email;
    const candidateName = body.candidateName || body.candidate_name || body.full_name;
    const subject = body.subject;
    const message = body.message || body.custom_message || body.content;
    const applicationId = body.applicationId || body.application_id || body.id;

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Recipient email, subject, and message are required." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY || "";
    let emailSent = false;
    let deliveryDetails = "";

    const htmlContent = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 6px;">
      <div style="background-color: #d22730; color: #fff; padding: 12px 16px; font-weight: bold; font-size: 16px; letter-spacing: 1px;">
        VEERRACERSS ELECTRIC // ONBOARDING DESK
      </div>
      <div style="padding: 20px 0; white-space: pre-wrap; font-size: 14px;">
${message.replace(/\n/g, "<br/>")}
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #777; margin: 0;">
        Formula Student Electric Team • Veer Surendra Sai University of Technology (VSSUT), Burla, Odisha, India.<br/>
        Official Desk: <a href="mailto:veerracersselectric.database@gmail.com" style="color: #d22730;">veerracersselectric.database@gmail.com</a>
      </p>
    </div>`;

    // 1. Direct SMTP / Google App Password Automated Delivery (Primary)
    const rawPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    const gmailPass = rawPass ? rawPass.trim().replace(/\s+/g, "") : "";
    const gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || "veerracersselectric.database@gmail.com").trim();
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const smtpFrom = process.env.SMTP_FROM || `"VeerRacerss Electric" <${gmailUser}>`;

    let deliveryError: string | null = null;

    if (gmailPass) {
      try {
        const transporter = smtpHost
          ? nodemailer.createTransport({
              host: smtpHost,
              port: smtpPort,
              secure: smtpPort === 465,
              auth: { user: gmailUser, pass: gmailPass },
              connectionTimeout: 10000,
              greetingTimeout: 10000,
              socketTimeout: 15000,
            })
          : nodemailer.createTransport({
              service: "gmail",
              auth: { user: gmailUser, pass: gmailPass },
              connectionTimeout: 10000,
              greetingTimeout: 10000,
              socketTimeout: 15000,
            });

        await transporter.sendMail({
          from: smtpFrom,
          to,
          subject,
          text: message,
          html: htmlContent,
        });

        emailSent = true;
        deliveryDetails = `Email dispatched via automated Google SMTP from ${gmailUser}.`;
      } catch (smtpErr: any) {
        console.error("Google SMTP send error:", smtpErr);
        deliveryError = smtpErr.message || "Failed to dispatch via Google SMTP";
        deliveryDetails = `SMTP error: ${smtpErr.message}`;
      }
    }

    // 2. Secondary fallback: Resend API (if configured and SMTP not sent)
    if (!emailSent && resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const fromAddress = process.env.RESEND_FROM || "VeerRacerss Electric <onboarding@resend.dev>";
        
        const resendResult = await resend.emails.send({
          from: fromAddress,
          to: [to],
          subject: subject,
          html: htmlContent,
          text: message,
        });

        if (resendResult.error) {
          console.warn("Resend API warning:", resendResult.error);
          deliveryError = resendResult.error.message;
          deliveryDetails = `Resend note: ${resendResult.error.message}`;
        } else {
          emailSent = true;
          deliveryError = null;
          deliveryDetails = `Email dispatched successfully via API (ID: ${resendResult.data?.id}).`;
        }
      } catch (resendErr: any) {
        console.warn("Resend send attempt error:", resendErr);
        deliveryError = resendErr.message;
        deliveryDetails = `Resend attempt: ${resendErr.message}`;
      }
    }

    if (!emailSent) {
      return NextResponse.json(
        {
          error: deliveryError || "Could not deliver email. Please check your Google SMTP App Password.",
          deliveryDetails,
        },
        { status: 502 }
      );
    }

    // 3. Update recruitment application record in Supabase (validated UUID only)
    const isUuid = applicationId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(applicationId);
    if (isUuid) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fizxzmnvsbsjrmgthdqq.supabase.co";
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

        const supabase = createSupabaseClient(supabaseUrl, serviceKey || anonKey, {
          auth: { persistSession: false },
        });

        const { error: updateErr } = await supabase
          .from("recruitment_applications")
          .update({
            status: "Accepted",
            onboarding_email_sent: true,
          })
          .eq("id", applicationId);

        if (updateErr) {
          console.warn("Could not update applicant status in Supabase:", updateErr);
        }
      } catch (dbErr) {
        console.warn("Could not update applicant status in Supabase:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Onboarding letter dispatched to ${candidateName || to}.`,
      deliveryDetails,
    });
  } catch (err: any) {
    console.error("Failed to send onboarding email:", err);
    return NextResponse.json(
      { error: err.message || "Failed to dispatch email." },
      { status: 500 }
    );
  }
}
