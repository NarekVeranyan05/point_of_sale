export default class ProductsContainerView {
    constructor() {
        const main = document.querySelector("main")!;

        const container = document.createElement("div");
        container.id = "products-container";
        main.prepend(container);
    }
}
