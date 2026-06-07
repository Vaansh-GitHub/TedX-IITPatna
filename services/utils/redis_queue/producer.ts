import { Queue } from 'bullmq';
import type { SendEmailJob } from '../../../interface/mail.interface.js';

const myQueue = new Queue('mail_queue');

export async function addJobs(job:SendEmailJob) {
  await myQueue.add('myJobName', job,{
    attempts:5,
    backoff:{
        type:"exponential",
        delay:5000,
    }
  });
}