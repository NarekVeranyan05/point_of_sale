import {assert, AssertionError} from "../../assertions";
import type Receipt from "../receipt.ts";
import db from "../assets/connection.ts";
import Product from "../product/product.ts";

export default abstract class Coupon {
    #id?: number;
    #name: string;
    #description: string;

    /**
     * Factory method for Coupons
     * @param type the type of Coupon to create (class name)
     * @param name the name of the Coupon
     * @param description the description of the Coupon
     * @param percentage_off the discount percentage of the Coupon
     * @param reward the reward Product of the Coupon
     * @param to_buy the Product to buy to get a reward
     */
    static async createCoupon(type: string, name: string, description: string, percentage_off?: number, reward?: Product, to_buy?: Product): Promise<Coupon> {
        const { Bogo } = await import("./bogo.ts");
        const { Discount } = await import("./discount.ts");

        switch (type) {
            case "Bogo":
                return new Bogo(name, description, reward!, to_buy!);
            case "Discount":
                return new Discount(name, description, percentage_off!);
            default:
                throw new AssertionError(`class type ${type} does not exist.`);
        }
    }

    /**
     * Stores a Coupon belonging to a Cart to the database
     * @param coupon the coupon to store
     * @param cartId the owner cart's id
     */
    static async storeForCart(coupon: Coupon, cartId: number): Promise<Coupon> {
        const masterResult = await db().query<{
            type: string,
            percentage_off: number,
            reward: string,
            reward_quantity: number,
            to_buy: string,
            buy_quantity: number
        }>("SELECT * FROM coupon_master WHERE name=$1", [coupon.name]);

        let results = await db().query<{id: number}>(`
            INSERT INTO coupon(id, type, name, description, percentage_off, reward, reward_quantity, to_buy, buy_quantity, cart)  
            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id;
        `, [
            masterResult.rows[0].type,
            coupon.name,
            coupon.description,
            masterResult.rows[0].percentage_off,
            masterResult.rows[0].reward,
            masterResult.rows[0].reward_quantity,
            masterResult.rows[0].to_buy,
            masterResult.rows[0].buy_quantity,
            cartId
        ]);

        coupon.#id = results.rows[0].id;

        return coupon;
    }

    /**
     * Stores a Receipt belonging to a Cart to the database
     * @param coupon the coupon to store
     * @param receiptId the owner receipt's id
     */
    static async storeForReceipt(coupon: Coupon, receiptId: number): Promise<Coupon> {
        const masterResult = await db().query<{
            type: string,
            percentage_off: number,
            reward: string,
            reward_quantity: number,
            to_buy: string,
            buy_quantity: number
        }>("SELECT * FROM coupon_master WHERE name=$1", [coupon.name]);

        let results = await db().query<{id: number}>(`
            INSERT INTO coupon(id, type, name, description, percentage_off, reward, reward_quantity, to_buy, buy_quantity, receipt)  
            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id;
        `, [
            masterResult.rows[0].type,
            coupon.name,
            coupon.description,
            masterResult.rows[0].percentage_off,
            masterResult.rows[0].reward,
            masterResult.rows[0].reward_quantity,
            masterResult.rows[0].to_buy,
            masterResult.rows[0].buy_quantity,
            receiptId
        ]);

        coupon.#id = results.rows[0].id;

        return coupon;
    }

    /**
     * Fetch inventory (master) table for Coupon
     */
    static async fetchMaster(): Promise<Coupon[]> {
        const masterResults = await db().query<{
            name: string;
            description: string;
            type: string;
            percentage_off: number,
            reward: string,
            reward_quantity: number,
            to_buy: string,
            buy_quantity: number
        }>("SELECT * FROM coupon_master");

        const productMasterResults = await db().query<{
            name: string;
            description: string;
            type: string;
            price: number;
        }>("SELECT * FROM product_master");

        let masterCoupons: Coupon[] = [];
        for(let i = 0; i < masterResults.rows.length; i++) {
            let row = masterResults.rows[i];

            let rewardProductMaster = productMasterResults.rows.find(p => p.name = row.reward);
            let to_buyProductMaster = productMasterResults.rows.find(p => p.name = row.to_buy);

            let rewardProduct;
            if(rewardProductMaster)
                rewardProduct = await Product.createProduct(rewardProductMaster.type, rewardProductMaster.name, rewardProductMaster.description, rewardProductMaster.price, row.reward_quantity);

            let to_buyProduct;
            if(to_buyProductMaster)
                to_buyProduct = await Product.createProduct(to_buyProductMaster.type, to_buyProductMaster.name, to_buyProductMaster.description, to_buyProductMaster.price, row.buy_quantity);

            let coupon = await this.createCoupon(
                row.type,
                row.name,
                row.description,
                row.percentage_off,
                rewardProduct,
                to_buyProduct
            );
            masterCoupons.push(coupon);
        }

        return masterCoupons;
    }

    /**
     * Fetches all Coupons belonging to the given Cart
     * @param cartId the owner Cart's id
     */
    static async fetchForCart(cartId: number): Promise<Coupon[]> {
        const productMasterResults = await db().query<{
            name: string;
            description: string;
            type: string;
            price: number;
        }>("SELECT * FROM product_master");

        const couponResults = await db().query<{
            id: number,
            type: string,
            name: string,
            description: string,
            percentage_off: number,
            reward: string,
            reward_quantity: number,
            to_buy: string,
            buy_quantity: number
        }>(`SELECT * FROM coupon WHERE cart = $1`, [cartId]);

        let coupons: Coupon[] = [];
        for(let i = 0; i < couponResults.rows.length; i++) {
            let row = couponResults.rows[i];

            let rewardProductMaster = productMasterResults.rows.find(p => p.name = row.reward);
            let toBuyProductMaster = productMasterResults.rows.find(p => p.name = row.reward);

            let rewardProduct;
            if(rewardProductMaster)
                rewardProduct = await Product.createProduct(rewardProductMaster.type, rewardProductMaster.name, rewardProductMaster.description, rewardProductMaster.price, row.reward_quantity);

            let to_buyProduct;
            if(toBuyProductMaster)
                to_buyProduct = await Product.createProduct(toBuyProductMaster.type, toBuyProductMaster.name, toBuyProductMaster.description, toBuyProductMaster.price, row.buy_quantity)

            let coupon = await this.createCoupon(
                row.type,
                row.name,
                row.description,
                row.percentage_off,
                rewardProduct,
                to_buyProduct
            );
            coupon.#id = row.id;
            coupons.push(coupon);
        }

        return coupons;
    }

    /**
     * Fetches all Coupons belonging to the given Receipt
     * @param receiptId the owner Receipt's id
     */
    static async fetchForReceipt(receiptId: number): Promise<Coupon[]> {
        const productMasterResults = await db().query<{
            name: string;
            description: string;
            type: string;
            price: number;
        }>("SELECT * FROM product_master");

        const couponResults = await db().query<{
            id: number,
            type: string,
            name: string,
            description: string,
            percentage_off: number,
            reward: string,
            reward_quantity: number,
            to_buy: string,
            buy_quantity: number
        }>(`SELECT * FROM coupon WHERE receipt = $1`, [receiptId]);

        let coupons: Coupon[] = [];
        for(let i = 0; i < couponResults.rows.length; i++) {
            let row = couponResults.rows[i];

            let rewardProductMaster = productMasterResults.rows.find(p => p.name = row.reward);
            let toBuyProductMaster = productMasterResults.rows.find(p => p.name = row.reward);

            let rewardProduct;
            if(rewardProductMaster)
                rewardProduct = await Product.createProduct(rewardProductMaster.type, rewardProductMaster.name, rewardProductMaster.description, rewardProductMaster.price, row.reward_quantity);

            let to_buyProduct;
            if(toBuyProductMaster)
                to_buyProduct = await Product.createProduct(toBuyProductMaster.type, toBuyProductMaster.name, toBuyProductMaster.description, toBuyProductMaster.price, row.buy_quantity)

            let coupon = await this.createCoupon(
                row.type,
                row.name,
                row.description,
                row.percentage_off,
                rewardProduct,
                to_buyProduct
            );
            coupon.#id = row.id;
            coupons.push(coupon);
        }

        return coupons;
    }

    /**
     * Delete Coupon from the database
     * @param couponId the id of the Coupon to delete
     */
    static async delete(couponId: number): Promise<void> {
        await db().query("DELETE FROM coupon WHERE id = $1", [couponId]);
    }

    constructor(name: string, description: string) {
        this.#name = name;
        this.#description = description;

        this.checkCoupon();
    }

    get id(): number | undefined {
        this.checkCoupon();

        return this.#id;
    }

    get name() {
        this.checkCoupon();

        return this.#name;
    }

    get description() {
        this.checkCoupon();

        return this.#description;
    }

    /**
     * Applies a coupon to the receipt
     * @param receipt
     */
    abstract applyCoupon(receipt: Receipt): void ;

    abstract clone(): Coupon;

    protected checkCoupon(): void  {
        assert(this.#name.length > 0, "name should be empty.");
        assert(this.#description.length > 0, "description should be empty.");
    }
}