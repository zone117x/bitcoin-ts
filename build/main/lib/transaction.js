"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils/utils");
/**
 * @param bin the raw transaction from which to read the input
 * @param offset the offset at which the input begins
 */
exports.readTransactionInput = (bin, offset) => {
    const offsetAfterTxHash = offset + 32 /* sha256Hash */;
    const outpointTransactionHash = bin
        .slice(offset, offsetAfterTxHash)
        .reverse();
    const offsetAfterOutpointIndex = offsetAfterTxHash + 4 /* uint32 */;
    const outpointIndex = utils_1.binToNumberUint32LE(bin.subarray(offsetAfterTxHash, offsetAfterOutpointIndex));
    const { nextOffset: offsetAfterScriptLength, value: scriptLength } = utils_1.readBitcoinVarInt(bin, offsetAfterOutpointIndex);
    const offsetAfterScript = offsetAfterScriptLength + Number(scriptLength);
    const unlockingScript = bin.slice(offsetAfterScriptLength, offsetAfterScript);
    const nextOffset = offsetAfterScript + 4 /* uint32 */;
    const sequenceNumber = utils_1.binToNumberUint32LE(bin.subarray(offsetAfterScript, nextOffset));
    return {
        input: {
            outpointIndex,
            outpointTransactionHash,
            sequenceNumber,
            unlockingScript
        },
        nextOffset
    };
};
/**
 * @param bin the raw transaction from which to read the output
 * @param offset the offset at which the output begins
 */
exports.readTransactionOutput = (bin, offset) => {
    const offsetAfterSatoshis = offset + 8 /* uint64 */;
    const satoshis = utils_1.binToBigIntUint64LE(bin.subarray(offset, offsetAfterSatoshis));
    const { nextOffset: offsetAfterScriptLength, value } = utils_1.readBitcoinVarInt(bin, offsetAfterSatoshis);
    const scriptLength = Number(value);
    const nextOffset = offsetAfterScriptLength + scriptLength;
    const lockingScript = scriptLength === 0
        ? new Uint8Array()
        : bin.slice(offsetAfterScriptLength, nextOffset);
    return {
        nextOffset,
        output: {
            lockingScript,
            satoshis
        }
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
exports.decodeRawTransaction = (bin) => {
    const version = utils_1.binToNumberUint32LE(bin.subarray(0, 4 /* uint32 */));
    const offsetAfterVersion = 4 /* uint32 */;
    const { nextOffset: offsetAfterInputCount, value: inputCount } = utils_1.readBitcoinVarInt(bin, offsetAfterVersion);
    // tslint:disable-next-line:no-let prefer-const
    let cursor = offsetAfterInputCount;
    // tslint:disable-next-line:readonly-array no-let prefer-const
    let inputs = [];
    // tslint:disable-next-line:no-let
    for (let i = 0; i < Number(inputCount); i++) {
        const { input, nextOffset } = exports.readTransactionInput(bin, cursor);
        // tslint:disable-next-line:no-expression-statement
        cursor = nextOffset;
        // tslint:disable-next-line:no-expression-statement
        inputs.push(input);
    }
    const { nextOffset: offsetAfterOutputCount, value: outputCount } = utils_1.readBitcoinVarInt(bin, cursor);
    // tslint:disable-next-line:no-expression-statement
    cursor = offsetAfterOutputCount;
    // tslint:disable-next-line:readonly-array no-let prefer-const
    let outputs = [];
    // tslint:disable-next-line:no-let
    for (let i = 0; i < Number(outputCount); i++) {
        const { output, nextOffset } = exports.readTransactionOutput(bin, cursor);
        // tslint:disable-next-line:no-expression-statement
        cursor = nextOffset;
        // tslint:disable-next-line:no-expression-statement
        outputs.push(output);
    }
    const locktime = utils_1.binToNumberUint32LE(bin.subarray(cursor, cursor + 4 /* uint32 */));
    return {
        inputs,
        locktime,
        outputs,
        version
    };
};
// TODO:
// export const encodeRawTransaction = () => {};
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
exports.getBitcoinIdentifier = (data, sha256) => utils_1.binToHex(sha256.hash(sha256.hash(data)).reverse());
/**
 * Derive a standard transaction identifier from a serialized raw transaction.
 *
 * @param rawTransaction the serialized raw transaction
 * @param sha256 an implementation of sha256
 */
exports.getBitcoinTransactionId = exports.getBitcoinIdentifier;
/**
 * Get the hash of a output. (For use in `correspondingOutputHash`.)
 * @param output the output to hash
 * @param sha256 an implementation of sha256
 */
exports.getOutputHash = (output, sha256) => sha256.hash(sha256.hash(Uint8Array.from([
    ...utils_1.bigIntToBinUint64LE(output.satoshis),
    ...output.lockingScript
])));
/**
 * Get the hash of all outpoints in a series of inputs. (For use in
 * `transactionOutpointsHash`.)
 *
 * @param inputs the series of inputs from which to extract the outpoints
 * @param sha256 an implementation of sha256
 */
exports.getOutpointsHash = (inputs, sha256) => sha256.hash(sha256.hash(Uint8Array.from(inputs.reduce((accumulated, input) => [
    ...accumulated,
    ...input.outpointTransactionHash.slice().reverse(),
    ...utils_1.numberToBinUint32LE(input.outpointIndex)
], []))));
/**
 * Serialize a single output.
 * @param output the output to serialize
 */
exports.serializeOutput = (output) => Uint8Array.from([
    ...utils_1.bigIntToBinUint64LE(BigInt(output.satoshis)),
    ...utils_1.bigIntToBitcoinVarInt(BigInt(output.lockingScript.length)),
    ...output.lockingScript
]);
/**
 * Serialize a set of outputs for inclusion in a serialized transaction.
 *
 * Format: <BitcoinVarInt: output count> <serialized outputs>
 *
 * @param outputs the set of outputs to serialize
 */
exports.serializeOutputs = (outputs) => Uint8Array.from([
    ...utils_1.bigIntToBitcoinVarInt(BigInt(outputs.length)),
    ...outputs.reduce((accumulated, output) => [...accumulated, ...exports.serializeOutput(output)], [])
]);
/**
 * Get the hash of a series of outputs. (Primarily for use in
 * `transactionOutputsHash`)
 * @param outputs the series of outputs to serialize and hash
 * @param sha256 an implementation of sha256
 */
exports.getOutputsHash = (outputs, sha256) => sha256.hash(sha256.hash(Uint8Array.from([
    ...outputs.reduce((accumulated, output) => [...accumulated, ...exports.serializeOutput(output)], [])
])));
/**
 * Get the hash of a series of input sequence numbers. (Primarily for use in
 * `transactionSequenceNumbersHash`)
 *
 * @param inputs the series of inputs from which to extract the sequence numbers
 * @param sha256 an implementation of sha256
 */
exports.getSequenceNumbersHash = (inputs, sha256) => sha256.hash(sha256.hash(Uint8Array.from([
    ...inputs.reduce((accumulated, input) => [
        ...accumulated,
        ...utils_1.numberToBinUint32LE(input.sequenceNumber)
    ], [])
])));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3RyYW5zYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7O0FBR3BELHlDQVF1QjtBQXNFdkI7OztHQUdHO0FBQ1UsUUFBQSxvQkFBb0IsR0FBRyxDQUFDLEdBQWUsRUFBRSxNQUFjLEVBQUUsRUFBRTtJQUN0RSxNQUFNLGlCQUFpQixHQUFHLE1BQU0sc0JBQXdCLENBQUM7SUFDekQsTUFBTSx1QkFBdUIsR0FBRyxHQUFHO1NBQ2hDLEtBQUssQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUM7U0FDaEMsT0FBTyxFQUFFLENBQUM7SUFDYixNQUFNLHdCQUF3QixHQUFHLGlCQUFpQixpQkFBb0IsQ0FBQztJQUN2RSxNQUFNLGFBQWEsR0FBRywyQkFBbUIsQ0FDdkMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSx3QkFBd0IsQ0FBQyxDQUMxRCxDQUFDO0lBQ0YsTUFBTSxFQUNKLFVBQVUsRUFBRSx1QkFBdUIsRUFDbkMsS0FBSyxFQUFFLFlBQVksRUFDcEIsR0FBRyx5QkFBaUIsQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztJQUNyRCxNQUFNLGlCQUFpQixHQUFHLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN6RSxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDOUUsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLGlCQUFvQixDQUFDO0lBQ3pELE1BQU0sY0FBYyxHQUFHLDJCQUFtQixDQUN4QyxHQUFHLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUM1QyxDQUFDO0lBQ0YsT0FBTztRQUNMLEtBQUssRUFBRTtZQUNMLGFBQWE7WUFDYix1QkFBdUI7WUFDdkIsY0FB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