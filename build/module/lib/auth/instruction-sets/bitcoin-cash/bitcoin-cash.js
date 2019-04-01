/* istanbul ignore file */ // TODO: stabilize & test
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
import { instantiateRipemd160, instantiateSecp256k1, instantiateSha256 } from '../../../crypto/crypto';
import { createAuthenticationVirtualMachine } from '../../virtual-machine';
import { cloneStack, commonOperations, createCommonInternalProgramState, createEmptyCommonProgramState, stackElementIsTruthy, undefinedOperation } from '../common/common';
import { authenticationInstructionsAreMalformed, parseScript } from '../instruction-sets';
import { BitcoinCashOpcodes } from './bitcoin-cash-opcodes';
export { BitcoinCashOpcodes };
export var BitcoinCashAuthenticationError;
(function (BitcoinCashAuthenticationError) {
    BitcoinCashAuthenticationError["exceededMaximumOperationCount"] = "Script exceeded the maximum operation count (201 operations).";
    BitcoinCashAuthenticationError["malformedP2shScript"] = "Redeem script was malformed prior to P2SH evaluation.";
})(BitcoinCashAuthenticationError || (BitcoinCashAuthenticationError = {}));
export const bitcoinCashInstructionSet = (sha256, ripemd160, secp256k1) => ({
    clone: (state) => ({
        ...(state.error !== undefined ? { error: state.error } : {}),
        alternateStack: state.alternateStack.slice(),
        correspondingOutputHash: state.correspondingOutputHash.slice(),
        executionStack: state.executionStack.slice(),
        instructions: state.instructions.slice(),
        ip: state.ip,
        lastCodeSeparator: state.lastCodeSeparator,
        locktime: state.locktime,
        operationCount: state.operationCount,
        outpointIndex: state.outpointIndex,
        outpointTransactionHash: state.outpointTransactionHash.slice(),
        outputValue: state.outputValue,
        sequenceNumber: state.sequenceNumber,
        signatureOperationsCount: state.signatureOperationsCount,
        stack: state.stack.slice(),
        transactionOutpointsHash: state.transactionOutpointsHash.slice(),
        transactionOutputsHash: state.transactionOutputsHash.slice(),
        transactionSequenceNumbersHash: state.transactionSequenceNumbersHash.slice(),
        version: state.version
    }),
    continue: (state) => state.error === undefined && state.ip < state.instructions.length,
    operations: {
        ...commonOperations(sha256, ripemd160, secp256k1)
    },
    ...undefinedOperation()
});
export const isPayToScriptHash = (verificationInstructions) => verificationInstructions.length === 3 /* length */ &&
    verificationInstructions[0].opcode ===
        BitcoinCashOpcodes.OP_HASH160 &&
    verificationInstructions[1].opcode ===
        BitcoinCashOpcodes.OP_PUSHBYTES_20 &&
    verificationInstructions[2 /* lastElement */]
        .opcode === BitcoinCashOpcodes.OP_EQUAL;
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
export const createBitcoinCashProgramState = (instructions, stack, // tslint:disable-line:readonly-array
programState) => ({
    ...createCommonInternalProgramState(instructions, stack),
    ...programState
});
export const createEmptyBitcoinCashProgramState = createEmptyCommonProgramState;
/**
 * Check whether a resulting `BitcoinCashAuthenticationProgramState` is valid
 * according to network consensus rules.
 *
 * @param state the `BitcoinCashAuthenticationProgramState` to validate
 */
export const validateBitcoinCashAuthenticationProgramState = (state) => state.error !== undefined &&
    state.stack.length === 1 &&
    stackElementIsTruthy(state.stack[0]);
export const evaluateBitcoinCashAuthenticationProgram = (vm, program) => {
    const unlockingResult = vm.evaluate(createBitcoinCashProgramState(program.initializationInstructions, [], program.state));
    // tslint:disable-next-line:no-if-statement
    if (unlockingResult.error !== undefined) {
        return unlockingResult;
    }
    const lockingResult = vm.evaluate(createBitcoinCashProgramState(program.verificationInstructions, unlockingResult.stack, program.state));
    // tslint:disable-next-line:no-if-statement
    if (!isPayToScriptHash(program.verificationInstructions)) {
        return lockingResult;
    }
    const p2shStack = cloneStack(unlockingResult.stack);
    // tslint:disable-next-line: strict-boolean-expressions
    const p2shScript = p2shStack.pop() || Uint8Array.of();
    const p2shInstructions = parseScript(p2shScript);
    return authenticationInstructionsAreMalformed(p2shInstructions)
        ? {
            ...lockingResult,
            error: BitcoinCashAuthenticationError.malformedP2shScript
        }
        : vm.evaluate(createBitcoinCashProgramState(p2shInstructions, p2shStack, program.state));
};
export const instantiateBitcoinCashVirtualMachine = async () => {
    const [sha256, ripemd160, secp256k1] = await Promise.all([
        instantiateSha256(),
        instantiateRipemd160(),
        instantiateSecp256k1()
    ]);
    return createAuthenticationVirtualMachine(bitcoinCashInstructionSet(sha256, ripemd160, secp256k1));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0Y29pbi1jYXNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvYml0Y29pbi1jYXNoL2JpdGNvaW4tY2FzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7QUFFcEQsOEVBQThFO0FBQzlFLCtCQUErQjtBQUMvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CRTtBQUVGLE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUVsQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFFTCxrQ0FBa0MsRUFFbkMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBRUwsVUFBVSxFQUNWLGdCQUFnQixFQUVoQixnQ0FBZ0MsRUFDaEMsNkJBQTZCLEVBRzdCLG9CQUFvQixFQUVwQixrQkFBa0IsRUFDbkIsTUFBTSxrQkFBa0IsQ0FBQztBQUMxQixPQUFPLEVBRUwsc0NBQXNDLEVBQ3RDLFdBQVcsRUFDWixNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRTVELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxDQUFDO0FBRTlCLE1BQU0sQ0FBTixJQUFZLDhCQUdYO0FBSEQsV0FBWSw4QkFBOEI7SUFDeEMsaUlBQStGLENBQUE7SUFDL0YsK0dBQTZFLENBQUE7QUFDL0UsQ0FBQyxFQUhXLDhCQUE4QixLQUE5Qiw4QkFBOEIsUUFHekM7QUFrQkQsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQUcsQ0FDdkMsTUFBYyxFQUNkLFNBQW9CLEVBQ3BCLFNBQW9CLEVBQ21DLEVBQUUsQ0FBQyxDQUFDO0lBQzNELEtBQUssRUFBRSxDQUFDLEtBQTRDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUss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