import { assert } from "../assertions";
import Product from "./product/product";
import {Temporal} from "@js-temporal/polyfill";
import Coupon from "./coupon/coupon.ts";
import db from "./assets/connection.ts";

/**
 * The Receipt class represents the receipt information of
 * all the {@link Product} instances in the purchased {@link Cart}
 */
export default class Receipt {
    #id?: number;
    #timestamp: Temporal.PlainDateTime
    #products: Array<Product>;
    #coupons: Array<Coupon>;
    #discount: number;
    #listPrice: number;

    /**
     * Stores a Receipt for an Account to the database
     * @param receipt the Receipt to store
     * @param accountName the name of the owner Account
     */
    static async store(receipt: Receipt, accountName: string): Promise<Receipt> {
        let results = await db().query<{
            id: number,
        }>(
        `INSERT INTO receipt(id, timestamp, discount, list_price, account)
                values (DEFAULT, $1, $2, $3, $4) 
                RETURNING id`,
            [receipt.#timestamp.toString(), receipt.#discount, receipt.#listPrice, accountName]
        );

        receipt.#id = results.rows[0].id;

        receipt.#coupons.forEach(coupon=> {
            Coupon.storeForReceipt(coupon, receipt.#id!);
        });

        receipt.#products.forEach(product=> {
            Product.storeForReceipt(product, receipt.#id!);
        })

        return receipt;
    }

    /**
     * Fetches all Receipts belonging to the given Account
     * @param accountName the name of the Account to fetch the Receipts of
     */
    static async fetchForAccount(accountName: string): Promise<Receipt[]> {
        let results = await db().query<{
            id: number,
            timestamp: Temporal.PlainDateTime,
            discount: number,
            list_price: number,
            account: string
        }>(`SELECT * FROM receipt WHERE account = $1`, [accountName]);

        let receipts: Receipt[] = [];
        for(let i = 0; i < results.rows.length; i++) {
            let products = await Product.fetchForReceipt(results.rows[i].id);
            let coupons = await Coupon.fetchForReceipt(results.rows[i].id);

            let receipt = new Receipt(products, coupons);
            receipt.#timestamp = results.rows[i].timestamp;
            receipt.#listPrice = results.rows[i].list_price;
            receipt.#discount = results.rows[i].discount;
            receipt.#id = results.rows[i].id;

            receipts.push(receipt);
        }
        return receipts;
    }

    /**
     * @param products the products that a receipt already had
     * @param coupons the coupons that a receipt already had
     * @note the coupons added here will not be applied. It is assumed that the coupons
     * provided are ones that have previously been added and applied. To add a new coupon
     * or a product, use the addCoupon and addProduct methods.
     */
    constructor(products: Array<Product>, coupons: Array<Coupon>) {
        if(products.length == 0)
            throw new EmptyCartException();

        this.#timestamp = Temporal.Now.plainDateTimeISO();
        this.#products = products;
        this.#coupons = coupons;
        this.#discount = 0;
        this.#listPrice = this.#products.reduce((acc, p) => acc + (p.price * p.quantity), 0);

        this.#checkReceipt();
    }

    get products(): ReadonlyArray<Product> {
        this.#checkReceipt();
        
        return this.#products;
    }

    get coupons(): ReadonlyArray<Coupon> {
        return this.#coupons;
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
     * @param product the Product to add to the cart
     */
    addProduct(product: Product) {
        this.#checkReceipt();

        this.#products.push(product);
        this.#listPrice += (product.price * product.quantity);

        this.#checkReceipt();
    }

    /**
     * Adds a {@link Coupon} to the cart
     * @param coupon the Coupon to add to the cart
     */
    addCoupon(coupon: Coupon) {
        this.#coupons.push(coupon);

        coupon.applyCoupon(this);
    }

    /**
     * Adds a discount to the Receipt
     * @param amt the amount of discount to add
     */
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
        assert(this.#listPrice - this.#discount > 0, "total price must be positive.");
    }
}

export class EmptyCartException extends Error { }