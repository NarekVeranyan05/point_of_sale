import {expect, test, vi} from "vitest";

vi.mock("../src/model/assets/hasher.ts", () => ({
    generateSalt: vi.fn(() => new Uint8Array(16).fill(0)),
    hash: vi.fn(async () => "mocked_hash_string")
}));

import Coupon from "../src/model/coupon/coupon";
import {Bogo} from "../src/model/coupon/bogo";
import {Discount} from "../src/model/coupon/discount";
import {Tracksuit} from "../src/model/product/tracksuit";
import Product from "../src/model/product/product";
import {AssertionError} from "../src/assertions";
import {RunningShoes} from "../src/model/product/running-shoes";
import {SunflowerSeed} from "../src/model/product/sunflower-seed";
import Account from "../src/model/account";

test("factory method creates instances", () => {
    let p = new Tracksuit("obj", "some", 1, 1);

    Coupon.createCoupon("Bogo", "some", "some", undefined, p, p).then(p => {
        expect(p).toBeInstanceOf(Bogo);
    })

    Coupon.createCoupon("Discount", "some", "some", 1, undefined, undefined).then(p => {
        expect(p).toBeInstanceOf(Discount);
    })
})

test("factory method rejects invalid class", async () => {
    await expect(
        Coupon.createCoupon("invalid_type", "some", "some", undefined, undefined,  undefined)
    ).rejects.toThrow(AssertionError);
})

test("coupon clones are distinct", () => {
    let p = new Tracksuit("obj", "some", 1, 1);

    let c1 = new Bogo("obj", "some", p, p);
    let c2 = new Discount("obj", "some", 12);

    expect(c1.clone() === c1).toBeFalsy();
    expect(c2.clone() === c2).toBeFalsy();
})

test("stores coupon for cart", async () => {
    let a = await Account.signup("some account for coupon", "some password");
    let p = new Tracksuit("Gary's Tracks", "lemma", 1, 1);

    await a.cart.addProduct(p);
    await a.cart.addCoupon(new Discount("20% Discount", "some", 20));

    await Account.signup("some account 11", "my pass");
    a = await Account.login("some account for coupon", "some password");

    expect(a.cart.coupons.length).equals(1);
    expect(a.cart.coupons[0].name).equals("20% Discount");
});
