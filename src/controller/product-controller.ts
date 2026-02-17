import type Product from "../model/product/product";
import ProductView from "../view/product/product-view";
import type CartController from "./cart-controller";

export default class ProductController {
    #product: Product;
    #productView: ProductView;

    constructor(product: Product, cartController: CartController) {
        this.#product = product;
        this.#productView = new ProductView(cartController, this.#product);
    }
}