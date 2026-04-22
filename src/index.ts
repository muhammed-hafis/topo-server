import express, { Request, Response } from "express";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import authRoutes from "./features/auth/auth.routes";
import profileRoutes from "./features/profile/profile.routes";
import cmsRoutes from "./features/cms/cms.routes";
import productRoutes from "./features/products/product.routes";
import { connectDB } from "./utils/db";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript + Node.js Server is Running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is sprinting on http://localhost:${PORT}`);
});
