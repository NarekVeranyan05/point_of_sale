import type Receipt from "../receipt";

export default interface Coupon {
    applyCoupon(receipt: Receipt): void;
}