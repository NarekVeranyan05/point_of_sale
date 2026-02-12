import type Receipt from "../../model/receipt";

/**
 * The ReceiptView presents a {@link Receipt} instance that lists
 * all the {@link Product} instances purchased in a {@link Cart}
 * 
 * @note ReceiptView is inert and does not listen to any events
 */
export default class ReceiptView {
    #receipt: Receipt;
    #receiptDiv: HTMLDivElement;

    constructor(receipt: Receipt) {
        this.#receipt = receipt;

        // creating the receipt div
        this.#receiptDiv = document.createElement("div");
        this.#receiptDiv.className = "notif receipt"
        this.#receiptDiv.innerHTML = `
            <div class="receipt-header">
                <h3>Receipt: </h3>
                <button class="button-circle">✕</button>
            </div>
            <ul></ul>
            <p class="receipt-summary">
                Number of items: ${this.#receipt.products.length}<br>
                Total price: $${this.#receipt.totalPrice}
            </p>
        `;

        document.querySelector<HTMLDivElement>("#notifs")!.append(this.#receiptDiv);
        this.#appendProducts();

        this.#linkButton();
    }

    /**
     * Removes the presentation from the document
     */
    close() {
        document.querySelector<HTMLDivElement>("#notifs")!.removeChild(this.#receiptDiv);
    }

    /**
     * Maps each {@link Product} in the Receipt to an HTML
     * representation and appends to the the div for Receipt
     */
    #appendProducts() {
        let productsUl = this.#receiptDiv.querySelector("ul")!;
        
        this.#receipt.products.forEach(p => {
            productsUl.innerHTML += `
                <li class="receipt-item">${p.constructor.name} : $${p.price}</li>`
        })
    }

    /**
     * Links the button added to the document
     * to the appropriate controller methods
     */
    #linkButton() {
        this.#receiptDiv.querySelector("button")!
            .addEventListener("click", () => this.close());
    }
}  