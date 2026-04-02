import Product from "./product";

/**
 * Shoes is a type of {@link Product} sold
 * in the point-of-sale system
 */
export class Shoes extends Product {
    constructor(name: string, description: string, price: number, quantity: number) {
        super(name, description, price, quantity);
    }

    clone(): Product {
        return new Shoes(this.name, this.description, this.price, this.quantity);
    }
}
