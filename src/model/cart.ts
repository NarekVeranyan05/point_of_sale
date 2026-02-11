import type Listener from "../listener";
import type Product from "./product";
import Receipt from "./receipt";

/**
 * The Cart class contains all the {@link Product} instances that
 * were added by the user to purchase.
 */
export default class Cart {
    #products: Array<Product>
    #listeners: Array<Listener>

    constructor() {
        this.#products = new Array<Product>();
        this.#listeners = [];
    }

    get products(): ReadonlyArray<Product> {
        return this.#products;
    }

    /**
     * Adds a {@link Product} to the cart
     * @param product The product to add to the cart
     */
    addProduct(product: Product) {
        this.#products.push(product);
        
        this.#notifyAll();
    }

    /**
     * Proceeds to checkout with the current Cart
     * @returns the {@link Receipt} for the purchase
     */
    checkout(): Receipt {
        let receipt = new Receipt(this.#products.map(p => p));
        this.#products.length = 0;
        this.#notifyAll();

        return receipt;
    }

    /**
     * Adds a listener to the Cart
     * @param listener the listener to register
     */
    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }

    /**
     * Sends a message to all the registered listeners
     */
    #notifyAll() {
        this.#listeners.forEach(l => l.notify());
    }
}