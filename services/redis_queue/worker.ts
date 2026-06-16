import { Worker } from "bullmq";
import connectDB from "../../database/connect.js";
import {connection} from "./queue.js";
import { MailLogModel } from "../../model/mail.model.js";
import { sendEmail } from "../mail/sendMail.js";
import dotenv from "dotenv";

dotenv.config({
  path: "../../config/.env",
});

connectDB();

const worker = new Worker(
    "mail_queue",
    async (job) => {
        //Send the Email Job
        await job.updateProgress("processing");
        const data = await sendEmail(job.data);

        if (data?.status === 200) {
            return data;
        }

        if(data?.status === 400) {
            throw new Error(data?.message || "Error in sending mail");
        }
    },
    {connection},
);

worker.on("completed", async (job,data) => {
    await MailLogModel.updateOne(
          { _id: job?.data?.logId},
          { status: "sent", sentAt: new Date(), providerMessageId: data.messageId },
    );
});

worker.on("failed", async (job, err) => {
    const attempts = job?.opts?.attempts ?? 1;
    const attemptsMade = (job?.attemptsMade ?? 0) + 1;
    const message = err instanceof Error ? err.message : "Error in processing job";

    await MailLogModel.updateOne(
      { _id: job?.data?.logId },
      { status: "failed", errorMessage: message , retryCount: attemptsMade >= attempts ? attemptsMade : attemptsMade - 1},
    );
});

worker.on("error", async (err) => {
    console.error(`Worker encountered an error: ${err.message}`);
});

worker.on("progress", async (job, progress) => {
    await MailLogModel.updateOne(
      { _id: job.data.logId },
      { status: progress },
    );
});