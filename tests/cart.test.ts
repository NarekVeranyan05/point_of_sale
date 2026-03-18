import {expect, test, vi} from "vitest";

vi.mock("../src/model/assets/hasher.ts", () => ({
    generateSalt: vi.fn(() => new Uint8Array(16).fill(0)),
    hash: vi.fn(async () => "mocked_hash_string")
}));

import { Bogo } from "../src/model/coupon/bogo";
import { Tracksuit } from "../src/model/product/tracksuit";
import { RunningShoes } from "../src/model/product/running-shoes";
import { EmptyCartException } from '../src/model/receipt';
import Account from "../src/model/account";

test("Adds a product to the cart", async () => {
    let a = await Account.signup("some name 1", "some password");
    let p = new Tracksuit("The Gopnik", "some description", 120, 120);

    await a.cart.addProduct(p);

    await Account.signup("some name 11", "my pass");
    await Account.login("some name 1", "some password");

    expect(a.cart.products).contains(p);
})

test("Does not allow adding coupon to an empty cart", async () => {
    let a = await Account.signup("some name 2", "some password");
    let p = new Tracksuit("The Gopnik", "some description", 120, 120);

    let coupon = new Bogo(
        "Buy Seeds Get The Gopnik",
        "something",
        p, p);

    await expect(a.cart.addCoupon(coupon)).rejects.toThrowError();
})

test("Adds coupon to the cart", async () => {
    let a = await Account.signup("some name 3", "some password");
    let p = new Tracksuit("The Gopnik", "some description", 120, 120);

    await a.cart.addProduct(p);
    let coupon = new Bogo(
        "Buy Seeds Get The Gopnik",
        "something",
        p, p);
    await a.cart.addCoupon(coupon);

    await Account.signup("some name 33", "my pass");
    await Account.login("some name 3", "some password");

    expect(a.cart.coupons).contains(coupon);
    expect(a.cart.products.find(p => p.name == "Bogo")).not.toBeNull();
})

test("Empty cart cannot be purchased", async () => {
    let a = await Account.signup("some name 4", "some password");

    expect(() => a.cart.purchase()).toThrowError(EmptyCartException);
})

test("single-item cart can be purchased", async () => {
    let a = await Account.signup("some name 5", "some password");
    let p1 = new Tracksuit("The Gopnik", "some description", 120, 1);
    let p2 = new RunningShoes("Greta's Runners", "some description", 120, 1);

    await a.cart.addProduct(p1);
    let coupon = new Bogo(
        "Buy Seeds Get The Gopnik",
        "something",
        p2, p2);
    await a.cart.addCoupon(coupon);

    let receipt = a.cart.purchase();

    expect(receipt.products).contains(p1);
    expect(receipt.products).contains(p2);
    expect(receipt.listPrice).equals(360);
    expect(receipt.discount).equals(120);

    await Account.signup("some name 55", "my pass");
    await Account.login("some name 5", "some password");

    expect(a.cart.products.length).equals(0);
    expect(a.cart.coupons.length).equals(0);
});

test("multi-item cart can be purchased", async () => {
    let a = await Account.signup("some name 6", "some password");
    let p1 = new Tracksuit("The Gopnik", "some description", 120, 1);
    let p2 = new RunningShoes("Greta's Runners", "some other description", 100, 1);

    await a.cart.addProduct(p1);
    await a.cart.addProduct(p2);

    let receipt = a.cart.purchase();

    expect(receipt.products).contains(p1);
    expect(receipt.products).contains(p2);
    expect(receipt.listPrice).equals(220);
})

test("cart notifies listeners", async () => {
    let a = await Account.signup("some name 7", "some password");
    let p = new RunningShoes("The Gopnik", "some other description", 120, 1);
    let notified = false;

    a.cart.registerListener({notify: () => notified = true});
    await a.cart.addProduct(p);

    expect(notified).equals(true);
})
