 
import { Sha256 } from '../crypto/sha256';
import { Output, Transaction } from '../transaction';
import { CommonAuthenticationError } from './instruction-sets/common/common';
import { AuthenticationInstruction } from './instruction-sets/instruction-sets';
/**
 * State which applies to every input in a given transaction.
 */
export interface TransactionState {
    /**
     * A time or block height at which the transaction is considered valid (and
     * can be added to the block chain). This allows signers to create time-locked
     * transactions which may only become valid in the future.
     */
    readonly locktime: number;
    /**
     * A.K.A. `hashPrevouts`
     *
     * The double SHA256 of the serialization of all input outpoints. (See
     * BIP143 or Bitcoin Cash's Replay Protected Sighash spec for details.)
     */
    readonly transactionOutpointsHash: Uint8Array;
    readonly transactionOutputsHash: Uint8Array;
    readonly transactionSequenceNumbersHash: Uint8Array;
    readonly version: number;
}
/**
 * The state of a single transaction input.
 *
 * Note: this implementation does not attempt to allow for lazy evaluation of
 * hashes. More performance-critical applications may choose to reimplement this
 * interface (and subsequent VM operations) by declaring the
 * `transactionOutpointsHash`, `transactionOutputHash`,
 * `transactionOutputsHash`, and `transactionSequenceNumbersHash` properties to
 * be of type `() => Uint8Array` to avoid pre-calculating unused hashes.
 */
export interface TransactionInputState extends TransactionState {
    readonly correspondingOutputHash: Uint8Array;
    /**
     * The index (within the previous transaction) of the outpoint being spent by
     * this input.
     */
    readonly outpointIndex: number;
    /**
     * The hash/ID of the transaction from which the outpoint being spent by this
     * input originated.
     */
    readonly outpointTransactionHash: Uint8Array;
    /**
     * The value of the outpoint being spent by this input.
     */
    readonly outputValue: bigint;
    /**
     * The `sequenceNumber` associated with the input being validated. See
     * `Input.sequenceNumber` for details.
     */
    readonly sequenceNumber: number;
}
export interface MinimumProgramState<Opcodes = number> {
    readonly instructions: ReadonlyArray<AuthenticationInstruction<Opcodes>>;
    /**
     * Instruction Pointer – the array index of `instructions` which will be read
     * to identify the next instruction. Once `ip` exceeds the last index of
     * `instructions` (`ip === instructions.length`), evaluation is complete.
     */
    ip: number;
}
export interface StackState<StackType = Uint8Array> {
    stack: StackType[];
}
export interface ExecutionStackState {
    /**
     * An array of boolean values representing the current execution status of the
     * program. This allows the state to track nested conditional branches.
     *
     * The `OP_IF` and `OP_NOTIF` operations push a new boolean onto the
     * `executionStack`, `OP_ELSE` flips the top boolean, and `OP_ENDIF` removes
     * the top boolean from the `executionStack`.
     *
     * Other instructions are only evaluated if `executionStack` contains no
     * `false` items.
     *
     * A.K.A. `vfExec` in the C++ implementation.
     */
    executionStack: boolean[];
}
export interface ErrorState<InstructionSetError, CommonError = CommonAuthenticationError> {
    error?: CommonError | InstructionSetError;
}
export interface AuthenticationProgram<Opcodes = number, ExternalState = TransactionInputState> {
    /**
     * A.K.A. "parsed unlocking script" or `scriptSig`
     */
    readonly initializationInstructions: ReadonlyArray<AuthenticationInstruction<Opcodes>>;
    readonly state: ExternalState;
    /**
     * A.K.A. "parsed locking script" or `scriptPubKey`
     */
    readonly verificationInstructions: ReadonlyArray<AuthenticationInstruction<Opcodes>>;
}
export interface CommonProgramInternalState<Opcodes, InstructionSetError, StackType = Uint8Array> extends MinimumProgramState<Opcodes>, StackState, ExecutionStackState, ErrorState<InstructionSetError> {
    alternateStack: StackType[];
    /**
     * The `lastCodeSeparator` indicates the index of the most recently executed
     * `OP_CODESEPARATOR` instruction. In each of the signing serialization
     * algorithms, the `instructions` are sliced at `lastCodeSeparator`, and the
     * subarray is re-serialized. The resulting bytecode is called the
     * `scriptCode`, and is part of the data hashed to create the signing
     * serialization digest.
     *
     * By default, this is `-1`, which indicates that the whole `instructions`
     * array is included in the signing serialization.
     */
    lastCodeSeparator: number;
    operationCount: number;
    signatureOperationsCount: number;
}
export interface CommonState<Opcodes, InstructionSetError> extends CommonProgramInternalState<Opcodes, InstructionSetError>, TransactionInputState {
}
export declare enum AuthenticationProgramCreationError {
    initializationInstructions = "The lockingScript in the provided output is malformed.",
    verificationInstructions = "The unlockingScript in the selected input of the provided transaction is malformed."
}
/**
 * TODO: document
 * TODO: fix types
 */
export declare const createAuthenticationProgram: <Opcodes = number, ExternalState extends TransactionInputState = TransactionInputState>(spendingTransaction: Transaction, inputIndex: number, sourceOutput: Output, sha256: Sha256) => AuthenticationProgram<Opcodes, ExternalState> | AuthenticationProgramCreationError;
