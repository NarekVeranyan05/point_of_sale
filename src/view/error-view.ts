/**
 * ErrorView represents an error message presented to the user as a notification
 */
export default class ErrorView {
    #errorDiv: HTMLDivElement;

    constructor(message: string) {
        // updating document
        this.#errorDiv = document.createElement("div");
        this.#errorDiv.className = "notif error";
        this.#errorDiv.innerHTML = message;

        document.querySelector<HTMLDivElement>("#app")!.append(this.#errorDiv);

        this.#hide();
    }

    /**
     * Sets a timeout to detach the ErrorView from the document
     */
    #hide() {
        setTimeout(() => {
            document.querySelector<HTMLDivElement>("#app")!.removeChild(this.#errorDiv);
        }, 5000);
    } 
}