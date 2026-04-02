import { assert } from "../../assertions";
import type Receipt from "../receipt";
import Coupon from "./coupon";

export class Discount extends Coupon {
    percentageOff: number;

    constructor(name: string, description: string, percentageOff: number) {
        super(name, description);
        this.percentageOff = percentageOff;

        this.#checkDiscount();
    }

    /**
     * Applies a discount to the receipt
     * @param receipt
     */
    applyCoupon(receipt: Receipt): void {
        this.checkCoupon();
        this.#checkDiscount();

        receipt.addDiscount(Math.floor(receipt.listPrice * this.percentageOff / 100));

        this.checkCoupon();
        this.#checkDiscount();
    }

    #checkDiscount() {
        assert(this.percentageOff > 0, "percentageOff must be positive");
        assert(this.percentageOff < 100, "percentageOff must be less than 100");
    }

    clone(): Discount {
        return new Discount(this.name, this.description, this.percentageOff);
    }
}