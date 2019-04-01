 
/**
 * A.K.A. `sighash` flags
 */
export declare enum SigningSerializationFlag {
    ALL = 1,
    NONE = 2,
    SINGLE = 3,
    FORKID = 64,
    ANYONECANPAY = 128
}
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
export declare const generateBitcoinCashSigningSerialization: (version: number, transactionOutpointsHash: Uint8Array, transactionSequenceNumbersHash: Uint8Array, outpointTransactionHash: Uint8Array, outpointIndex: number, coveredScript: Uint8Array, outputValue: bigint, sequenceNumber: number, correspondingOutputHash: Uint8Array, transactionOutputsHash: Uint8Array, locktime: number, signingSerializationType: Uint8Array, forkId?: Uint8Array) => Uint8Array;
