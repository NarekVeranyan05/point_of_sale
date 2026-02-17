import Product from "./product";

/**
 * Tracksuit is a type of {@link Product} sold
 * in the point-of-sale system
 */
export class Tracksuit extends Product {
    constructor(name: string, price: number) {
        super(name, price);
    }
}