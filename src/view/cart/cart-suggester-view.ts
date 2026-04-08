import type CartController from "../../controller/cart-controller";
import type Listener from "../../listener";
import type Cart from "../../model/cart";
import { Tracksuit } from "../../model/product/tracksuit.ts";
import {Shoes} from "../../model/product/shoes.ts";
import {Snacks} from "../../model/product/snacks.ts";

/**
 * The CartSuggesterView displays a button suggesting to auto-buy products
 */
export default class CartSuggesterView implements Listener {
    #cart: Cart;
    #controller: CartController;

    constructor(cart: Cart, controller: CartController) {
        this.#cart = cart;
        this.#controller = controller;
        this.#cart.registerListener(this);

        // creating the button div
        this.appendButton();
    }

    appendButton(): void {
        let suggestButton = document.createElement("button");
        suggestButton.id = "suggest-button";
        suggestButton.className = "button";
        suggestButton.innerHTML = "Turn on Auto-buy"

        document.querySelector('#cart-panel')!.prepend(suggestButton);
        document.querySelector('#suggest-button')!.addEventListener("click", () => {
            this.#controller.showCartSuggesterDialogView();
        })
    }

    notify() {
    }

}