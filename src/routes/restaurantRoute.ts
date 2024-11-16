import express from "express";
import { param } from "express-validator";
import { getRestaurant, searchRestaurant } from "../controllers/restaurantController";

const router = express.Router();

router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Restaurant ID is required"),
  getRestaurant
);

router.get(
    "/search/:city",
    param("city")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("City name is required"),
    searchRestaurant
  );

export default router;
