import {assert, AssertionError} from "../../assertions";
import db from "../assets/connection.ts";

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
    static async createProduct(type: string, name: string, description: string, price: number, quantity: number): Promise<Product> {
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
     * Stores a Product belonging to a Cart to the database
     * @param product the Product to store
     * @param cartId the id of the owner Cart
     */
    static async storeForCart(product: Product, cartId: number): Promise<Product> {
        const masterResult = await db().query<{
            type: string,
        }>("SELECT * FROM product_master");

        let results = await db().query<{id: number}>(`
            INSERT INTO product(id, name, description, type, price, quantity, cart)  
            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)
            RETURNING id;
        `, [product.#name, product.#description, masterResult.rows[0].type, product.#price, product.#quantity, cartId]);

        product.#id = results.rows[0].id

        return product;
    }

    /**
     * Stores a Product belonging to a Receipt to the database
     * @param product the Product to store
     * @param receiptId the id of the owner Receipt
     */
    static async storeForReceipt(product: Product, receiptId: number): Promise<Product> {
        const masterResult = await db().query<{
            type: string,
        }>("SELECT * FROM product_master");

        let results = await db().query<{id: number}>(`
            INSERT INTO product(id, name, description, type, price, quantity, receipt)  
            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)
            RETURNING id;
        `, [product.#name, product.#description, masterResult.rows[0].type, product.#price, product.#quantity, receiptId]);

        product.#id = results.rows[0].id

        return product;
    }

    /**
     * Fetch inventory (master) table for Product
     */
    static async fetchMaster(): Promise<Product[]> {
        const masterResults = await db().query<{
            name: string;
            description: string;
            type: string;
            price: number;
        }>("SELECT * FROM product_master");

        let masterProducts: Product[] = [];
        for(let i = 0; i < masterResults.rows.length; i++) {
            let m = masterResults.rows[i];
            let product = await this.createProduct(m.type, m.name, m.description, m.price, 1)
            masterProducts.push(product);
        }
        return masterProducts;
    }

    /**
     * Fetches all Products belonging to the given Cart
     * @param cartId the owner Cart's id
     */
    static async fetchForCart(cartId: number): Promise<Product[]> {
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
        }>(`SELECT * FROM product WHERE cart = $1`, [cartId]);

        let products: Product[] = [];
        for(let i = 0; i < productResults.rows.length; i++) {
            let row = productResults.rows[i];
            let master = masterResults.rows.find(m => m.name === row.name)!;
            let p = await this.createProduct(master.type, row.name, master.description, master.price, row.quantity);

            products.push(p);

            p.#id = row.id;
        }

        return products;
    }

    /**
     * Fetches all Products belonging to the given Receipt
     * @param receptId the owner Receipt's id
     */
    static async fetchForReceipt(receptId: number): Promise<Product[]> {
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
        }>(`SELECT * FROM product WHERE receipt = $1`, [receptId]);

        let products: Product[] = [];
        for(let i = 0; i < productResults.rows.length; i++) {
            let row = productResults.rows[i];
            let master = masterResults.rows.find(m => m.name === row.name)!;
            let p = await this.createProduct(master.type, row.name, master.description, master.price, row.quantity);

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

    constructor(name: string, description: string, price: number, quantity: number) {
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

export class NonPositiveProductAmountError extends Error { };