import Product from "./product";

/**
 * RunningShoes is a type of {@link Product} sold
 * in the point-of-sale system
 */
export class RunningShoes extends Product {
    static readonly measurementUnit: string = "discrete";

    constructor(name: string, description: string, price: number, quantity: number) {
        super(name, description, price, quantity);
    }

    clone(): Product {
        return new RunningShoes(this.name, this.description, this.price, this.quantity);
    }
}
