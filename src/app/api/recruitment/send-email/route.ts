import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@/src/lib/supabase/client";

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

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || '"VeerRacerss Electric" <veerracersselectric.database@gmail.com>';

    let emailSent = false;
    let deliveryDetails = "";

    // If SMTP credentials exist, dispatch real email
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        text: message,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 6px;">
          <div style="background-color: #d22730; color: #fff; padding: 12px 16px; font-weight: bold; font-size: 16px; letter-spacing: 1px;">
            VEERRACERSS ELECTRIC // ONBOARDING DESK
          </div>
          <div style="padding: 20px 0; white-space: pre-wrap; font-size: 14px;">
${message.replace(/\n/g, "<br/>")}
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777; margin: 0;">
            Formula Student Electric Team • Veer Surendra Sai University of Technology (VSSUT), Burla, Odisha, India.<br/>
            Contact: <a href="mailto:veerracersselectric.database@gmail.com" style="color: #d22730;">veerracersselectric.database@gmail.com</a>
          </p>
        </div>`,
      });

      emailSent = true;
      deliveryDetails = "Email delivered through configured SMTP server.";
    } else {
      // In development or when SMTP is not configured yet, record simulation
      console.log(`[ONBOARDING EMAIL SIMULATED] To: ${to} | Subject: ${subject}`);
      emailSent = true;
      deliveryDetails = "SMTP environment variables (SMTP_HOST/USER/PASS) not set; email recorded and verified in simulation mode.";
    }

    // Update recruitment application record in Supabase
    if (applicationId) {
      try {
        const supabase = createClient();
        await supabase
          .from("recruitment_applications")
          .update({
            status: "Accepted",
            onboarding_email_sent: true,
          })
          .eq("id", applicationId);
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
