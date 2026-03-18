// import { PGlite } from "@electric-sql/pglite";
// import {afterAll, afterEach, beforeAll, beforeEach, vi} from "vitest";
// import ddl from "../../create-tables.sql?raw";
//
// let instance: any;
//
// beforeEach(async () => {
//     const uniqueId = Math.random().toString(36).substring(7);
//     instance = await PGlite.create(`memory://${uniqueId}`);
//     await instance.exec(ddl);
// });
//
// afterEach(async () => {
//     await instance.close();
// });
//
// vi.mock("../src/model/assets/connection", () => ({
//     db: vi.fn(async () => instance)
// }));