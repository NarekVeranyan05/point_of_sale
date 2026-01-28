import Cart from "../model/cart";
import Product from "../model/product";
import CartCounterView from "../view/cart/cart-counter-view";

export default class CartController {
    #cart: Cart;
    #cartCounterView: CartCounterView

    constructor() {
        this.#cart = new Cart();
        this.#cartCounterView = new CartCounterView(this.#cart);
    }

    addProduct(product: Product) {
        // FIXME can I have sth like this
        this.#cart.addProduct(product);
    }
}