import mongoose from "mongoose";

export interface EmailTemplate {
  _id: mongoose.Types.ObjectId;

  name: string;

  subject: string;

  htmlBody: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}