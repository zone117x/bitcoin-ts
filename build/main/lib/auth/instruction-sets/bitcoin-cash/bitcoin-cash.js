"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: unimplemented consensus rules – sig op count, max script length, etc.
// TODO: error if missing ENDIF
/*
// before: (state: BitcoinCashAuthenticationProgramState) => {
//   // tslint:disable-next-line:no-object-mutation no-expression-statement
//   state.ip++;
//   const operation = state.instructions[state.ip];
//   // tslint:disable-next-line:no-if-statement
//   if (operation !== undefined) {
//     // tslint:disable-next-line:no-object-mutation no-expression-statement
//     state.operationCount++;
//     // tslint:disable-next-line:no-if-statement
//     if (state.operationCount > CommonConsensus.maximumOperationCount) {
//       return applyError(
//         BitcoinCashAuthenticationError.exceededMaximumOperationCount,
//         state
//       );
//     }
//   }
//   return state;
// },
*/
const crypto_1 = require("../../../crypto/crypto");
const virtual_machine_1 = require("../../virtual-machine");
const common_1 = require("../common/common");
const instruction_sets_1 = require("../instruction-sets");
const bitcoin_cash_opcodes_1 = require("./bitcoin-cash-opcodes");
exports.BitcoinCashOpcodes = bitcoin_cash_opcodes_1.BitcoinCashOpcodes;
var BitcoinCashAuthenticationError;
(function (BitcoinCashAuthenticationError) {
    BitcoinCashAuthenticationError["exceededMaximumOperationCount"] = "Script exceeded the maximum operation count (201 operations).";
    BitcoinCashAuthenticationError["malformedP2shScript"] = "Redeem script was malformed prior to P2SH evaluation.";
})(BitcoinCashAuthenticationError = exports.BitcoinCashAuthenticationError || (exports.BitcoinCashAuthenticationError = {}));
exports.bitcoinCashInstructionSet = (sha256, ripemd160, secp256k1) => (Object.assign({ clone: (state) => (Object.assign({}, (state.error !== undefined ? { error: state.error } : {}), { alternateStack: state.alternateStack.slice(), correspondingOutputHash: state.correspondingOutputHash.slice(), executionStack: state.executionStack.slice(), instructions: state.instructions.slice(), ip: state.ip, lastCodeSeparator: state.lastCodeSeparator, locktime: state.locktime, operationCount: state.operationCount, outpointIndex: state.outpointIndex, outpointTransactionHash: state.outpointTransactionHash.slice(), outputValue: state.outputValue, sequenceNumber: state.sequenceNumber, signatureOperationsCount: state.signatureOperationsCount, stack: state.stack.slice(), transactionOutpointsHash: state.transactionOutpointsHash.slice(), transactionOutputsHash: state.transactionOutputsHash.slice(), transactionSequenceNumbersHash: state.transactionSequenceNumbersHash.slice(), version: state.version })), continue: (state) => state.error === undefined && state.ip < state.instructions.length, operations: Object.assign({}, common_1.commonOperations(sha256, ripemd160, secp256k1)) }, common_1.undefinedOperation()));
exports.isPayToScriptHash = (verificationInstructions) => verificationInstructions.length === 3 /* length */ &&
    verificationInstructions[0].opcode ===
        bitcoin_cash_opcodes_1.BitcoinCashOpcodes.OP_HASH160 &&
    verificationInstructions[1].opcode ===
        bitcoin_cash_opcodes_1.BitcoinCashOpcodes.OP_PUSHBYTES_20 &&
    verificationInstructions[2 /* lastElement */]
        .opcode === bitcoin_cash_opcodes_1.BitcoinCashOpcodes.OP_EQUAL;
// const isPayToScriptHash = (lockingScript: Uint8Array) =>
//   lockingScript.length === PayToScriptHash.length &&
//   lockingScript[0] === BitcoinCashOpcodes.OP_HASH160 &&
//   lockingScript[1] === BitcoinCashOpcodes.OP_PUSHBYTES_20 &&
//   lockingScript[PayToScriptHash.lastElement] === BitcoinCashOpcodes.OP_EQUAL;
// const enum P2shError {
//   asm = '[P2SH error]',
//   pushOnly = 'P2SH error: unlockingScript must be push-only.',
//   emptyStack = 'P2SH error: unlockingScript must not leave an empty stack.'
// }
/**
 * From C++ implementation:
 * Note that IsPushOnly() *does* consider OP_RESERVED to be a push-type
 * opcode, however execution of OP_RESERVED fails, so it's not relevant to
 * P2SH/BIP62 as the scriptSig would fail prior to the P2SH special
 * validation code being executed.
 */
// const isPushOnly = (operations: ReadonlyArray<number>) =>
//   operations.every(value => value < BitcoinCashOpcodes.OP_16);
/**
 * TODO: describe
 * @param program TODO
 * @param instructions TODO
 * @param stack TODO
 */
exports.createBitcoinCashProgramState = (instructions, stack, // tslint:disable-line:readonly-array
programState) => (Object.assign({}, common_1.createCommonInternalProgramState(instructions, stack), programState));
exports.createEmptyBitcoinCashProgramState = common_1.createEmptyCommonProgramState;
/**
 * Check whether a resulting `BitcoinCashAuthenticationProgramState` is valid
 * according to network consensus rules.
 *
 * @param state the `BitcoinCashAuthenticationProgramState` to validate
 */
exports.validateBitcoinCashAuthenticationProgramState = (state) => state.error !== undefined &&
    state.stack.length === 1 &&
    common_1.stackElementIsTruthy(state.stack[0]);
exports.evaluateBitcoinCashAuthenticationProgram = (vm, program) => {
    const unlockingResult = vm.evaluate(exports.createBitcoinCashProgramState(program.initializationInstructions, [], program.state));
    // tslint:disable-next-line:no-if-statement
    if (unlockingResult.error !== undefined) {
        return unlockingResult;
    }
    const lockingResult = vm.evaluate(exports.createBitcoinCashProgramState(program.verificationInstructions, unlockingResult.stack, program.state));
    // tslint:disable-next-line:no-if-statement
    if (!exports.isPayToScriptHash(program.verificationInstructions)) {
        return lockingResult;
    }
    const p2shStack = common_1.cloneStack(unlockingResult.stack);
    // tslint:disable-next-line: strict-boolean-expressions
    const p2shScript = p2shStack.pop() || Uint8Array.of();
    const p2shInstructions = instruction_sets_1.parseScript(p2shScript);
    return instruction_sets_1.authenticationInstructionsAreMalformed(p2shInstructions)
        ? Object.assign({}, lockingResult, { error: BitcoinCashAuthenticationError.malformedP2shScript }) : vm.evaluate(exports.createBitcoinCashProgramState(p2shInstructions, p2shStack, program.state));
};
exports.instantiateBitcoinCashVirtualMachine = async () => {
    const [sha256, ripemd160, secp256k1] = await Promise.all([
        crypto_1.instantiateSha256(),
        crypto_1.instantiateRipemd160(),
        crypto_1.instantiateSecp256k1()
    ]);
    return virtual_machine_1.createAuthenticationVirtualMachine(exports.bitcoinCashInstructionSet(sha256, ripemd160, secp256k1));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0Y29pbi1jYXNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvYml0Y29pbi1jYXNoL2JpdGNvaW4tY2FzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQTBCLENBQUMseUJBQXlCOztBQUVwRCw4RUFBOEU7QUFDOUUsK0JBQStCO0FBQy9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBbUJFO0FBRUYsbURBS2dDO0FBQ2hDLDJEQUkrQjtBQUMvQiw2Q0FZMEI7QUFDMUIsMERBSTZCO0FBQzdCLGlFQUE0RDtBQUVuRCw2QkFGQSx5Q0FBa0IsQ0FFQTtBQUUzQixJQUFZLDhCQUdYO0FBSEQsV0FBWSw4QkFBOEI7SUFDeEMsaUlBQStGLENBQUE7SUFDL0YsK0dBQTZFLENBQUE7QUFDL0UsQ0FBQyxFQUhXLDhCQUE4QixHQUE5QixzQ0FBOEIsS0FBOUIsc0NBQThCLFFBR3pDO0FBa0JZLFFBQUEseUJBQXlCLEdBQUcsQ0FDdkMsTUFBYyxFQUNkLFNBQW9CLEVBQ3BCLFNBQW9CLEVBQ21DLEVBQUUsQ0FBQyxpQkFDMUQsS0FBSyxFQUFFLENBQUMsS0FBNEMsRUFBRSxFQUFFLENBQUMsbUJBQ3BELENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQzVELGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxFQUM1Qyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLEVBQzlELGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxFQUM1QyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFDeEMsRUFBRSxFQUFFLEtBQUss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