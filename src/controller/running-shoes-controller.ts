import Product from "../model/product"
import RunningShoes from "../model/running-shoes"
import ProductView from "../view/product/product-view"
import type CartController from "./cart-controller"

/**
 * RunningShoesController is the controller for the {@link RunningShoes} model class.
 */
export default class RunningShoesController {
    #product: Product
    #productView: ProductView

    constructor(cartController: CartController) {
        this.#product = new RunningShoes(120);
        this.#productView = new ProductView(cartController, this.#product);
    }
}