 
import { CommonProgramInternalState, CommonState, ErrorState } from '../../state';
import { Operation } from '../../virtual-machine';
import { AuthenticationInstruction } from '../instruction-sets';
import { Ripemd160, Secp256k1, Sha256 } from './crypto';
export * from './push';
export * from '../../state';
export * from './stack';
export * from './types';
export * from './encoding';
export * from './signing-serialization';
export { Ripemd160, Sha256, Secp256k1 };
export declare enum CommonAuthenticationError {
    calledReturn = "Script called an OP_RETURN operation.",
    emptyStack = "Tried to read from an empty stack.",
    malformedPush = "Script must be long enough to push the requested number of bytes.",
    nonMinimalPush = "Push operations must use the smallest possible encoding.",
    exceedsMaximumPush = "Push exceeds the push size limit of 520 bytes.",
    failedVerify = "Script failed an OP_VERIFY operation.",
    invalidPublicKeyEncoding = "Encountered an improperly encoded public key.",
    invalidSignatureEncoding = "Encountered an improperly encoded signature.",
    invalidNaturalNumber = "Invalid input: this parameter requires a natural number.",
    insufficientPublicKeys = "An OP_CHECKMULTISIG operation requires signatures from more public keys than are provided.",
    invalidProtocolBugValue = "The protocol bug value must be a Script Number 0.",
    exceededMaximumOperationCount = "Script exceeded the maximum operation count (201 operations).",
    exceedsMaximumMultisigPublicKeyCount = "Script called an OP_CHECKMULTISIG which exceeds the maximum public key count (20 public keys).",
    unexpectedEndIf = "Encountered an OP_ENDIF which is not following a matching OP_IF.",
    unexpectedElse = "Encountered an OP_ELSE outside of an OP_IF ... OP_ENDIF block.",
    unknownOpcode = "Called an unknown opcode."
}
export declare enum CommonConsensus {
    maximumOperationCount = 201
}
export declare const applyError: <State extends ErrorState<Errors, CommonAuthenticationError>, Errors>(error: CommonAuthenticationError | Errors, state: State) => State;
export declare const undefinedOperation: <State extends ErrorState<Errors, CommonAuthenticationError>, Errors>() => {
    undefined: (state: State) => State;
};
export declare const commonOperations: <Opcodes, State extends CommonState<Opcodes, Errors>, Errors>(sha256: Sha256, ripemd160: Ripemd160, secp256k1: Secp256k1) => {
    readonly [opcodes: number]: Operation<State>;
};
export declare const cloneStack: (stack: ReadonlyArray<Readonly<Uint8Array>>) => Uint8Array[];
/**
 * TODO: describe
 */
export declare const createCommonInternalProgramState: <Opcodes, Errors>(instructions: ReadonlyArray<AuthenticationInstruction<Opcodes>>, stack?: Uint8Array[]) => CommonProgramInternalState<Opcodes, Errors, Uint8Array>;
/**
 * This is a meaningless but complete `CommonExternalProgramState`, useful for
 * testing and debugging.
 */
export declare const createEmptyCommonExternalProgramState: () => {
    correspondingOutputHash: Uint8Array;
    locktime: number;
    outpointIndex: number;
    outpointTransactionHash: Uint8Array;
    outputValue: bigint;
    sequenceNumber: number;
    transactionOutpointsHash: Uint8Array;
    transactionOutputsHash: Uint8Array;
    transactionSequenceNumbersHash: Uint8Array;
    version: number;
};
/**
 * Create an "empty" CommonProgramState, suitable for testing a VM against short scripts
 *
 * TODO: describe
 */
export declare const createEmptyCommonProgramState: <Opcodes, Errors>(instructions: ReadonlyArray<AuthenticationInstruction<Opcodes>>, stack?: Uint8Array[]) => CommonState<Opcodes, Errors>;
