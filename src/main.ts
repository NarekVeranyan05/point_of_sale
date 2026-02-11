import CartController from "./controller/cart-controller";
import RunningShoesController from "./controller/running-shoes-controller";
import TracksuitController from "./controller/tracksuit-controller";

// sets up the system
let cartController = new CartController();
new RunningShoesController(cartController);
new TracksuitController(cartController);