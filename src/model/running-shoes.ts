import Product from "./product";

/**
 * RunningShoes is a type of {@link Product} sold
 * in the point-of-sale system
 */
export default class RunningShoes extends Product {
    constructor(price: number) {
        super(price);
    }
}