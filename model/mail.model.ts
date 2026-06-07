import {Schema,model }from "mongoose";
import type {MailLog} from "../interface/mail.interface.js";

const MailLogSchema = new Schema<MailLog>(
  {
    recipientEmail: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    templateName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["queued", "processing", "sent", "failed"],
      default: "queued",
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    providerMessageId: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps:true,
  }
);

export const MailLogModel = model<MailLog>("MailLog", MailLogSchema);