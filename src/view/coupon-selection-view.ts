import type CartController from "../controller/cart-controller.ts";
import type Coupon from "../model/coupon/coupon.ts";

export default class CouponSelectionView {
    #cartController: CartController;
    #coupons: Array<Coupon>;
    #couponsEl: HTMLDivElement;

    constructor(cartController: CartController, coupons: Array<Coupon>) {
        this.#cartController = cartController;
        this.#coupons = coupons;

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

        console.log("hi");
    }

    close() {
        document.querySelector("#app")!.removeChild(this.#couponsEl);
    }

    #appendCoupons() {
        this.#coupons.forEach(coupon => {
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

    #appendPurchaseButton() {
        let purchaseButton = document.createElement("button");
        purchaseButton.setAttribute("class", "button purchase-button");
        purchaseButton.innerHTML = `Purchase`;

        this.#couponsEl.appendChild(purchaseButton);
        purchaseButton.addEventListener("click", async () => {
            await this.#cartController.purchase();
        });
    }

    #linkCouponButton(coupon: Coupon, couponEl: HTMLDivElement) {
        let couponBuyButton = couponEl.querySelector("button")!;

        couponBuyButton!.addEventListener("click", () => {
            this.#cartController.addCoupon(coupon);
            // this.#cartController.purchase();
            this.#couponsEl.removeChild(couponEl);
        });
    }
}