import { render } from "@react-email/render"
import nodemailer from "nodemailer"

import { ResetPasswordEmail } from "@/components/email/reset-password"
import { UsernameReminderEmail } from "@/components/email/username-reminder"
import { VerificationEmail } from "@/components/email/verification"


export type EmailOptions = {
  to: string
  subject: string
  text?: string
  html?: string
}

// Create a singleton for the transporter
let _transporter: nodemailer.Transporter | null = null

// Get the transporter instance
function getTransporter() {
  if (_transporter) return _transporter

  // Create new transporter if it doesn't exist
  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Verify connection configuration
  _transporter.verify().then(
    () => console.log("✔️  SMTP transporter ready"),
    (err) => console.error("❌  SMTP transporter error:", err),
  )

  return _transporter
}

export async function sendEmail(options: EmailOptions) {
  const { to, subject, text, html } = options

  // Validate required fields
  if (!to || !subject || (!text && !html)) {
    throw new Error("Missing email parameters: to, subject, and text/html are required")
  }

  const transporter = getTransporter()

  try {
    // Send email
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Forum" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    })

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export async function sendVerificationEmail(email: string, url: string, name?: string) {
  const html = await render(VerificationEmail({ name, url }))
  const text = await render(VerificationEmail({ name, url }), { plainText: true })

  return sendEmail({
    to: email,
    subject: "🔒 Please Confirm Your Email Address",
    html,
    text,
  })
}

export async function sendResetPasswordEmail(email: string, url: string, name?: string) {
  const html = await render(ResetPasswordEmail({ name, url }))
  const text = await render(ResetPasswordEmail({ name, url }), { plainText: true })

  return sendEmail({
    to: email,
    subject: "🔑 Reset Your Password",
    html,
    text,
  })
}

export async function sendUsernameReminderEmail(email: string, username: string, name?: string) {
  const html = await render(UsernameReminderEmail({ name, username }))
  const text = await render(UsernameReminderEmail({ name, username }), { plainText: true })

  return sendEmail({
    to: email,
    subject: "👤 Your Username Reminder",
    html,
    text,
  })
}
