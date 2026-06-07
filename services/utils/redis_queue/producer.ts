import { Queue } from 'bullmq';
import type { SendEmailJob } from '../../../interface/mail.interface.js';
import { MailLogModel } from '../../../model/mail.model.js';

const myQueue = new Queue('mail_queue');

export async function enqueueEmail(job:SendEmailJob) {
  const logData: Record<string, any> = {
    recipientEmail: job.recipientEmail,
    subject: job.subject,
    templateName: job.templateName,
    status: "queued",
  };

  if (job.metadata !== undefined) {
    logData.metadata = job.metadata;
  }

  const mailLog = await MailLogModel.create(logData);

  await myQueue.add('SEND_EMAIL', { ...job, logId: mailLog._id }, {
    attempts: 5,
    backoff: {
      type: "exponential",
        delay:5000,
    }
  });
}