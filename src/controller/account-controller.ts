import Account from "../model/account";
import LoginView from "../view/login-view";
import CartController from "./cart-controller";
import Cart from "../model/cart.ts";

export default class AccountController {
    #account?: Account;
    #cartController?: CartController
    #loginView: LoginView

    constructor() {
        this.#loginView = new LoginView(this);
    }

    set account(account: Account) {
        this.#account = account;
    }

    async login(accountName: string, password: string) {
        this.#account = await Account.login(accountName, password);
        this.#cartController = new CartController(await Cart.fetchCart(accountName));

        this.#loginView.close();
    }

    async signup(accountName: string, password: string) {
        this.#account = await Account.signup(accountName, password);
        this.#cartController = new CartController(await Cart.fetchCart(accountName));

        this.#loginView.close();
    }
}