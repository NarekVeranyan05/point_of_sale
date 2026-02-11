import { assert } from "../assertions";
import type Product from "./product";

/**
 * The Receipt class represents an the receipt information of
 * all the {@link Product} instances in the purchased {@link Cart}
 */
export default class Receipt {
    #products: Array<Product>;
    #totalPrice: number;

    constructor(products: Array<Product>) {
        if(products.length == 0)
            throw new EmptyCartException();
        
        this.#products = products;
        this.#totalPrice = this.#products.reduce(
            (accumulator, p) => accumulator + p.price, 0); // computing total price

        this.#checkReceipt();
    }

    get products(): ReadonlyArray<Product> {
        return this.#products;
    }

    get totalPrice(): number {
        return this.#totalPrice;
    }

    /**
     * Class invariants for Receipt
     */
    #checkReceipt (){
        assert(this.#products.length > 0, "products cannot be empty.");
        assert(this.#totalPrice > 0, "totalPrice must be positive.");
    }
}

export class EmptyCartException extends Error { }