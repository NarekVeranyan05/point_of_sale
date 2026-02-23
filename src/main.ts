import CartController from "./controller/cart-controller";
import ddl from '../create-tables.sql?raw'
import db from './model/connection.ts'

import ProductController from "./controller/product-controller.ts";
import Product from "./model/product/product.ts";
import AccountController from "./controller/account-controller.ts";

// load the tables into the database:
db().exec(ddl);

// sets up the system

let cartController = new CartController();
let products = await Product.getAllProducts();
let productControllers = products.map(p => new ProductController(p, cartController));

const accountController = new AccountController(cartController, productControllers);
