const db = require("./app/models");
// Debug: List all available models
console.log("Models available:", Object.keys(db));
const products = [
  /// Beds
{
  product_name: "Eco Classic Bed",
  description: "A sustainable and stylish bed made from responsibly sourced wood for a greener home.",
  img: "../imgs/product_images/bed1_product.avif",
  quantity_available: 10,
  price: 200,
  quantity_cart: 0,
  category: "Beds",
  ratings: [5, 4, 5],
},
{
  product_name: "Modern Eco Bed",
  description: "A sleek, modern bed crafted with eco-friendly materials and minimal environmental impact.",
  img: "../imgs/product_images/bed2_product.avif",
  quantity_available: 5,
  price: 300,
  quantity_cart: 0,
  category: "Beds",
  ratings: [4, 3],
},

// Furniture
{
  product_name: "Sustainable Modern Couch",
  description: "A stylish couch made with recycled fabrics and sustainable frames, perfect for eco-conscious spaces.",
  img: "../imgs/product_images/Furniture1_product.avif",
  quantity_available: 15,
  price: 50,
  quantity_cart: 0,
  category: "Furniture",
  ratings: [4, 1],
},
{
  product_name: "Reclaimed Wooden Chair",
  description: "A durable chair crafted from reclaimed wood, adding eco-friendly charm to your home or office.",
  img: "../imgs/product_images/Furniture2_product.avif",
  quantity_available: 7,
  price: 150,
  quantity_cart: 0,
  category: "Furniture",
  ratings: [3, 4, 2],
},

  // Decoration
{
  product_name: "Eco Modern Vase",
  description: "A beautifully handcrafted vase made from natural and sustainable materials to enhance your green living space.",
  img: "../imgs/product_images/Decoration1_product.avif",
  quantity_available: 20,
  price: 100,
  quantity_cart: 0,
  category: "Decoration",
  ratings: [3, 4, 5],
},
{
  product_name: "Elegant Eco Vase",
  description: "An elegant vase crafted with eco-friendly techniques, perfect for showcasing flowers sustainably.",
  img: "../imgs/product_images/Decoration2_product.avif",
  quantity_available: 12,
  price: 70,
  quantity_cart: 0,
  category: "Decoration",
  ratings: [2, 4, 1],
},

// Storage
{
  product_name: "Sustainable Shelf",
  description: "A versatile shelf made from reclaimed wood, designed for eco-conscious storage and display.",
  img: "../imgs/product_images/Storage1_product.avif",
  quantity_available: 8,
  price: 40,
  quantity_cart: 0,
  category: "Storage",
  ratings: [5, 4, 5],
},
{
  product_name: "Eco Storage Box",
  description: "A large, durable storage box crafted with recycled materials to help you organize sustainably.",
  img: "../imgs/product_images/Storage2_product.avif",
  quantity_available: 6,
  price: 120,
  quantity_cart: 0,
  category: "Storage",
  ratings: [3, 4, 3],
},

// Home
{
  product_name: "Eco Classic Bed",
  description: "A comfortable and stylish bed made from eco-certified wood to support greener homes.",
  img: "../imgs/product_images/bed1_product.avif",
  quantity_available: 10,
  price: 200,
  quantity_cart: 0,
  category: "Home",
  ratings: [5, 4, 5],
},
{
  product_name: "Sustainable Modern Couch",
  description: "A stylish and eco-friendly couch, built with recycled materials for your home or workspace.",
  img: "../imgs/product_images/Furniture1_product.avif",
  quantity_available: 15,
  price: 50,
  quantity_cart: 0,
  category: "Home",
  ratings: [5, 4, 4],
},
{
  product_name: "Eco Modern Vase",
  description: "A natural and elegant vase to add a touch of sustainable beauty to your home decor.",
  img: "../imgs/product_images/Decoration1_product.avif",
  quantity_available: 20,
  price: 100,
  quantity_cart: 0,
  category: "Home",
  ratings: [5, 4, 5],
},
{
  product_name: "Sustainable Shelf",
  description: "An eco-friendly shelf crafted from responsibly sourced wood, ideal for green living spaces.",
  img: "../imgs/product_images/Storage1_product.avif",
  quantity_available: 8,
  price: 40,
  quantity_cart: 0,
  category: "Home",
  ratings: [5, 4, 4],
},
]



const seedProducts = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connection to the database has been established successfully.");

    await db.products.destroy({ where: {}, truncate: true });
    console.log("Existing products cleared from the database.");

    await db.products.bulkCreate(products);
    console.log("New products have been added to the database!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();




// const seedProducts = async () => {
//   try {
//     // Ensure database connection
//     await db.sequelize.authenticate();
//     console.log("Connection to the database has been established successfully.");

//     // Clear existing products
//     await db.Products.destroy({ where: {}, truncate: true });
//     console.log("Existing products cleared from the database.");

//     // Seed new products
//     await db.Products.bulkCreate(products);
//     console.log("New products have been added to the database!");

//     process.exit(0); // Exit the process successfully
//   } catch (error) {
//     console.error("Error seeding products:", error);
//     process.exit(1); // Exit the process with an error
//   }
// };

// seedProducts();