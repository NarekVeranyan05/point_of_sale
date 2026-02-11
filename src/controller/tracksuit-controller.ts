import Product from "../model/product"
import Tracksuit from "../model/tracksuit"
import ProductView from "../view/product/product-view"
import type CartController from "./cart-controller"

/**
 * TracksuitController is the controller for the {@link Tracksuit} model class.
 */
export default class TracksuitController {
    #product: Product
    #productView: ProductView

    constructor(cartController: CartController) {
        this.#product = new Tracksuit(120);
        this.#productView = new ProductView(cartController, this.#product);
    }
}