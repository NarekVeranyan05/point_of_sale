import type CartController from "../../controller/cart-controller";
import type Product from "../../model/product";

/**
 * The ProductView presents a {@link Product} instance that can be
 * added to a {@link Cart} and purchased
 * 
 * @note ProductView is inert and does not listen to any events
 */
export default class ProductView {
    static #products = new Array<Product>();

    #product: Product;
    #cartController: CartController;
    #productEl: HTMLDivElement;

    constructor(cartController: CartController, product: Product) {
        this.#cartController = cartController;
        this.#product = product;

        // updating document
        this.#productEl = document.createElement("div");
        this.#productEl.innerHTML = `
            <div class="product">
                <div class="product-info">
                    <h1 class="product-name">${product.constructor.name}</h1>
                    <p class="product-price">$${product.price}</p>
                </div>
                <img src="./public/${product.constructor.name}.png">
                <button class="button buy-button">Add to Cart</button>
            </div>`;
        
        this.#appendProduct();
        this.#linkButton();

        ProductView.#products.push(this.#product);
    }

    /**
     * Appends a {@link Product} HTML representation to the document
     */
    #appendProduct() {
        if(ProductView.#products.length > 0) {
            document.querySelector<HTMLDivElement>("#products")!
                .appendChild(this.#productEl);
        }
        else {
            // if no previous products added, append a products div to the document
            let products = document.createElement("div");
            products.id = "products";
            
            products.appendChild(this.#productEl);
            document.querySelector<HTMLDivElement>("main")!
                .appendChild(products);
        }
    }

    /**
     * Links all the buttons added to the document
     * to the appropriate controller methods
     */
    #linkButton() {
        this.#productEl.querySelector("button")!.addEventListener("click", () => {
            this.#cartController.addProduct(this.#product);
        });
    }
}