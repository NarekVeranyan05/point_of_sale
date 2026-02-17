import type CartController from "../../controller/cart-controller";
import type Product from "../../model/product/product";

export default class ProductAmountDialogView {
    #product: Product;
    #controller: CartController;
    #dialog: HTMLDialogElement

    constructor(product: Product, controller: CartController) {
        this.#product = product;
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.className = "product-amount-dialog"
        this.#dialog.innerHTML = `
            <input type="number" id="product-amount"></input>    
            <button class="button">Add</button>
        `;

        document.querySelector("#app")!.appendChild(this.#dialog);
        this.#linkButton();

        this.#dialog.show();
    }

    close() {
        document.querySelector("#app")!.removeChild(this.#dialog);
    }

    #linkButton() {
        this.#dialog.querySelector("button")!.addEventListener("click", () => {
            const amt = this.#dialog.querySelector("input")!.valueAsNumber;
            this.#controller.addProduct(this.#product, amt);
        });
    }
}