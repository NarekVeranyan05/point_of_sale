import { assert } from "../../assertions";
import type Receipt from "../receipt";
import type Coupon from "./coupon";

export default class Discount implements Coupon {
    #amountOff: number;

    constructor(amountOff: number) {
        this.#amountOff = amountOff;

        this.#checkDiscount();
    }

    applyCoupon(receipt: Receipt): void {
        this.#checkDiscount();

        receipt.addDiscount(this.#amountOff);

        this.#checkDiscount();
    }

    #checkDiscount() {
        assert(this.#amountOff > 0, "amountOff must be positive");
    }
}