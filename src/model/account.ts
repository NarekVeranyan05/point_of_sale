import { assert } from "../assertions";
import Cart from "./cart"
import db from "./connection";
import type Receipt from "./receipt"

export default class Account {
    #name: string;
    #cart: Cart;
    #receipts: Array<Receipt>;

    static async login(accountName: string, password: string): Promise<Account> {
        // checking if account exists
        const accountRes = await db().query<{exists: boolean}>(`select exists (select 1 from Account where name='${accountName}' and password='${password}')`);

        if(!accountRes.rows[0].exists)
            throw new AccountDoesNotExistError();

        return new Account(accountName, new Cart());
    }

    static async signup(accountName: string, password: string): Promise<Account> {
        // checking if account exists
        const accountRes = await db().query<{exists: boolean}>(`select exists( select 1 from Account where name='${accountName}' and password='${password}')`);

        if(accountRes.rows[0].exists)
            throw new AccountAlreadyExistsError();

        await db().query(`insert into Account (name, password) values (${accountName}, ${password})`);

        return new Account(accountName, new Cart());
    }

    constructor(name: string, cart: Cart) {
        this.#name = name;
        this.#cart = cart;
        this.#receipts = new Array<Receipt>();

        this.#checkAccount();
    }

    get cart(): Cart {
        return this.#cart;
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

export class AccountDoesNotExistError extends Error { };
export class AccountAlreadyExistsError extends Error { };