import {expect, test} from "vitest";
import Receipt from "../src/model/receipt";
import {Tracksuit} from "../src/model/product/tracksuit";
import {Discount} from "../src/model/coupon/discount";
import {Bogo} from "../src/model/coupon/bogo";
import {Shoes} from "../src/model/product/shoes";

test("Discount applies to Receipt", () => {
    let p = new Tracksuit("obj", "some", 120, 1);
    let discount = new Discount("some", "some", 30);

    let receipt = new Receipt(
        [p], []
    );
    receipt.addCoupon(discount);

    expect(receipt.discount).equals(36);
});

test("Bogo applies  Receipt", () => {
    let p1 = new Tracksuit("obj", "some", 120, 1);
    let p2 = new Shoes("obj", "some", 120, 1);
    let bogo = new Bogo("some", "some", p2, p2);

    let receipt = new Receipt(
        [p1], []
    );
    receipt.addCoupon(bogo);

    expect(receipt.products.length).equals(3);
    expect(receipt.products).contains(p2);
});