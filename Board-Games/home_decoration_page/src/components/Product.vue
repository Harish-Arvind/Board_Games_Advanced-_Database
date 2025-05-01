<template>
    
      <img :src="product.img" alt="product" @click="handleClick" loading="lazy" />
      <h4 @click="handleClick">{{ product.product_name }}</h4>
      <h2>Price: {{ product.price }} $</h2>
   
  </template>
  
  <script>
  export default {
    name: "Product",
    props: {
      product: {
        type: Object,
        required: true,
      },
    },
    emits: ["product-clicked"],
    methods: {
      handleClick() {
        this.$emit("product-clicked", this.product.id);
      },
    },
  };
  </script>
  

<style scoped>


.product h4{
    margin-top: 10px;
    cursor: pointer;
}

.product img{
    border: 2px solid gray;
    width: 200px;
    height: 200px;
    cursor: pointer;
}

.product h2{
    margin: 10px;
    

}


</style>
