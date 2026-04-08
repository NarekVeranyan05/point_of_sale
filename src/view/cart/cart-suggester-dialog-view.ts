import type CartController from "../../controller/cart-controller";
import type Product from "../../model/product/product";
import {Measurements} from "../../model/product/measurements.ts";
import { Tracksuit } from "../../model/product/tracksuit.ts";
import {Shoes} from "../../model/product/shoes.ts";
import {Snacks} from "../../model/product/snacks.ts";

/**
 * The ProductAmountDialogView prompts the user to enter the amount (quantity)
 * of a selected Product to add to Cart
 */
export default class CartSuggesterDialogView {
    #controller: CartController;
    #dialog: HTMLDialogElement

    constructor(controller: CartController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.className = "suggester-money-amount-dialog"
        this.#dialog.innerHTML = `
            <p>Enter how much money to spend on auto-buy</p>
            <div id="suggester-money-amount-input-box">
                <input type="number" id="suggester-amount" placeholder="CAD"/>    
                <button class="button">Auto-buy</button>
            </div>
        `;

        document.querySelector("#app")!.appendChild(this.#dialog);
        this.#linkButton();

        this.#dialog.show();
    }

    close() {
        document.querySelector("#app")!.removeChild(this.#dialog);
    }

    /**
     * Links the button added to the document
     * to the appropriate controller methods
     */
    #linkButton() {
        this.#dialog.querySelector("button")!.addEventListener("click", async () => {
            const amt = this.#dialog.querySelector("input")!.valueAsNumber;

            this.#controller.autoBuy(amt);
        });
    }
}