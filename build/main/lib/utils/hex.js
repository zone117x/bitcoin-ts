"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns an array of incrementing values starting at `begin` and incrementing by one for `length`.
 *
 * E.g.: `range(3)` => `[0, 1, 2]` and `range(3, 1)` => `[1, 2, 3]`
 *
 * @param length the number of elements in the array
 * @param begin the index at which the range starts (default: `0`)
 */
exports.range = (length, begin = 0) => Array.from({ length }, (_, index) => begin + index);
/**
 * Split a string into an array of `chunkLength` strings. The final string may have a length between 1 and `chunkLength`.
 *
 * E.g.: `splitEvery('abcde', 2)` => `['ab', 'cd', 'e']`
 */
exports.splitEvery = (input, chunkLength) => exports.range(Math.ceil(input.length / chunkLength))
    .map(index => index * chunkLength)
    .map(begin => input.slice(begin, begin + chunkLength));
const hexByteWidth = 2;
const hexadecimal = 16;
/**
 * Decode a hexadecimal-encoded string into a Uint8Array.
 *
 * E.g.: `hexToBin('2a64ff')` => `new Uint8Array([42, 100, 255])`
 *
 * Note, this method always completes. If `wellFormedHex` is not divisible by 2,
 * the final byte will be parsed as if it were prepended with a `0` (e.g. `aaa`
 * is interpreted as `aa0a`). If `wellFormedHex` is potentially malformed, check
 * its length and handle the error before calling this method.
 *
 * @param wellFormedHex a string of valid, hexadecimal-encoded data
 */
exports.hexToBin = (wellFormedHex) => new Uint8Array(exports.splitEvery(wellFormedHex, hexByteWidth).map(byte => parseInt(byte, hexadecimal)));
/**
 * Encode a Uint8Array into a hexadecimal-encoded string.
 *
 * E.g.: `binToHex(new Uint8Array([42, 100, 255]))` => `'2a64ff'`
 *
 * @param bytes a Uint8Array to encode
 */
exports.binToHex = (bytes) => bytes.reduce((str, byte) => str + byte.toString(hexadecimal).padStart(hexByteWidth, '0'), '');
/**
 * Decode a hexadecimal-encoded string into bytes, reverse it, then re-encode.
 *
 * @param wellFormedHex a string of valid, hexadecimal-encoded data. See
 * `hexToBin` for more information.
 */
exports.swapEndianness = (wellFormedHex) => exports.binToHex(exports.hexToBin(wellFormedHex).reverse());
/**
 * Reduce an array of `Uint8Array`s into a single `Uint8Array`.
 * @param array the array of `Uint8Array`s to flatten
 */
exports.flattenBinArray = (array) => {
    const totalLength = array.reduce((total, bin) => total + bin.length, 0);
    const flattened = new Uint8Array(totalLength);
    // tslint:disable-next-line:no-expression-statement
    array.reduce((index, bin) => {
        // tslint:disable-next-line:no-expression-statement
        flattened.set(bin, index);
        return index + bin.length;
    }, 0);
    return flattened;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi91dGlscy9oZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztHQU9HO0FBQ1UsUUFBQSxLQUFLLEdBQUcsQ0FBQyxNQUFjLEVBQUUsUUFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FDekQsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBRXREOzs7O0dBSUc7QUFDVSxRQUFBLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxXQUFtQixFQUFFLEVBQUUsQ0FDL0QsYUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsQ0FBQztLQUN6QyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO0tBQ2pDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBRTNELE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN2QixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFFdkI7Ozs7Ozs7Ozs7O0dBV0c7QUFDVSxRQUFBLFFBQVEsR0FBRyxDQUFDLGFBQXFCLEVBQUUsRUFBRSxDQUNoRCxJQUFJLFVBQVUsQ0FDWixrQkFBVSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDakQsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FDNUIsQ0FDRixDQUFDO0FBRUo7Ozs7OztHQU1HO0FBQ1UsUUFBQSxRQUFRLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUUsQ0FDNUMsS0FBSyxDQUFDLE1BQU0sQ0FDVixDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLEVBQzNFLEVBQUUsQ0FDSCxDQUFDO0FBRUo7Ozs7O0dBS0c7QUFDVSxRQUFBLGNBQWMsR0FBRyxDQUFDLGFBQXFCLEVBQUUsRUFBRSxDQUN0RCxnQkFBUSxDQUFDLGdCQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUU5Qzs7O0dBR0c7QUFDVSxRQUFBLGVBQWUsR0FBRyxDQUFDLEtBQWdDLEVBQUUsRUFBRTtJQUNsRSxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEUsTUFBTSxTQUFTLEdBQUcsSUFBSSxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDOUMsbURBQW1EO0lBQ25ELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDMUIsbURBQW1EO1FBQ25ELFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFCLE9BQU8sS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDNUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ04sT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyxDQUFDIn0=