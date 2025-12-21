import mongoose, { Schema, Model } from "mongoose";
import { Client } from "@/types";

const ClientSchema = new Schema<Client>(
  {
    name: {
      type: String,
      required: [true, "Please provide client name"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Please provide client URL"],
      trim: true,
    },
    logoUrl: {
      type: String,
      required: [true, "Please provide logo URL"],
    },
    regularClient: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ClientModel: Model<Client> =
  mongoose.models.Client ||
  mongoose.model<Client>("Client", ClientSchema);

export default ClientModel;
