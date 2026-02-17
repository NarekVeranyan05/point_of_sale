import { assert } from "../../assertions";
import type Product from "../product/product";
import type Receipt from "../receipt";
import type Coupon from "./coupon";

export default class Bogo implements Coupon {
    #reward: Product;
    #amt: number;

    constructor(reward: Product, amt: number) {
        this.#reward = reward;
        this.#amt = amt;

        this.#checkBogo();
    }

    applyCoupon(receipt: Receipt): void {
        this.#checkBogo();

        receipt.addProduct(this.#reward, this.#amt);

        this.#checkBogo();
    }

    #checkBogo() {
        assert(this.#amt > 0, "amount must be positive.");
    }
}