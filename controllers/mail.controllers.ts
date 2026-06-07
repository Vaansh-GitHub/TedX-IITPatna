import express from 'express';

import { sendError, sendSuccess } from '../scripts/controllerHelpers.js';
import type{ SendEmailJob } from '../interface/mail.interface.js';
import { enqueueEmail } from '../services/utils/redis_queue/producer.js';

export async function sendEmailHandler(req:express.Request, res:express.Response) {
    try {
        const job = req.body as SendEmailJob;

        await enqueueEmail(job);

        return sendSuccess(res, 202, 'Email job queued successfully');
    } catch (err: unknown) {
        console.error(err);
        return sendError(res, 500, 'Internal Server Error');
    }
}