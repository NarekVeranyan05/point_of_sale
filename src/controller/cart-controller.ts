import Product from "../model/product/product";
import CartBadgeView from "../view/cart/cart-badge-view";
import CartPanelView from "../view/cart/cart-panel-view";
import ErrorView from "../view/error-view";
import ProductAmountDialogView from "../view/product/product-amount-dialog-view";
import ReceiptView from "../view/receipt/receipt-view";
import ProductView from "../view/product/product-view.ts";
import Cart from "../model/cart.ts";
import Coupon from "../model/coupon/coupon.ts";
import CouponSelectionView from "../view/coupon-selection-view.ts";
import AccountController from "./account-controller.ts";
import {Measurements} from "../model/product/measurements.ts";

/**
 * CartController is the controller for the {@link Cart} model class.
 */
export default class CartController {
    #accountController: AccountController;
    #cart: Cart;
    #productViews: Array<ProductView>; // ok to have sth like this?
    #cartBadgeView: CartBadgeView;
    #cartPanelView: CartPanelView;
    #productAmountDialogView?: ProductAmountDialogView;
    #couponSelectionView?: CouponSelectionView
    #receiptView?: ReceiptView;

    constructor(accountController: AccountController, cart: Cart) {
        this.#accountController = accountController;
        this.#cart = cart
        this.#productViews = new Array<ProductView>();

        Product.fetchMaster().then(products => {
            products.forEach(p => this.#productViews.push(new ProductView(this, p)));
        });

        Measurements.fetchMeasures();

        this.#cartBadgeView = new CartBadgeView(this.#cart, this);
        this.#cartPanelView = new CartPanelView(this.#cart, this);
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

            this.#productAmountDialogView!.close();
            this.#productAmountDialogView = undefined;
        }
        catch(e) {
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
        this.#cartPanelView = new CartPanelView(this.#cart, this);
    }

    /**
     * Displays the dialog for entering the quantity of a {@link Product} to add to {@link Cart}
     * @param product the product selected to add to the cart
     */
    showProductAmountDialogView(product: Product) {
        if(this.#productAmountDialogView) 
            this.#productAmountDialogView.close();

        this.#productAmountDialogView = new ProductAmountDialogView(product, this);
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
            Coupon.fetchMaster().then(masterCoupons  => {
                let notSelected = masterCoupons.filter(masterCoupon => !this.#cart.coupons.find(coupon => coupon.name === masterCoupon.name));
                this.#couponSelectionView = new CouponSelectionView(this, notSelected);
            });
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

        let receipt = this.#cart.purchase();
        await this.#accountController.addReceipt(receipt);

        this.#receiptView = new ReceiptView(receipt);
    }
}

