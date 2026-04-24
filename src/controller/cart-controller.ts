import Product from "../model/product/product";
import CartBadgeView from "../view/cart/cart-badge-view";
import CartPanelView from "../view/cart/cart-panel-view";
import ErrorView from "../view/error-view";
import ReceiptView from "../view/receipt/receipt-view";
import Cart from "../model/cart.ts";
import Coupon from "../model/coupon/coupon.ts";
import CouponSelectionView from "../view/coupon-selection-view.ts";
import AccountController from "./account-controller.ts";
import CartSuggesterView from "../view/cart/cart-suggester-view.ts";
import CartSuggesterDialogView from "../view/cart/cart-suggester-dialog-view.ts";
import ProductController from "./product-controller.ts";

/**
 * CartController is the controller for the {@link Cart} model class.
 */
export default class CartController {
    #accountController: AccountController;
    #productController: ProductController;
    #cart: Cart;
    #cartBadgeView: CartBadgeView;
    #cartPanelView: CartPanelView;
    #cartSuggesterView?: CartSuggesterView
    #cartSuggesterDialogView?: CartSuggesterDialogView;
    #couponSelectionView?: CouponSelectionView
    #receiptView?: ReceiptView;

    constructor(accountController: AccountController, cart: Cart) {
        this.#accountController = accountController;
        this.#productController = new ProductController(this);
        this.#cart = cart

        this.#cartBadgeView = new CartBadgeView(this.#cart, this);
        this.#cartPanelView = new CartPanelView(this.#cart);

        if(cart.products.length > 0)
            this.#cartSuggesterView = new CartSuggesterView(this.#cart, this);
    }

    set cart(cart: Cart) {
        this.#cart = cart;
    }


    /**
     * Adds a {@link Product} to the {@link Cart}
     * @param product the product to add to the cart
     * @param amount the amount of product to add
     */
    async addProduct(product: Product, amount: number) {
        try{
            let pCpy = product.clone();
            pCpy.quantity = amount;

            await this.#cart.addProduct(pCpy);

            this.#productController.hideProductAmountDialogView()
            this.#cartSuggesterView = new CartSuggesterView(this.#cart, this);
        }
        catch(e) {
            new ErrorView("Error: the quantity of the product should be a positive whole number, e.g. 6");
        }
    }

    async addProductsUpToAmount(amount: number) {
        try {
            await this.#cart.addProductsUpToAmount(amount);
            this.#cartSuggesterDialogView!.close();
            this.#cartSuggesterDialogView = undefined;
        } catch(e) {
            new ErrorView("Error: the quantity of the product should be a positive whole number, e.g. 6");
        }
    }

    /**
     * Adds a {@link Coupon} to the {@link Cart}
     * @param coupon the coupon to add to the cart
     */
    async addCoupon(coupon: Coupon) {
        let cCpy = coupon.clone();

        await this.#cart.addCoupon(cCpy);
    }

    showCart() {
        this.#cartBadgeView = new CartBadgeView(this.#cart, this);
        this.#cartPanelView = new CartPanelView(this.#cart);
    }

    showCartSuggesterDialogView() {
        this.#cartSuggesterDialogView = new CartSuggesterDialogView(this);
    }

    /**
     * Proceeds to checkout with the current cart by displaying coupons to select from.
     */
    checkout() {
        if(this.#couponSelectionView)
            new ErrorView("Error: You are already in the checkout process.");
        else if(this.#cart.products.length === 0)
            new ErrorView("Error: the cart is empty, cannot checkout.");
        else {
            this.#couponSelectionView = new CouponSelectionView(this, this.#cart);
        }
    }

    exitCheckout() {
        this.#couponSelectionView!.close();
        this.#couponSelectionView = undefined;
    }

    /**
     * Purchases the items currently in the {@link Cart}.
     */
    async purchase() {
        this.exitCheckout();

        let receipt = await this.#cart.purchase();
        await this.#accountController.addReceipt(receipt);

        this.#receiptView = new ReceiptView(receipt);
    }
}
