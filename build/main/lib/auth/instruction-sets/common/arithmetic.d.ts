 
import { CommonState, StackState } from '../../state';
import { CommonAuthenticationError, ErrorState } from './common';
import { CommonOpcodes } from './opcodes';
export declare const opNot: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opAdd: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opSub: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opBoolAnd: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opBoolOr: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opNumEqual: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opNumNotEqual: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opLessThan: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opLessThanOrEqual: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opGreaterThan: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const opGreaterThanOrEqual: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => (state: State) => State;
export declare const arithmeticOperations: <Opcodes, State extends CommonState<Opcodes, Errors>, Errors>() => {
    [CommonOpcodes.OP_NOT]: (state: State) => State;
    [CommonOpcodes.OP_ADD]: (state: State) => State;
    [CommonOpcodes.OP_SUB]: (state: State) => State;
    [CommonOpcodes.OP_BOOLAND]: (state: State) => State;
    [CommonOpcodes.OP_BOOLOR]: (state: State) => State;
    [CommonOpcodes.OP_NUMEQUAL]: (state: State) => State;
    [CommonOpcodes.OP_NUMNOTEQUAL]: (state: State) => State;
    [CommonOpcodes.OP_LESSTHAN]: (state: State) => State;
    [CommonOpcodes.OP_LESSTHANOREQUAL]: (state: State) => State;
    [CommonOpcodes.OP_GREATERTHAN]: (state: State) => State;
    [CommonOpcodes.OP_GREATERTHANOREQUAL]: (state: State) => State;
};
