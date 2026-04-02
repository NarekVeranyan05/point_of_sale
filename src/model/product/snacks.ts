import Product from "./product.ts";

export class Snacks extends Product {
    static readonly measurementUnit: string = "grams";

    constructor(name: string, description: string, price: number, quantity: number) {
        super(name, description, price, quantity);
    }

    clone(): Snacks {
        return new Snacks(this.name, this.description, this.price, this.quantity);
    }
}