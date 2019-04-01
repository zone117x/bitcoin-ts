 
import { BitcoinCashAuthenticationProgramState } from './instruction-sets/instruction-sets';
import { MinimumProgramState } from './state';
/**
 * Operations define the behavior of an opcode in an InstructionSet.
 *
 * Operations should be written as efficiently as possible, and may safely
 * mutate the ProgramState. If needed, the AuthenticationVirtualMachine
 * will clone the ProgramState before providing it to an operation.
 */
export declare type Operation<ProgramState> = (state: ProgramState) => ProgramState;
export declare type Guard<ProgramState> = (state: ProgramState) => boolean;
/**
 * An `InstructionSet` is a dictionary of methods which defines the operation of
 * an `AuthenticationVirtualMachine`. This instruction set is usually specific
 * to a single network, e.g. `BCH` or `BTC`.
 *
 * An instruction set is composed of `Operation`s which take a `ProgramState`
 * and return a `ProgramState`, as well as the `clone` and `continue`
 * "lifecycle" methods.
 *
 * Each operation is assigned to its `opcode` number (between 0 and 255). When
 * evaluating instructions, the virtual machine will select an Operation based
 * on its opcode. Any opcodes which are unassigned by the instruction set will
 * use the `undefined` operation.
 */
export interface InstructionSet<ProgramState> {
    /**
     * This method should take a ProgramState and return a new copy of that
     * ProgramState. It's used internally by `evaluate`, `step`, and `debug` to
     * prevent the AuthenticationVirtualMachine from mutating an input when
     * mutation is not desirable (e.g. when performance is not a priority).
     */
    readonly clone: Operation<ProgramState>;
    /**
     * This method should test the ProgramState to determine if execution should
     * continue. It's used internally by the `evaluate` and `debug` methods, and
     * should usually test for errors or program completion.
     */
    readonly continue: Guard<ProgramState>;
    /**
     * A mapping of `opcode` numbers (between 0 and 255) to `Operations`. When the
     * `AuthenticationVirtualMachine` encounters an instruction for the specified
     * `opcode`, the program state will be passed to the specified operation.
     */
    readonly operations: {
        readonly [opcode: number]: Operation<ProgramState>;
    };
    /**
     * This operation is called when an undefined opcode is encountered. It should
     * usually mark the ProgramState with an error.
     */
    readonly undefined: Operation<ProgramState>;
}
/**
 * A set of pure-functions allowing authentication programs to be evaluated and
 * inspected.
 */
export interface AuthenticationVirtualMachine<ProgramState> {
    /**
     * Return an array of program states by fully evaluating `state`, cloning and
     * adding each intermediate state to the returned array.
     */
    readonly debug: (state: Readonly<ProgramState>) => ProgramState[];
    /**
     * Return a new program state by cloning and fully evaluating `state`.
     * @param state the program state to evaluate
     */
    readonly evaluate: (state: Readonly<ProgramState>) => ProgramState;
    /**
     * Clones and return a new program state advanced by one step.
     * @param state the program state to advance
     */
    readonly step: (state: Readonly<ProgramState>) => ProgramState;
    /**
     * A faster, less-safe version of `step` which directly modifies the provided
     * program state.
     * @param state the program state to mutate
     */
    readonly stepMutate: (state: ProgramState) => ProgramState;
}
/**
 * Create an AuthenticationVirtualMachine to evaluate authentication programs
 * constructed from operations in the `instructionSet`.
 * @param instructionSet an `InstructionSet`
 */
export declare const createAuthenticationVirtualMachine: <ProgramState extends MinimumProgramState<number> = BitcoinCashAuthenticationProgramState<import("./instruction-sets/instruction-sets").BitcoinCashOpcodes, import("./instruction-sets/instruction-sets").BitcoinCashAuthenticationError>>(instructionSet: InstructionSet<ProgramState>) => AuthenticationVirtualMachine<ProgramState>;
