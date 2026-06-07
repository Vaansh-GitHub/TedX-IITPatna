import mongoose from "mongoose";
import type{ AttachmentPayload } from "./attachment.interface.js";
export interface MailLog {
  _id: mongoose.Types.ObjectId;

  recipientEmail: string;

  subject: string;

  templateName: string;

  status:
    | "queued"
    | "processing"
    | "sent"
    | "failed";

  retryCount: number;

  providerMessageId?: string;

  errorMessage?: string;

  metadata?: Record<string, any>;

  sentAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export interface SendEmailJob {
 recipientEmail: string;
 recipientName?: string;
 templateName: string;
 subject: string;
 variables: Record<string, any>;
 attachments?: AttachmentPayload[];
 metadata?: Record<string, any>;
}
 
