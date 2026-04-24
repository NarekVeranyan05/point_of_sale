import ddl from '../create-tables.sql?raw'
import db from './model/assets/connection.ts'

import AccountController from "./controller/account-controller.ts";
import MarkovModel from "./model/assets/markov-model/markov-model.ts";
// load the tables into the database:
await db().exec(ddl);
// load the model
await MarkovModel.getInstance();

// sets up the system
const accountController = new AccountController();