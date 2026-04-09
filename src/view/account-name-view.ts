import type Account from "../model/account.ts";

export default class AccountNameView {
    #account?: Account;
    #accountNameEl: HTMLElement;

    constructor() {
        this.#accountNameEl = document.createElement("h3");
        this.#accountNameEl.id = "account-name";
        this.#accountNameEl.innerHTML = "Authenticating...";

        document.querySelector("#header")!.prepend(this.#accountNameEl);
    }

    set account(account: Account) {
        this.#account = account;
        document.querySelector("#account-name")!.innerHTML = account.name;
    }

    close() {
        document.querySelector("#header")!.removeChild(this.#accountNameEl);
    }
}