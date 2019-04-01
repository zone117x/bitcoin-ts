 
export declare enum ScriptNumberError {
    outOfRange = "Failed to parse Script Number: overflows Script Number range.",
    requiresMinimal = "Failed to parse Script Number: the number is not minimally-encoded."
}
export declare const isScriptNumberError: (value: BigInt | ScriptNumberError) => value is ScriptNumberError;
/**
 * This method attempts to parse a "Script Number", a format with which numeric
 * values are represented on the stack. (The Satoshi implementation calls this
 * `CScriptNum`.)
 *
 * If `bytes` is a valid Script Number, this method returns the represented
 * number in BigInt format. If `bytes` is not valid, a `ScriptNumberError` is
 * returned.
 *
 * All common operations accepting numeric parameters or pushing numeric values
 * to the stack currently use the Script Number format. The binary format of
 * numbers wouldn't be important if they could only be operated on by arithmetic
 * operators, but since the results of these operations may become input to
 * other operations (e.g. hashing), the specific representation is consensus-
 * critical.
 *
 * Parsing of Script Numbers is limited to 4 bytes (with the exception of
 * OP_CHECKLOCKTIMEVERIFY, which reads up to 5-bytes). The bytes are read as a
 * signed integer (for 32-bits: inclusive range from -2^31 + 1 to 2^31 - 1) in
 * little-endian byte order. It must further be encoded as minimally as possible
 * (no zero-padding). See code/tests for details.
 *
 * ### Notes
 *
 * Operators may push numeric results to the stack which exceed the current
 * 4-byte length limit of Script Numbers. While these stack elements would
 * otherwise be valid Script Numbers, because of the 4-byte length limit, they
 * can only be used as none-numeric values in later operations.
 *
 * Most other implementations currently parse Script Numbers into 64-bit
 * integers to operate on them (rather than integers of arbitrary size like
 * BigInt). Currently, no operators are at risk of overflowing 64-bit integers
 * given 32-bit integer inputs, but future operators may require additional
 * refactoring in those implementations.
 *
 * This implementation always requires minimal encoding of script numbers.
 * Applications trying to validate (historical) transactions without this
 * requirement will need a modified method.
 *
 * @param bytes a Uint8Array from the stack
 */
export declare const parseBytesAsScriptNumber: (bytes: Uint8Array) => bigint | ScriptNumberError;
/**
 * Convert a BigInt into the "Script Number" format. See
 * `parseBytesAsScriptNumber` for more information.
 *
 * @param integer the BigInt to encode as a Script Number
 */
export declare const bigIntToScriptNumber: (integer: bigint) => Uint8Array;
/**
 * Returns true if the provided stack element is "truthy" in the sense required
 * by several operations (anything but zero and "negative zero").
 *
 * The Satoshi implementation calls this method `CastToBool`.
 *
 * @param element the stack element to check for truthiness
 */
export declare const stackElementIsTruthy: (element: Uint8Array) => boolean;
/**
 * Convert a boolean into Script Number format (the type used to express
 * boolean values emitted by several operations).
 *
 * @param value the boolean value to convert
 */
export declare const booleanToScriptNumber: (value: boolean) => Uint8Array;