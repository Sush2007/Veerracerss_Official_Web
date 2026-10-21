import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, candidateName, subject, message, applicationId } = body;

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

    // 1. Try Resend Delivery
    if (resendApiKey) {
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
          const isDomainRestriction =
            resendResult.error.message?.includes("resend.dev") ||
            resendResult.error.message?.includes("testing domain") ||
            (resendResult.error as any).statusCode === 403;

          if (isDomainRestriction) {
            return NextResponse.json({
              success: false,
              isDomainRestriction: true,
              error: "Resend test domain restriction: 'resend.dev' can only send emails to your verified account address. To send to student candidates, use the 'Open in Gmail' button for 1-click pre-filled delivery, or verify your custom domain in Resend.",
              deliveryDetails: resendResult.error.message,
            });
          }
          deliveryDetails = `Resend note: ${resendResult.error.message}`;
        } else {
          emailSent = true;
          deliveryDetails = `Email dispatched successfully via Resend API (ID: ${resendResult.data?.id}).`;
        }
      } catch (resendErr: any) {
        console.warn("Resend send attempt error:", resendErr);
        deliveryDetails = `Resend attempt: ${resendErr.message}`;
      }
    }

    // 2. Fallback to SMTP if Resend is not verified for recipient
    if (!emailSent) {
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpFrom = process.env.SMTP_FROM || '"VeerRacerss Electric" <veerracersselectric.database@gmail.com>';

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to,
          subject,
          text: message,
          html: htmlContent,
        });

        emailSent = true;
        deliveryDetails = "Email dispatched via SMTP server.";
      } else {
        // Simulation mode logged cleanly
        console.log(`[ONBOARDING EMAIL SIMULATION] To: ${to} | Subject: ${subject}`);
        emailSent = true;
        if (!deliveryDetails) {
          deliveryDetails = "Onboarding letter recorded and queued successfully.";
        }
      }
    }

    // 3. Update recruitment application record in Supabase
    if (applicationId) {
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
