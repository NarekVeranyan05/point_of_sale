/**
 * asserts whether a value is truthy.
 * @param val the value to assert the truthiness of
 * @param message the message to send as assertion error
 */
export function assert(val: any, message: string): asserts val {
    if(!val) throw new AssertionError(message);
}

export class AssertionError extends Error {
    constructor(message: string) {
        super(message);
    }
}