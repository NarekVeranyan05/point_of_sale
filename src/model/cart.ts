import type Listener from "../listener";
import type Product from "./product";
import Receipt from "./receipt";

export default class Cart {
    #products: Array<Product>
    #listeners: Array<Listener>

    constructor() {
        this.#products = new Array<Product>();
        this.#listeners = [];
    }

    get size(): number {
        return this.#products.length;
    }

    addProduct(product: Product) {
        this.#products.push(product);
        
        this.#notifyAll();
    }

    checkout(): Receipt {
        return new Receipt(this.#products);
    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }

    #notifyAll() {
        this.#listeners.forEach(l => l.notify());
    }
}