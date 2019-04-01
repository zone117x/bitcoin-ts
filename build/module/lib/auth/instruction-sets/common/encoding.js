/* istanbul ignore file */ // TODO: stabilize & test
export const isValidUncompressedPublicKeyEncoding = (publicKey) => publicKey.length === 65 /* uncompressedByteLength */ &&
    publicKey[0] === 4 /* uncompressedHeaderByte */
    ? true
    : false;
export const isValidCompressedPublicKeyEncoding = (publicKey) => publicKey.length === 33 /* compressedByteLength */ &&
    (publicKey[0] === 2 /* compressedHeaderByteEven */ ||
        publicKey[0] === 3 /* compressedHeaderByteOdd */)
    ? true
    : false;
export const isValidPublicKeyEncoding = (publicKey) => isValidCompressedPublicKeyEncoding(publicKey) ||
    isValidUncompressedPublicKeyEncoding(publicKey);
const isNegative = (value) => 
// tslint:disable-next-line:no-bitwise
(value & 128 /* negative */) !== 0;
const hasUnnecessaryPadding = (length, firstByte, secondByte) => length > 1 && firstByte === 0 && !isNegative(secondByte);
const isValidInteger = (signature, tagIndex, length, index) => signature[tagIndex] === 2 /* integerTagType */ &&
    length !== 0 &&
    !isNegative(signature[index]) &&
    !hasUnnecessaryPadding(length, signature[index], signature[index + 1]);
/**
 * Validate a bitcoin-encoded signature.
 *
 * From the C++ implementation:
 *
 * A canonical signature exists of: <30> <total len> <02> <len R> <R> <02> <len
 * S> <S> <hashtype>, where R and S are not negative (their first byte has its
 * highest bit not set), and not excessively padded (do not start with a 0 byte,
 * unless an otherwise negative number follows, in which case a single 0 byte is
 * necessary and even required).
 *
 * See https://bitcointalk.org/index.php?topic=8392.msg127623#msg127623
 *
 * This function is consensus-critical since BIP66.
 */
// TODO: unit test cases for each clause
// tslint:disable-next-line:cyclomatic-complexity
export const isValidSignatureEncoding = (signature) => {
    const rLength = signature[3 /* rLengthIndex */];
    const sTagIndex = 4 /* rIndex */ + rLength;
    const sLengthIndex = sTagIndex + 1;
    const sLength = signature[sLengthIndex];
    const sIndex = sLengthIndex + 1;
    return (signature.length > 9 /* minimumPossibleLength */ &&
        signature.length < 73 /* maximumPossibleLength */ &&
        signature[0 /* sequenceTagIndex */] === 48 /* sequenceTagType */ &&
        signature[1 /* sequenceLengthIndex */] ===
            signature.length - 3 /* nonSequenceBytes */ &&
        signature.length === rLength + sLength + 7 /* bytesExcludingIntegers */ &&
        isValidInteger(signature, 2 /* rTagIndex */, rLength, 4 /* rIndex */) &&
        isValidInteger(signature, sTagIndex, sLength, sIndex));
};
/**
 * Split a bitcoin-encoded signature into a signature and signing serialization
 * type.
 *
 * While a bitcoin-encoded signature only includes a single byte to encode the
 * signing serialization type, a 3-byte forkId can be appended to the signing
 * serialization to provide replay-protection between different forks. (See
 * Bitcoin Cash's Replay Protected Sighash spec for details.)
 *
 * @param signature a signature which passes `isValidSignatureEncoding`
 */
// TODO: unit test with and without forkId
export const decodeBitcoinSignature = (encodedSignature) => ({
    signature: encodedSignature.slice(0, encodedSignature.length - 1),
    signingSerializationType: new Uint8Array([
        encodedSignature[encodedSignature.length - 1]
    ])
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9jb21tb24vZW5jb2RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEJBQTBCLENBQUMseUJBQXlCO0FBVXBELE1BQU0sQ0FBQyxNQUFNLG9DQUFvQyxHQUFHLENBQUMsU0FBcUIsRUFBRSxFQUFFLENBQzVFLFNBQVMsQ0FBQyxNQUFNLG9DQUFxQztJQUNyRCxTQUFTLENBQUMsQ0FBQyxDQUFDLG1DQUFxQztJQUMvQyxDQUFDLENBQUMsSUFBSTtJQUNOLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFFWixNQUFNLENBQUMsTUFBTSxrQ0FBa0MsR0FBRyxDQUFDLFNBQXFCLEVBQUUsRUFBRSxDQUMxRSxTQUFTLENBQUMsTUFBTSxrQ0FBbUM7SUFDbkQsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHFDQUF1QztRQUNsRCxTQUFTLENBQUMsQ0FBQyxDQUFDLG9DQUFzQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxJQUFJO0lBQ04sQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUVaLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLENBQUMsU0FBcUIsRUFBRSxFQUFFLENBQ2hFLGtDQUFrQyxDQUFDLFNBQVMsQ0FBQztJQUM3QyxvQ0FBb0MsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQXlCbEQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRTtBQUNuQyxzQ0FBc0M7QUFDdEMsQ0FBQyxLQUFLLHFCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRWhDLE1BQU0scUJBQXFCLEdBQUcsQ0FDNUIsTUFBYyxFQUNkLFNBQWlCLEVBQ2pCLFVBQWtCLEVBQ2xCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFNBQVMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFOUQsTUFBTSxjQUFjLEdBQUcsQ0FDckIsU0FBcUIsRUFDckIsUUFBZ0IsRUFDaEIsTUFBYyxFQUNkLEtBQWEsRUFDYixFQUFFLENBQ0YsU0FBUyxDQUFDLFFBQVEsQ0FBQywyQkFBd0I7SUFDM0MsTUFBTSxLQUFLLENBQUM7SUFDWixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUV6RTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILHdDQUF3QztBQUN4QyxpREFBaUQ7QUFDakQsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxTQUFxQixFQUFFLEVBQUU7SUFDaEUsTUFBTSxPQUFPLEdBQUcsU0FBUyxzQkFBa0IsQ0FBQztJQUM1QyxNQUFNLFNBQVMsR0FBRyxpQkFBYSxPQUFPLENBQUM7SUFDdkMsTUFBTSxZQUFZLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNuQyxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDeEMsTUFBTSxNQUFNLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUVoQyxPQUFPLENBQ0wsU0FBUyxDQUFDLE1BQU0sZ0NBQTRCO1FBQzVDLFNBQVMsQ0FBQyxNQUFNLGlDQUE0QjtRQUM1QyxTQUFTLDBCQUFzQiw2QkFBeUI7UUFDeEQsU0FBUyw2QkFBeUI7WUFDaEMsU0FBUyxDQUFDLE1BQU0sMkJBQXVCO1FBQ3pDLFNBQVMsQ0FBQyxNQUFNLEtBQUssT0FBTyxHQUFHLE9BQU8saUNBQTZCO1FBQ25FLGNBQWMsQ0FBQyxTQUFTLHFCQUFpQixPQUFPLGlCQUFhO1FBQzdELGNBQWMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FDdEQsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGOzs7Ozs7Ozs7O0dBVUc7QUFDSCwwQ0FBMEM7QUFDMUMsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxnQkFBNEIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2RSxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2pFLHdCQUF3QixFQUFFLElBQUksVUFBVSxDQUFDO1FBQ3ZDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDOUMsQ0FBQztDQUNILENBQUMsQ0FBQyJ9