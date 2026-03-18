import type Product from "../product/product";
import type Receipt from "../receipt";
import Coupon from "./coupon";

/**
 * Bogo is a type of {@link Coupon} offerred to customers
 * in the point-of-sale system
 */
export class Bogo extends Coupon {
    #reward: Product;
    #toBuy: Product;

    constructor(name: string, description: string, reward: Product, toBuy: Product) {
        super(name, description);
        this.#reward = reward;
        this.#toBuy = toBuy;

        this.checkCoupon();
    }

    /**
     * Adds a new paid product to the receipt
     * And a reward product of no price
     * The price of the reward product is removed as a discount
     * @param receipt the receipt to add the reward to
     */
    applyCoupon(receipt: Receipt): void {
        this.checkCoupon();

        receipt.addProduct(this.#toBuy);
        receipt.addProduct(this.#reward);
        receipt.addDiscount(this.#reward.price);

        this.checkCoupon();
    }

    clone(): Bogo {
        return new Bogo(this.name, this.description, this.#reward, this.#toBuy);
    }
}