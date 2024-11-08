import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";

mongoose.connect(process.env.MONGODB_URI!).then(() => console.log("Connected to MongoDB"));
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (req: Request, res: Response) => {
    res.send({ message: "health OK!"})
})

app.use("/api/user", userRoute);

app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));
