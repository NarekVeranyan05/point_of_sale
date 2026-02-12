/**
 * ErrorView represents an error message presented to the user as a notification
 */
export default class ErrorView {
    #errorDiv: HTMLDivElement;

    constructor(message: string) {
        // creating the error div
        this.#errorDiv = document.createElement("div");
        this.#errorDiv.className = "notif error";
        this.#errorDiv.innerHTML = message;

        document.querySelector<HTMLDivElement>("#notifs")!.append(this.#errorDiv);

        this.#hide();
    }

    /**
     * Sets a timeout to detach the ErrorView from the document
     */
    #hide() {
        setTimeout(() => {
            document.querySelector<HTMLDivElement>("#notifs")!.removeChild(this.#errorDiv);
        }, 5000);
    } 
}