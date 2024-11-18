import express from "express";
import multer from "multer";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";
import {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
  updateOrderStatus,
} from "../controllers/myRestaurantController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
});

router.get("/", jwtCheck, jwtParse, getMyRestaurant);

router.post(
  "/",
  upload.single("imageFile"),
  jwtCheck,
  jwtParse,
  validateMyRestaurantRequest,
  createMyRestaurant
);

router.put(
  "/",
  upload.single("imageFile"),
  jwtCheck,
  jwtParse,
  validateMyRestaurantRequest,
  updateMyRestaurant
);

router.get("/order", jwtCheck, jwtParse, getMyRestaurantOrders);

router.patch("/order/:orderId/status", jwtCheck, jwtParse, updateOrderStatus);

export default router;
