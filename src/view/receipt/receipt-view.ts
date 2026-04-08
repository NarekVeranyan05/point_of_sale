import type Receipt from "../../model/receipt";
import type Listener from "../../listener.ts";

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
        const amt = [...this.#receipt.products].reduce((acc, pair) => acc += pair.quantity, 0);

        this.#receiptDiv = document.createElement("div");
        this.#receiptDiv.className = "notif receipt"
        this.#receiptDiv.innerHTML = `
            <div class="receipt-header">
                <h3>Receipt: </h3>
                <button class="button-circle">✕</button>
            </div>
            <ul></ul>
            <p class="receipt-summary">
                Number of items: ${amt}<br>
                List price: $${this.#receipt.listPrice}<br>
                Discount: $${this.#receipt.discount}<br>
                Total price: $${this.#receipt.listPrice - this.#receipt.discount}
            </p>
        `;

        document.querySelector<HTMLDivElement>("#notifs")!.append(this.#receiptDiv);
        this.#appendItems();
        this.#appendItems();

        this.#linkButton();
    }

    /**
     * Removes the presentation from the document
     */
    close() {
        document.querySelector<HTMLDivElement>("#notifs")!.removeChild(this.#receiptDiv);
    }

    /**
     * Maps each {@link Product} and {@link Coupon} in the {@link Receipt} to an HTML
     * representation and appends to the div for Receipt
     */
    #appendItems() {
        let itemsUl = this.#receiptDiv.querySelector("ul")!;
        
        [...this.#receipt.products].forEach(p => {
            itemsUl.innerHTML += `
                <li class="receipt-item">${p.name} | amount: ${p.quantity} | $${p.price * p.quantity}</li>`
        });

        [...this.#receipt.coupons].forEach(c => {
            itemsUl.innerHTML += `
                <li class="receipt-item">Coupon applied: '${c.name}'</li>`
        });
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