import express, { Request, Response } from "express";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import authRoutes from "./features/auth/auth.routes";

import cmsRoutes from "./features/cms/cms.routes";
import productRoutes from "./features/products/product.routes";
import galleryRoutes from "./features/gallery/gallery.routes";
import faqRoutes from "./features/faq/faq.routes";
import reelsRoutes from "./features/reels/reels.routes";


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

app.use("/api/cms", cmsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/reels", reelsRoutes);



app.listen(PORT, () => {
  console.log(`Server is sprinting on http://localhost:${PORT}`);
});
