import { NextResponse } from "next/server";

import nodemailer from 'nodemailer';



export async function POST(req) {
    const GEMAIL = process.env.EMAIL;
    const EMAIL_PASS = process.env.EMAIL_PASS + " ";

    let body;
    try {
        body = await req.json();
    } catch (error) {
        // If JSON parsing fails, return a 400 Bad Request response
        console.error('Error parsing JSON:', error);
        return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    if (!body) {
        return NextResponse.json({ message: "bad request" }, { status: 400 });
    } else {
        console.log(body)
        const { email, subject, feedback, honeypot } = body

        // Honeypot check - if honeypot field is filled, it's likely a bot
        if (honeypot) {
            return NextResponse.json({ message: "Bot detected" }, { status: 400 });
        }

        // Basic input validation
        if (!email || !subject || !feedback) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Email format validation
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            console.log('Email not sent: error not valid email');
            return NextResponse.json({ message: "Invalid email format" }, { status: 400 }, { error: "Invalid email format" });
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
            return NextResponse.json({ message: "mail not sent" }, { status: 500 }, { error: "mail not sent because error" });
        }
    }
}



