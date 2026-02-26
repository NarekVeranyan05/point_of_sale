import type AccountController from "../controller/account-controller";
import type CartController from "../controller/cart-controller.ts";
import ErrorView from "./error-view.ts";

export default class LoginView {
    #accountController: AccountController;
    #loginDialog: HTMLDialogElement;

    constructor(accountController: AccountController) {
        this.#accountController = accountController;

        this.#loginDialog = document.createElement("dialog");
        this.#loginDialog.id = "login-dialog";
        this.#loginDialog.innerHTML = `
            <div id="login-inputs">
                <input type="text" id="login-name" placeholder="Account name"/>
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

    #linkButtons() {
        this.#loginDialog.querySelector("#login-button")!.addEventListener("click", async () => {
            const accountName = this.#loginDialog.querySelector<HTMLInputElement>("#login-name")!.value;
            const password = this.#loginDialog.querySelector<HTMLInputElement>("#login-password")!.value;
            try{
                await this.#accountController.login(accountName, password);
            } catch(e) {
                new ErrorView(`Error: Account with name ${accountName} does not exist. Create such an account.`);
            }
        });

        this.#loginDialog.querySelector("#signup-button")!.addEventListener("click", async () => {
            const accountName = this.#loginDialog.querySelector<HTMLInputElement>("#login-name")!.value;
            const password = this.#loginDialog.querySelector<HTMLInputElement>("#login-password")!.value;
            try{
                await this.#accountController.signup(accountName, password);
            } catch(e) {
                new ErrorView(`Error: Account with name ${accountName} does not exist. Create such an account.`);
            }
        });
    }

    close() {
        document.querySelector("main")!.removeChild(this.#loginDialog);
    }
}