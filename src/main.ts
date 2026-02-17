import CartController from "./controller/cart-controller";
import ddl from '../create-tables.sql?raw'
import db from './model/connection.ts'

import ProductController from "./controller/product-controller.ts";
import Product from "./model/product/product.ts";

// load the tables into the database:
db().exec(ddl);

// sets up the system

let cartController = new CartController();
let products = await Product.getAllProducts();
products.map(p => new ProductController(p, cartController));
