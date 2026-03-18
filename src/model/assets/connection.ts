import { PGlite } from '@electric-sql/pglite';
import ddl from "../../../create-tables.sql?raw";

// I want to ask q/ns about the environment to decide where to put or store our db (memory vs indexDb)
let src = import.meta.env.VITE_DATABASE_URL;
const pgliteDb = await PGlite.create(src);

// in the test environment, we need to populate the tables
// in our database
if(src == 'memory://') {
  db().exec(ddl);
}

export default function db() {
  return pgliteDb;
}
