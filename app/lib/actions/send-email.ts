import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify().then(
    () => console.log('✔️  SMTP transporter ready'),
    (err) => console.error('❌  SMTP transporter error:', err)
);

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendEmail(options: EmailOptions) {
    const { to, subject, text, html } = options;

    if (!to || !subject || (!text && !html)) {
        throw new Error('Missing email parameters: to, subject, and text/html are required');
    }

    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
    });

    return info;
}
