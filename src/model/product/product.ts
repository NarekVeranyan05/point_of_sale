import {assert, AssertionError} from "../../assertions";
import db from "../assets/connection.ts";
import type {StorageType} from "../assets/markov-model/storage-type.ts";

/**
 * The Product class represents an item that can be added to a {@link Cart} 
 * to purchase later.
 */
export default abstract class Product {
    static readonly measurementUnit: string = "discrete units";

    #id?: number;
    #name: string;
    #description: string;
    #price: number;
    #quantity: number;
    
    /**
     * Factory method for creating a Product
     * @param type the type of the Product (class name)
     * @param name the name of the Product
     * @param description the description of the Product
     * @param price the price (cost) of the Product
     * @param quantity the amount of Product to create
     */
    static async create(type: string, name: string, description: string, price: number, quantity: number): Promise<Product> {
        const { Shoes } = await import("./shoes.ts");
        const { Snacks } = await import("./snacks.ts")
        const { Tracksuit } = await import("./tracksuit.ts");

        switch (type) {
            case "Shoes":
                return new Shoes(name, description, price, quantity);
            case "Snacks":
                return new Snacks(name, description, price, quantity);
            case "Tracksuit":
                return new Tracksuit(name, description, price, quantity);
            default:
                throw new AssertionError(`class type ${type} does not exist.`);
        }
    }

    /**
     * Stores a Product belonging to a container class to the database
     * @param product the Product to store
     * @param storage the container to store the Product for (either Cart or Receipt)
     * @param id the id of the storage
     */
    static async store(product: Product, storage: StorageType, id: number): Promise<Product> {
        let results = await db().query<{id: number}>(`
            INSERT INTO product(id, name, description, type, price, quantity, ${storage})  
            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)
            RETURNING id;
        `, [
            product.#name,
            product.#description,
            product.constructor.name,
            product.#price,
            product.#quantity,
            id
        ]);

        product.#id = results.rows[0].id

        return product;
    }

    /**
     * Fetch inventory (master) table for Product
     */
    static async fetchInventory(): Promise<Product[]> {
        const masterResults = await db().query<{
            name: string;
            description: string;
            type: string;
            price: number;
        }>("SELECT * FROM product_master");

        let masterProducts: Product[] = [];
        for(let i = 0; i < masterResults.rows.length; i++) {
            let m = masterResults.rows[i];
            let product = await this.create(m.type, m.name, m.description, m.price, 1)
            masterProducts.push(product);
        }
        return masterProducts;
    }

    /**
     * Fetches all Products belonging to a container class
     * @param storage the container to fetch the Products from (either Cart or Receipt)
     * @param id the container id
     */
    static async fetch(storage: StorageType, id: number): Promise<Product[]> {
        const masterResults = await db().query<{
            name: string,
            description: string,
            type: string,
            price: number
        }>("SELECT * FROM product_master");

        const productResults = await db().query<{
            id: number,
            name: string,
            quantity: number,
            cart: number,
            receipt: number
        }>(`SELECT * FROM product WHERE ${storage} = $1`, [id]);

        let products: Product[] = [];
        for(let i = 0; i < productResults.rows.length; i++) {
            let row = productResults.rows[i];
            let master = masterResults.rows.find(m => m.name === row.name)!;
            let p = await this.create(master.type, row.name, master.description, master.price, row.quantity);

            products.push(p);

            p.#id = row.id;
        }

        return products;
    }

    /**
     * Delete Product from the database
     * @param productId the id of the Product to delete
     */
    static async delete(productId: number): Promise<void> {
        await db().query("DELETE FROM product WHERE id = $1", [productId]);
    }

    protected constructor(name: string, description: string, price: number, quantity: number) {
        this.#name = name
        this.#description = description;
        this.#price = price;
        this.#quantity = quantity;

        this.#checkProduct();
    }

    get id(): number | undefined {
        this.#checkProduct();

        return this.#id;
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
        if(quantity <= 0)
            throw new NonPositiveProductAmountError();

        this.#checkProduct();

        this.#quantity = quantity;

        this.#checkProduct();
    }

    abstract clone(): Product;

    /**
     * Class invariants for Product
     */
    #checkProduct() {
        assert(this.#name.length > 0, "name cannot be empty.")
        assert(this.#description.length > 0, "description cannot be empty.");
        assert(this.#price > 0, "price must be positive.");
        assert(this.#quantity > 0, "quantity must be positive.");
    }
}

export class NonPositiveProductAmountError extends Error { }
