import Product from "../model/product"
import { ProductType } from "../model/product-type"
import ProductView from "../view/product/product-view"
import type CartController from "./cart-controller"

export default class ProductController {
    #product: Product
    #productView: ProductView

    // can I have sth like this>
    constructor(cartController: CartController) {
        this.#product = new Product(ProductType.TRACK_SUIT, 120);
        this.#productView = new ProductView(cartController, this.#product);
    }
}