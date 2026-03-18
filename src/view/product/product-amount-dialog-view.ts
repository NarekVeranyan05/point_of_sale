import type CartController from "../../controller/cart-controller";
import type Product from "../../model/product/product";
import {Measurements} from "../../model/product/measurements.ts";
import { Tracksuit } from "../../model/product/tracksuit.ts";
import {RunningShoes} from "../../model/product/running-shoes.ts";
import {SunflowerSeed} from "../../model/product/sunflower-seed.ts";


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
            <input type="number" id="product-amount" placeholder="Enter in ${Measurements.units.get(product.constructor.name)}"/>    
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
        this.#dialog.querySelector("button")!.addEventListener("click", async () => {
            const amt = this.#dialog.querySelector("input")!.valueAsNumber;

            await this.#controller.addProduct(this.#product, amt);
        });
    }
}