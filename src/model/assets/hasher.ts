/**
 * Generates a random salt for the hasher
 */
export function generateSalt() {
    return window.crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Hashes the given password using PBKDF2
 * @param password the password to hash
 * @param salt the salt to use for the hash function
 */
export async function hash(password: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
    const enc = new TextEncoder();

    let keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"],
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        256,
    );
    const bytes = new Uint8Array(derivedBits);
    const passHex = [...bytes]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    return passHex;
}