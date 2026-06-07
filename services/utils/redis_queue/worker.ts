import { Worker } from 'bullmq';
import {Redis} from 'ioredis';

const connection = new Redis({ maxRetriesPerRequest: null });

const worker = new Worker("mail_queue",completeJob,{connection});

async function completeJob()
{

}