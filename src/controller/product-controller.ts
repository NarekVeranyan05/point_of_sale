import ProductView from "../view/product/product-view.ts";
import Product from "../model/product/product.ts";
import type CartController from "./cart-controller.ts";
import ProductAmountDialogView from "../view/product/product-amount-dialog-view.ts";
import {Measurements} from "../model/product/measurements.ts";

export default class ProductController {
    #cartController: CartController;
    #productViews: Array<ProductView>;
    #productAmountDialogView?: ProductAmountDialogView;

    constructor(cartController: CartController) {
        this.#cartController = cartController;
        this.#productViews = new Array<ProductView>();

        Product.fetchInventory().then(products => {
            products.forEach(p => this.#productViews.push(new ProductView(this, p)));
        });

        Measurements.fetchMeasures();
    }

    /**
     * Displays the dialog for entering the quantity of a {@link Product} to add to {@link Cart}
     * @param product the product selected to add to the cart
     */
    showProductAmountDialogView(product: Product) {
        if(this.#productAmountDialogView)
            this.#productAmountDialogView.close();

        this.#productAmountDialogView = new ProductAmountDialogView(product, this.#cartController);
    }

    hideProductAmountDialogView() {
        if(this.#productAmountDialogView)
            this.#productAmountDialogView.close();
        this.#productAmountDialogView = undefined;
    }

}