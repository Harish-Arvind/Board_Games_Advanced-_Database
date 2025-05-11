const express = require("express");
const cors = require("cors");
const db = require("./app/models"); // Import models
const Role = db.role; // Access the Role model

// Import routes
const authRoutes = require("./app/routes/authRoutes"); 
const productRoutes = require("./app/routes/productRoutes");
const userRoutes = require("./app/routes/userRoutes"); // Import user routes

// Import the seedAdmin function
const seedAdmin = require("./seedAdmin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/auth", authRoutes); // Routes for authentication
app.use("/api/products", productRoutes); // Product routes (adjusted path)
app.use("/api/users", userRoutes); // Use the routes with the base path "/api/users"

// Define the initial function to seed roles
async function initial() {
  try {
    // Check if roles exist
    const roleCount = await Role.count();
    if (roleCount === 0) {
      // Seed roles if none exist
      await Role.bulkCreate([
        { id: 1, name: "user" },
        { id: 2, name: "admin" },
      ]);
      console.log("Roles seeded successfully!");
    } else {
      console.log("Roles already exist. Skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding roles:", error.message);
  }
}

// Test database connection and sync tables
db.sequelize
  .sync({ force: false }) // Use `force: true` only for resetting the database during development
  .then(() => {
    console.log("Database synchronized successfully!");
    initial(); // Seed roles after syncing database
    seedAdmin();
  })
  .catch((err) => {
    console.error("Error syncing database:", err.message);
  });

// Test server route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Home Decoration API!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
