import express from 'express';

import { sendError, sendSuccess } from '../scripts/controllerHelpers.js';
import type{ SendEmailJob } from '../interface/mail.interface.js';
import { sendEmail } from '../services/mail/sendMail.js';

export async function sendEmailHandler(req:express.Request, res:express.Response) {
    try {
        const job = req.body as SendEmailJob;

        const result = await sendEmail(job);

        if (result && result.status === 200) {
            return sendSuccess(res, 200, result.message);
        }

        return sendError(res, result?.status ?? 500, result?.message ?? 'Failed to send email');
    } catch (err: unknown) {
        console.error(err);
        return sendError(res, 500, 'Internal Server Error');
    }
}