import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  icon: String,
});

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

const defaultCategories = [
  {
    name: "Bone Awl",
    slug: "bone-awl",
    description: "Specialized tools for bone drilling and preparation",
    icon: "🦴",
  },
  {
    name: "Joint Replacement",
    slug: "joint-replacement",
    description: "Instruments for hip, knee, and shoulder replacements",
    icon: "🦵",
  },
  {
    name: "Trauma & Fracture",
    slug: "trauma-fracture",
    description: "Tools for trauma surgery and fracture fixation",
    icon: "🔨",
  },
  {
    name: "Spine Surgery",
    slug: "spine-surgery",
    description: "Specialized instruments for spinal procedures",
    icon: "🦴",
  },
  {
    name: "Bone Screws & Plates",
    slug: "bone-screws-plates",
    description: "Fixation devices for bone stabilization",
    icon: "🔩",
  },
  {
    name: "Surgical Drills",
    slug: "surgical-drills",
    description: "Powered and manual drilling instruments",
    icon: "⚙️",
  },
  {
    name: "Retractors",
    slug: "retractors",
    description: "Surgical retractors for tissue displacement",
    icon: "🔧",
  },
  {
    name: "Bone Saws",
    slug: "bone-saws",
    description: "Precision cutting instruments for bone",
    icon: "🪚",
  },
];

async function seedCategories() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env.local");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    console.log("Seeding categories...");

    for (const category of defaultCategories) {
      const existing = await Category.findOne({ slug: category.slug });
      if (existing) {
        console.log(`Category already exists: ${category.name}`);
      } else {
        await Category.create(category);
        console.log(`Created category: ${category.name}`);
      }
    }

    console.log("\nCategories seeded successfully!");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
