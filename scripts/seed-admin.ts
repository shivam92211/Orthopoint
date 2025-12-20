import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "super_admin"],
    default: "admin",
  },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seedAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env.local");
    }

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env.local"
      );
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
      console.log("Updating password...");

      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();

      console.log("Password updated successfully!");
    } else {
      console.log("Creating admin user...");

      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      const admin = new Admin({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: "Admin",
        role: "super_admin",
      });

      await admin.save();
      console.log(`Admin user created successfully: ${ADMIN_EMAIL}`);
    }

    console.log("\nYou can now login at: http://localhost:3000/admin/login");
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
