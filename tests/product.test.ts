import {expect, test, vi} from "vitest";

vi.mock("../src/model/assets/hasher.ts", () => ({
    generateSalt: vi.fn(() => new Uint8Array(16).fill(0)),
    hash: vi.fn(async () => "mocked_hash_string")
}));

import {Tracksuit} from "../src/model/product/tracksuit";
import Product, {NonPositiveProductAmountError} from "../src/model/product/product";
import {Shoes} from "../src/model/product/shoes";
import {Snacks} from "../src/model/product/snacks";
import {AssertionError} from "../src/assertions";
import Account from "../src/model/account";

test("factory method creates instances", () => {
    Product.createProduct("Shoes", "some", "some", 1, 1).then(p => {
        expect(p).toBeInstanceOf(Shoes);
    })

    Product.createProduct("Tracksuit", "some", "some", 1, 1).then(p => {
        expect(p).toBeInstanceOf(Tracksuit);
    })

    Product.createProduct("Snacks", "some", "some", 1, 1).then(p => {
        expect(p).toBeInstanceOf(Snacks);
    })
})

test("factory method rejects invalid class", async () => {
    await expect(
        Product.createProduct("invalid_type", "some", "some", 1, 1)
    ).rejects.toThrow(AssertionError);
})

test("product clones are distinct", () => {
    let p1 = new Tracksuit("some", "some", 1, 1);
    let p2 = new Shoes("some", "some", 1, 1);
    let p3 = new Snacks("some", "some", 1, 1);

    expect(p1.clone() === p1).toBeFalsy();
    expect(p2.clone() === p2).toBeFalsy();
    expect(p3.clone() === p3).toBeFalsy();
})

test("changes product quantity", () => {
    let p = new Tracksuit("some", "some", 1, 1);

    p.quantity = 12;

    expect(p.quantity).equals(12);
})

test("zero quantity is rejected", () => {
    let p = new Tracksuit("some", "some", 1, 1);

    expect(() => p.quantity = 0).toThrowError(NonPositiveProductAmountError);
})

test("negative quantity is rejected", () => {
    let p = new Tracksuit("some", "some", 1, 1);

    expect(() => p.quantity = -1).toThrowError(NonPositiveProductAmountError);
})

test("stores product for cart", async () => {
    let a = await Account.signup("some account", "some password");

    let p = new Tracksuit("Gary's Tracks", "some", 1, 1);
    await a.cart.addProduct(p);

    await Account.signup("some account 1", "my pass");
    a = await Account.login("some account", "some password");

    expect(a.cart.products.length).equals(1);
    expect(a.cart.products[0].name).equals(p.name);
});
