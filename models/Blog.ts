import mongoose, { Schema, Model } from "mongoose";
import { Blog } from "@/types";

const BlogSchema = new Schema<Blog>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, "Please provide an excerpt"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    author: {
      type: String,
      trim: true,
      default: "OrthoPoint Team",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    readTime: {
      type: Number,
      default: 1,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

BlogSchema.index({ status: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ title: "text", excerpt: "text", content: "text" });

const BlogModel: Model<Blog> =
  mongoose.models.Blog || mongoose.model<Blog>("Blog", BlogSchema);

export default BlogModel;
