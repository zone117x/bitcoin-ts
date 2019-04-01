 
import { Sha256 } from './crypto/sha256';
export interface Input {
    /**
     * The index of the output in the transaction from which this input is spent.
     *
     * An "outpoint" is a reference ("pointer") to an output in a previous
     * transaction.
     */
    readonly outpointIndex: number;
    /**
     * A.K.A. `Transaction ID`
     *
     * The hash of the raw transaction from which this input is spent (in
     * big-endian byte order).
     *
     * An "outpoint" is a reference ("pointer") to an output in a previous
     * transaction.
     *
     * Serialized raw bitcoin transactions encode this value in little-endian byte
     * order. However, it is more common to use big-endian byte order when
     * displaying transaction hashes. (In part because the SHA-256 specification
     * defines its output as big-endian, so this byte order is output by most
     * cryptographic libraries.)
     */
    readonly outpointTransactionHash: Uint8Array;
    /**
     * TODO: summarize BIP 68
     */
    readonly sequenceNumber: number;
    /**
     * The script used to unlock a transaction output. To spend an output, an
     * unlocking script must be included in a transaction input which – when
     * evaluated in the authentication virtual machine with a locking script –
     * completes in valid state.
     */
    readonly unlockingScript: Uint8Array;
}
export interface Output {
    /**
     * The script used to encumber a transaction output. To spend the output, an
     * unlocking script must be included in a transaction input which – when
     * evaluated with the locking script – completes in valid state.
     */
    readonly lockingScript: Uint8Array;
    /**
     * The value of the output in satoshis, the smallest unit of bitcoin. There
     * are 100 satoshis in a bit, and 100,000,000 satoshis in a bitcoin.
     */
    readonly satoshis: bigint;
}
export interface Transaction {
    /** TODO: */
    readonly inputs: ReadonlyArray<Input>;
    /** TODO: */
    readonly locktime: number;
    /** TODO: */
    readonly outputs: ReadonlyArray<Output>;
    /** TODO: */
    readonly version: number;
}
/**
 * @param bin the raw transaction from which to read the input
 * @param offset the offset at which the input begins
 */
export declare const readTransactionInput: (bin: Uint8Array, offset: number) => {
    input: {
        outpointIndex: number;
        outpointTransactionHash: Uint8Array;
        sequenceNumber: number;
        unlockingScript: Uint8Array;
    };
    nextOffset: number;
};
/**
 * @param bin the raw transaction from which to read the output
 * @param offset the offset at which the output begins
 */
export declare const readTransactionOutput: (bin: Uint8Array, offset: number) => {
    nextOffset: number;
    output: {
        lockingScript: Uint8Array;
        satoshis: bigint;
    };
};
/**
 * TODO: document return type (note outpointTransactionHash is little-endian – most UIs display big-endian transaction hashes)
 *
 * This method may throw runtime errors when attempting to decode improperly
 * encoded transactions.
 *
 * @param bin the raw transaction to decode
 */
export declare const decodeRawTransaction: (bin: Uint8Array) => Transaction;
/**
 * Derive a standard identifier from a serialized data structure.
 *
 * By convention, Bitcoin transaction and block identifiers are derived by
 * double-sha256 hashing their serialized form, and reversing the byte order.
 * (The result of sha256 is defined by its specification as big-endian, and
 * bitcoin displays hashes in little-endian format.)
 *
 * @param data the serialized raw data being identified
 * @param sha256 an implementation of sha256
 */
export declare const getBitcoinIdentifier: (data: Uint8Array, sha256: Sha256) => string;
/**
 * Derive a standard transaction identifier from a serialized raw transaction.
 *
 * @param rawTransaction the serialized raw transaction
 * @param sha256 an implementation of sha256
 */
export declare const getBitcoinTransactionId: (data: Uint8Array, sha256: Sha256) => string;
/**
 * Get the hash of a output. (For use in `correspondingOutputHash`.)
 * @param output the output to hash
 * @param sha256 an implementation of sha256
 */
export declare const getOutputHash: (output: Output, sha256: Sha256) => Uint8Array;
/**
 * Get the hash of all outpoints in a series of inputs. (For use in
 * `transactionOutpointsHash`.)
 *
 * @param inputs the series of inputs from which to extract the outpoints
 * @param sha256 an implementation of sha256
 */
export declare const getOutpointsHash: (inputs: ReadonlyArray<Input>, sha256: Sha256) => Uint8Array;
/**
 * Serialize a single output.
 * @param output the output to serialize
 */
export declare const serializeOutput: (output: Output) => Uint8Array;
/**
 * Serialize a set of outputs for inclusion in a serialized transaction.
 *
 * Format: <BitcoinVarInt: output count> <serialized outputs>
 *
 * @param outputs the set of outputs to serialize
 */
export declare const serializeOutputs: (outputs: ReadonlyArray<Output>) => Uint8Array;
/**
 * Get the hash of a series of outputs. (Primarily for use in
 * `transactionOutputsHash`)
 * @param outputs the series of outputs to serialize and hash
 * @param sha256 an implementation of sha256
 */
export declare const getOutputsHash: (outputs: ReadonlyArray<Output>, sha256: Sha256) => Uint8Array;
/**
 * Get the hash of a series of input sequence numbers. (Primarily for use in
 * `transactionSequenceNumbersHash`)
 *
 * @param inputs the series of inputs from which to extract the sequence numbers
 * @param sha256 an implementation of sha256
 */
export declare const getSequenceNumbersHash: (inputs: ReadonlyArray<Input>, sha256: Sha256) => Uint8Array;
