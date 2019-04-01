 
import { CommonState, StackState } from '../../state';
import { ErrorState } from './common';
import { CommonOpcodes } from './opcodes';
export declare const opCheckLockTimeVerify: <State extends StackState<Uint8Array> & ErrorState<Errors, import("./common").CommonAuthenticationError> & {
    readonly locktime: number;
}, Errors>() => (state: State) => State;
export declare const timeOperations: <Opcodes, State extends CommonState<Opcodes, Errors>, Errors>() => {
    [CommonOpcodes.OP_CHECKLOCKTIMEVERIFY]: (state: State) => State;
};
