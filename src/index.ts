import { v2 as cloudinary } from 'cloudinary';
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import myRestaurantRoute from "./routes/myRestaurantRoute";
import restaurantRoute from "./routes/restaurantRoute";

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI!).then(() => console.log("Connected to MongoDB"));

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (req: Request, res: Response) => {
    res.send({ message: "health OK!"})
})

app.use("/api/user", userRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);

app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));
