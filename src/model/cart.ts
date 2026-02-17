import { assert, AssertionError } from "../assertions";
import type Listener from "../listener";
import type Coupon from "./coupon/coupon";
import type Product from "./product/product";
import Receipt from "./receipt";

/**
 * The Cart class contains all the {@link Product} instances that
 * were added by the user to purchase.
 */
export default class Cart {
    #products: Map<Product, number>;
    #coupons: Array<Coupon> 
    #listeners: Array<Listener>;

    constructor() {
        this.#products = new Map<Product, number>();
        this.#coupons = new Array<Coupon>();
        this.#listeners = [];

        this.#checkCart();
    }

    get products(): ReadonlyMap<Product, number> {
        this.#checkCart();

        return this.#products;
    }

    /**
     * Adds a {@link Product} to the cart
     * @param product the product to add to the cart
     * @param amt the quantity of how much to add
     */
    addProduct(product: Product, amt: number) {
        if(amt <= 0)
            throw new NonPositiveAmountError();

        this.#checkCart();

        if(this.#products.has(product))
            this.#products.set(product, this.#products.get(product)! + amt);
        else
            this.#products.set(product, amt);

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

        console.log(new Map(this.#products));
        let receipt = new Receipt(new Map(this.#products));
        this.#coupons.forEach(c => c.applyCoupon(receipt));
        this.#products.clear();

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
        assert(this.#coupons.length == 0 || (this.#products.size > 0), "empty cart cannot have coupons.");

        [...this.#products].forEach(pair => {
            assert(pair[1] > 0, "product amount must be positive.");
        });
    }
}

export class NonPositiveAmountError extends Error { }