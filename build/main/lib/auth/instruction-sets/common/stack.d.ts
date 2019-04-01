 
import { CommonAuthenticationError, ErrorState, StackState } from './common';
import { CommonOpcodes } from './opcodes';
export declare const opDup: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opDrop: <State extends StackState<Uint8Array>>() => (state: State) => State;
export declare const stackOperations: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => {
    [CommonOpcodes.OP_DUP]: (state: State) => State;
    [CommonOpcodes.OP_DROP]: (state: State) => State;
};
