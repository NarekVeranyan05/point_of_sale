import { assert } from "../assertions";
import type Product from "./product/product";
import {Temporal} from "@js-temporal/polyfill";

/**
 * The Receipt class represents the receipt information of
 * all the {@link Product} instances in the purchased {@link Cart}
 */
export default class Receipt {
    #timestamp: Temporal.PlainDateTime
    #products: Array<Product>;
    #discount: number;
    #listPrice: number;

    constructor(products: Array<Product>) {
        if(products.length == 0)
            throw new EmptyCartException();

        this.#timestamp = Temporal.Now.plainDateTimeISO();
        this.#products = products;
        this.#discount = 0;
        this.#listPrice = this.#products.reduce((acc, p) => acc + (p.price * p.quantity), 0);

        this.#checkReceipt();
    }

    get products(): ReadonlyArray<Product> {
        this.#checkReceipt();
        
        return this.#products;
    }

    get discount(): number {
        return this.#discount;
    }

    get listPrice(): number {
        this.#checkReceipt();

        return this.#listPrice;
    }

    /**
     * Adds a {@link Product} to the cart
     * @param product the product to add to the cart
     */
    addProduct(product: Product) {
        this.#products.push(product);
    }

    addDiscount(amt: number) {
        this.#checkReceipt();

        this.#discount += amt;

        this.#checkReceipt();
    }

    /**
     * Class invariants for Receipt
     */
    #checkReceipt (){
        assert(this.#products.length > 0, "products cannot be empty.");
        assert(this.#discount >= 0, "discount must be positive.");
        assert(this.#listPrice > 0, "listPrice must be positive.");
        assert(this.#listPrice - this.#discount > 0, "total price must be positive.");
    }
}

export class EmptyCartException extends Error { }