import Product from "./product";

/**
 * Tracksuit is a type of {@link Product} sold
 * in the point-of-sale system
 */
export class Tracksuit extends Product {
    static readonly measurementUnit: string = "discrete";

    constructor(name: string, description: string, price: number, quantity: number) {
        super(name, description, price, quantity);
    }

    clone(): Tracksuit {
        return new Tracksuit(this.name, this.description, this.price, this.quantity);
    }
}