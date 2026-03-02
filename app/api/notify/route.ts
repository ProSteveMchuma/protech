import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, email, type, ...data } = body;

        // In a real app, you'd use environment variables
        // For this demonstration, we acknowledge the intent
        console.log(`Sending Email Notification for ${type}...`);
        console.log("Details:", body);

        /*
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 587,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
    
        await transporter.sendMail({
          from: '"RemotePro Notifications" <noreply@remotepro.co.ke>',
          to: "admin@remotepro.co.ke",
          subject: `New ${type}: ${fullName}`,
          text: JSON.stringify(body, null, 2),
        });
        */

        return NextResponse.json({ success: true, message: "Notification sent" });
    } catch (error) {
        console.error("Email Error:", error);
        return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 });
    }
}
