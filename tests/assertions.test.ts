import { expect, test } from "vitest"
import { assert, AssertionError } from "../src/assertions"

test("assert rejects falsy", () => {
    expect(() => assert("", "msg")).toThrowError(AssertionError);
})

test("assert accepts truthy", () => {
    expect(() => assert(1, "msg")).not.toThrowError();
})