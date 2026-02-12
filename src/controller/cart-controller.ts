import Cart from "../model/cart";
import Product from "../model/product";
import { EmptyCartException } from "../model/receipt";
import CartBadgeView from "../view/cart/cart-badge-view";
import CartPanelView from "../view/cart/cart-panel-view";
import ErrorView from "../view/error-view";
import ReceiptView from "../view/receipt/receipt-view";

/**
 * CartController is the controller for the {@link Cart} model class.
 */
export default class CartController {
    #cart: Cart;
    #cartBadgeView: CartBadgeView;
    #cartPanelView: CartPanelView;
    #receiptView?: ReceiptView;

    constructor() {
        this.#cart = new Cart();

        this.#cartBadgeView = new CartBadgeView(this.#cart, this);
        this.#cartPanelView = new CartPanelView(this.#cart, this);
    }

    /**
     * Adds a {@link Product} to the {@link Cart}
     * @param product The product to add to the cart
     */
    addProduct(product: Product) {
        this.#cart.addProduct(product);
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