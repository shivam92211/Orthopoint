import mongoose, { Schema, Model } from "mongoose";
import { Instrument } from "@/types";

const InstrumentSchema = new Schema<Instrument>(
  {
    name: {
      type: String,
      required: [true, "Please provide instrument name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please provide category"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
    },
    specifications: {
      brand: String,
      model: String,
      material: String,
      color: String,
      weight: String,
      dimensions: String,
    },
    price: {
      type: Number,
      required: [true, "Please provide price"],
      min: 0,
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },
    images: {
      type: [String],
      default: [],
    },
    mainImage: {
      type: String,
      required: [true, "Please provide main image"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    mostSold: {
      type: Boolean,
      default: false,
    },
    whatsappNumber: {
      type: String,
      default: process.env.WHATSAPP_PHONE_NUMBER || "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filter
InstrumentSchema.index({ name: "text", description: "text" });
InstrumentSchema.index({ category: 1 });
InstrumentSchema.index({ price: 1 });
InstrumentSchema.index({ available: 1 });
InstrumentSchema.index({ featured: 1 });

const InstrumentModel: Model<Instrument> =
  mongoose.models.Instrument ||
  mongoose.model<Instrument>("Instrument", InstrumentSchema);

export default InstrumentModel;
