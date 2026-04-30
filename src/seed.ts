import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "./features/auth/admin.model";

dotenv.config();


async function seedAdmin() {
    try {
        
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("✅ DB Connected");

        
        const existing = await Admin.findOne({ email: "admin@gmail.com" });

        if (existing) {
            console.log("⚠️ Admin already exists");
            process.exit();
        }


        
        const admin = await Admin.create({
            email: "admin@gmail.com",
            password: "admin@123"
        });

        console.log("🎉 Admin created:", admin.email);

        process.exit();
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}

seedAdmin();