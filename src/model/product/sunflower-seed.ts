import Product from "./product.ts";

export class SunflowerSeed extends Product {
    static readonly measurementUnit: string = "grams";

    constructor(name: string, description: string, price: number, quantity: number) {
        super(name, description, price, quantity);
    }

    clone(): SunflowerSeed {
        return new SunflowerSeed(this.name, this.description, this.price, this.quantity);
    }
}