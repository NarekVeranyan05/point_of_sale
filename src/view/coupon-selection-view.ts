import CartController from "../controller/cart-controller.ts";
import Coupon from "../model/coupon/coupon.ts";
import type Cart from "../model/cart.ts";

/**
 * The CouponSelectionView prompts the user to either select one or
 * more Coupons to add to the Cart, or to proceed to purchase.
 */
export default class CouponSelectionView {
    #cartController: CartController;
    #cart: Cart;
    #couponsEl: HTMLDivElement;

    constructor(cartController: CartController, cart: Cart) {
        this.#cartController = cartController;
        this.#cart = cart;

        this.#couponsEl = document.createElement("div");
        this.#couponsEl.setAttribute("id", "coupon-selection");
        document.querySelector("#app")!.appendChild(this.#couponsEl);

        this.#couponsEl.innerHTML = `
            <div class="coupons-title-bar">
                <h3 class="coupons-ad">You may add some of the following coupons to apply upon purchase:</h3>
                <button class="button-circle" id="coupon-selection-close-button">✕</button>
            </div>
        `;
        this.#couponsEl.querySelector<HTMLButtonElement>("#coupon-selection-close-button")!.addEventListener("click", () => {
           this.#cartController.exitCheckout();
        });
        this.#appendCoupons();
        this.#appendPurchaseButton();

    }

    /**
     * Removes the presentation from the document
     */
    close() {
        document.querySelector("#app")!.removeChild(this.#couponsEl);
    }

    /**
     * Appends the HTML elements for Coupons to the screen
     */
    async #appendCoupons() {
        let masterCoupons = await Coupon.fetchInventory();
        let notSelected = masterCoupons.filter(masterCoupon => !this.#cart.coupons.find(coupon => coupon.name === masterCoupon.name));

        notSelected.forEach(coupon => {
            let couponEl = document.createElement("div");

            couponEl.innerHTML = `
                <div class="coupon">
                    <div class="coupon-info">
                        <h1 class="coupon-name">${coupon.name}</h1>
                        <p class="coupon-description">${coupon.description}</p>
                    </div>
                    <button class="button buy-button">Add Coupon</button>
                </div>`;

            this.#couponsEl.appendChild(couponEl);
            this.#linkCouponButton(coupon, couponEl);
        });
    }

    /**
     * Appends the purchase button to the screen
     */
    #appendPurchaseButton() {
        let purchaseButton = document.createElement("button");
        purchaseButton.setAttribute("class", "button purchase-button");
        purchaseButton.innerHTML = `Purchase`;

        this.#couponsEl.appendChild(purchaseButton);
        purchaseButton.addEventListener("click", async () => {
            await this.#cartController.purchase();
        });
    }

    /**
     * Links a select button for a given coupon element
     * @param coupon the Coupon that `couponEl` represents
     * @param couponEl the HTML element for Coupon
     */
    #linkCouponButton(coupon: Coupon, couponEl: HTMLDivElement) {
        let couponBuyButton = couponEl.querySelector("button")!;

        couponBuyButton!.addEventListener("click", async () => {
            await this.#cartController.addCoupon(coupon);

            this.#couponsEl.removeChild(couponEl);
        });
    }
}