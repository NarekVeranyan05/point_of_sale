import Account from "../model/account";
import LoginView from "../view/login-view";
import type CartController from "./cart-controller";
import type ProductController from "./product-controller";

export default class AccountController {
    #account?: Account;
    #loginView: LoginView

    constructor(cartController: CartController, productControllers: Array<ProductController>) {
        this.#loginView = new LoginView(this, cartController, productControllers);
    }

    login(accountName: string) {
        this.#account = Account.login(accountName);
    }
}