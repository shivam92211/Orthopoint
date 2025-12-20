import mongoose, { Schema, Model } from "mongoose";
import { Admin } from "@/types";

const AdminSchema = new Schema<Admin>(
  {
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "super_admin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

const AdminModel: Model<Admin> =
  mongoose.models.Admin || mongoose.model<Admin>("Admin", AdminSchema);

export default AdminModel;
