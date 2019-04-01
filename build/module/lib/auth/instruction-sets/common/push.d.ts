 
import { MinimumProgramState, StackState } from '../../state';
import { Operation } from '../../virtual-machine';
import { CommonOpcodes } from './opcodes';
export declare enum PushOperationConstants {
    /**
     * OP_PUSHBYTES_75
     */
    maximumPushByteOperationSize = 75,
    OP_PUSHDATA_1 = 76,
    OP_PUSHDATA_2 = 77,
    OP_PUSHDATA_4 = 78,
    /**
     * OP_PUSHDATA_4
     */
    highestPushDataOpcode = 78,
    /**
     * For OP_1 to OP_16, `opcode` is the number offset by `0x50` (80):
     *
     * `OP_N = 0x50 + N`
     *
     * OP_0 is really OP_PUSHBYTES_0 (`0x00`), so it does not follow this pattern.
     */
    pushNumberOpcodesOffset = 80,
    /** OP_1 through OP_16 */
    pushNumberOpcodes = 16,
    /**
     * 256 - 1
     */
    maximumPushData1Size = 255,
    /**
     * Standard consensus parameter for most Bitcoin forks.
     */
    maximumPushSize = 520,
    /**
     * 256 ** 2 - 1
     */
    maximumPushData2Size = 65536,
    /**
     * 256 ** 4 - 1
     */
    maximumPushData4Size = 4294967295
}
/**
 * Prefix a `Uint8Array` with the proper opcode and push length bytes (if
 * necessary) to create a push instruction for `data`.
 *
 * Note, the maximum `bytecode` length which can be encoded for a push in the
 * Bitcoin system is `4294967295` (~4GB). This method assumes a smaller input – if
 * `bytecode` has the potential to be longer, it should be checked (and the
 * error handled) prior to calling this method.
 *
 * @param data the Uint8Array to push to the stack
 */
export declare const prefixDataPush: (data: Uint8Array) => Uint8Array;
export declare const pushByteOpcodes: ReadonlyArray<CommonOpcodes>;
export declare const pushOperation: <Opcodes, ProgramState extends StackState<Uint8Array> & MinimumProgramState<Opcodes>>() => Operation<ProgramState>;
export declare const pushOperations: <Opcodes, ProgramState extends StackState<Uint8Array> & MinimumProgramState<Opcodes>>() => {
    readonly [opcode: number]: Operation<ProgramState>;
};
export declare const pushNumberOpcodes: ReadonlyArray<CommonOpcodes>;
export declare const pushNumberOperations: <Opcodes, ProgramState extends StackState<Uint8Array> & MinimumProgramState<Opcodes>>() => {
    readonly [opcode: number]: Operation<ProgramState>;
};
