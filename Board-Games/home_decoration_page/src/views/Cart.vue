<template>
  <div class="cart_container">
    <h2>{{ cart_products.length === 0 ? 'Your Eco cart is empty' : 'This is your Eco cart' }}</h2>
    <ul>
      <li class="car_product_container" v-for="item in cart_products" :key="item.id">
        <Cart_product 
          :product="item" 
          @update-cart="() => add_product_to_cart(item)"
          @reduce_cart="()=> remove_one_unit_cart_product(item)"
          @remove-product="remove_cart_product(item)"
          @product-clicked="viewProduct" 
        />
      </li>
    </ul>
    <div class="total" v-if="cart_products.length !== 0">
      <p>Total to pay : {{ totalPrice }}$ ({{number_Cart_Items}} products)</p>
    </div>
  </div>
</template>

<script>
import Cart_product from '../components/Cart_product.vue';

export default {
  props: {
    cart_products: Array,
    add_product_to_cart: Function,
    remove_one_unit_cart_product: Function,
    remove_cart_product: Function,
    totalPrice: Number,
    number_Cart_Items: Number,
  },
  components: {
    Cart_product
  },
  methods: {
      viewProduct(id) {
        this.$router.push(`/product/${id}`);
      },
  },
};
</script>


<style scoped>
  .cart_container{
    width: 100%;
    min-height: 300px;
    height: auto;
    background-color: #EAEDED;
    padding-bottom: 20px;
  }
  .cart_container h2{
    text-align: center;
    padding: 20px;
  }

  .cart_container ul{
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    margin: 0 auto;
    border-radius: 20px 20px 0 0 ;
  }

  .total{
    width: 80%;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    margin: 0 auto;
    border-radius: 0 0 20px 20px  ;
    font-size: larger;
  }

  .car_product_container{
    width: 100%;
    background-color: rgba(0, 128, 0, 0);
    height: auto;
  }  
</style>