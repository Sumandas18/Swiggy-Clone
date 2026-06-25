require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./app/models/User");
const Restaurant = require("./app/models/Restaurant");
const FoodItem = require("./app/models/FoodItem");
const FoodCategory = require("./app/models/FoodCategory");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URL || "mongodb://localhost:27017/swiggy_clone",
    );
    console.log("✓ MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const restaurantAdjectives = ["Spicy", "Golden", "Royal", "Urban", "Rustic", "Fresh", "Classic", "Modern", "Grand", "Cozy", "Authentic", "Gourmet", "Secret", "Magic", "Taste of"];
const restaurantNouns = ["Spoon", "Fork", "Bites", "Grill", "Kitchen", "Eatery", "Diner", "Palace", "House", "Corner", "Bowl", "Wok", "Oven", "Table", "Spice"];
const foodNames = ["Pizza", "Burger", "Pasta", "Noodles", "Sushi", "Salad", "Sandwich", "Tacos", "Wrap", "Curry", "Rice", "Biryani", "Steak", "Soup", "Fries", "Momos", "Kebab", "Brownie", "Ice Cream", "Waffles", "Pancakes", "Dosa", "Idli", "Samosa", "Paneer Tikka"];
const cuisines = ["Italian", "Chinese", "Indian", "Mexican", "Japanese", "American", "Continental", "Thai", "Mediterranean", "Korean"];
const images = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80"
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    await FoodCategory.deleteMany({});
    console.log("✓ Cleared old data");

    // Create categories
    const categories = [];
    for (let cuisine of cuisines) {
      const cat = await FoodCategory.create({
        name: cuisine,
        description: `Authentic ${cuisine} cuisine`,
      });
      categories.push(cat);
    }
    console.log(`✓ Created ${categories.length} categories`);

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
      name: "Customer User",
      email: "user@example.com",
      password: "password123",
      role: "user",
    });
    console.log("✓ Created test users (admin, owner, user)");

    // Create 20 restaurants
    const restaurants = [];
    for (let i = 1; i <= 20; i++) {
      const r = await Restaurant.create({
        name: `${getRandomElement(restaurantAdjectives)} ${getRandomElement(restaurantNouns)}`,
        description: `Experience the best food in town.`,
        address: `${Math.floor(Math.random() * 900) + 100} Main St, City Center`,
        ownerId: ownerUser._id,
        image: getRandomElement(images),
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
        deliveryTime: `${Math.floor(Math.random() * 20) + 15}-${Math.floor(Math.random() * 20) + 35}`,
      });
      restaurants.push(r);
    }
    console.log(`✓ Created ${restaurants.length} restaurants`);

    // Create 10-15 food items for each restaurant
    let totalFoodItems = 0;
    for (let r of restaurants) {
      const numItems = Math.floor(Math.random() * 6) + 10; // 10 to 15 items
      const itemsToCreate = [];
      for (let j = 0; j < numItems; j++) {
        const cat = getRandomElement(categories);
        const isVeg = Math.random() > 0.5;
        itemsToCreate.push({
          name: `${getRandomElement(restaurantAdjectives)} ${getRandomElement(foodNames)}`,
          description: `Delicious and freshly prepared ${isVeg ? 'vegetarian' : 'non-vegetarian'} dish.`,
          price: Math.floor(Math.random() * 400) + 100, // Price between 100 and 500
          vegOrNonVeg: isVeg ? "veg" : "non-veg",
          restaurantId: r._id,
          categoryId: cat._id,
        });
      }
      await FoodItem.insertMany(itemsToCreate);
      totalFoodItems += itemsToCreate.length;
    }
    console.log(`✓ Created ${totalFoodItems} food items in total across all restaurants.`);

    console.log("\n✅ Database seeded successfully!\n");
    console.log("Customer: user@example.com / password123");
    console.log("Owner: owner@example.com / password123");
    console.log("Admin: admin@example.com / password123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

connectDB().then(() => seedDatabase());
