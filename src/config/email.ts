require('dotenv').config()
import { createTransport } from 'nodemailer';

const { EMAIL, PASS } = process.env;

export const transport = createTransport({
    
    service:"gmail",
    auth:{
     
            pass:PASS,
            user:EMAIL
    }
})


transport.verify((err, success) => {
    if(err) {
        console.error("SMTP Server failure")
    } else console.log("SMTP Server configured suceesfully" , success);
})

export const sendMail = (to: string , html : string, subject: string , cc ?: string  ) => {
    
    console.log("Sent11111", to);
    transport.sendMail({
        to,
        cc,
        html,
        subject,
    })
}