/* istanbul ignore file */ // TODO: stabilize & test
/**
 * Encode a number as a little-endian Uint8Array.
 *
 * Note: For valid results, value must be within the range representable by the
 * specified number of bytes. For values exceeding Number.MAX_SAFE_INTEGER, use
 * `bigIntToBinUintLE`.
 *
 * @param value the number to convert into a Uint32LE Uint8Array
 * @param bytes the number of bytes to read
 */
export const numberToBinUintLE = (value, bytes) => {
    const bin = new Uint8Array(bytes);
    // tslint:disable-next-line:no-let
    for (let offset = 0; offset < bytes; offset++) {
        // tslint:disable-next-line:no-object-mutation no-expression-statement
        bin[offset] = value;
        // tslint:disable-next-line:no-bitwise no-parameter-reassignment no-expression-statement
        value = value >>> 8 /* bitsInAByte */;
    }
    return bin;
};
/**
 * Encode a number as a 2-byte Uint16LE Uint8Array.
 *
 * Note: For valid results, value must be between 0 and 0xffff.
 *
 * @param value the number to convert into a Uint16LE Uint8Array
 */
export const numberToBinUint16LE = (value) => numberToBinUintLE(value, 2 /* uint16 */);
/**
 * Encode a number as a 4-byte Uint32LE Uint8Array.
 *
 * Note: For valid results, value must be between 0 and 0xffffffff.
 *
 * @param value the number to convert into a Uint32LE Uint8Array
 */
export const numberToBinUint32LE = (value) => numberToBinUintLE(value, 4 /* uint32 */);
/**
 * Decode a little-endian Uint8Array into a number.
 *
 * @param bin the Uint8Array to decode
 * @param bytes the number of bytes to read
 */
export const binToNumberUintLE = (bin, bytes) => {
    // tslint:disable-next-line:no-let
    let value = 0;
    // tslint:disable-next-line:no-let
    for (let offset = 0; offset < bytes; offset++) {
        // tslint:disable-next-line:no-bitwise no-expression-statement
        value += bin[offset] * 2 /* base */ ** (8 /* bitsInAByte */ * offset);
    }
    return value;
};
/**
 * Decode a 2-byte Uint16LE Uint8Array into a number.
 *
 * @param bin the Uint8Array to decode
 */
export const binToNumberUint16LE = (bin) => binToNumberUintLE(bin, 2 /* uint16 */);
/**
 * Decode a 4-byte Uint32LE Uint8Array into a number.
 *
 * @param bin the Uint8Array to decode
 */
export const binToNumberUint32LE = (bin) => binToNumberUintLE(bin, 4 /* uint32 */);
/**
 * Return a BigInt as little-endian Uint8Array.
 *
 * Note: For valid results, value must be between 0 and 0xffff ffff ffff ffff.
 * @param value the number to convert into a little-endian Uint8Array
 * @param bytes the byte length of the Uint8Array to return
 */
export const bigIntToBinUintLE = (value, bytes) => {
    const bin = new Uint8Array(bytes);
    // tslint:disable-next-line:no-let
    for (let offset = 0; offset < bytes; offset++) {
        // tslint:disable-next-line:no-object-mutation no-expression-statement
        bin[offset] = Number(value);
        // tslint:disable-next-line:no-bitwise no-parameter-reassignment no-expression-statement
        value = value >> BigInt(8 /* bitsInAByte */);
    }
    return bin;
};
/**
 * Return a BigInt as Uint64LE Uint8Array.
 *
 * Note: For valid results, value must be within the range representable by the
 * specified number of bytes.
 *
 * @param value the number to convert into a little-endian Uint8Array
 */
export const bigIntToBinUint64LE = (value) => bigIntToBinUintLE(value, 8 /* uint64 */);
/**
 * Decode a little-endian Uint8Array into a BigInt.
 *
 * @param bin the Uint8Array to decode
 */
export const binToBigIntUintLE = (bin, bytes) => {
    const base = 2;
    const bitsInAByte = 8;
    // tslint:disable-next-line:no-let
    let value = BigInt(0);
    // tslint:disable-next-line:no-let
    for (let offset = 0; offset < bytes; offset++) {
        // tslint:disable-next-line:no-bitwise no-expression-statement
        value += BigInt(bin[offset] * base ** (bitsInAByte * offset));
    }
    return value;
};
/**
 * Decode an 8-byte Uint64LE Uint8Array into a BigInt.
 *
 * @param bin the Uint8Array to decode
 */
export const binToBigIntUint64LE = (bin) => binToBigIntUintLE(bin, 8 /* uint64 */);
const varIntPrefixToSize = (firstByte) => {
    switch (firstByte) {
        default:
            return 1 /* uint8 */;
        case 253 /* Uint16Prefix */:
            return 2 /* uint16 */;
        case 254 /* Uint32Prefix */:
            return 4 /* uint32 */;
        case 255 /* Uint64Prefix */:
            return 8 /* uint64 */;
    }
};
/**
 * Read a Bitcoin VarInt (Variable-length integer) from a Uint8Array, returning
 * the `nextOffset` after the VarInt and the value as a BigInt.
 *
 * @param bin the Uint8Array from which to read the VarInt
 * @param offset the offset at which the input begins
 */
export const readBitcoinVarInt = (bin, offset) => {
    const bytes = varIntPrefixToSize(bin[offset]);
    return {
        nextOffset: offset + bytes,
        value: binToBigIntUintLE(bin.subarray(offset, offset + bytes), bytes)
    };
};
/**
 * Encode a BigInt as a Bitcoin VarInt (Variable-length integer).
 *
 * Note: the maximum value of a Bitcoin VarInt is 0xffff ffff ffff ffff. This
 * method will produce invalid results for larger values.
 *
 * @param value the BigInt to encode (no larger than 0xffff ffff ffff ffff)
 */
export const bigIntToBitcoinVarInt = (value) => value <= BigInt(252 /* Uint8MaxValue */)
    ? bigIntToBinUintLE(value, 1 /* uint8 */)
    : value <= BigInt(65535 /* Uint16MaxValue */)
        ? Uint8Array.from([
            253 /* Uint16Prefix */,
            ...bigIntToBinUintLE(value, 2 /* uint16 */)
        ])
        : value <= BigInt(4294967295 /* Uint32MaxValue */)
            ? Uint8Array.from([
                254 /* Uint32Prefix */,
                ...bigIntToBinUintLE(value, 4 /* uint32 */)
            ])
            : Uint8Array.from([
                255 /* Uint64Prefix */,
                ...bigIntToBinUintLE(value, 8 /* uint64 */)
            ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvdXRpbHMvbnVtYmVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7QUFjcEQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxLQUFhLEVBQUUsS0FBYSxFQUFFLEVBQUU7SUFDaEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsa0NBQWtDO0lBQ2xDLEtBQUssSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDN0Msc0VBQXNFO1FBQ3RFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDcEIsd0ZBQXdGO1FBQ3hGLEtBQUssR0FBRyxLQUFLLHdCQUEyQixDQUFDO0tBQzFDO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFFRjs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQ25ELGlCQUFpQixDQUFDLEtBQUssaUJBQW9CLENBQUM7QUFFOUM7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUNuRCxpQkFBaUIsQ0FBQyxLQUFLLGlCQUFvQixDQUFDO0FBRTlDOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxHQUFlLEVBQUUsS0FBYSxFQUFFLEVBQUU7SUFDbEUsa0NBQWtDO0lBQ2xDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLGtDQUFrQztJQUNsQyxLQUFLLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLE1B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