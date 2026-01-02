"use server";

import nodemailer from "nodemailer";

interface EmailPayload {
    to: string; // Internal email (e.g., hello@proinnovation.tech)
    subject: string;
    html: string;
    replyTo?: string; // The user's email
}

export async function sendEmail(data: EmailPayload) {
    const { to, subject, html, replyTo } = data;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"ProTech Website" <${process.env.SMTP_USER}>`, // Sender address
            to,
            replyTo,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: "Failed to send email" };
    }
}
