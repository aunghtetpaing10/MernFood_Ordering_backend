import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import Restaurant from '../models/restaurant';
import * as dotenv from 'dotenv';

dotenv.config();

const generateMenuItems = (count: number) => {
  return Array.from({ length: count }, () => ({
    name: faker.food.dish(),
    price: parseFloat(faker.commerce.price({ min: 5, max: 30 })),
  }));
};

const generateRestaurants = (count: number) => {
  return Array.from({ length: count }, () => ({
    restaurantName: faker.company.name(),
    city: faker.location.city(),
    country: faker.location.country(),
    deliveryPrice: parseFloat(faker.commerce.price({ min: 2, max: 10 })),
    estimatedDeliveryTime: faker.number.int({ min: 15, max: 90 }),
    cuisines: Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () => faker.helpers.arrayElement(['Italian', 'Indian', 'Chinese', 'Mexican', 'Japanese', 'Thai'])
    ),
    menuItems: generateMenuItems(faker.number.int({ min: 5, max: 20 })),
    imageUrl: faker.image.urlLoremFlickr({ category: 'food' }),
    lastUpdated: faker.date.recent()
  }));
};

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_CONNECTION_STRING is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    await Restaurant.deleteMany({});
    
    const restaurants = generateRestaurants(30);
    await Restaurant.insertMany(restaurants);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Only run if this file is executed directly
if (require.main === module) {
  seedData();
}

export { seedData, generateRestaurants, generateMenuItems };