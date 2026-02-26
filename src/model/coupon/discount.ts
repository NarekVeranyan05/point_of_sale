import { assert } from "../../assertions";
import type Receipt from "../receipt";
import Coupon from "./coupon";

export default class Discount extends Coupon {
    #amountOff: number;

    constructor(name: string, description: string, amountOff: number) {
        super(name, description);
        this.#amountOff = amountOff;

        this.#checkDiscount();
    }

    applyCoupon(receipt: Receipt): void {
        this.checkCoupon();
        this.#checkDiscount();

        receipt.addDiscount(this.#amountOff);

        this.checkCoupon();
        this.#checkDiscount();
    }

    #checkDiscount() {
        assert(this.#amountOff > 0, "amountOff must be positive");
    }
}