import express, { Request, Response } from "express";
import 'dotenv/config';
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript + Node.js Server is Running!");
});

app.listen(PORT, () => {
  console.log(`Server is sprinting on http://localhost:${PORT}`);
});
