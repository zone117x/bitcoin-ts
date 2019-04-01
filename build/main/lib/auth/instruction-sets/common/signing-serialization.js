"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../../..");
/**
 * A.K.A. `sighash` flags
 */
var SigningSerializationFlag;
(function (SigningSerializationFlag) {
    SigningSerializationFlag[SigningSerializationFlag["ALL"] = 1] = "ALL";
    SigningSerializationFlag[SigningSerializationFlag["NONE"] = 2] = "NONE";
    SigningSerializationFlag[SigningSerializationFlag["SINGLE"] = 3] = "SINGLE";
    SigningSerializationFlag[SigningSerializationFlag["FORKID"] = 64] = "FORKID";
    SigningSerializationFlag[SigningSerializationFlag["ANYONECANPAY"] = 128] = "ANYONECANPAY";
})(SigningSerializationFlag = exports.SigningSerializationFlag || (exports.SigningSerializationFlag = {}));
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
exports.generateBitcoinCashSigningSerialization = (version, 
// TODO: consider making all hashes functions to allow for lazy evaluation
transactionOutpointsHash, transactionSequenceNumbersHash, outpointTransactionHash, outpointIndex, coveredScript, outputValue, sequenceNumber, correspondingOutputHash, transactionOutputsHash, locktime, signingSerializationType, forkId = new Uint8Array([0, 0, 0])) => new Uint8Array([
    ...__1.numberToBinUint32LE(version),
    ...hashPrevouts(signingSerializationType, transactionOutpointsHash),
    ...hashSequence(signingSerializationType, transactionSequenceNumbersHash),
    ...outpointTransactionHash.slice().reverse(),
    ...__1.numberToBinUint32LE(outpointIndex),
    ...Uint8Array.from([
        ...__1.bigIntToBitcoinVarInt(BigInt(coveredScript.length)),
        ...coveredScript
    ]),
    ...__1.bigIntToBinUint64LE(outputValue),
    ...__1.numberToBinUint32LE(sequenceNumber),
    ...hashOutputs(signingSerializationType, transactionOutputsHash, correspondingOutputHash),
    ...__1.numberToBinUint32LE(locktime),
    ...signingSerializationType,
    ...forkId
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmluZy1zZXJpYWxpemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvY29tbW9uL3NpZ25pbmctc2VyaWFsaXphdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQTBCLENBQUMseUJBQXlCOztBQUVwRCxtQ0FJcUI7QUFFckI7O0dBRUc7QUFDSCxJQUFZLHdCQU1YO0FBTkQsV0FBWSx3QkFBd0I7SUFDbEMscUVBQVUsQ0FBQTtJQUNWLHVFQUFXLENBQUE7SUFDWCwyRUFBYSxDQUFBO0lBQ2IsNEVBQWEsQ0FBQTtJQUNiLHlGQUFtQixDQUFBO0FBQ3JCLENBQUMsRUFOVyx3QkFBd0IsR0FBeEIsZ0NBQXdCLEtBQXhCLGdDQUF3QixRQU1uQztBQU9ELE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBZ0IsRUFBRSxJQUE4QixFQUFFLEVBQUU7QUFDakUsc0NBQXNDO0FBQ3RDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUV6QixNQUFNLE1BQU0sR0FBRyxDQUNiLElBQWdCLEVBQ2hCLElBQThCO0FBQzlCLHNDQUFzQztFQUN0QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEtBQUssSUFBSSxDQUFDO0FBRTdDLE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBZ0IsRUFBRSxFQUFFLENBQ3hDLEtBQUssQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFckQsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLElBQWdCLEVBQUUsRUFBRSxDQUM5QyxNQUFNLENBQUMsSUFBSSxFQUFFLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRWhELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFnQixFQUFFLEVBQUUsQ0FDNUMsTUFBTSxD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