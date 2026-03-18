import {expect, test, vi} from "vitest";

vi.mock("../src/model/assets/hasher.ts", () => ({
    generateSalt: vi.fn(() => new Uint8Array(16).fill(0)),
    hash: vi.fn(async () => {
        return "mocked_hash_string".concat(String(Math.random() * 100))
    })
}));

import Account, {IncorrectAccountNameOrPasswordError} from "../src/model/account";
import {hash} from "../src/model/assets/hasher";

test("creates new account", async () => {
    let acc = await Account.signup("some name", "some password");

    expect(acc.name).equals("some name");
});

test("does not sign up for an already existing account", async () => {
    await Account.signup("some other name", "some password");
    await expect(Account.signup("some other name", "some password")).rejects.toThrowError();
});

test("logs into existing account", async () => {
    vi.mocked(hash).mockReturnValueOnce(new Promise<string>((resolve) => resolve("some password")));
    await Account.signup("some new name", "some password");

    vi.mocked(hash).mockReturnValueOnce(new Promise<string>((resolve) => resolve("some password")));
    let acc = await Account.login("some new name", "some password");

    expect(acc.name).equals("some new name");
});

test("rejects wrong password for existing account", async () => {
    await Account.signup("some new name that's unique", "some password that's unique");

    await expect(Account.login("some new name that's unique", "some password that's not unique")).rejects.toThrowError(IncorrectAccountNameOrPasswordError);
});

test("does not log into non-existing account", async () => {
    await expect(Account.login("I dont exist", "some password")).rejects.toThrowError(IncorrectAccountNameOrPasswordError);
});

