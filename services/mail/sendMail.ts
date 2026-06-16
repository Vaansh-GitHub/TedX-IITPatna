import nodemailer from "nodemailer";
import transport from "./transport.js";
import type{ SendEmailJob } from "../../interface/mail.interface.js";
import dotenv from "dotenv";
import { EmailTemplateModel } from "../../model/email_template.model.js";

dotenv.config({
  path: "../../config/.env",
});

export async function sendEmail(job:SendEmailJob)
{
    try{
        transport.verify()
        .then(() => console.log("SMTP verified"))
        .catch(err => console.error("SMTP verify failed:", err));
        
        const data = await emailJob(job);
        if(!data) {
            throw new Error("No email data");
        }
        const info = await transport.sendMail(data as any) as any;

        if(info.rejected?.length)
        {
            throw new Error(info.rejected.join(", ") || "Email rejected by SMTP server");
        }
        return {
            status:200,
            message:"Message Sent Successfully!",
            messageId:info.messageId,
        }
    }catch(err:unknown)
    {
        if(err instanceof Error)
        {
            console.log("Error in Sending Mail");
            return {
                status:400,
                    message:err.message,
            };
        }
    }
}

async function emailJob(job:SendEmailJob)
{
    try{
        const attachments = job.attachments?.map((value)=>{
            return {
                filename:value.filename,
                href:value.url,
                contentType:value.mimeType,
            };
        });
    
        const template = await EmailTemplateModel.findOne({name:job.templateName});

        if (!template) {
            throw new Error(`Email template not found: ${job.templateName}`);
        }
    
        const data = {
            from:process.env.MAIL_FROM,
            to:job.recipientEmail,
            subject:job.subject,
            html:template.htmlBody,
            attachments,
        }
        return data;
    }catch(err:unknown){
        if(err instanceof Error)
        {
            console.log("Error in fetching data for mail");
            throw err;
        }
    }
}