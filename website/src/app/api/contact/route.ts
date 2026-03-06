import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'All fields are required.' },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"BrikUp Contact" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            replyTo: email,
            subject: `New Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">
                        New Contact Form Submission
                    </h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: #f9f9f9; padding: 16px; border-radius: 8px; border-left: 4px solid #D4AF37;">
                        ${message}
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 24px;">
                        Sent from BrikUp contact form — brikuptech.com
                    </p>
                </div>
            `,
        });

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error('Mail error:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again.' },
            { status: 500 }
        );
    }
}
