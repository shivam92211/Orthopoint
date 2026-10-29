import mongoose, { Schema, Model } from "mongoose";
import { RefurbishmentRequest } from "@/types";

const REFURBISHMENT_STATUSES = [
  "new",
  "under_review",
  "assessment_required",
  "quotation_sent",
  "approved",
  "in_progress",
  "completed",
  "rejected",
] as const;

const RefurbishmentRequestSchema = new Schema<RefurbishmentRequest>(
  {
    customerName: { type: String, required: true, trim: true },
    organizationName: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    customerCategory: {
      type: String,
      enum: ["surgeon", "hospital", "dealer", "distributor", "other"],
      required: true,
    },
    instrumentName: { type: String, required: true, trim: true },
    instrumentCategory: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    condition: { type: String, required: true, trim: true },
    reportedIssue: { type: String, trim: true },
    images: { type: [String], default: [] },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: REFURBISHMENT_STATUSES,
      default: "new",
      index: true,
    },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

const RefurbishmentRequestModel: Model<RefurbishmentRequest> =
  mongoose.models.RefurbishmentRequest ||
  mongoose.model<RefurbishmentRequest>(
    "RefurbishmentRequest",
    RefurbishmentRequestSchema
  );

export default RefurbishmentRequestModel;
