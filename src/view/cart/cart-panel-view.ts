import type Listener from "../../listener";
import type Cart from "../../model/cart";
import {Measurements} from "../../model/product/measurements.ts";

/**
 * The CartPanelView presents all the {@link Product} instances added to the {@link Cart}.
 */
export default class CartPanelView implements Listener {
    #cart: Cart;
    #cartPanelDiv: HTMLDivElement;

    constructor(cart: Cart) {
        this.#cart = cart;
        this.#cart.registerListener(this);

        // creating the panel div
        this.#cartPanelDiv = document.createElement("div");
        this.#cartPanelDiv.id = "cart-panel";
        this.#appendItems();

        document.querySelector("main")!.appendChild(this.#cartPanelDiv);
    }

    notify() {
        this.#cartPanelDiv.innerHTML = '';    
        this.#appendItems();
    }

    /**
     * Maps each {@link Product} in the {@link Cart} to an HTML
     * representation and appends to the div for cart panel
     */
    #appendItems() {
        this.#cart.products.forEach(p => {
            let productDiv = document.createElement("div");

            // setting up div content
            productDiv.className = "product-cart-item";
            productDiv.innerHTML = `
                <h3>${p.name} </h3>
                <p> 
                    quantity: ${p.quantity} 
                    ${Measurements.units.get(p.constructor.name)}
                </p>
                <p>${p.price * p.quantity}</p>`;

            this.#cartPanelDiv.appendChild(productDiv);
        });
        this.#cart.coupons.forEach(c => {
            let couponDiv = document.createElement("div");

            // setting up div content
            couponDiv.className = "coupon-cart-item";
            couponDiv.innerHTML = `
                <h3>${c.name} </h3>
                <p>${c.description}</p>
            `;

            this.#cartPanelDiv.appendChild(couponDiv);
        });
    }
}