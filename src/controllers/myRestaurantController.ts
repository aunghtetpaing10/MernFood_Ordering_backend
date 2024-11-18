import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      res.status(400).json({ message: "Restaurant already exists" });
      return;
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const restaurant = new Restaurant(req.body);
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.imageUrl = imageUrl;
    restaurant.lastUpdated = new Date();

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error creating restaurant" });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const {
      restaurantName,
      city,
      country,
      deliveryPrice,
      estimatedDeliveryTime,
      cuisines,
      menuItems,
    } = req.body;

    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    restaurant.restaurantName = restaurantName;
    restaurant.city = city;
    restaurant.country = country;
    restaurant.deliveryPrice = deliveryPrice;
    restaurant.estimatedDeliveryTime = estimatedDeliveryTime;
    restaurant.cuisines = cuisines;
    restaurant.menuItems = menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error updating restaurant" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  if (!file) {
    throw new Error("No file provided");
  }

  const base64Image = Buffer.from(file.buffer).toString("base64");
  const dataUrl = `data:${file.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataUrl);
  return uploadResponse.url;
};

const getMyRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    if (!orders) {
      res.status(404).json({ message: "No orders found" });
      return;
    }

    res.status(200).json(orders);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const restaurant = await Restaurant.findById(order.restaurant);

    if (restaurant?.user?._id.toString() !== req.userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error updating order status" });
    
  }
};

export {
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
  updateOrderStatus,
};
