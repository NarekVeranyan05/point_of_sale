import {expect, test, vi} from "vitest";
import Account from "../src/model/account";
import {Tracksuit} from "../src/model/product/tracksuit";
import {Shoes} from "../src/model/product/shoes";
import {Bogo} from "../src/model/coupon/bogo";

vi.mock("../src/model/assets/hasher.ts", () => ({
    generateSalt: vi.fn(() => new Uint8Array(16).fill(0)),
    hash: vi.fn(async () => "mocked_hash_string")
}));

test("adds receipt to the account", async () => {
    let a = await Account.signup("some name for receipt", "some password");
    let p1 = new Tracksuit("The Gopnik", "some description", 120, 1);
    let p2 = new Shoes("Greta's Runners", "some description", 120, 1);

    await a.cart.addProduct(p1);
    let coupon = new Bogo(
        "Buy Seeds Get The Gopnik",
        "something",
        p2, p2);
    await a.cart.addCoupon(coupon);

    await a.addReceipt(a.cart.purchase());

    await Account.signup("some name for receipt 1", "my pass");
    a = await Account.login("some name for receipt", "some password");

    expect(a.receipts.length).equals(1);
    expect(a.receipts[0].products.length).equals(3);
    expect(a.receipts[0].coupons.length).equals(1);
    expect(a.receipts[0].products.map(p => p.name)).contains("The Gopnik");
    expect(a.receipts[0].products.map(p => p.name)).contains("Greta's Runners");
    expect(a.receipts[0].listPrice).equals(360);
    expect(a.receipts[0].discount).equals(120);
})