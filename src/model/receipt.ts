import { assert } from "../assertions";
import type Product from "./product";

export default class Receipt {
    #products: Array<Product>;
    #totalPrice: number;

    constructor(products: Array<Product>) {
        this.#products = products;

        this.#totalPrice = 0;
        this.#products.forEach((p) => this.#totalPrice += p.price);

        this.#checkReceipt();
    }

    #checkReceipt (){
        assert(this.#products.length > 0, "products cannot be empty.");
        assert(this.#totalPrice > 0, "totalPrice must be positive.");
    }
}