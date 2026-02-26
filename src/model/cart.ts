import { assert } from "../assertions";
import type Listener from "../listener";
import Coupon from "./coupon/coupon";
import Product from "./product/product";
import Receipt from "./receipt";
import db from "./connection.ts";

/**
 * The Cart class contains all the {@link Product} instances that
 * were added by the user to purchase.
 */
export default class Cart {
    #products: Array<Product>;
    #coupons: Array<Coupon> 
    #listeners: Array<Listener>;

    static async fetchCart(accountName: string): Promise<Cart> {
        let cart = new Cart();
        Product.fetchProducts(accountName).then(rows => cart.#products = rows);
        Coupon.fetchCoupons(accountName).then(rows => cart.#coupons = rows);

        return cart;
    }

    constructor() {
        this.#products = new Array<Product>();
        this.#coupons = new Array<Coupon>();
        this.#listeners = [];

        this.#checkCart();
    }

    get products(): ReadonlyArray<Product> {
        this.#checkCart();

        return this.#products;
    }

    /**
     * Adds a {@link Product} to the cart
     * @param product the product to add to the cart
     */
    addProduct(product: Product){
        this.#checkCart();

        this.#products.push(product);
        this.#notifyAll();

        this.#checkCart();
    }
    
    /**
     * Adds a {@link Coupon} to the cart
     * @param coupon the coupon to add to the cart
     */
    addCoupon(coupon: Coupon) {
        this.#checkCart();

        this.#coupons.push(coupon);

        this.#checkCart();
    }  

    /**
     * Proceeds to checkout with the current Cart
     * @returns the {@link Receipt} for the purchase
     */
    checkout(): Receipt {
        this.#checkCart();

        let receipt = new Receipt(this.#products.map(p => p));
        this.#coupons.forEach(c => c.applyCoupon(receipt));
        this.#products.length = 0;

        this.#notifyAll();

        this.#checkCart();

        return receipt;
    }

    /**
     * Adds a listener to the Cart
     * @param listener the listener to register
     */
    registerListener(listener: Listener) {
        this.#checkCart();

        this.#listeners.push(listener);

        this.#checkCart();
    }

    /**
     * Sends a message to all the registered listeners
     */
    #notifyAll() {
        this.#checkCart();

        this.#listeners.forEach(l => l.notify());

        this.#checkCart();
    }

    /**
     * Class invariants for Product
     */
    #checkCart() {
        assert(this.#coupons.length == 0 || (this.#products.length > 0), "empty cart cannot have coupons.");
    }
}