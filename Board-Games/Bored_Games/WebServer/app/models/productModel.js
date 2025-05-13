module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    img: {
      type: DataTypes.STRING,
    },
    quantity_available: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity_cart: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
    },
    ratings:{
      type: DataTypes.JSON, // Store an array of ratings as JSON
      defaultValue: [], // Default is an empty array
    },
  });

  // Before creating or updating, set default value for ratings if null
  Product.beforeCreate((product) => {
    if (!product.ratings) {
      product.ratings = [];
    }
  });
  Product.beforeUpdate((product) => {
    if (!product.ratings) {
      product.ratings = [];
    }
  });

  return Product;
};
