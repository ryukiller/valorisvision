import { NextResponse } from "next/server";
const { MailtrapClient } = require("mailtrap");


export async function POST(req) {

    const TOKEN = process.env.MAILTRAP_TOKEN;
    const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

    const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

    const sender = {
        email: "mailtrap@valorisvisio.top",
        name: "Mailtrap Test",
    };
    const recipients = [
        {
            email: "rian.rodrigo.webmaster@gmail.com",
        }
    ];

    client
        .send({
            from: sender,
            to: recipients,
            subject: "You are awesome!",
            text: "Congrats for sending test email with Mailtrap!",
            category: "Integration Test",
        })
        .then(console.log, console.error);


    return NextResponse.json({ message: "mail sent", status: 200 });
}

