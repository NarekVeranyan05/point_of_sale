import { assert } from "../../assertions";
import db from "../connection";
import ProductView from "../../view/product/product-view.ts";
import type Account from "../account.ts";

type ProductType = {
    name: string,
    description: string,
    type: string,
    price: number
}

/**
 * The Product class represents an item that can be added to a {@link Cart} 
 * to purchase later.
 */
export default abstract class Product {
    #account?: Account;
    #name: string;
    #description: string;
    #price: number;
    #quantity: number;

    static async fetchProductMaster(): Promise<Product[]> {
        const productResults = await db().query<ProductType>("SELECT * FROM productmaster");

        const { RunningShoes } = await import("./running-shoes.ts");
        const { Tracksuit } = await import("./tracksuit.ts");

        return productResults.rows.map<Product>(pType => eval(`new ${pType.type}("${pType.name}", "${pType.description}", ${pType.price}, 1)`));
    }

    static async fetchProducts(accountName: string): Promise<Product[]> {
        const productResults = await db().query<Product>(`SELECT * FROM product WHERE account = '${accountName}'`);

        return productResults.rows;
    }

    constructor(name: string, description: string, price: number, quantity: number, account?: Account) {
        this.#name = name
        this.#description = description;
        this.#price = price;
        this.#quantity = quantity;
        this.#account = account;

        this.#checkProduct();
    }

    get name() {
        this.#checkProduct();
        
        return this.#name;
    }

    get description() {
        this.#checkProduct();

        return this.#description;
    }

    get price() {
        this.#checkProduct();
        
        return this.#price;
    }

    get quantity() {
        this.#checkProduct();

        return this.#quantity;
    }

    set quantity(quantity: number) {
        this.#checkProduct();

        this.#quantity = quantity;
    }

    abstract clone(): Product;

    /**
     * Class invariants for Product
     */
    #checkProduct() {
        assert(this.#name.length > 0, "name cannot be empty.")
        assert(this.#price > 0, "price must be positive.");
        assert(this.#quantity > 0, "quantity must be positive.");
    }
}