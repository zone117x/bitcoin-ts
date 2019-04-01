/* istanbul ignore file */ // TODO: stabilize & test
import { bigIntToBinUint64LE, bigIntToBitcoinVarInt, binToBigIntUint64LE, binToHex, binToNumberUint32LE, numberToBinUint32LE, readBitcoinVarInt } from './utils/utils';
/**
 * @param bin the raw transaction from which to read the input
 * @param offset the offset at which the input begins
 */
export const readTransactionInput = (bin, offset) => {
    const offsetAfterTxHash = offset + 32 /* sha256Hash */;
    const outpointTransactionHash = bin
        .slice(offset, offsetAfterTxHash)
        .reverse();
    const offsetAfterOutpointIndex = offsetAfterTxHash + 4 /* uint32 */;
    const outpointIndex = binToNumberUint32LE(bin.subarray(offsetAfterTxHash, offsetAfterOutpointIndex));
    const { nextOffset: offsetAfterScriptLength, value: scriptLength } = readBitcoinVarInt(bin, offsetAfterOutpointIndex);
    const offsetAfterScript = offsetAfterScriptLength + Number(scriptLength);
    const unlockingScript = bin.slice(offsetAfterScriptLength, offsetAfterScript);
    const nextOffset = offsetAfterScript + 4 /* uint32 */;
    const sequenceNumber = binToNumberUint32LE(bin.subarray(offsetAfterScript, nextOffset));
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
export const readTransactionOutput = (bin, offset) => {
    const offsetAfterSatoshis = offset + 8 /* uint64 */;
    const satoshis = binToBigIntUint64LE(bin.subarray(offset, offsetAfterSatoshis));
    const { nextOffset: offsetAfterScriptLength, value } = readBitcoinVarInt(bin, offsetAfterSatoshis);
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
export const decodeRawTransaction = (bin) => {
    const version = binToNumberUint32LE(bin.subarray(0, 4 /* uint32 */));
    const offsetAfterVersion = 4 /* uint32 */;
    const { nextOffset: offsetAfterInputCount, value: inputCount } = readBitcoinVarInt(bin, offsetAfterVersion);
    // tslint:disable-next-line:no-let prefer-const
    let cursor = offsetAfterInputCount;
    // tslint:disable-next-line:readonly-array no-let prefer-const
    let inputs = [];
    // tslint:disable-next-line:no-let
    for (let i = 0; i < Number(inputCount); i++) {
        const { input, nextOffset } = readTransactionInput(bin, cursor);
        // tslint:disable-next-line:no-expression-statement
        cursor = nextOffset;
        // tslint:disable-next-line:no-expression-statement
        inputs.push(input);
    }
    const { nextOffset: offsetAfterOutputCount, value: outputCount } = readBitcoinVarInt(bin, cursor);
    // tslint:disable-next-line:no-expression-statement
    cursor = offsetAfterOutputCount;
    // tslint:disable-next-line:readonly-array no-let prefer-const
    let outputs = [];
    // tslint:disable-next-line:no-let
    for (let i = 0; i < Number(outputCount); i++) {
        const { output, nextOffset } = readTransactionOutput(bin, cursor);
        // tslint:disable-next-line:no-expression-statement
        cursor = nextOffset;
        // tslint:disable-next-line:no-expression-statement
        outputs.push(output);
    }
    const locktime = binToNumberUint32LE(bin.subarray(cursor, cursor + 4 /* uint32 */));
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
export const getBitcoinIdentifier = (data, sha256) => binToHex(sha256.hash(sha256.hash(data)).reverse());
/**
 * Derive a standard transaction identifier from a serialized raw transaction.
 *
 * @param rawTransaction the serialized raw transaction
 * @param sha256 an implementation of sha256
 */
export const getBitcoinTransactionId = getBitcoinIdentifier;
/**
 * Get the hash of a output. (For use in `correspondingOutputHash`.)
 * @param output the output to hash
 * @param sha256 an implementation of sha256
 */
export const getOutputHash = (output, sha256) => sha256.hash(sha256.hash(Uint8Array.from([
    ...bigIntToBinUint64LE(output.satoshis),
    ...output.lockingScript
])));
/**
 * Get the hash of all outpoints in a series of inputs. (For use in
 * `transactionOutpointsHash`.)
 *
 * @param inputs the series of inputs from which to extract the outpoints
 * @param sha256 an implementation of sha256
 */
export const getOutpointsHash = (inputs, sha256) => sha256.hash(sha256.hash(Uint8Array.from(inputs.reduce((accumulated, input) => [
    ...accumulated,
    ...input.outpointTransactionHash.slice().reverse(),
    ...numberToBinUint32LE(input.outpointIndex)
], []))));
/**
 * Serialize a single output.
 * @param output the output to serialize
 */
export const serializeOutput = (output) => Uint8Array.from([
    ...bigIntToBinUint64LE(BigInt(output.satoshis)),
    ...bigIntToBitcoinVarInt(BigInt(output.lockingScript.length)),
    ...output.lockingScript
]);
/**
 * Serialize a set of outputs for inclusion in a serialized transaction.
 *
 * Format: <BitcoinVarInt: output count> <serialized outputs>
 *
 * @param outputs the set of outputs to serialize
 */
export const serializeOutputs = (outputs) => Uint8Array.from([
    ...bigIntToBitcoinVarInt(BigInt(outputs.length)),
    ...outputs.reduce((accumulated, output) => [...accumulated, ...serializeOutput(output)], [])
]);
/**
 * Get the hash of a series of outputs. (Primarily for use in
 * `transactionOutputsHash`)
 * @param outputs the series of outputs to serialize and hash
 * @param sha256 an implementation of sha256
 */
export const getOutputsHash = (outputs, sha256) => sha256.hash(sha256.hash(Uint8Array.from([
    ...outputs.reduce((accumulated, output) => [...accumulated, ...serializeOutput(output)], [])
])));
/**
 * Get the hash of a series of input sequence numbers. (Primarily for use in
 * `transactionSequenceNumbersHash`)
 *
 * @param inputs the series of inputs from which to extract the sequence numbers
 * @param sha256 an implementation of sha256
 */
export const getSequenceNumbersHash = (inputs, sha256) => sha256.hash(sha256.hash(Uint8Array.from([
    ...inputs.reduce((accumulated, input) => [
        ...accumulated,
        ...numberToBinUint32LE(input.sequenceNumber)
    ], [])
])));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3RyYW5zYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBCQUEwQixDQUFDLHlCQUF5QjtBQUdwRCxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLHFCQUFxQixFQUNyQixtQkFBbUIsRUFDbkIsUUFBUSxFQUNSLG1CQUFtQixFQUNuQixtQkFBbUIsRUFDbkIsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBc0V2Qjs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEdBQWUsRUFBRSxNQUFjLEVBQUUsRUFBRTtJQUN0RSxNQUFNLGlCQUFpQixHQUFHLE1BQU0sc0JBQXdCLENBQUM7SUFDekQsTUFBTSx1QkFBdUIsR0FBRyxHQUFHO1NBQ2hDLEtBQUssQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUM7U0FDaEMsT0FBTyxFQUFFLENBQUM7SUFDYixNQUFNLHdCQUF3QixHQUFHLGlCQUFpQixpQkFBb0IsQ0FBQztJQUN2RSxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FDdkMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSx3QkFBd0IsQ0FBQyxDQUMxRCxDQUFDO0lBQ0YsTUFBTSxFQUNKLFVBQVUsRUFBRSx1QkFBdUIsRUFDbkMsS0FBSyxFQUFFLFlBQVksRUFDcEIsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztJQUNyRCxNQUFNLGlCQUFpQixHQUFHLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN6RSxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDOUUsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLGlCQUFvQixDQUFDO0lBQ3pELE1BQU0sY0FBYyxHQUFHLG1CQUFtQixD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