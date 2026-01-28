import { assert } from "../assertions";
import type { ProductType } from "./product-type";

export default class Product {
    #productType: ProductType;
    #price: number;

    constructor(productType: ProductType, price: number) {
        this.#productType = productType;
        this.#price = price;

        this.#checkProduct();
    }

    get type() {
        return this.#productType;
    }

    get price() {
        return this.#price;
    }

    #checkProduct() {
        assert(this.#price > 0, "price must be positive.");
    }
}