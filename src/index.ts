import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import authRoutes from "./features/auth/auth.routes";

import cmsRoutes from "./features/cms/cms.routes";
import productRoutes from "./features/products/product.routes";
import galleryRoutes from "./features/gallery/gallery.routes";
import faqRoutes from "./features/faq/faq.routes";
import reelsRoutes from "./features/reels/reels.routes";
import testimonialRoutes from "./features/testimonials/testimonial.route";


import { connectDB } from "./config/db";

const app = express();
const PORT = process.env.PORT || 5000;


app.set("trust proxy", 1);


connectDB();


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript + Node.js Server is Running!");
});


app.use("/api/auth", authRoutes);

app.use("/api/cms", cmsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/reels", reelsRoutes);
app.use("/api/testimonials", testimonialRoutes);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image is too large. Maximum allowed size is 10MB." });
  }
  if (err.message) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Something went wrong. Please try again." });
});

app.listen(PORT, () => {
  console.log(`Server is sprinting on http://localhost:${PORT}`);
});

