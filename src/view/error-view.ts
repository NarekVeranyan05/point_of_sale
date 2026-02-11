/**
 * ErrorView represents an error message presented to the user as a notification
 * 
 * @note ErrorView is an autocloseable view - a timeout is set for the view to be detached
 */
export default class ErrorView {
    static #timoutMS: number = 5000; // the timout in milliseconds
    static #errors: Array<ErrorView> = new Array<ErrorView>(); // all the errors in the notifications bar
    #errorDiv: HTMLDivElement;

    constructor(message: string) {
        this.#openNotifs();

        // updating document
        this.#errorDiv = document.createElement("div");
        this.#errorDiv.className = "notif error";
        this.#errorDiv.innerHTML = message;

        document.querySelector<HTMLDivElement>("#notifs")!.append(this.#errorDiv);
        ErrorView.#errors.push(this);

        this.#hide();
    }

    /**
     * Determines if the notifications sidebar is not present in the document
     * If not, appends the sidebar
     */
    #openNotifs() {
        if(ErrorView.#errors.length == 0) {
            let notifsDiv = document.createElement("div");
            notifsDiv.id = "notifs";

            document.querySelector<HTMLDivElement>("#app")!.appendChild(notifsDiv);
        }
    }

    /**
     * Sets a timeout to detach the ErrorView from the document
     */
    #hide() {
        setTimeout(() => {
            let notifs = document.querySelector<HTMLDivElement>("#notifs")!;

            notifs!.removeChild(this.#errorDiv);
            ErrorView.#errors.splice(
                ErrorView.#errors.indexOf(this), 1
            );
            
            // if no notifications are presented, detaches the
            // notifications sidebar from the document
            if(notifs.childElementCount === 0){
                document.querySelector<HTMLDivElement>("#app")!.removeChild(
                    document.querySelector("#notifs")!
                );
            }
        }, ErrorView.#timoutMS);
    } 
}