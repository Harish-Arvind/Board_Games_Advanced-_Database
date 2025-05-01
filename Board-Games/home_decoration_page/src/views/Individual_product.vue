<template>
  <div class="product_details_page">
    <div v-if="!product">Loading product details...</div>
    <div v-else class="product_container">
      <img :src="product.img" alt="Product Image" loading="lazy" />
      <div class="product_details">
        <h1>{{ product.product_name }}</h1>
        <hr />
        <p class="category">Category: {{ product.category }}</p>

        <div class="rating_section">
          <h3>Rating: {{ averageRating }} / 5</h3>
          <div v-if="product.ratings.length">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= averageRating }">&#9733;</span>
          </div>
          <div v-else>No ratings yet.</div>
        </div>

        <h2>Price: {{ product.price }} $</h2>
        <p class="description">Description:</p>
        <p>{{ product.description }}</p>
        
        <div class="add_rating">
          <label for="rating">Rate this product:</label>
          <select v-model="userRating" id="rating">
            <option value="" disabled>Select rating</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
          <button @click="submitRating">Submit</button>
        </div>

        <button @click="addToCart">Add to Cart</button>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "IndividualProduct",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      product: null,
      userRating: null, // To store the user's selected rating
    };
  },
  computed: {
    averageRating() {
      if (this.product && this.product.ratings.length) {
        const total = this.product.ratings.reduce((sum, rating) => sum + rating, 0);
        return (total / this.product.ratings.length).toFixed(1);
      }
      return 0;
    },
  },
  created() {
    this.fetchProductOnLoad();
  },
  methods: {
    async fetchProductOnLoad() {
      const productId = parseInt(this.id, 10);
      if (this.$root.products.length) {
        this.fetchProduct(productId);
      }
    },
    async fetchProduct(productId) {
      const product = this.$root.products?.find((item) => item.id === productId);
      if (product) {
        // Ensure product has a ratings array
        if (!product.ratings) {
          product.ratings = [];
        }
        this.product = product;
      } else {
        console.error("Product not found");
      }
    },
    addToCart() {
      this.$root.add_product_to_cart(this.product);
    },
    submitRating() {
      if (!this.userRating) {
        alert("Please select a rating before submitting.");
        return;
      }
      if (this.product) {
        this.product.ratings.push(parseInt(this.userRating, 10));
        this.userRating = null; // Reset user rating after submission
      }
    },
  },
  watch: {
    '$root.products': {
      immediate: true,
      handler(newProducts) {
        if (newProducts.length && !this.product) {
          const productId = parseInt(this.id, 10);
          this.fetchProduct(productId);
        }
      },
    },
    id(newId) {
      const productId = parseInt(newId, 10);
      this.fetchProduct(productId);
    },
  },
};

</script>

  

<style scoped>
.product_details_page{
    width: 100%;
    background-color: #EAEDED;
    padding-top: 30px;
    padding-bottom: 30px;
}

.product_container{
    margin: 0 auto;
    background: white;
    display: flex;
    width: 70%;
    padding: 20px;
    border-radius: 20px;
    gap:20px;
}

.product_container img{
    max-width: 400px;
    height: 100%;
    border: 1px solid gray;
}


.product_details {
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex-grow: 1; 
}

.product_details button {
    background-color: #243E36;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 20px;
    height: 40px;
    cursor: pointer;
}
.category{
    color: grey;
    font-weight: bold;
}

.description{
    text-decoration: underline;
}

.product_details h1, .product_details h2{
    color: #243E36;
}

hr{
    width: 100%;
}

.star {
  font-size: 24px;
  color: #ccc;
}
.star.filled {
  color: gold;
}
.rating_section {
  margin: 10px 0;
}
.add_rating {
  margin-top: 10px;
  display: flex;
  justify-content: center; /* Center the button */
  align-items: center;
  gap: 10px;
  height: 70px;
}

.add_rating button {
  padding: 5px 10px; /* Adjust padding to make the button smaller */
  height: 40px; /* Adjust the height if needed */
  background-color: #243E36;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}


@media (max-width: 800px){
  .product_container{
    flex-direction: column;
    align-items: center;
  }
  .product_container img{
    max-width: 250px;
    
}

}
</style>