import Cart, { NonPositiveAmountError } from "../model/cart";
import Product from "../model/product/product";
import { EmptyCartException } from "../model/receipt";
import CartBadgeView from "../view/cart/cart-badge-view";
import CartPanelView from "../view/cart/cart-panel-view";
import ErrorView from "../view/error-view";
import ProductAmountDialogView from "../view/product/product-amount-dialog-view";
import ReceiptView from "../view/receipt/receipt-view";

/**
 * CartController is the controller for the {@link Cart} model class.
 */
export default class CartController {
    #cart: Cart;
    #cartBadgeView?: CartBadgeView;
    #cartPanelView?: CartPanelView;
    #productAmountDialogView?: ProductAmountDialogView;
    #receiptView?: ReceiptView;


    constructor() {
        this.#cart = new Cart();

        // this.#cartBadgeView = new CartBadgeView(this.#cart, this);
        // this.#cartPanelView = new CartPanelView(this.#cart, this);
    }

    /**
     * Adds a {@link Product} to the {@link Cart}
     * @param product the product to add to the cart
     * @param amt the quantity of the product to add
     */
    addProduct(product: Product, amt: number) {
        try{
            this.#cart.addProduct(product, amt);
            this.#productAmountDialogView!.close();
            this.#productAmountDialogView = undefined;
        } catch(e) {
            if(e instanceof NonPositiveAmountError)
                new ErrorView(`Error: ${amt} is not a valid amount. You must provide a positive number, e.g. 7`);
        }
    }

    showProductAmountDialogView(product: Product) {
        if(this.#productAmountDialogView) 
            this.#productAmountDialogView.close();

        this.#productAmountDialogView = new ProductAmountDialogView(product, this);
    }

    /**
     * Proceeds to checkout with the current cart and creates a ReceiptView for the receipt
     */
    checkоut() {
        try {
            let receipt = this.#cart.checkout();
            this.#receiptView = new ReceiptView(receipt);
        } catch(e) {
            if(e instanceof EmptyCartException)
                new ErrorView("Error: the cart is empty, cannot checkout.");
        }
    }
}