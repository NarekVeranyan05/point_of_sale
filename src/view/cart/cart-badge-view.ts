import type CartController from "../../controller/cart-controller";
import type Listener from "../../listener";
import type Cart from "../../model/cart";

/**
 * The CartBadgeView presents the {@link Cart} checkout button and the 
 * count of the number of items in the Cart to UI.
 */
export default class CartBadgeView implements Listener {
    #cart: Cart;
    #controller: CartController;
    #cartEl: HTMLButtonElement;

    constructor(cart: Cart, controller: CartController) {   
        this.#cart = cart;
        this.#controller = controller;
        this.#cart.registerListener(this);

        // adding the cart counter and checkout button to the document
        document.querySelector<HTMLDivElement>("#header")!.innerHTML = `
            <div id='cart-counter'>Cart: ${this.#cart.products.length}</div>
            <button class='button' id='checkout-button'>Checkout</button>`;

        this.#cartEl = document.querySelector<HTMLButtonElement>("#cart-counter")!;

        this.#linkButton();
    }

    notify() {
        // updates the count for the number of items in the cart
        const amt = this.#cart.products.reduce((acc, p) => acc += p.price, 0);
        this.#cartEl.textContent = `Cart: ${amt}`;
    }

    /**
     * Links the button added to the document
     * to the appropriate controller method
     */
    #linkButton() {
        document.querySelector("#checkout-button")!
            .addEventListener("click", () => {
                this.#controller.checkout();
            })
    }
}