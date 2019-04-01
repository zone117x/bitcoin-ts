 
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
export declare const numberToBinUintLE: (value: number, bytes: number) => Uint8Array;
/**
 * Encode a number as a 2-byte Uint16LE Uint8Array.
 *
 * Note: For valid results, value must be between 0 and 0xffff.
 *
 * @param value the number to convert into a Uint16LE Uint8Array
 */
export declare const numberToBinUint16LE: (value: number) => Uint8Array;
/**
 * Encode a number as a 4-byte Uint32LE Uint8Array.
 *
 * Note: For valid results, value must be between 0 and 0xffffffff.
 *
 * @param value the number to convert into a Uint32LE Uint8Array
 */
export declare const numberToBinUint32LE: (value: number) => Uint8Array;
/**
 * Decode a little-endian Uint8Array into a number.
 *
 * @param bin the Uint8Array to decode
 * @param bytes the number of bytes to read
 */
export declare const binToNumberUintLE: (bin: Uint8Array, bytes: number) => number;
/**
 * Decode a 2-byte Uint16LE Uint8Array into a number.
 *
 * @param bin the Uint8Array to decode
 */
export declare const binToNumberUint16LE: (bin: Uint8Array) => number;
/**
 * Decode a 4-byte Uint32LE Uint8Array into a number.
 *
 * @param bin the Uint8Array to decode
 */
export declare const binToNumberUint32LE: (bin: Uint8Array) => number;
/**
 * Return a BigInt as little-endian Uint8Array.
 *
 * Note: For valid results, value must be between 0 and 0xffff ffff ffff ffff.
 * @param value the number to convert into a little-endian Uint8Array
 * @param bytes the byte length of the Uint8Array to return
 */
export declare const bigIntToBinUintLE: (value: bigint, bytes: number) => Uint8Array;
/**
 * Return a BigInt as Uint64LE Uint8Array.
 *
 * Note: For valid results, value must be within the range representable by the
 * specified number of bytes.
 *
 * @param value the number to convert into a little-endian Uint8Array
 */
export declare const bigIntToBinUint64LE: (value: bigint) => Uint8Array;
/**
 * Decode a little-endian Uint8Array into a BigInt.
 *
 * @param bin the Uint8Array to decode
 */
export declare const binToBigIntUintLE: (bin: Uint8Array, bytes: number) => bigint;
/**
 * Decode an 8-byte Uint64LE Uint8Array into a BigInt.
 *
 * @param bin the Uint8Array to decode
 */
export declare const binToBigIntUint64LE: (bin: Uint8Array) => bigint;
/**
 * Read a Bitcoin VarInt (Variable-length integer) from a Uint8Array, returning
 * the `nextOffset` after the VarInt and the value as a BigInt.
 *
 * @param bin the Uint8Array from which to read the VarInt
 * @param offset the offset at which the input begins
 */
export declare const readBitcoinVarInt: (bin: Uint8Array, offset: number) => {
    nextOffset: number;
    value: bigint;
};
/**
 * Encode a BigInt as a Bitcoin VarInt (Variable-length integer).
 *
 * Note: the maximum value of a Bitcoin VarInt is 0xffff ffff ffff ffff. This
 * method will produce invalid results for larger values.
 *
 * @param value the BigInt to encode (no larger than 0xffff ffff ffff ffff)
 */
export declare const bigIntToBitcoinVarInt: (value: bigint) => Uint8Array;