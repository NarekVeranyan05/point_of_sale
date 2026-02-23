import { assert } from "../../assertions";
import type Product from "../product/product";
import type Receipt from "../receipt";
import type Coupon from "./coupon";

export default class Bogo implements Coupon {
    #reward: Product;
    #amount: number;

    constructor(reward: Product, amount: number) {
        this.#reward = reward;
        this.#amount = amount;

        this.#checkBogo();
    }

    applyCoupon(receipt: Receipt): void {
        this.#checkBogo();

        receipt.addProduct(this.#reward, this.#amount);

        this.#checkBogo();
    }

    #checkBogo() {
        assert(this.#amount > 0, "amount must be positive.");
    }
}