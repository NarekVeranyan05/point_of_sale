import CartController from "./controller/cart-controller";
import ddl from '../create-tables.sql?raw'
import db from './model/connection.ts'

import AccountController from "./controller/account-controller.ts";

// load the tables into the database:
db().exec(ddl);

// sets up the system
const accountController = new AccountController();
