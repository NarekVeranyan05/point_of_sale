import Product from "./product";

/**
 * RunningShoes is a type of {@link Product} sold
 * in the point-of-sale system
 */
export class RunningShoes extends Product {
    constructor(name: string, price: number) {
        super(name, price);
    }
}
