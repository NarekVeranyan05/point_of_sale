import type CartController from "../../controller/cart-controller";
import type Listener from "../../listener";
import type Product from "../../model/product";
import { ProductType } from "../../model/product-type";

export default class ProductView implements Listener {
    #product: Product
    #cartController: CartController
    #productEl: HTMLDivElement

    constructor(cartController: CartController, product: Product) {
        this.#cartController = cartController;
        this.#product = product;
        console.log(product);

        this.#productEl = document.createElement("div");
        let buyButton = document.createElement("button");
        buyButton.className = "button buy_button";
        buyButton.innerHTML = "Add to Cart";
        buyButton.addEventListener("click", () => {
            cartController.addProduct(this.#product);
        })

        this.#productEl.innerHTML = 
            `<div class="product">
                <div class="product_info">
                    <h1 class="product_name">${this.#product.type.replaceAll("_", " ").toLocaleLowerCase()}</h1>
                    <p class="product_price">$${this.#product.price}</p>
                </div>
                <img src="./public/tracksuits/black.png">
            </div>`
        
        this.#productEl.querySelector<HTMLDivElement>(".product")!.appendChild(buyButton);

        document.querySelector<HTMLDivElement>("#products")!
            .appendChild(this.#productEl);
    }

    notify() {

    }
}