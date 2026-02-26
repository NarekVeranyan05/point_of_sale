import { assert } from "../../assertions";
import type Receipt from "../receipt.ts";
import db from "../connection.ts";

export default abstract class Coupon {
    #name: string;
    #description: string;

    static async fetchCoupons(accountName: string): Promise<Coupon[]> {
        const couponResults = await db().query<Coupon>(`SELECT * FROM coupon WHERE account = '${accountName}'`);

        return couponResults.rows;
    }

    constructor(name: string, description: string) {
        this.#name = name;
        this.#description = description;

        this.checkCoupon();
    }

    abstract applyCoupon(receipt: Receipt): void ;

    protected checkCoupon(): void  {
        assert(this.#name.length > 0, "name should be empty.");
        assert(this.#description.length > 0, "description should be empty.");
    }
}