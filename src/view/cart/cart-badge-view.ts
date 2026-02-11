import type CartController from "../../controller/cart-controller";
import type Listener from "../../listener";
import type Cart from "../../model/cart";

/**
 * The CartBadgeView presents the {@link Cart} checkout button and the 
 * count of the number of items in the Cart to UI.
 * The count is also a button that opens a side-panel
 */
export default class CartBadgeView implements Listener {
    #cart: Cart;
    #controller: CartController
    #cartEl: HTMLButtonElement

    constructor(cart: Cart, controller: CartController) {   
        this.#cart = cart;
        this.#controller = controller;
        this.#cart.registerListener(this);

        // adding the cart counter button to the document
        document.querySelector<HTMLDivElement>("#header")!.innerHTML = `
            <button class='button' id='cart-counter'>Cart: ${this.#cart.products.length}</button>
            <button class='button' id='checkout-button'>Checkout</button>`;

        this.#cartEl = document.querySelector<HTMLButtonElement>("#cart-counter")!;

        this.#linkButtons();
    }

    notify() {
        // updates the count for the number of items in the cart
        this.#cartEl.textContent = `Cart: ${this.#cart.products.length}`;
    }

    /**
     * Links all the buttons added to the document
     * to the appropriate controller methods
     */
    #linkButtons() {
        document.querySelector("#cart-counter")!
            .addEventListener("click", () => {
                // should open or close the cart panel
                this.#controller.toggleCartPanelVisibility();
            })

        document.querySelector("#checkout-button")!
            .addEventListener("click", () => {
                this.#controller.checkоut();
            })
    }
}