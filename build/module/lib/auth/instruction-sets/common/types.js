/* istanbul ignore file */ // TODO: stabilize & test
export var ScriptNumberError;
(function (ScriptNumberError) {
    ScriptNumberError["outOfRange"] = "Failed to parse Script Number: overflows Script Number range.";
    ScriptNumberError["requiresMinimal"] = "Failed to parse Script Number: the number is not minimally-encoded.";
})(ScriptNumberError || (ScriptNumberError = {}));
// tslint:disable-next-line:no-any
export const isScriptNumberError = (value) => value === ScriptNumberError.outOfRange ||
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
export const parseBytesAsScriptNumber = (bytes) => {
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
export const bigIntToScriptNumber = (integer) => {
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
export const stackElementIsTruthy = (element) => {
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
export const booleanToScriptNumber = (value) => value ? bigIntToScriptNumber(BigInt(1)) : bigIntToScriptNumber(BigInt(0));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9jb21tb24vdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEJBQTBCLENBQUMseUJBQXlCO0FBRXBELE1BQU0sQ0FBTixJQUFZLGlCQUdYO0FBSEQsV0FBWSxpQkFBaUI7SUFDM0IsaUdBQTRFLENBQUE7SUFDNUUsNEdBQXVGLENBQUE7QUFDekYsQ0FBQyxFQUhXLGlCQUFpQixLQUFqQixpQkFBaUIsUUFHNUI7QUFFRCxrQ0FBa0M7QUFDbEMsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsQ0FDakMsS0FBaUMsRUFDTCxFQUFFLENBQzlCLEtBQUssS0FBSyxpQkFBaUIsQ0FBQyxVQUFVO0lBQ3RDLEtBQUssS0FBSyxpQkFBaUIsQ0FBQyxlQUFlLENBQUM7QUFFOUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Q0c7QUFDSCxpREFBaUQ7QUFDakQsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsQ0FDdEMsS0FBaUIsRUFDVyxFQUFFO0lBQzlCLE1BQU0sNkJBQTZCLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLDJDQUEyQztJQUMzQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xCO0lBQ0QsMkNBQTJDO0lBQzNDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyw2QkFBNkIsRUFBRTtRQUNoRCxPQUFPLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztLQUNyQztJQUNELE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEQsTUFBTSx5QkFBeUIsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdB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