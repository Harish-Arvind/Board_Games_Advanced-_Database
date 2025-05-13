<template>
  <div class="main_product_section">
    
    <ul class="list_products">
      <li 
        class="product" 
        v-for="item in products" 
        :key="item.id" 
        v-show="item.category === Page_category"
      >
        <Product 
          :product="item"
          @product-clicked="viewProduct"
        />
        <button @click="add_product_to_cart(item)">Add to cart</button>
      </li>
    </ul>
    <p  v-if="products.length===0">There are no products available</p>

  </div>
</template>

<script>
import Product from './Product.vue';

export default {
  name: "Catalog_product",
  components: {
    Product,
  },
  props: {
    add_product_to_cart: Function,
    products: Array,
    Page_category: String,
  },
  methods: {
    viewProduct(id) {
      this.$router.push(`/product/${id}`);
    },
  },
};
</script>



<style scoped>
.main_product_section{
    text-align: center;
}

.main_product_section>h2{
    padding: 0;
    margin: 20px;
}
.list_products{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background-color: #243E36;
    width: 100%;
   
}

.product{
    margin: 20px;
    width: 250px;
    height: 350px;
    background-color: #f0e9d7;
    border-radius: 10px;
    padding: 10px;
    transition: transform 0.3s ease-in-out;
}

.product:hover{
    transform: scale(1.05);;
}

.product>button{
    background-color: white;
    border: 1px solid white;
    color: #243E36;
    border-radius: 20px;
    padding: 7px;
    font-weight: bold;
    transition: color 0.3s ease-in-out;
    cursor: pointer;
}

.product>button:hover{
    background-color: #243E36;
    border: 1px solid #243E36;
    color: white;
}



</style>

