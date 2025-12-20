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
    name: "Guitars",
    slug: "guitars",
    description: "Acoustic, electric, and classical guitars",
  },
  {
    name: "Keyboards",
    slug: "keyboards",
    description: "Pianos, synthesizers, and MIDI controllers",
  },
  {
    name: "Drums",
    slug: "drums",
    description: "Acoustic and electronic drum kits",
  },
  {
    name: "Violins",
    slug: "violins",
    description: "String instruments for classical music",
  },
  {
    name: "Brass",
    slug: "brass",
    description: "Trumpets, trombones, and other brass instruments",
  },
  {
    name: "Woodwind",
    slug: "woodwind",
    description: "Flutes, clarinets, and saxophones",
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
