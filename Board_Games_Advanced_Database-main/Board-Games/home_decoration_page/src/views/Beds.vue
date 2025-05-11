<template>
    <div class="Beds">
      <div class="banner">
        <h1>Beds</h1>
        <p>
          Discover the perfect eco-friendly bed for restful nights and refreshed mornings. Whether you prefer a minimalist, sustainable frame or a luxurious, natural-material headboard, our selection offers comfort, style, and environmental care for every bedroom.
        </p>
    </div>
      
      <SearchableCatalog
        :add_product_to_cart="add_product_to_cart"
        :products="products"
        :Page_category="Page_category"
      />
    </div>
  </template>
  
  <script>
  import SearchableCatalog from "../components/SearchableCatalog.vue";
  
  export default {
    name: "Beds",
    components: {
      SearchableCatalog,
    },
    props: {
      add_product_to_cart: Function,
      products: Array,
    },
    data() {
      return {
        Page_category: "Beds", 
      };
    },
  };
  </script>
  
  
  
<style scoped>
.Beds{
  min-height: 400px;
}
  .banner{
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .banner h1{
    color: #243E36;
  }
  </style>