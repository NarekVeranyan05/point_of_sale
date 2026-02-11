import type Receipt from "../../model/receipt";

/**
 * The ReceiptView presents a {@link Receipt} instance that lists
 * all the {@link Product} instances purchased in a {@link Cart}
 * 
 * @note ReceiptView is inert and does not listen to any events
 */
export default class ReceiptView {
    static #receipts: Array<ReceiptView> = new Array<ReceiptView>();
    #receipt: Receipt
    #receiptDiv: HTMLDivElement

    constructor(receipt: Receipt) {
        this.#receipt = receipt;

        // updating document
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

        this.#openNotifs();
        document.querySelector<HTMLDivElement>("#notifs")!.append(this.#receiptDiv);
        this.#appendProducts();

        this.#linkButton();

        ReceiptView.#receipts.push(this);
    }

    /**
     * Removes the presentation from the document
     */
    close() {
        let notifs = document.querySelector<HTMLDivElement>("#notifs")!;

        // removing the receipt
        notifs.removeChild(this.#receiptDiv);
        ReceiptView.#receipts.splice(
            ReceiptView.#receipts.indexOf(this), 1
        );
        
        // if the notifications bar is empty, removes the element from the document
        if(notifs.childElementCount === 0){
            document.querySelector<HTMLDivElement>("#app")!.removeChild(
                document.querySelector("#notifs")!
            );
        }
    }

    /**
     * Determines if the notifications sidebar is not present in the document
     * If not, appends the sidebar
     */
    #openNotifs() {
        if(ReceiptView.#receipts.length == 0) {
            let notifsDiv = document.createElement("div");
            notifsDiv.id = "notifs";

            document.querySelector<HTMLDivElement>("#app")!.appendChild(notifsDiv);
        }
    }

    /**
     * Maps each {@link Product} in the Receipt to an HTML
     * representation and appends to the the div for Receipt
     */
    #appendProducts() {
        let productsUl = this.#receiptDiv.querySelector("ul")!;
        
        this.#receipt.products.forEach(p => {
            productsUl.innerHTML += `
                <li class="receipt-item">${p.constructor.name} : $${p.price}</li>
            `
        })
    }

    /**
     * Links all the buttons added to the document
     * to the appropriate controller methods
     */
    #linkButton() {
        this.#receiptDiv.querySelector("button")!.addEventListener("click", () => this.close());
    }
}  