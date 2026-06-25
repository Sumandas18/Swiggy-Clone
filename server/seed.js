require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./app/models/User");
const Restaurant = require("./app/models/Restaurant");
const FoodItem = require("./app/models/FoodItem");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/swiggy_clone",
    );
    console.log("✓ MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    console.log("✓ Cleared old data");

    // Create users
    const ownerUser = new User({
      name: "John Doe (Restaurant Owner)",
      email: "owner@example.com",
      password: "password123",
      role: "owner",
    });
    await ownerUser.save();

    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
    await adminUser.save();

    const customerUser = new User({
      name: "Sohom Das",
      email: "sohom@example.com",
      password: "password123",
      role: "user",
    });
    await customerUser.save();

    console.log("✓ Created test users");
    console.log("  Owner: owner@example.com / password123");
    console.log("  Admin: admin@example.com / password123");
    console.log("  Customer: sohom@example.com / password123");

    // Create restaurants
    const restaurant1 = new Restaurant({
      name: "The Sushi House",
      description: "Fresh Japanese sushi and seafood",
      address: "123 Main St, Kolkata",
      ownerId: ownerUser._id,
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
      rating: 4.5,
      deliveryTime: "30-40",
      isPublished: true,
    });
    await restaurant1.save();

    const restaurant2 = new Restaurant({
      name: "Burger Kingdom",
      description: "Delicious burgers and fast food",
      address: "456 Park Ave, Kolkata",
      ownerId: ownerUser._id,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
      rating: 4.2,
      deliveryTime: "25-30",
      isPublished: true,
    });
    await restaurant2.save();

    const restaurant3 = new Restaurant({
      name: "Pizza Palace",
      description: "Authentic Italian pizzas",
      address: "789 Oak Rd, Kolkata",
      ownerId: ownerUser._id,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      deliveryTime: "35-45",
      isPublished: true,
    });
    await restaurant3.save();

    console.log("✓ Created 3 test restaurants");

    // Create food items for restaurant 1
    const foodItems = [
      {
        name: "Salmon Sushi Roll",
        description: "Fresh salmon with avocado and cream cheese",
        price: 250,
        vegOrNonVeg: "Non-Veg",
        restaurantId: restaurant1._id,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=150&q=80",
      },
      {
        name: "Vegetable Sushi",
        description: "Cucumber, radish, and pickled vegetables",
        price: 150,
        vegOrNonVeg: "Veg",
        restaurantId: restaurant1._id,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=150&q=80",
      },
      {
        name: "Double Cheeseburger",
        description: "Two beef patties with cheese and special sauce",
        price: 200,
        vegOrNonVeg: "Non-Veg",
        restaurantId: restaurant2._id,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80",
      },
      {
        name: "Veggie Burger",
        description: "Plant-based patty with lettuce and tomato",
        price: 120,
        vegOrNonVeg: "Veg",
        restaurantId: restaurant2._id,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80",
      },
      {
        name: "Margherita Pizza",
        description: "Classic pizza with tomato, mozzarella, and basil",
        price: 280,
        vegOrNonVeg: "Veg",
        restaurantId: restaurant3._id,
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=150&q=80",
      },
      {
        name: "Pepperoni Pizza",
        description: "Loaded with pepperoni and mozzarella",
        price: 320,
        vegOrNonVeg: "Non-Veg",
        restaurantId: restaurant3._id,
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=150&q=80",
      },
    ];

    await FoodItem.insertMany(foodItems);
    console.log("✓ Created 6 test food items");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nNow you can:");
    console.log("1. Login as customer: sohom@example.com / password123");
    console.log("2. Browse restaurants and order food");
    console.log("3. Login as admin: admin@example.com / password123");
    console.log("4. View and approve orders\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

connectDB().then(() => seedDatabase());
