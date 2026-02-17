import { assert } from "../assertions";
import type Product from "./product/product";

/**
 * The Receipt class represents the receipt information of
 * all the {@link Product} instances in the purchased {@link Cart}
 */
export default class Receipt {
    #products: Map<Product, number>;
    #discount: number;
    #listPrice: number;

    constructor(products: Map<Product, number>) {
        if(products.size == 0)
            throw new EmptyCartException();
        
        this.#products = products;
        this.#discount = 0;
        this.#listPrice = [...this.#products].reduce(
            (acc, p) => acc + (p[0].price * p[1]), 0);

        this.#checkReceipt();
    }

    get products(): ReadonlyMap<Product, number> {
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
     * @param amt the quantity of how much to add
     */
    addProduct(product: Product, amt: number) {
        this.#products.set(product, amt);
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
        assert(this.#products.size > 0, "products cannot be empty.");
        assert(this.#discount >= 0, "discount must be positive.");
        assert(this.#listPrice > 0, "listPrice must be positive.");
        assert(this.#listPrice - this.#discount > 0, "total price must be positive.");
    }
}

export class EmptyCartException extends Error { }