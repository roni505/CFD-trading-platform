import { Resend } from "resend"
import { RESEND_KEY } from "../../../packages/config/dist/env";

const resend = new Resend(RESEND_KEY)

function emailSender(email: string, token: string) {
    const sender = resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [email],
        subject: 'Hello World',
        html: '<a>api/v1/',
    })
}

export default emailSender;