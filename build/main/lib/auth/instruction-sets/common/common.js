"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const arithmetic_1 = require("./arithmetic");
const bitwise_1 = require("./bitwise");
const combinators_1 = require("./combinators");
const crypto_1 = require("./crypto");
const flow_control_1 = require("./flow-control");
const push_1 = require("./push");
const stack_1 = require("./stack");
const time_1 = require("./time");
__export(require("./push"));
__export(require("../../state"));
__export(require("./stack"));
__export(require("./types"));
__export(require("./encoding"));
__export(require("./signing-serialization"));
var CommonAuthenticationError;
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
})(CommonAuthenticationError = exports.CommonAuthenticationError || (exports.CommonAuthenticationError = {}));
var CommonConsensus;
(function (CommonConsensus) {
    CommonConsensus[CommonConsensus["maximumOperationCount"] = 201] = "maximumOperationCount";
})(CommonConsensus = exports.CommonConsensus || (exports.CommonConsensus = {}));
exports.applyError = (error, state) => (Object.assign({}, state, { error }));
exports.undefinedOperation = () => ({
    undefined: (state) => exports.applyError(CommonAuthenticationError.unknownOpcode, state)
});
exports.commonOperations = (sha256, ripemd160, secp256k1) => (Object.assign({}, combinators_1.mapOverOperations(Object.assign({}, push_1.pushOperations(), push_1.pushNumberOperations(), combinators_1.mapOverOperations(Object.assign({}, arithmetic_1.arithmeticOperations(), bitwise_1.bitwiseOperations(), crypto_1.cryptoOperations(sha256, ripemd160, secp256k1), flow_control_1.conditionalFlowControlOperations(), stack_1.stackOperations(), time_1.timeOperations()), combinators_1.incrementOperationCount)), combinators_1.conditionallyEvaluate), flow_control_1.unconditionalFlowControlOperations()));
exports.cloneStack = (stack) => 
// tslint:disable-next-line:readonly-array
stack.reduce((newStack, element) => {
    // tslint:disable-next-line:no-expression-statement
    newStack.push(element.slice());
    return newStack;
}, []);
/**
 * TODO: describe
 */
exports.createCommonInternalProgramState = (instructions, stack = [] // tslint:disable-line:readonly-array
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
exports.createEmptyCommonExternalProgramState = () => ({
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
exports.createEmptyCommonProgramState = (instructions, stack = [] // tslint:disable-line:readonly-array
) => (Object.assign({}, exports.createCommonInternalProgramState(instructions, stack), exports.createEmptyCommonExternalProgramState()));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvY29tbW9uL2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQTBCLENBQUMseUJBQXlCOzs7OztBQVNwRCw2Q0FBb0Q7QUFDcEQsdUNBQThDO0FBQzlDLCtDQUl1QjtBQUN2QixxQ0FBMEU7QUFDMUUsaURBR3dCO0FBQ3hCLGlDQUE4RDtBQUM5RCxtQ0FBMEM7QUFDMUMsaUNBQXdDO0FBRXhDLDRCQUF1QjtBQUN2QixpQ0FBNEI7QUFDNUIsNkJBQXdCO0FBQ3hCLDZCQUF3QjtBQUN4QixnQ0FBMkI7QUFDM0IsNkNBQXdDO0FBSXhDLElBQVkseUJBaUJYO0FBakJELFdBQVkseUJBQXlCO0lBQ25DLG1GQUFzRCxDQUFBO0lBQ3RELDhFQUFpRCxDQUFBO0lBQ2pELGdIQUFtRixDQUFBO0lBQ25GLHdHQUEyRSxDQUFBO0lBQzNFLGtHQUFxRSxDQUFBO0lBQ3JFLG1GQUFzRCxDQUFBO0lBQ3RELHVHQUEwRSxDQUFBO0lBQzFFLHNHQUF5RSxDQUFBO0lBQ3pFLDhHQUFpRixDQUFBO0lBQ2pGLGtKQUFxSCxDQUFBO0lBQ3JILDBHQUE2RSxDQUFBO0lBQzdFLDRIQUErRixDQUFBO0lBQy9GLG9LQUF1SSxDQUFBO0lBQ3ZJLGlIQUFvRixDQUFBO0lBQ3BGLDhHQUFpRixDQUFBO0lBQ2pGLHdFQUEyQyxDQUFBO0FBQzdDLENBQUMsRUFqQlcseUJBQXlCLEdBQXpCLGlDQUF5QixLQUF6QixpQ0FBeUIsUUFpQnBDO0FBRUQsSUFBWSxlQUVYO0FBRkQsV0FBWSxlQUFlO0lBQ3pCLHlGQUEyQixDQUFBO0FBQzdCLENBQUMsRUFGVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQUUxQjtBQUVZLFFBQUEsVUFBVSxHQUFHLENBQ3hCLEtBQXlDLEVBQ3pDLEtBQVksRUFDTCxFQUFFLENBQUMsbUJB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