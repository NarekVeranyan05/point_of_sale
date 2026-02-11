import Product from "./product";

/**
 * Tracksuit is a type of {@link Product} sold
 * in the point-of-sale system
 */
export default class Tracksuit extends Product {
    constructor(price: number) {
        super(price);
    }
}