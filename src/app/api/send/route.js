import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(req) {
    const GEMAIL = process.env.EMAIL;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    // In-memory limiter (per-instance on serverless — see src/lib/rate-limit.js)
    const ip = getClientIp(req);
    const limited = rateLimit(`send:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
    if (!limited.ok) {
        return NextResponse.json(
            { message: "Too many requests. Please try again later." },
            {
                status: 429,
                headers: { 'Retry-After': String(Math.ceil(limited.retryAfterMs / 1000) || 60) },
            }
        );
    }

    let body;
    try {
        body = await req.json();
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    if (!body) {
        return NextResponse.json({ message: "bad request" }, { status: 400 });
    }

    const { email, subject, feedback, honeypot, website } = body;

    // Honeypot: UI + API use `honeypot`; also reject legacy `website` if filled
    if (honeypot || website) {
        return NextResponse.json({ message: "Bot detected" }, { status: 400 });
    }

    if (!email || !subject || !feedback) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!GEMAIL || !EMAIL_PASS) {
        console.error('EMAIL / EMAIL_PASS not configured');
        return NextResponse.json({ message: "mail not sent" }, { status: 500 });
    }

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        console.log('Email not sent: error not valid email');
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GEMAIL,
            pass: EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: GEMAIL,
        subject: subject,
        text: feedback + '\n\n Email: ' + email,
        replyTo: email
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return NextResponse.json({ message: "mail sent" }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: "mail not sent" }, { status: 500 });
    }
}
