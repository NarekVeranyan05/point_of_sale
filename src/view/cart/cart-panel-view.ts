import type CartController from "../../controller/cart-controller";
import type Listener from "../../listener";
import type Cart from "../../model/cart";

/**
 * The CartPanelView presents all the {@link Product} instances added to the {@link Cart}.
 */
export default class CartPanelView implements Listener {
    #cart: Cart;
    #controller: CartController;
    #cartPanelDiv: HTMLDivElement;

    constructor(cart: Cart, controller: CartController) {
        this.#cart = cart;
        this.#controller = controller;
        this.#cart.registerListener(this);

        // creating the panel div
        this.#cartPanelDiv = document.createElement("div");
        this.#cartPanelDiv.id = "cart-panel";
        this.#appendProducts();

        document.querySelector("main")!.appendChild(this.#cartPanelDiv);
    }

    notify() {
        this.#cartPanelDiv.innerHTML = '';    
        this.#appendProducts();
    }

    /**
     * Maps each {@link Product} in the {@link Cart} to an HTML
     * representation and appends to the the div for cart panel
     */
    #appendProducts() {
        [...this.#cart.products].forEach(p => {
            let productDiv = document.createElement("div");

            // setting up div content
            productDiv.className = "product-cart-item";
            productDiv.innerHTML = `
                <h3>${p[0].name} </h3>
                <p> amount: ${p[1]}</p>
                <p>$${p[0].price * p[1]}</p>`;

            this.#cartPanelDiv.appendChild(productDiv);
        });
    }
}