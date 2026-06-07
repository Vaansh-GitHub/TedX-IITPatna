import { Worker } from "bullmq";
import dotenv from "dotenv";
import { Redis } from "ioredis";
import path from "path";
import connectDB from "../../../database/connect.js";

dotenv.config({ path: path.resolve(process.cwd(), "config/.env") });

await connectDB();

const connection = new Redis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "mail_queue",
  async (job) => {
    return await processJob(job);
  },
  {
    connection,
    removeOnComplete: {
      count: 0,
    },
  },
);

async function processJob(job: any) {
  try {
    const { MailLogModel } = await import("../../../model/mail.model.js");
    await MailLogModel.updateOne(
      { _id: job.data.logId },
      { status: "processing" },
    );
    
    const { sendEmail } = await import("../../mail/sendMail.js");
    const data = await sendEmail(job.data);

    if (data?.status === 200) {
        await MailLogModel.updateOne(
          { _id: job.data.logId },
          { status: "sent", sentAt: new Date(), providerMessageId: data.messageId },
        );
        return;
    }

    await MailLogModel.updateOne(
      { _id: job.data.logId },
      { status: "failed", errorMessage: data?.message || "Error in sending mail" },
    );

    throw new Error(data?.message || "Error in sending mail");
  } catch (err: unknown) {
    const { MailLogModel } = await import("../../../model/mail.model.js");
    const attempts = job?.opts?.attempts ?? 1;
    const attemptsMade = (job?.attemptsMade ?? 0) + 1;
    const message = err instanceof Error ? err.message : "Error in processing job";

    if (job?.data?.logId) {
      if (attemptsMade >= attempts) {
        await MailLogModel.updateOne(
          { _id: job.data.logId },
          { status: "failed", errorMessage: message, retryCount: attemptsMade },
        );
      } else {
        await MailLogModel.updateOne(
          { _id: job.data.logId },
          { status: "processing", errorMessage: message, retryCount: attemptsMade },
        );
      }
    }

    console.log("Error in processing job");
    throw err instanceof Error ? err : new Error(message);
  }
}
