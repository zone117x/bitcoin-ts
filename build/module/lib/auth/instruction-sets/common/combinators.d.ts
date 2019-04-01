 
import { ErrorState, StackState } from '../../state';
import { Operation } from '../../virtual-machine';
import { CommonAuthenticationError } from './common';
export declare const incrementOperationCount: <ProgramState extends {
    operationCount: number;
}>(operation: Operation<ProgramState>) => Operation<ProgramState>;
export declare const conditionallyEvaluate: <ProgramState extends {
    executionStack: boolean[];
}>(operation: Operation<ProgramState>) => Operation<ProgramState>;
/**
 * Map a function over each operation in an `InstructionSet.operations` object,
 * assigning the result to the same `opcode` in the resulting object.
 * @param operations an operations map from an `InstructionSet`
 * @param combinator a function to apply to each operation
 */
export declare const mapOverOperations: <ProgramState>(operations: {
    readonly [opcode: number]: Operation<ProgramState>;
}, combinator: (operation: Operation<ProgramState>) => Operation<ProgramState>) => {
    readonly [opcode: number]: Operation<ProgramState>;
};
export declare const useTwoScriptNumbers: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>(state: State, operation: (nextState: State, firstValue: bigint, secondValue: bigint) => State) => State;
/**
 * Pop one stack item off of `state.stack` and provide that item to `operation`.
 */
export declare const useOneStackItem: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>(state: State, operation: (nextState: State, value: Uint8Array) => State) => State;
/**
 * Return the provided state with the provided value pushed to its stack.
 * @param state the state to update and return
 * @param data the value to push to the stack
 */
export declare const pushToStack: <State extends StackState<Uint8Array>>(state: State, data: Uint8Array) => State;
export declare const combineOperations: <State>(firstOperation: Operation<State>, secondOperation: Operation<State>) => (state: State) => State;
