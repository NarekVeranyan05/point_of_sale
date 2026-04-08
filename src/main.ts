import ddl from '../create-tables.sql?raw'
import db from './model/assets/connection.ts'

import AccountController from "./controller/account-controller.ts";
import {suggestProduct} from "../ai/product-suggester.ts";
// load the tables into the database:
db().exec(ddl);

// sets up the system
const accountController = new AccountController();

console.log(await suggestProduct("Tatik's Pickled Everything", 1000));