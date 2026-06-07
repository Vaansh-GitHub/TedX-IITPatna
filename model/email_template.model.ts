import {Schema,model }from "mongoose";
import type {EmailTemplate} from "../interface/email_template.interface.js";

const EmailTemplateSchema = new Schema<EmailTemplate>(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    htmlBody: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps:true,
  }
);

export const EmailTemplateModel = model<EmailTemplate>("EmailTemplate", EmailTemplateSchema);
