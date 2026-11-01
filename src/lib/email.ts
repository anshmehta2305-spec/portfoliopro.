import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || "Portfolio Pro <no-reply@portfoliopro.in>";

  // If SMTP is not fully configured, log email payload safely (Development / Mock mode)
  if (!user || !pass || !host) {
    console.log("-------------------------------------------------------");
    console.log(`[SIMULATED EMAIL DISPATCH]`);
    console.log(`To: ${to}`);
    console.log(`From: ${from}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content Preview: ${html.slice(0, 160)}...`);
    console.log("-------------------------------------------------------");
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from,
      to,
      replyTo: replyTo || from,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Nodemailer dispatch failed:", error);
    return { success: false, error: (error as Error).message };
  }
}

