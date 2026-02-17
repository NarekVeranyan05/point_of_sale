import { assert } from "../../assertions";
import db from "../connection";

type ProductType = {
    name: string, 
    type: string,
    price: string
}

/**
 * The Product class represents an item that can be added to a {@link Cart} 
 * to purchase later.
 */
export default abstract class Product {
    #name: string
    #price: number;

    constructor(name: string, price: number) {
        this.#name = name;
        this.#price = price;

        this.#checkProduct();
    }

    static async getAllProducts(): Promise<Array<Product>> {
        const result = await db().query<ProductType>("SELECT * FROM productMaster");

        const { RunningShoes } = await import("./running-shoes.ts");
        const { Tracksuit } = await import("./tracksuit.ts");

        const products: Array<Product> = result.rows.map(row => {
            return eval(`new ${row.type}(row.name, row.price)`);
        });

        return products;
    }

    get name() {
        this.#checkProduct();
        
        return this.#name;
    }

    get price() {
        this.#checkProduct();
        
        return this.#price;
    }

    /**
     * Class invariants for Product
     */
    #checkProduct() {
        assert(this.#name.length > 0, "name cannot be empty.")
        assert(this.#price > 0, "price must be positive.");
    }
}