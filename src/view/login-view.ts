import type AccountController from "../controller/account-controller";
import type CartController from "../controller/cart-controller";
import type ProductController from "../controller/product-controller";

export default class LoginView {
    #accountController: AccountController;
    #cartController: CartController;
    #productControllers: Array<ProductController>;
    #loginDialog: HTMLDialogElement;

    constructor(accountController: AccountController, cartController: CartController, productControllers: Array<ProductController>) {
        this.#accountController = accountController;
        this.#cartController = cartController;
        this.#productControllers = productControllers;

        this.#loginDialog = document.createElement("dialog");
        this.#loginDialog.id = "login-dialog";
        this.#loginDialog.innerHTML = `
            <input type="text" id="login-name" placeholder="Account name"></input>    
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
        this.#loginDialog.querySelector("#login-button")!.addEventListener("click", () => {
            const amt = this.#loginDialog.querySelector("input")!.value;
            try{
                this.#accountController.login(amt);
                this.#cartController.showCartBadgeView();
                this.#cartController.showCartPanelView();
                this.#productControllers.forEach(c => c.showProductView());
            } catch(e) {
                // fixme
            }
        })
    }
}