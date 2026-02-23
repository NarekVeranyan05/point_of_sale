import { assert } from "../assertions";
import type Cart from "./cart"
import db from "./connection";
import type Receipt from "./receipt"

export default class Account {
    #name: string;
    #cart: Cart;
    #receipts: Array<Receipt>;

    static async login(accountName: string): Account {
        const accountRes = await db().query<{name: string}>(`select * from Account where name='${accountName}'`);
        
        return new Account(accountRes.rows[0].name);
    }

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