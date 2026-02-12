import { assert } from "../assertions";
import {} from "../../public/tracksuit.png"

/**
 * The Product class represents an item that can be added to a {@link Cart} 
 * to purchase later.
 */
export default abstract class Product {
    #price: number;

    constructor(price: number) {
        this.#price = price;

        this.#checkProduct();
    }

    get price() {
        this.#checkProduct();
        
        return this.#price;
    }

    /**
     * Class invariants for Product
     */
    #checkProduct() {
        assert(this.#price > 0, "price must be positive.");
    }
}