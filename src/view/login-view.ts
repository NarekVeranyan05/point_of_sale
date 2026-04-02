import type AccountController from "../controller/account-controller";
import type CartController from "../controller/cart-controller.ts";
import ErrorView from "./error-view.ts";

/**
 * The LoginView prompts the user to enter an account name and password
 * to either log in to or to sign up for.
 */
export default class LoginView {
    #accountController: AccountController;
    #loginDialog: HTMLDialogElement;

    constructor(accountController: AccountController) {
        this.#accountController = accountController;

        this.#loginDialog = document.createElement("dialog");
        this.#loginDialog.id = "login-dialog";
        this.#loginDialog.innerHTML = `
            <h2>Log in or Sign up to continue</h2>
            <div id="login-inputs">
                <input type="text" id="login-name" placeholder="Account name" autofocus/>
                <input type="text" id="login-password" placeholder="Password"/>
            </div>
            <div id="login-signup">
                <button class="button" id="login-button">Log in</button>
                <p>or</p>
                <button class="button" id="signup-button">Sign up</button>
            </div>
        `;
        this.#loginDialog.show();

        document.querySelector("main")!.appendChild(this.#loginDialog);

        this.#linkButtons();
    }

    /**
     * Links the button added to the document
     * to the appropriate controller methods
     */
    #linkButtons() {
        this.#loginDialog.querySelector("#login-button")!.addEventListener("click", async () => {
            const accountName = this.#loginDialog.querySelector<HTMLInputElement>("#login-name")!.value;
            const password = this.#loginDialog.querySelector<HTMLInputElement>("#login-password")!.value;

            this.#loginDialog.querySelector("#login-button")!.setAttribute("disabled", "true");

            await this.#accountController.login(accountName, password);

            this.#loginDialog.querySelector("#login-button")!.removeAttribute("disabled");
        });

        this.#loginDialog.querySelector("#signup-button")!.addEventListener("click", async () => {
            const accountName = this.#loginDialog.querySelector<HTMLInputElement>("#login-name")!.value;
            const password = this.#loginDialog.querySelector<HTMLInputElement>("#login-password")!.value;

            this.#loginDialog.querySelector("#signup-button")!.setAttribute("disabled", "");

            await this.#accountController.signup(accountName, password);

            this.#loginDialog.querySelector("#signup-button")!.removeAttribute("disabled");
        });
    }

    /**
     * Enables the login and signup buttons on the screen
     */
    enableButtons(): void {
        this.#loginDialog.querySelector("#login-button")!.removeAttribute("disabled");
        this.#loginDialog.querySelector("#signup-button")!.removeAttribute("disabled");
    }

    close() {
        document.querySelector("main")!.removeChild(this.#loginDialog);
    }
}