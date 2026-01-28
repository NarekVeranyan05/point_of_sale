// document.querySelector<HTMLDivElement>("#app")!
// .innerHTML = "<button id='add-suit'>Add Track Suit</button>"

import CartController from "./controller/cart-controller";
import ProductController from "./controller/product-controller";

let cartController = new CartController();
let productController = new ProductController(cartController);