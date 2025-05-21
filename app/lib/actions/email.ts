import nodemailer from "nodemailer"

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
  const { subject, html, text } = createVerificationEmail({ name, url })
  return sendEmail({ to: email, subject, html, text })
}

export async function sendResetPasswordEmail(email: string, url: string, name?: string) {
  const { subject, html, text } = createResetPasswordEmail({ name, url })
  return sendEmail({ to: email, subject, html, text })
}

export async function sendUsernameRecoveryEmail(email: string, username: string, name?: string) {
  const { subject, html, text } = createUsernameRecoveryEmail({ name, username })
  return sendEmail({ to: email, subject, html, text })
}


function createVerificationEmail({ name, url }: { name?: string; url: string }) {
  const displayName = name ?? 'Friend';
  const subject = '🔒 Please Confirm Your Email Address';
  const html = `
<div style="font-family: Arial, sans-serif; line-height:1.5; color: #333;">
  <h2 style="color: #2a9d8f;">Hello ${displayName},</h2>
  <p>Thanks for creating an account with <strong>Forum</strong>! To get started, we just need to verify your email address.</p>
  <p style="text-align: center; margin: 30px 0;">
    <a href="${url}" style="background-color: #2a9d8f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
      Verify My Email
    </a>
  </p>
  <p>If that button doesn’t work, copy & paste this link:</p>
  <p style="word-break: break-all;"><a href="${url}">${url}</a></p>
  <p>This link expires in 1 hour.</p>
  <hr style="border:none;border-top:1px solid #eee; margin: 30px 0;" />
  <p>If you didn’t sign up, just ignore this email.</p>
  <p>Cheers,<br/><strong>Forum</strong> Team</p>
</div>
  `;
  const text = `Hello ${displayName},

Thanks for creating an account with Forum! To get started, we just need to verify your email address.

Verify your email by clicking this link:
${url}

If that doesn’t work, copy & paste:
${url}

This link expires in 1 hour.

If you didn’t sign up, just ignore this email.

Cheers,
Forum Team`;
  return { subject, html, text };
}


function createResetPasswordEmail({ name, url }: { name?: string; url: string }) {
  const displayName = name ?? 'there';
  const subject = '🔑 Reset Your Password';
  const html = `
<div style="font-family: Arial, sans-serif; line-height:1.5; color: #333;">
  <h2 style="color: #2a9d8f;">Hello ${displayName},</h2>
  <p>You requested a password reset for your Forum account.</p>
  <p style="text-align: center; margin: 30px 0;">
    <a href="${url}" style="background-color: #2a9d8f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
      Reset Password
    </a>
  </p>
  <p>If that link doesn’t work, copy & paste:</p>
  <p style="word-break: break-all;"><a href="${url}">${url}</a></p>
  <p>This link expires in 1 hour.</p>
  <hr style="border:none;border-top:1px solid #eee; margin: 30px 0;" />
  <p>If you didn’t request this, ignore this email.</p>
  <p>Thank you,<br/>Forum Team</p>
</div>
  `;
  const text = `Hello ${displayName},

You requested a password reset for your Forum account.

Reset your password here:
${url}

If that doesn’t work, copy & paste:
${url}

This link expires in 1 hour.

If you didn’t ask, just ignore.

Thank you,
Forum Team`;
  return { subject, html, text };
}

function createUsernameRecoveryEmail({ name, username }: { name?: string; username: string }) {
  const displayName = name ?? 'there';
  const subject = '👤 Your Username Recovery';
  const html = `
<div style="font-family: Arial, sans-serif; line-height:1.5; color: #333;">
  <h2 style="color: #2a9d8f;">Hello ${displayName},</h2>
  <p>You recently requested to recover your username for your Forum account.</p>
  
  <div style="background-color: #f8f9fa; border-left: 4px solid #2a9d8f; padding: 15px; margin: 25px 0; border-radius: 4px;">
    <p style="margin: 0; font-size: 16px;">Your username is: <strong style="font-size: 18px;">${username}</strong></p>
  </div>
  
  <p>You can use this username to sign in to your account.</p>
  
  <hr style="border:none;border-top:1px solid #eee; margin: 30px 0;" />
  
  <p>If you did not make this request, please ignore this email or contact support if you're concerned about your account security.</p>
  <p>Thank you,<br/><strong>Forum</strong> Team</p>
</div>
  `;
  const text = `Hello ${displayName},

You recently requested to recover your username for your Forum account.

Your username is: ${username}

You can use this username to sign in to your account.

If you did not make this request, please ignore this email or contact support if you're concerned about your account security.

Thank you,
Forum Team`;
  return { subject, html, text };
}