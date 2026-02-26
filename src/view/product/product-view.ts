import type CartController from "../../controller/cart-controller";
import type Product from "../../model/product/product";
import type AccountController from "../../controller/account-controller.ts";
import type Account from "../../model/account.ts";

/**
 * The ProductView presents a {@link Product} instance that can be
 * added to a {@link Cart} and purchased
 * 
 * @note ProductView is inert and does not listen to any events
 */
export default class ProductView {
    #product: Product;
    #cartController: CartController;
    #productDiv: HTMLDivElement;

    constructor(cartController: CartController, product: Product) {
        this.#cartController = cartController;
        this.#product = product;

        // creating the product div
        this.#productDiv = document.createElement("div");
        this.#productDiv.innerHTML = `
            <div class="product">
                <div class="product-info">
                    <h1 class="product-name">${product.name}</h1>
                    <p class="product-price">$${product.price}</p>
                </div>
                <img src="./public/${product.name}.png">
                <button class="button buy-button">Add to Cart</button>
            </div>`;
        
        document.querySelector<HTMLDivElement>("main")!.appendChild(this.#productDiv);
        this.#linkButton();
    }

    /**
     * Links the button added to the document
     * to the appropriate controller methods
     */
    #linkButton() {
        this.#productDiv.querySelector("button")!.addEventListener("click", () => {
            this.#cartController.showProductAmountDialogView(this.#product);
        });
    }
}