import Product from "../model/product/product";
import { EmptyCartException } from "../model/receipt";
import CartBadgeView from "../view/cart/cart-badge-view";
import CartPanelView from "../view/cart/cart-panel-view";
import ErrorView from "../view/error-view";
import ProductAmountDialogView from "../view/product/product-amount-dialog-view";
import ReceiptView from "../view/receipt/receipt-view";
import ProductView from "../view/product/product-view.ts";
import Cart from "../model/cart.ts";
import type AccountController from "./account-controller.ts";
import type Account from "../model/account.ts";

/**
 * CartController is the controller for the {@link Cart} model class.
 */
export default class CartController {
    #cart: Cart;
    #productViews: Array<ProductView>;
    #cartBadgeView: CartBadgeView;
    #cartPanelView: CartPanelView;
    #productAmountDialogView?: ProductAmountDialogView;
    #receiptView?: ReceiptView;

    constructor(cart: Cart) {
        this.#cart = cart
        this.#productViews = new Array<ProductView>();

        Product.fetchProductMaster().then(products => {
            products.forEach(p => this.#productViews.push(new ProductView(this, p)));
        });

        this.#cartBadgeView = new CartBadgeView(this.#cart, this);
        this.#cartPanelView = new CartPanelView(this.#cart, this);
    }

    set cart(cart: Cart) {
        this.#cart = cart;
    }

    /**
     * Adds a {@link Product} to the {@link Cart}
     * @param product the product to add to the cart
     */
    async addProduct(product: Product) {
        this.#cart.addProduct(product);

        await Product.saveProduct(product);

        this.#productAmountDialogView!.close();
        this.#productAmountDialogView = undefined;
    }

    showCart() {
        this.#cartBadgeView = new CartBadgeView(this.#cart, this);
        this.#cartPanelView = new CartPanelView(this.#cart, this);
    }

    showProductAmountDialogView(product: Product) {
        if(this.#productAmountDialogView) 
            this.#productAmountDialogView.close();

        this.#productAmountDialogView = new ProductAmountDialogView(product, this);
    }

    /**
     * Proceeds to checkout with the current cart and creates a ReceiptView for the receipt
     */
    checkout() {
        try {
            let receipt = this.#cart.checkout();
            this.#receiptView = new ReceiptView(receipt);
        } catch(e) {
            new ErrorView("Error: the cart is empty, cannot checkout.");
        }
    }
}