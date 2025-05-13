<template>
    <User_menu :number_Cart_Items="number_Cart_Items" :totalPrice="totalPrice" />
    <router-view v-bind="viewProps"/>
    <Footer_User />
  </template>
  
  <script>
  import User_menu from "./components/User_menu.vue";
  import Footer_User from "./components/Footer_User.vue";
  import ProductService from "./services/ProductService";
  
  export default {
    name: "App",
    components: {
      User_menu,
      Footer_User,
    },
    data() {
      return {
        number_Cart_Items: 0,
        totalPrice: 0.0,
        products: [],
        cart_products:[],
        categories:[
          "Beds",
          "Furniture",
          "Decoration",
          "Storage",
          "Home",
        ],
        
      };
    },
    methods: {
      // Fetch products from backend
    async fetchProducts() {
      try {
        this.products = await ProductService.getAllProducts();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

      add_product_to_cart(item) {
        const existingProduct = this.cart_products.find((product) => product.id === item.id);
        if(item.quantity_available===item.quantity_cart){
          alert("There are no more Eco Friendly products of this kind available")
        }
        if (item.quantity_available > item.quantity_cart) {
          if(existingProduct){
            existingProduct.quantity_cart ++;
          }
          else{
            item.quantity_cart++;
            this.cart_products.push(item);
          }
          this.number_Cart_Items ++;
          this.totalPrice += item.price;
        }
      },

      remove_one_unit_cart_product(item){
        if(item.quantity_cart>0){
          this.number_Cart_Items--;
          item.quantity_cart--;
          this.totalPrice -= item.price;
          if(item.quantity_cart==0){
            this.cart_products.splice(item,1);
          }
        }
      },
      remove_cart_product(item){
          this.number_Cart_Items-= item.quantity_cart;
          this.totalPrice -= item.price*item.quantity_cart;
          item.quantity_cart=0;
          this.cart_products.splice(item,1);
      },
      

    },
    computed: {
      viewProps() {
        const sharedProductProps = {
            products: this.products,
            add_product_to_cart: this.add_product_to_cart,
        };

        switch (this.$route.name) {
            case 'Storage':
            case 'Furniture':
            case 'Beds':
            case 'Decoration':
                return sharedProductProps;

            case 'Home':
                return {
                    products: this.products,
                    add_product_to_cart: this.add_product_to_cart,
                };

            case 'Cart':
                return {
                    cart_products: this.cart_products,
                    totalPrice: this.totalPrice,
                    number_Cart_Items: this.number_Cart_Items,
                    remove_one_unit_cart_product: this.remove_one_unit_cart_product,
                    remove_cart_product: this.remove_cart_product,
                    add_product_to_cart: this.add_product_to_cart,
                };

            default:
                return {};
        }
      }
    },
    async mounted() {
    await this.fetchProducts(); // Load products when the app loads
  },
  }
  </script>
  

<style>
*{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Montserrat";
    list-style: none;
}

html{
    width: 100%;
}

body{
    width: 100%;
}
</style>
