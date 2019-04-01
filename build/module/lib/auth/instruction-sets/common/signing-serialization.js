/* istanbul ignore file */ // TODO: stabilize & test
import { bigIntToBinUint64LE, bigIntToBitcoinVarInt, numberToBinUint32LE } from '../../../..';
/**
 * A.K.A. `sighash` flags
 */
export var SigningSerializationFlag;
(function (SigningSerializationFlag) {
    SigningSerializationFlag[SigningSerializationFlag["ALL"] = 1] = "ALL";
    SigningSerializationFlag[SigningSerializationFlag["NONE"] = 2] = "NONE";
    SigningSerializationFlag[SigningSerializationFlag["SINGLE"] = 3] = "SINGLE";
    SigningSerializationFlag[SigningSerializationFlag["FORKID"] = 64] = "FORKID";
    SigningSerializationFlag[SigningSerializationFlag["ANYONECANPAY"] = 128] = "ANYONECANPAY";
})(SigningSerializationFlag || (SigningSerializationFlag = {}));
const match = (type, flag) => 
// tslint:disable-next-line:no-bitwise
(type[0] & flag) !== 0;
const equals = (type, flag
// tslint:disable-next-line:no-bitwise
) => (type[0] & 31 /* mask5Bits */) === flag;
const anyoneCanPay = (type) => match(type, SigningSerializationFlag.ANYONECANPAY);
const sigSerializeSingle = (type) => equals(type, SigningSerializationFlag.SINGLE);
const sigSerializeNone = (type) => equals(type, SigningSerializationFlag.NONE);
const emptyHash = () => new Uint8Array(32 /* sha256HashByteLength */).fill(0);
/**
 * Return the proper `hashPrevouts` value for a given a signing serialization
 * type.
 * @param signingSerializationType the signing serialization type to test
 * @param transactionOutpointsHash see `generateBitcoinCashSigningSerialization`
 */
const hashPrevouts = (signingSerializationType, transactionOutpointsHash) => anyoneCanPay(signingSerializationType)
    ? emptyHash()
    : transactionOutpointsHash;
/**
 * Return the proper `hashSequence` value for a given a signing serialization
 * type.
 * @param signingSerializationType the signing serialization type to test
 * @param transactionSequenceNumbersHash see
 * `generateBitcoinCashSigningSerialization`
 */
const hashSequence = (signingSerializationType, transactionSequenceNumbersHash) => anyoneCanPay(signingSerializationType) ||
    !sigSerializeSingle(signingSerializationType) ||
    !sigSerializeNone(signingSerializationType)
    ? transactionSequenceNumbersHash
    : emptyHash();
/**
 * Return the proper `hashOutputs` value for a given a signing serialization
 * type.
 * @param signingSerializationType the signing serialization type to test
 * @param transactionOutputsHash see `generateBitcoinCashSigningSerialization`
 * @param correspondingOutputHash see `generateBitcoinCashSigningSerialization`
 */
const hashOutputs = (signingSerializationType, transactionOutputsHash, correspondingOutputHash) => !sigSerializeSingle(signingSerializationType) &&
    !sigSerializeNone(signingSerializationType)
    ? transactionOutputsHash
    : sigSerializeSingle(signingSerializationType)
        ? correspondingOutputHash
        : emptyHash();
/**
 * Serialize the signature-protected properties of a transaction following the
 * algorithm required by the `signingSerializationType` of a signature.
 *
 * @param version the version number of the transaction
 * @param transactionOutpointsHash the 32-byte double SHA256 hash of the
 * serialization of all input outpoints (A.K.A. `hashPrevouts`) – used if
 * `ANYONECANPAY` is not set
 * @param transactionSequenceNumbersHash the double SHA256 hash of the
 * serialization of all input sequence numbers. (A.K.A. `hashSequence`) – used
 * if none of `ANYONECANPAY`, `SINGLE`, or `NONE` are set.
 * @param outpointTransactionHash the big-endian (standard) transaction hash of
 * the outpoint being spent.
 * @param outpointIndex the index of the outpoint being spent in
 * `outpointTransactionHash`
 * @param coveredScript the script currently being executed, beginning at the
 * `lastCodeSeparator`.
 * @param outputValue the value of the outpoint in satoshis
 * @param sequenceNumber the sequence number of the input (A.K.A. `nSequence`)
 * @param correspondingOutputHash The double SHA256 of the serialization of the
 * output at the same index as this input (A.K.A. `hashOutputs` with
 * `SIGHASH_SINGLE`) – only used if `SINGLE` is set
 * @param transactionOutputsHash the double SHA256 of the serialization of
 * output amounts and locking scripts (A.K.A. `hashOutputs` with `SIGHASH_ALL`)
 * – only used if `ALL` is set
 * @param locktime the locktime of the transaction
 * @param signingSerializationType the signing serialization type of the
 * signature (A.K.A. `sighash` type)
 * @param forkId while a bitcoin-encoded signature only includes a single byte
 * to encode the signing serialization type, a 3-byte forkId can be appended to
 * provide replay-protection between different forks. (See Bitcoin Cash's Replay
 * Protected Sighash spec for details.)
 */
export const generateBitcoinCashSigningSerialization = (version, 
// TODO: consider making all hashes functions to allow for lazy evaluation
transactionOutpointsHash, transactionSequenceNumbersHash, outpointTransactionHash, outpointIndex, coveredScript, outputValue, sequenceNumber, correspondingOutputHash, transactionOutputsHash, locktime, signingSerializationType, forkId = new Uint8Array([0, 0, 0])) => new Uint8Array([
    ...numberToBinUint32LE(version),
    ...hashPrevouts(signingSerializationType, transactionOutpointsHash),
    ...hashSequence(signingSerializationType, transactionSequenceNumbersHash),
    ...outpointTransactionHash.slice().reverse(),
    ...numberToBinUint32LE(outpointIndex),
    ...Uint8Array.from([
        ...bigIntToBitcoinVarInt(BigInt(coveredScript.length)),
        ...coveredScript
    ]),
    ...bigIntToBinUint64LE(outputValue),
    ...numberToBinUint32LE(sequenceNumber),
    ...hashOutputs(signingSerializationType, transactionOutputsHash, correspondingOutputHash),
    ...numberToBinUint32LE(locktime),
    ...signingSerializationType,
    ...forkId
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmluZy1zZXJpYWxpemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvY29tbW9uL3NpZ25pbmctc2VyaWFsaXphdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7QUFFcEQsT0FBTyxFQUNMLG1CQUFtQixFQUNuQixxQkFBcUIsRUFDckIsbUJBQW1CLEVBQ3BCLE1BQU0sYUFBYSxDQUFDO0FBRXJCOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksd0JBTVg7QUFORCxXQUFZLHdCQUF3QjtJQUNsQyxxRUFBVSxDQUFBO0lBQ1YsdUVBQVcsQ0FBQTtJQUNYLDJFQUFhLENBQUE7SUFDYiw0RUFBYSxDQUFBO0lBQ2IseUZBQW1CLENBQUE7QUFDckIsQ0FBQyxFQU5XLHdCQUF3QixLQUF4Qix3QkFBd0IsUUFNbkM7QUFPRCxNQUFNLEtBQUssR0FBRyxDQUFDLElBQWdCLEVBQUUsSUFBOEIsRUFBRSxFQUFFO0FBQ2pFLHNDQUFzQztBQUN0QyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFekIsTUFBTSxNQUFNLEdBQUcsQ0FDYixJQUFnQixFQUNoQixJQUE4QjtBQUM5QixzQ0FBc0M7RUFDdEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLElBQUksQ0FBQztBQUU3QyxNQUFNLFlBQVksR0FBRyxDQUFDLElBQWdCLEVBQUUsRUFBRSxDQUN4QyxLQUFLLENBQUMsSUFBSSxFQUFFLHdCQUF3QixDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRXJELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxJQUFnQixFQUFFLEVBQUUsQ0FDOUMsTUFBTSxDQUFDLElBQUksRUFBRSx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUVoRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsSUFBZ0IsRUFBRSxFQUFFLENBQzVDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFOUMsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxVQUFVLCtCQUErQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUU5RTs7Ozs7R0FLRztBQUNILE1BQU0sWUFBWSxHQUFHLENBQ25CLHdCQUFvQyxFQUNwQyx3QkFBb0MsRUFDcEMsRUFBRSxDQUNGLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQztJQUNwQyxDQUFDLENBQUMsU0FBUyxFQUFFO0lBQ2IsQ0FBQyxDQUFDLHdCQUF3QixDQUFDO0FBRS9COzs7Ozs7R0FNRztBQUNILE1BQU0sWUFBWSxHQUFHLENBQ25CLHdCQUFvQyxFQUNwQyw4QkFBMEMsRUFDMUMsRUFBRSxDQUNGLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQztJQUN0QyxDQUFDLGtCQUFrQixDQUFDLHdCQUF3QixDQUFDO0lBQzdDLENBQUMsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUM7SUFDekMsQ0FBQyxDQUFDLDhCQUE4QjtJQUNoQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7QUFFbEI7Ozs7OztHQU1HO0FBQ0gsTUFBTSxXQUFXLEdBQUcsQ0FDbEIsd0JBQW9DLEVBQ3BDLHNCQUFrQyxFQUNsQyx1QkFBbUMsRUFDbkMsRUFBRSxDQUNGLENBQUMsa0JBQWtCLENBQUMsd0JBQXdCLENBQUM7SUFDN0MsQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBd0IsQ0FBQztJQUN6QyxDQUFDLENBQUMsc0JBQXNCO0lBQ3hCLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyx3QkFBd0IsQ0FBQztRQUM5QyxDQUFDLENBQUMsdUJBQXVCO1FBQ3pCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUVsQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFDSCxNQUFNLENBQUMsTUFBTSx1Q0FBdUMsR0FBRyxDQUNyRCxPQUFlO0FBQ2YsMEVBQTBFO0FBQzFFLHdCQUFvQyxFQUNwQyw4QkFBMEMsRUFDMUMsdUJBQW1DLEVBQ25DLGFBQXFCLEVBQ3JCLGFBQXlCLEVBQ3pCLFdBQW1CLEVBQ25CLGNBQXNCLEVBQ3RCLHVCQUFtQyxFQUNuQyxzQkFBa0MsRUFDbEMsUUFBZ0IsRUFDaEIsd0JBQW9DLEVBQ3BDLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDbEMsRUFBRSxDQUNGLElBQUksVUFBVSxDQUFDO0lBQ2IsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7SUFDL0IsR0FBRyxZQUFZLENBQUMsd0JBQXdCLEVBQUUsd0JBQXdCLENBQUM7SUFDbkUsR0FBRyxZQUFZLENBQUMsd0JBQXdCLEVBQUUsOEJBQThCLENBQUM7SUFDekUsR0FBRyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUU7SUFDNUMsR0FBRyxtQkFBbUIsQ0FBQyxhQUFhLENBQUM7SUFDckMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQ2pCLEdBQUcscUJBQXFCLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxHQUFHLGFBQWE7S0FDakIsQ0FBQztJQUNGLEdBQUcsbUJBQW1CLENBQUMsV0FBVyxDQUFDO0lBQ25DLEdBQUcsbUJBQW1CLENBQUMsY0FBYyxDQUFDO0lBQ3RDLEdBQUcsV0FBVyxDQUNaLHdCQUF3QixFQUN4QixzQkFBc0IsRUFDdEIsdUJBQXVCLENBQ3hCO0lBQ0QsR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUM7SUFDaEMsR0FBRyx3QkFBd0I7SUFDM0IsR0FBRyxNQUFNO0NBQ1YsQ0FBQyxDQUFDIn0=