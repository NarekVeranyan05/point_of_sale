import { assert } from "../assertions";
import type Listener from "../listener";
import Coupon from "./coupon/coupon";
import Product from "./product/product";
import Receipt from "./receipt";
import db from "./assets/connection.ts";

/**
 * The Cart class contains all the {@link Product} instances that
 * were added by the user to purchase.
 */
export default class Cart {
    #id?: number;
    #products: Array<Product>;
    #coupons: Array<Coupon> 
    #listeners: Array<Listener>;

    static async fetchCartForAccount(accountName: string): Promise<Cart> {
        let cart = new Cart();

        let results = await db().query<{
            id: number,
            account: string
        }>(`SELECT * FROM cart WHERE account = $1`, [accountName]);
        cart.#id = results.rows[0].id

        cart.#products = await Product.fetchForCart(cart.#id);
        cart.#coupons = await Coupon.fetchForCart(cart.#id);

        return cart;
    }

    constructor() {
        this.#products = new Array<Product>();
        this.#coupons = new Array<Coupon>();
        this.#listeners = [];

        this.#checkCart();
    }

    get id(): number | undefined {
        this.#checkCart();

        return this.#id;
    }

    get products(): ReadonlyArray<Product> {
        this.#checkCart();

        return this.#products;
    }

    get coupons(): ReadonlyArray<Coupon> {
        this.#checkCart();

        return this.#coupons;
    }

    set id(id: number) {
        this.#checkCart();

        this.#id = id;

        this.#checkCart();
    }

    /**
     * Adds a {@link Product} to the cart
     * @param product the product to add to the cart
     */
    async addProduct(product: Product){
        this.#checkCart();

        this.#products.push(product);
        await Product.storeForCart(product, this.id!);

        this.#notifyAll();

        this.#checkCart();
    }
    
    /**
     * Adds a {@link Coupon} to the cart
     * @param coupon the coupon to add to the cart
     */
    async addCoupon(coupon: Coupon){
        this.#checkCart();

        this.#coupons.push(coupon);
        await Coupon.storeForCart(coupon, this.id!);

        this.#notifyAll();

        this.#checkCart();
    }  

    /**
     * Purchases the items in the current Cart
     * @returns the {@link Receipt} for the purchase
     */
    purchase(): Receipt {
        this.#checkCart();

        let receipt = new Receipt(this.#products.map(p => p), []);
        this.#coupons.forEach(c => receipt.addCoupon(c));

        this.#products.forEach(async p => await Product.delete(p.id!));
        this.#coupons.forEach(async c => await Coupon.delete(c.id!));
        this.#products.length = 0;
        this.#coupons.length = 0;
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
        assert((this.#products.length > 0) || (this.#coupons.length == 0), "empty cart cannot have coupons.");
    }
}