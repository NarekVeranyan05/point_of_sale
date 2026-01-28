import type Listener from "../../listener";
import type Cart from "../../model/cart";

export default class CartCounterView implements Listener {
    #cart: Cart;
    #cartEl: HTMLDivElement
    // #checkoutEl: HTMLButtonElement

    constructor(cart: Cart) {   
        this.#cart = cart;
        this.#cart.registerListener(this);

        document.querySelector<HTMLDivElement>("#header")!.innerHTML = 
            `<div id='cart_counter'>Cart: ${this.#cart.size}</div>` +
            `<div class='button' id='checkout_button'>Checkout</div>`;

        this.#cartEl = document.querySelector<HTMLDivElement>("#cart_counter")!;
    }
    
    notify() {
        this.#cartEl.textContent = `Cart: ${this.#cart.size}`;
    }
}