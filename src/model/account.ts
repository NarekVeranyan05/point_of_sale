import { assert } from "../assertions";
import type Cart from "./cart"
import type Receipt from "./receipt"

export default class Account {
    #name: string;
    #cart: Cart;
    #receipts: Array<Receipt>;

    constructor(name: string, cart: Cart) {
        this.#name = name;
        this.#cart = cart;
        this.#receipts = new Array<Receipt>();

        this.#checkAccount();
    }

    addReceipt(receipt: Receipt) {
        this.#checkAccount();

        this.#receipts.push(receipt);

        this.#checkAccount();
    }

    #checkAccount() {
        assert(this.#name.length > 0, "name cannot be empty");
    }
}