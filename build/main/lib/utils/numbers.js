"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.numberToBinUintLE = (value, bytes) => {
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
exports.numberToBinUint16LE = (value) => exports.numberToBinUintLE(value, 2 /* uint16 */);
/**
 * Encode a number as a 4-byte Uint32LE Uint8Array.
 *
 * Note: For valid results, value must be between 0 and 0xffffffff.
 *
 * @param value the number to convert into a Uint32LE Uint8Array
 */
exports.numberToBinUint32LE = (value) => exports.numberToBinUintLE(value, 4 /* uint32 */);
/**
 * Decode a little-endian Uint8Array into a number.
 *
 * @param bin the Uint8Array to decode
 * @param bytes the number of bytes to read
 */
exports.binToNumberUintLE = (bin, bytes) => {
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
exports.binToNumberUint16LE = (bin) => exports.binToNumberUintLE(bin, 2 /* uint16 */);
/**
 * Decode a 4-byte Uint32LE Uint8Array into a number.
 *
 * @param bin the Uint8Array to decode
 */
exports.binToNumberUint32LE = (bin) => exports.binToNumberUintLE(bin, 4 /* uint32 */);
/**
 * Return a BigInt as little-endian Uint8Array.
 *
 * Note: For valid results, value must be between 0 and 0xffff ffff ffff ffff.
 * @param value the number to convert into a little-endian Uint8Array
 * @param bytes the byte length of the Uint8Array to return
 */
exports.bigIntToBinUintLE = (value, bytes) => {
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
exports.bigIntToBinUint64LE = (value) => exports.bigIntToBinUintLE(value, 8 /* uint64 */);
/**
 * Decode a little-endian Uint8Array into a BigInt.
 *
 * @param bin the Uint8Array to decode
 */
exports.binToBigIntUintLE = (bin, bytes) => {
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
exports.binToBigIntUint64LE = (bin) => exports.binToBigIntUintLE(bin, 8 /* uint64 */);
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
exports.readBitcoinVarInt = (bin, offset) => {
    const bytes = varIntPrefixToSize(bin[offset]);
    return {
        nextOffset: offset + bytes,
        value: exports.binToBigIntUintLE(bin.subarray(offset, offset + bytes), bytes)
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
exports.bigIntToBitcoinVarInt = (value) => value <= BigInt(252 /* Uint8MaxValue */)
    ? exports.bigIntToBinUintLE(value, 1 /* uint8 */)
    : value <= BigInt(65535 /* Uint16MaxValue */)
        ? Uint8Array.from([
            253 /* Uint16Prefix */,
            ...exports.bigIntToBinUintLE(value, 2 /* uint16 */)
        ])
        : value <= BigInt(4294967295 /* Uint32MaxValue */)
            ? Uint8Array.from([
                254 /* Uint32Prefix */,
                ...exports.bigIntToBinUintLE(value, 4 /* uint32 */)
            ])
            : Uint8Array.from([
                255 /* Uint64Prefix */,
                ...exports.bigIntToBinUintLE(value, 8 /* uint64 */)
            ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvdXRpbHMvbnVtYmVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQTBCLENBQUMseUJBQXlCOztBQWNwRDs7Ozs7Ozs7O0dBU0c7QUFDVSxRQUFBLGlCQUFpQixHQUFHLENBQUMsS0FBYSxFQUFFLEtBQWEsRUFBRSxFQUFFO0lBQ2hFLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLGtDQUFrQztJQUNsQyxLQUFLLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzdDLHNFQUFzRTtRQUN0RSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLHdGQUF3RjtRQUN4RixLQUFLLEdBQUcsS0FBSyx3QkFBMkIsQ0FBQztLQUMxQztJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUY7Ozs7OztHQU1HO0FBQ1UsUUFBQSxtQkFBbUIsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQ25ELHlCQUFpQixDQUFDLEtBQUssaUJBQW9CLENBQUM7QUFFOUM7Ozs7OztHQU1HO0FBQ1UsUUFBQSxtQkFBbUIsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQ25ELHlCQUFpQixDQUFDLEtBQUssaUJBQW9CLENBQUM7QUFFOUM7Ozs7O0dBS0c7QUFDVSxRQUFBLGlCQUFpQixHQUFHLENBQUMsR0FBZSxFQUFFLEtBQWEsRUFBRSxFQUFFO0lBQ2xFLGtDQUFrQztJQUNsQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxrQ0FBa0M7SUFDbEMsS0FBSyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUM3Qyw4REFBOEQ7UUFDOUQsS0FBSyxJ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