import Account, {
    AccountAlreadyExistsError,
    EmptyNameOrPasswordError,
    IncorrectAccountNameOrPasswordError
} from "../model/account";
import LoginView from "../view/login-view";
import CartController from "./cart-controller";
import ErrorView from "../view/error-view.ts";
import Receipt from "../model/receipt.ts";

/**
 * AccountController is the controller for the {@link Account} model class.
 */
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

    /**
     * Logins to an existing account in the system
     * @param accountName the name of the account to log in to
     * @param password the password of the existing account. If the password is incorrect,
     * views an error
     */
    async login(accountName: string, password: string) {
        try {
            this.#account = await Account.login(accountName, password);
            this.#cartController = new CartController(this, this.#account.cart);

            this.#loginView.close();
        } catch (e) {
            this.#loginView.enableButtons();

            if(e instanceof IncorrectAccountNameOrPasswordError)
               new ErrorView(`Error: Incorrect account name or password. Please, try again.`);
        }
    }

    /**
     * Creates a new account in the system
     * @param accountName the name of the account to create
     * @param password the password of the new account
     * @note if the account name already exists, views an error
     */
    async signup(accountName: string, password: string) {
        try {
            this.#account = await Account.signup(accountName, password);
            this.#cartController = new CartController(this, this.#account.cart);

            this.#loginView.close();
        } catch (e) {
            this.#loginView.enableButtons();

            if(e instanceof AccountAlreadyExistsError)
                new ErrorView(`Error: Account with name ${accountName} already exists. Pick another name or choose to log in to that account.`);
            else if(e instanceof EmptyNameOrPasswordError)
                new ErrorView("Error: cannot provide an empty account name or password. Please, try again.");
        }
    }

    /**
     * Adds a receipt to the account logged into the system
     * @param receipt the receipt to add to the current account
     */
    async addReceipt(receipt: Receipt) {
        await this.#account!.addReceipt(receipt)
    }
}