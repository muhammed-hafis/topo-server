import express, { Request, Response } from "express";
import 'dotenv/config';
import authRoutes from "./features/auth/auth.routes";
import { connectDB } from "./utils/db";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript + Node.js Server is Running!");
});

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is sprinting on http://localhost:${PORT}`);
});
