<template>
  <div class="product-management">
    <h1>Eco Product Management</h1>
    <div class="Form_div">
      <form @submit.prevent="createProduct">
        <label for="product_name">Product Name</label>
        <input
          type="text"
          id="product_name"
          v-model="newProduct.product_name"
          placeholder="Product Name"
          required
        />

        <label for="description">Product Description</label>
        <textarea
          id="description"
          v-model="newProduct.description"
          placeholder="Product Description"
          required
        ></textarea>

        <label for="img">Product Image URL</label>
        <input
          type="text"
          id="img"
          v-model="newProduct.img"
          placeholder="Product Image URL"
        />

        <label for="quantity_available">Quantity Available</label>
        <input
          type="number"
          id="quantity_available"
          v-model="newProduct.quantity_available"
          placeholder="Quantity Available"
          min="0"
        />

        <label for="price">Price</label>
        <input
          type="number"
          id="price"
          v-model="newProduct.price"
          placeholder="Price"
          step="0.01"
          min="0"
        />

        <label for="category">Category</label>
        <select v-model="newProduct.category" id="category" required>
          <option value="" disabled>Select Category</option>
          <option value="bed">Bed</option>
          <option value="storage">Storage</option>
          <option value="furniture">Furniture</option>
          <option value="decorations">Decorations</option>
          placeholder="Category"
        </select>

        <div class="button_box">
          <button type="submit">Add Product</button>
          <button
           
            @click.prevent="deleteAllProducts"
            class="delete-all-button"
          >
            Delete All Products
          </button>
        </div>
      </form>
    </div>

    <div class="list_of_products">
      <h2>Existing Products</h2>
      <hr />
      <ul class="product_container">
        <li
          v-for="product in products"
          :key="product.id"
          class="single_product"
        >
          <img :src="product.img" alt="Product Image" loading="lazy" /> <br />
          <div class="single_product_details">
            <p><strong>ID:</strong> {{ product.id }}</p>
            <p><strong>Product Name:</strong> {{ product.product_name }}</p>
            <p><strong>Description:</strong> {{ product.description }}</p>
            <p><strong>Price:</strong> ${{ product.price }}</p>
            <p><strong>Category:</strong> {{ product.category }}</p>
            <p><strong>Quantity Available:</strong> {{ product.quantity_available }}</p>
          </div>

          <div class="single_product_buttons_box" >
            <button @click="deleteProduct(product.id)">Delete</button>
            <button @click="editProduct(product)">Edit</button>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="editingProduct" class="edit_product">
      <h3>Edit Product</h3>
      <hr />
      <form @submit.prevent="updateProduct">
        <label for="edit_product_name">Product Name</label>
        <input
          type="text"
          id="edit_product_name"
          v-model="editingProduct.product_name"
          placeholder="Product Name"
          required
        />

        <label for="edit_description">Product Description</label>
        <textarea
          id="edit_description"
          v-model="editingProduct.description"
          placeholder="Product Description"
          required
        ></textarea>

        <label for="edit_img">Product Image URL</label>
        <input
          type="text"
          id="edit_img"
          v-model="editingProduct.img"
          placeholder="Product Image URL"
        />

        <label for="edit_quantity_available">Quantity Available</label>
        <input
          type="number"
          id="edit_quantity_available"
          v-model="editingProduct.quantity_available"
          placeholder="Quantity Available"
          min="0"
        />

        <label for="edit_price">Price</label>
        <input
          type="number"
          id="edit_price"
          v-model="editingProduct.price"
          placeholder="Price"
          step="0.01"
          min="0"
        />

        <label for="edit_category">Category</label>
        <select v-model="editingProduct.category" id="edit_category" required>
          <option value="bed">Bed</option>
          <option value="storage">Storage</option>
          <option value="furniture">Furniture</option>
          <option value="decorations">Decorations</option>
          placeholder="Category"
        </select>

        <button type="submit">Update Product</button>
      </form>
    </div>
  </div>
</template>

<script>
import ProductService from "../services/ProductService";

export default {
  name: "ProductManagement",
  data() {
    return {
      products: [],
      newProduct: {
        product_name: "",
        description: "",
        img: "",
        quantity_available: null,
        price: null,
        category: "",
      },
      editingProduct: null,
      isAdmin: false,
    };
  },
  methods: {
    async fetchProducts() {
      try {
        this.products = await ProductService.getAllProducts();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async createProduct() {
      try {
        await ProductService.createProduct(this.newProduct);
        this.resetForm();
        this.fetchProducts();
      } catch (error) {
        console.error("Error creating product:", error.response?.data || error.message);
      }
    },
    async deleteProduct(id) {
      try {
        await ProductService.deleteProduct(id);
        this.fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error.response?.data || error.message);
      }
    },
    async deleteAllProducts() {
      try {
        await ProductService.deleteAllProducts();
        this.fetchProducts();
      } catch (error) {
        console.error("Error deleting all products:", error.response?.data || error.message);
      }
    },
    editProduct(product) {
      this.editingProduct = { ...product };
    },
    async updateProduct() {
      try {
        await ProductService.updateProduct(this.editingProduct.id, this.editingProduct);
        this.editingProduct = null;
        this.fetchProducts();
      } catch (error) {
        console.error("Error updating product:", error.response?.data || error.message);
      }
    },
    resetForm() {
      this.newProduct = {
        product_name: "",
        description: "",
        img: "",
        quantity_available: null,
        price: null,
        category: "",
      };
    },
  },
  mounted() {
    this.fetchProducts();
    const role = localStorage.getItem("role");
    this.isAdmin = role === "admin";
  },
};
</script>



<style scoped>
  .product-management{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .product-management h1{
    margin: 20px;
  }
  .Form_div{
    padding: 30px;
    background-color: #243E36;
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 30px;
  }
  form{
    display: flex;
    flex-direction: column;
    gap:10px;
    width: 100%;
  }

  form label{
    color: white;
    font-weight: bold;
    font-size: large;
  }
  form input,form textarea{
    height: 30px;
    padding-left: 8px;
    border-radius: 5px;
    border: none;
    outline: none; 
  }

  form textarea{
    padding-top: 6px;
    height: 60px;
  }
  .button_box{
    display: flex;
    justify-content: center;
    gap:20px;
  }

  .button_box button{
    margin-top: 10px;
    background-color: white;
    border: none;
    padding: 6px;
    border-radius: 10px;
    color: black;
    transition: background-color 0.3s ease-in-out;
  }

  .button_box button:hover{
    cursor: pointer;
    background-color: black;
    color: white;
  }

  .list_of_products{
    margin-top: 30px;
    margin-bottom: 30px;
    width: 80%;

  }
  .product_container{
    width: 100%;
  }
  
  
  .single_product{
    background-color: rgb(173, 173, 173);
    margin-top: 15px;
    padding: 15px;
    display: flex;
    border-radius: 10px;
    gap: 8px;
  }

  .single_product_details{
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 50%;
  }
  .single_product img{
    width: 200px;
    height: auto;
  }
  
  .single_product_buttons_box{
    width: 25%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    background-color: #243E36;
    justify-content: center;
    gap: 20px;
    padding: 20px;
  }
  .single_product_buttons_box button{
    height: 40px;
    border: none;
    border-radius: 10px;
    padding: 5px;
    transition: background-color 0.3s ease-in-out;
  }

  .single_product_buttons_box button:hover{
    cursor: pointer;
    background-color: black;
    color: white;
  }

  .edit_product {
  padding: 30px;
  background-color: grey;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 30px;
  margin-top: 30px;
  color: white;
  margin-bottom: 30px;
}

.edit_product form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.edit_product label {
  color: white;
  font-weight: bold;
  font-size: large;
}

.edit_product input,
.edit_product textarea {
  height: 30px;
  padding-left: 8px;
  border-radius: 5px;
  border: none;
  outline: none;
}

.edit_product textarea {
  padding-top: 6px;
  height: 60px;
}

.edit_product button {
  margin-top: 10px;
  background-color: white;
  border: none;
  padding: 8px;
  border-radius: 10px;
  color: black;
  transition: background-color 0.3s ease-in-out;
}

.edit_product button:hover {
  cursor: pointer;
  background-color: black;
  color: white;
}





  @media (max-width: 800px){
    .single_product{
      flex-direction: column;
    }
    .single_product_buttons_box{
      margin-top: 10px;
      width: 100%;
    }
    .single_product img{
      
      margin: 0 auto;
      text-align: center;
    }

  }
</style>