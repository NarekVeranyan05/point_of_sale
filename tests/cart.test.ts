// import { expect, test } from 'vitest';
//
// import Cart from "../src/model/cart";
// import Tracksuit from "../src/model/tracksuit";
// import RunningShoes from "../src/model/running-shoes";
// import { EmptyCartException } from '../src/model/receipt';
//
// test("Adds a product to the cart", () => {
//     let cart = new Cart();
//     let p = new Tracksuit(120);
//
//     cart.addProduct(p);
//
//     expect(cart.products).contains(p);
// })
//
// test("Empty cart cannot checkout", () => {
//     let cart = new Cart();
//
//     expect(() => cart.checkout()).toThrowError(EmptyCartException);
// })
//
// test("single-item cart can checkout", () => {
//     let cart = new Cart();
//     let p = new Tracksuit(120);
//
//     cart.addProduct(p);
//
//     let receipt = cart.checkout();
//
//     expect(receipt.products).contains(p);
//     expect(receipt.totalPrice).equals(120);
// })
//
// test("multi-item cart can checkout", () => {
//     let cart = new Cart();
//     let p1 = new Tracksuit(120);
//     let p2 = new RunningShoes(100);
//
//     cart.addProduct(p1);
//     cart.addProduct(p2);
//
//     let receipt = cart.checkout();
//
//     expect(receipt.products).contains(p1);
//     expect(receipt.products).contains(p2);
//     expect(receipt.totalPrice).equals(220);
// })
//
// test("cart notifies listeners", () => {
//     let cart = new Cart();
//     let p = new RunningShoes(120);
//     let notified = false;
//
//     cart.registerListener({notify: () => notified = true});
//     cart.addProduct(p);
//
//     expect(notified).equals(true);
// })
