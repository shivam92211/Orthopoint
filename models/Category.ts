import mongoose, { Schema, Model } from "mongoose";
import { Category } from "@/types";

const CategorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: [true, "Please provide category name"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel: Model<Category> =
  mongoose.models.Category ||
  mongoose.model<Category>("Category", CategorySchema);

export default CategoryModel;
