import { assert } from "../../assertions";
import type Product from "../product/product";
import type Receipt from "../receipt";
import Coupon from "./coupon";

export default class Bogo extends Coupon {
    #reward: Product;
    #toBuy: Product;

    constructor(name: string, description: string, reward: Product, toBuy: Product) {
        super(name, description);
        this.#reward = reward;
        this.#toBuy = toBuy;
    }

    applyCoupon(receipt: Receipt): void {
        receipt.addProduct(this.#toBuy);
        receipt.addProduct(this.#reward);
        receipt.addDiscount(this.#reward.price);
    }
}