 
import { CommonState, StackState } from '../../state';
import { Operation } from '../../virtual-machine';
import { CommonAuthenticationError, ErrorState } from './common';
import { CommonOpcodes } from './opcodes';
export declare const opEqual: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => Operation<State>;
export declare const opEqualVerify: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => Operation<State>;
export declare const bitwiseOperations: <Opcodes, State extends CommonState<Opcodes, Errors>, Errors>() => {
    [CommonOpcodes.OP_EQUAL]: Operation<State>;
    [CommonOpcodes.OP_EQUALVERIFY]: Operation<State>;
};
