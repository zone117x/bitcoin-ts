"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
var ScriptNumberError;
(function (ScriptNumberError) {
    ScriptNumberError["outOfRange"] = "Failed to parse Script Number: overflows Script Number range.";
    ScriptNumberError["requiresMinimal"] = "Failed to parse Script Number: the number is not minimally-encoded.";
})(ScriptNumberError = exports.ScriptNumberError || (exports.ScriptNumberError = {}));
// tslint:disable-next-line:no-any
exports.isScriptNumberError = (value) => value === ScriptNumberError.outOfRange ||
    value === ScriptNumberError.requiresMinimal;
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
// tslint:disable-next-line:cyclomatic-complexity
exports.parseBytesAsScriptNumber = (bytes) => {
    const maximumScriptNumberByteLength = 4;
    // tslint:disable-next-line:no-if-statement
    if (bytes.length === 0) {
        return BigInt(0);
    }
    // tslint:disable-next-line:no-if-statement
    if (bytes.length > maximumScriptNumberByteLength) {
        return ScriptNumberError.outOfRange;
    }
    const mostSignificantByte = bytes[bytes.length - 1];
    const secondMostSignificantByte = bytes[bytes.length - 1 - 1];
    const allButTheSignBit = 127;
    const justTheSignBit = 128;
    // tslint:disable-next-line:no-if-statement no-bitwise
    if (
    // tslint:disable-next-line:no-bitwise
    (mostSignificantByte & allButTheSignBit) === 0 &&
        // tslint:disable-next-line:no-bitwise
        (bytes.length <= 1 || (secondMostSignificantByte & justTheSignBit) === 0)) {
        return ScriptNumberError.requiresMinimal;
    }
    const bitsPerByte = 8;
    const signFlippingByte = 0x80;
    // tslint:disable-next-line:prefer-const no-let
    let result = BigInt(0);
    // tslint:disable-next-line:prefer-for-of no-let
    for (let byte = 0; byte < bytes.length; byte++) {
        // tslint:disable-next-line:no-expression-statement no-bitwise
        result |= BigInt(bytes[byte]) << BigInt(byte * bitsPerByte);
    }
    // tslint:disable-next-line:no-bitwise
    const isNegative = (bytes[bytes.length - 1] & signFlippingByte) !== 0;
    return isNegative
        ? -(result &
            // tslint:disable-next-line:no-bitwise
            BigInt(~(signFlippingByte << (bitsPerByte * (bytes.length - 1)))))
        : result;
};
/**
 * Convert a BigInt into the "Script Number" format. See
 * `parseBytesAsScriptNumber` for more information.
 *
 * @param integer the BigInt to encode as a Script Number
 */
// tslint:disable-next-line:cyclomatic-complexity
exports.bigIntToScriptNumber = (integer) => {
    // tslint:disable-next-line:no-if-statement
    if (integer === BigInt(0)) {
        return new Uint8Array();
    }
    // tslint:disable-next-line:readonly-array
    const bytes = [];
    const isNegative = integer < 0;
    const byteStates = 0xff;
    const bitsPerByte = 8;
    // tslint:disable-next-line:prefer-const no-let
    let remaining = isNegative ? -integer : integer;
    while (remaining > 0) {
        // tslint:disable-next-line:no-expression-statement no-bitwise
        bytes.push(Number(remaining & BigInt(byteStates)));
        // tslint:disable-next-line:no-expression-statement no-bitwise
        remaining >>= BigInt(bitsPerByte);
    }
    const signFlippingByte = 0x80;
    // tslint:disable-next-line:no-if-statement no-bitwise
    if ((bytes[bytes.length - 1] & signFlippingByte) > 0) {
        // tslint:disable-next-line:no-expression-statement
        bytes.push(isNegative ? signFlippingByte : 0x00);
        // tslint:disable-next-line:no-if-statement
    }
    else if (isNegative) {
        // tslint:disable-next-line:no-expression-statement no-object-mutation no-bitwise
        bytes[bytes.length - 1] |= signFlippingByte;
    }
    return new Uint8Array(bytes);
};
/**
 * Returns true if the provided stack element is "truthy" in the sense required
 * by several operations (anything but zero and "negative zero").
 *
 * The Satoshi implementation calls this method `CastToBool`.
 *
 * @param element the stack element to check for truthiness
 */
exports.stackElementIsTruthy = (element) => {
    const signFlippingByte = 0x80;
    // tslint:disable-next-line:no-let
    for (let i = 0; i < element.length; i++) {
        // tslint:disable-next-line:no-if-statement
        if (element[i] !== 0) {
            // tslint:disable-next-line:no-if-statement
            if (i === element.length - 1 && element[i] === signFlippingByte) {
                return false;
            }
            return true;
        }
    }
    return false;
};
/**
 * Convert a boolean into Script Number format (the type used to express
 * boolean values emitted by several operations).
 *
 * @param value the boolean value to convert
 */
exports.booleanToScriptNumber = (value) => value ? exports.bigIntToScriptNumber(BigInt(1)) : exports.bigIntToScriptNumber(BigInt(0));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9jb21tb24vdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUEwQixDQUFDLHlCQUF5Qjs7QUFFcEQsSUFBWSxpQkFHWDtBQUhELFdBQVksaUJBQWlCO0lBQzNCLGlHQUE0RSxDQUFBO0lBQzVFLDRHQUF1RixDQUFBO0FBQ3pGLENBQUMsRUFIVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQUc1QjtBQUVELGtDQUFrQztBQUNyQixRQUFBLG1CQUFtQixHQUFHLENBQ2pDLEtBQWlDLEVBQ0wsRUFBRSxDQUM5QixLQUFLLEtBQUssaUJBQWlCLENBQUMsVUFBVTtJQUN0QyxLQUFLLEtBQUssaUJBQWlCLENBQUMsZUFBZSxDQUFDO0FBRTlDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0NHO0FBQ0gsaURBQWlEO0FBQ3BDLFFBQUEsd0JBQXdCLEdBQUcsQ0FDdEMsS0FBaUIsRUFDVyxFQUFFO0lBQzlCLE1BQU0sNkJBQTZCLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLDJDQUEyQztJQUMzQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xCO0lBQ0QsMkNBQTJDO0lBQzNDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyw2QkFBNkIsRUFBRTtRQUNoRCxPQUFPLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztLQUNyQztJQUNELE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEQsTUFBTSx5QkFBeUIsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENB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