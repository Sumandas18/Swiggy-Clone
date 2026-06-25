require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./app/models/User");
const Restaurant = require("./app/models/Restaurant");
const FoodItem = require("./app/models/FoodItem");
const FoodCategory = require("./app/models/FoodCategory");

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
    await FoodCategory.deleteMany({});
    console.log("✓ Cleared old data");

    // Create categories
    const cat1 = await FoodCategory.create({
      name: "Japanese",
      description: "Japanese cuisine",
    });
    const cat2 = await FoodCategory.create({
      name: "Fast Food",
      description: "Fast food items",
    });
    const cat3 = await FoodCategory.create({
      name: "Italian",
      description: "Italian cuisine",
    });
    console.log("✓ Created 3 categories");

    // Create users
    const ownerUser = await User.create({
      name: "John Doe (Owner)",
      email: "owner@example.com",
      password: "password123",
      role: "owner",
    });

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    const customerUser = await User.create({
      name: "Sohom Das",
      email: "sohom@example.com",
      password: "password123",
      role: "user",
    });

    console.log("✓ Created test users");

    // Create restaurants
    const r1 = await Restaurant.create({
      name: "The Sushi House",
      description: "Fresh Japanese sushi and seafood",
      address: "123 Main St, Kolkata",
      ownerId: ownerUser._id,
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
      rating: 4.5,
      deliveryTime: "30-40",
    });

    const r2 = await Restaurant.create({
      name: "Burger Kingdom",
      description: "Delicious burgers and fast food",
      address: "456 Park Ave, Kolkata",
      ownerId: ownerUser._id,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
      rating: 4.2,
      deliveryTime: "25-30",
    });

    const r3 = await Restaurant.create({
      name: "Pizza Palace",
      description: "Authentic Italian pizzas",
      address: "789 Oak Rd, Kolkata",
      ownerId: ownerUser._id,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      deliveryTime: "35-45",
    });

    console.log("✓ Created 3 restaurants");

    // Create food items
    await FoodItem.create([
      {
        name: "Salmon Sushi Roll",
        description: "Fresh salmon with avocado",
        price: 250,
        vegOrNonVeg: "non-veg",
        restaurantId: r1._id,
        categoryId: cat1._id,
      },
      {
        name: "Vegetable Sushi",
        description: "Cucumber and pickled vegetables",
        price: 150,
        vegOrNonVeg: "veg",
        restaurantId: r1._id,
        categoryId: cat1._id,
      },
      {
        name: "Double Cheeseburger",
        description: "Two beef patties with cheese",
        price: 200,
        vegOrNonVeg: "non-veg",
        restaurantId: r2._id,
        categoryId: cat2._id,
      },
      {
        name: "Veggie Burger",
        description: "Plant-based patty",
        price: 120,
        vegOrNonVeg: "veg",
        restaurantId: r2._id,
        categoryId: cat2._id,
      },
      {
        name: "Margherita Pizza",
        description: "Tomato, mozzarella, basil",
        price: 280,
        vegOrNonVeg: "veg",
        restaurantId: r3._id,
        categoryId: cat3._id,
      },
      {
        name: "Pepperoni Pizza",
        description: "Pepperoni and mozzarella",
        price: 320,
        vegOrNonVeg: "non-veg",
        restaurantId: r3._id,
        categoryId: cat3._id,
      },
    ]);
    console.log("✓ Created 6 food items");

    console.log("\n✅ Database seeded!\n");
    console.log("Customer: sohom@example.com / password123");
    console.log("Admin: admin@example.com / password123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

connectDB().then(() => seedDatabase());
