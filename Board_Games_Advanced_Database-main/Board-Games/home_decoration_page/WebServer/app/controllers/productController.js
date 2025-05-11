const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

// Create and Save a new Product
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.product_name || !req.body.price) {
      return res.status(400).json({ message: "Product name and price are required!" });
    }

    // Create a Product
    const product = {
      product_name: req.body.product_name,
      description: req.body.description,
      img: req.body.img,
      quantity_available: req.body.quantity_available,
      price: req.body.price,
      quantity_cart: req.body.quantity_cart || 0,
      category: req.body.category,
    };

    // Save Product in the database
    const data = await Product.create(product);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while creating the Product." });
  }
};

// Retrieve all Products from the database.
exports.findAll = async (req, res) => {
  try {
    const title = req.query.title;
    const condition = title ? { product_name: { [Op.like]: `%${title}%` } } : null;

    const data = await Product.findAll({ where: condition });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while retrieving Products." });
  }
};

// Find a single Product with an ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Product.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: `Product with ID ${id} not found.` });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while retrieving the Product." });
  }
};

// Update a Product by the ID in the request
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Product.update(req.body, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ message: `Product with ID ${id} not found or no changes made.` });
    }

    res.status(200).json({ message: "Product updated successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while updating the Product." });
  }
};

// Delete a Product with the specified ID in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Product.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ message: `Product with ID ${id} not found.` });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while deleting the Product." });
  }
};

// Delete all Products from the database
exports.deleteAll = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: {}, truncate: true });

    if (deleted === 0) {
      return res.status(404).json({ message: "No Products found to delete." });
    }

    res.status(200).json({ message: "All Products deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while deleting all Products." });
  }
};

// Find Products by title
exports.findByTitle = async (req, res) => {
  try {
    const title = req.params.title;
    const data = await Product.findAll({
      where: { product_name: { [Op.like]: `%${title}%` } },
    });

    if (data.length === 0) {
      return res.status(404).json({ message: `No Products found with title "${title}".` });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error occurred while searching for Products by title." });
  }
};

// Submit a new rating
exports.addRating = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Add the new rating to the existing ratings array
    const newRating = req.body.rating; // Expected in the request body
    product.ratings.push(newRating);

    // Save the updated product
    await product.save();
    res.send(product);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
