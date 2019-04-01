/* istanbul ignore file */ // TODO: stabilize & test
import { arithmeticOperations } from './arithmetic';
import { bitwiseOperations } from './bitwise';
import { conditionallyEvaluate, incrementOperationCount, mapOverOperations } from './combinators';
import { cryptoOperations } from './crypto';
import { conditionalFlowControlOperations, unconditionalFlowControlOperations } from './flow-control';
import { pushNumberOperations, pushOperations } from './push';
import { stackOperations } from './stack';
import { timeOperations } from './time';
export * from './push';
export * from '../../state';
export * from './stack';
export * from './types';
export * from './encoding';
export * from './signing-serialization';
export var CommonAuthenticationError;
(function (CommonAuthenticationError) {
    CommonAuthenticationError["calledReturn"] = "Script called an OP_RETURN operation.";
    CommonAuthenticationError["emptyStack"] = "Tried to read from an empty stack.";
    CommonAuthenticationError["malformedPush"] = "Script must be long enough to push the requested number of bytes.";
    CommonAuthenticationError["nonMinimalPush"] = "Push operations must use the smallest possible encoding.";
    CommonAuthenticationError["exceedsMaximumPush"] = "Push exceeds the push size limit of 520 bytes.";
    CommonAuthenticationError["failedVerify"] = "Script failed an OP_VERIFY operation.";
    CommonAuthenticationError["invalidPublicKeyEncoding"] = "Encountered an improperly encoded public key.";
    CommonAuthenticationError["invalidSignatureEncoding"] = "Encountered an improperly encoded signature.";
    CommonAuthenticationError["invalidNaturalNumber"] = "Invalid input: this parameter requires a natural number.";
    CommonAuthenticationError["insufficientPublicKeys"] = "An OP_CHECKMULTISIG operation requires signatures from more public keys than are provided.";
    CommonAuthenticationError["invalidProtocolBugValue"] = "The protocol bug value must be a Script Number 0.";
    CommonAuthenticationError["exceededMaximumOperationCount"] = "Script exceeded the maximum operation count (201 operations).";
    CommonAuthenticationError["exceedsMaximumMultisigPublicKeyCount"] = "Script called an OP_CHECKMULTISIG which exceeds the maximum public key count (20 public keys).";
    CommonAuthenticationError["unexpectedEndIf"] = "Encountered an OP_ENDIF which is not following a matching OP_IF.";
    CommonAuthenticationError["unexpectedElse"] = "Encountered an OP_ELSE outside of an OP_IF ... OP_ENDIF block.";
    CommonAuthenticationError["unknownOpcode"] = "Called an unknown opcode.";
})(CommonAuthenticationError || (CommonAuthenticationError = {}));
export var CommonConsensus;
(function (CommonConsensus) {
    CommonConsensus[CommonConsensus["maximumOperationCount"] = 201] = "maximumOperationCount";
})(CommonConsensus || (CommonConsensus = {}));
export const applyError = (error, state) => ({
    ...state,
    error
});
export const undefinedOperation = () => ({
    undefined: (state) => applyError(CommonAuthenticationError.unknownOpcode, state)
});
export const commonOperations = (sha256, ripemd160, secp256k1) => ({
    ...mapOverOperations({
        ...pushOperations(),
        ...pushNumberOperations(),
        ...mapOverOperations({
            ...arithmeticOperations(),
            ...bitwiseOperations(),
            ...cryptoOperations(sha256, ripemd160, secp256k1),
            ...conditionalFlowControlOperations(),
            ...stackOperations(),
            ...timeOperations()
        }, incrementOperationCount)
    }, conditionallyEvaluate),
    ...unconditionalFlowControlOperations()
});
export const cloneStack = (stack) => 
// tslint:disable-next-line:readonly-array
stack.reduce((newStack, element) => {
    // tslint:disable-next-line:no-expression-statement
    newStack.push(element.slice());
    return newStack;
}, []);
/**
 * TODO: describe
 */
export const createCommonInternalProgramState = (instructions, stack = [] // tslint:disable-line:readonly-array
) => ({
    alternateStack: [],
    executionStack: [],
    instructions,
    ip: 0,
    lastCodeSeparator: -1,
    operationCount: 0,
    signatureOperationsCount: 0,
    stack
});
/**
 * This is a meaningless but complete `CommonExternalProgramState`, useful for
 * testing and debugging.
 */
export const createEmptyCommonExternalProgramState = () => ({
    correspondingOutputHash: new Uint8Array(32 /* length */).fill(1 /* correspondingOutputHash */),
    locktime: 0,
    outpointIndex: 0,
    outpointTransactionHash: new Uint8Array(32 /* length */).fill(2 /* outpointTransactionHash */),
    outputValue: BigInt(0),
    sequenceNumber: 0,
    transactionOutpointsHash: new Uint8Array(32 /* length */).fill(3 /* transactionOutpointsHash */),
    transactionOutputsHash: new Uint8Array(32 /* length */).fill(4 /* transactionOutputsHash */),
    transactionSequenceNumbersHash: new Uint8Array(32 /* length */).fill(5 /* transactionSequenceNumbersHash */),
    version: 0
});
/**
 * Create an "empty" CommonProgramState, suitable for testing a VM against short scripts
 *
 * TODO: describe
 */
export const createEmptyCommonProgramState = (instructions, stack = [] // tslint:disable-line:readonly-array
) => ({
    ...createCommonInternalProgramState(instructions, stack),
    ...createEmptyCommonExternalProgramState()
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvY29tbW9uL2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7QUFTcEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3BELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUM5QyxPQUFPLEVBQ0wscUJBQXFCLEVBQ3JCLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFnQyxNQUFNLFVBQVUsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsZ0NBQWdDLEVBQ2hDLGtDQUFrQyxFQUNuQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDOUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBRXhDLGNBQWMsUUFBUSxDQUFDO0FBQ3ZCLGNBQWMsYUFBYSxDQUFDO0FBQzVCLGNBQWMsU0FBUyxDQUFDO0FBQ3hCLGNBQWMsU0FBUyxDQUFDO0FBQ3hCLGNBQWMsWUFBWSxDQUFDO0FBQzNCLGNBQWMseUJBQXlCLENBQUM7QUFJeEMsTUFBTSxDQUFOLElBQVkseUJBaUJYO0FBakJELFdBQVkseUJBQXlCO0lBQ25DLG1GQUFzRCxDQUFBO0lBQ3RELDhFQUFpRCxDQUFBO0lBQ2pELGdIQUFtRixDQUFBO0lBQ25GLHdHQUEyRSxDQUFBO0lBQzNFLGtHQUFxRSxDQUFBO0lBQ3JFLG1GQUFzRCxDQUFBO0lBQ3RELHVHQUEwRSxDQUFBO0lBQzFFLHNHQUF5RSxDQUFBO0lBQ3pFLDhHQUFpRixD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