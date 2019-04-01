/**
 * Returns an array of incrementing values starting at `begin` and incrementing by one for `length`.
 *
 * E.g.: `range(3)` => `[0, 1, 2]` and `range(3, 1)` => `[1, 2, 3]`
 *
 * @param length the number of elements in the array
 * @param begin the index at which the range starts (default: `0`)
 */
export const range = (length, begin = 0) => Array.from({ length }, (_, index) => begin + index);
/**
 * Split a string into an array of `chunkLength` strings. The final string may have a length between 1 and `chunkLength`.
 *
 * E.g.: `splitEvery('abcde', 2)` => `['ab', 'cd', 'e']`
 */
export const splitEvery = (input, chunkLength) => range(Math.ceil(input.length / chunkLength))
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
export const hexToBin = (wellFormedHex) => new Uint8Array(splitEvery(wellFormedHex, hexByteWidth).map(byte => parseInt(byte, hexadecimal)));
/**
 * Encode a Uint8Array into a hexadecimal-encoded string.
 *
 * E.g.: `binToHex(new Uint8Array([42, 100, 255]))` => `'2a64ff'`
 *
 * @param bytes a Uint8Array to encode
 */
export const binToHex = (bytes) => bytes.reduce((str, byte) => str + byte.toString(hexadecimal).padStart(hexByteWidth, '0'), '');
/**
 * Decode a hexadecimal-encoded string into bytes, reverse it, then re-encode.
 *
 * @param wellFormedHex a string of valid, hexadecimal-encoded data. See
 * `hexToBin` for more information.
 */
export const swapEndianness = (wellFormedHex) => binToHex(hexToBin(wellFormedHex).reverse());
/**
 * Reduce an array of `Uint8Array`s into a single `Uint8Array`.
 * @param array the array of `Uint8Array`s to flatten
 */
export const flattenBinArray = (array) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi91dGlscy9oZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7R0FPRztBQUNILE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLE1BQWMsRUFBRSxRQUFnQixDQUFDLEVBQUUsRUFBRSxDQUN6RCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFFdEQ7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxXQUFtQixFQUFFLEVBQUUsQ0FDL0QsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsQ0FBQztLQUN6QyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO0tBQ2pDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBRTNELE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN2QixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFFdkI7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxhQUFxQixFQUFFLEVBQUUsQ0FDaEQsSUFBSSxVQUFVLENBQ1osVUFBVSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDakQsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FDNUIsQ0FDRixDQUFDO0FBRUo7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBaUIsRUFBRSxFQUFFLENBQzVDLEtBQUssQ0FBQyxNQUFNLENBQ1YsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxFQUMzRSxFQUFFLENBQ0gsQ0FBQztBQUVKOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLENBQUMsYUFBcUIsRUFBRSxFQUFFLENBQ3RELFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUU5Qzs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxLQUFnQyxFQUFFLEVBQUU7SUFDbEUsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sU0FBUyxHQUFHLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzlDLG1EQUFtRDtJQUNuRCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQzFCLG1EQUFtRDtRQUNuRCxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxQixPQUFPLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzVCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNOLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMsQ0FBQyJ9