"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUncompressedPublicKeyEncoding = (publicKey) => publicKey.length === 65 /* uncompressedByteLength */ &&
    publicKey[0] === 4 /* uncompressedHeaderByte */
    ? true
    : false;
exports.isValidCompressedPublicKeyEncoding = (publicKey) => publicKey.length === 33 /* compressedByteLength */ &&
    (publicKey[0] === 2 /* compressedHeaderByteEven */ ||
        publicKey[0] === 3 /* compressedHeaderByteOdd */)
    ? true
    : false;
exports.isValidPublicKeyEncoding = (publicKey) => exports.isValidCompressedPublicKeyEncoding(publicKey) ||
    exports.isValidUncompressedPublicKeyEncoding(publicKey);
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
exports.isValidSignatureEncoding = (signature) => {
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
exports.decodeBitcoinSignature = (encodedSignature) => ({
    signature: encodedSignature.slice(0, encodedSignature.length - 1),
    signingSerializationType: new Uint8Array([
        encodedSignature[encodedSignature.length - 1]
    ])
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9jb21tb24vZW5jb2RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUEwQixDQUFDLHlCQUF5Qjs7QUFVdkMsUUFBQSxvQ0FBb0MsR0FBRyxDQUFDLFNBQXFCLEVBQUUsRUFBRSxDQUM1RSxTQUFTLENBQUMsTUFBTSxvQ0FBcUM7SUFDckQsU0FBUyxDQUFDLENBQUMsQ0FBQyxtQ0FBcUM7SUFDL0MsQ0FBQyxDQUFDLElBQUk7SUFDTixDQUFDLENBQUMsS0FBSyxDQUFDO0FBRUMsUUFBQSxrQ0FBa0MsR0FBRyxDQUFDLFNBQXFCLEVBQUUsRUFBRSxDQUMxRSxTQUFTLENBQUMsTUFBTSxrQ0FBbUM7SUFDbkQsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHFDQUF1QztRQUNsRCxTQUFTLENBQUMsQ0FBQyxDQUFDLG9DQUFzQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxJQUFJO0lBQ04sQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUVDLFFBQUEsd0JBQXdCLEdBQUcsQ0FBQyxTQUFxQixFQUFFLEVBQUUsQ0FDaEUsMENBQWtDLENBQUMsU0FBUyxDQUFDO0lBQzdDLDRDQUFvQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBeUJsRCxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO0FBQ25DLHNDQUFzQztBQUN0QyxDQUFDLEtBQUsscUJBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFaEMsTUFBTSxxQkFBcUIsR0FBRyxDQUM1QixNQUFjLEVBQ2QsU0FBaUIsRUFDakIsVUFBa0IsRUFDbEIsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksU0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUU5RCxNQUFNLGNBQWMsR0FBRyxDQUNyQixTQUFxQixFQUNyQixRQUFnQixFQUNoQixNQUFjLEVBQ2QsS0FBYSxFQUNiLEVBQUUsQ0FDRixTQUFTLENBQUMsUUFBUSxDQUFDLDJCQUF3QjtJQUMzQyxNQUFNLEtBQUssQ0FBQztJQUNaLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXpFOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsd0NBQXdDO0FBQ3hDLGlEQUFpRDtBQUNwQyxRQUFBLHdCQUF3QixHQUFHLENBQUMsU0FBcUIsRUFBRSxFQUFFO0lBQ2hFLE1BQU0sT0FBTyxHQUFHLFNBQVMsc0JBQWtCLENBQUM7SUFDNUMsTUFBTSxTQUFTLEdBQUcsaUJBQWEsT0FBTyxDQUFDO0lBQ3ZDLE1BQU0sWUFBWSxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDbkMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sTUFBTSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUM7SUFFaEMsT0FBTyxDQUNMLFNBQVMsQ0FBQyxNQUFNLGdDQUE0QjtRQUM1QyxTQUFTLENBQUMsTUFBTSxpQ0FBNEI7UUFDNUMsU0FBUywwQkFBc0IsNkJBQXlCO1FBQ3hELFNBQVMsNkJBQXlCO1lBQ2hDLFNBQVMsQ0FBQyxNQUFNLDJCQUF1QjtRQUN6QyxTQUFTLENBQUMsTUFBTSxLQUFLLE9BQU8sR0FBRyxPQUFPLGlDQUE2QjtRQUNuRSxjQUFjLENBQUMsU0FBUyxxQkFBaUIsT0FBTyxpQkFBYTtRQUM3RCxjQUFjLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQ3RELENBQUM7QUFDSixDQUFDLENBQUM7QUFFRjs7Ozs7Ozs7OztHQVVHO0FBQ0gsMENBQTBDO0FBQzdCLFFBQUEsc0JBQXNCLEdBQUcsQ0FBQyxnQkFBNEIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2RSxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2pFLHdCQUF3QixFQUFFLElBQUksVUFBVSxDQUFDO1FBQ3ZDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDOUMsQ0FBQztDQUNILENBQUMsQ0FBQyJ9