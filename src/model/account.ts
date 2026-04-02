import { assert } from "../assertions";
import Cart from "./cart"
import db from "./assets/connection.ts";
import Receipt from "./receipt"
import { hash, generateSalt } from "./assets/hasher.ts";

export default class Account {
    #name: string;
    #cart: Cart;
    #receipts: Array<Receipt>;

    /**
     * Logs into an existing Account in the system
     * @param accountName the name of the Account to log in to
     * @param password the password for that Account
     */
    static async login(accountName: string, password: string): Promise<Account> {
        const saltRes = await db().query<{
            salt: string
        }>(
            "SELECT * FROM Account WHERE name=$1", [accountName]
        );

        if(saltRes.rows.length === 0)
            throw new IncorrectAccountNameOrPasswordError();

        // @ts-ignore
        const hashed = await hash(password, Uint8Array.fromHex(saltRes.rows[0].salt));

        const accountRes = await db().query<{
            exists: boolean
        }>(
            "SELECT EXISTS (SELECT 1 FROM Account WHERE name=$1 AND password=$2)",
            [accountName, hashed]
        );

        if(!accountRes.rows[0].exists)
            throw new IncorrectAccountNameOrPasswordError();

        let account = new Account(accountName, await Cart.fetchCartForAccount(accountName));
        account.#receipts = await Receipt.fetchForAccount(accountName);

        return account;
    }

    /**
     * Signs up for a new Account in the system
     * @param accountName the name of the new Account to add to the database
     * @param password the password of the new Account to add to the database
     */
    static async signup(accountName: string, password: string): Promise<Account> {
        if(password.length == 0 || accountName.length == 0)
            throw new EmptyNameOrPasswordError();

        // checking if account exists
        const accountRes = await db().query<{
            exists: boolean
        }>(
            "SELECT EXISTS (SELECT 1 FROM Account WHERE name=$1)",
            [accountName]
        );

        if(accountRes.rows[0].exists)
            throw new AccountAlreadyExistsError();

        const salt = generateSalt();
        const hashed = await hash(password, salt);

        await db().query(
            "INSERT INTO Account (name, password, salt) VALUES ($1, $2, $3)",
            // @ts-ignore
            [accountName, hashed, salt.toHex()]
        );

        let results = await db().query<{
            id: number
        }>(
            "INSERT INTO Cart (id, account) VALUES (default, $1) RETURNING id",
            [accountName]
        );

        let cart  = new Cart();
        cart.id = results.rows[0].id;

        let account = new Account(accountName, cart);
        account.#receipts = await Receipt.fetchForAccount(accountName);

        return account;
    }

    constructor(name: string, cart: Cart) {
        this.#name = name;
        this.#cart = cart;
        this.#receipts = new Array<Receipt>();

        this.#checkAccount();
    }

    get name() {
        this.#checkAccount();

        return this.#name;
    }

    get cart(): Cart {
        this.#checkAccount();

        return this.#cart;
    }

    get receipts(): ReadonlyArray<Receipt> {
        return this.#receipts;
    }

    /**
     * Adds a receipt to the Account
     * @param receipt the receipt to add
     */
    async addReceipt(receipt: Receipt) {
        this.#checkAccount();

        this.#receipts.push(receipt);
        await Receipt.store(receipt, this.#name);

        this.#checkAccount();
    }

    #checkAccount() {
        assert(this.#name.length > 0, "name cannot be empty");
    }
}

export class IncorrectAccountNameOrPasswordError extends Error { }
export class AccountAlreadyExistsError extends Error { }
export class EmptyNameOrPasswordError extends Error { }