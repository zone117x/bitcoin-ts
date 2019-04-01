 
import { CommonState, StackState } from '../../state';
import { Operation } from '../../virtual-machine';
import { CommonAuthenticationError, ErrorState, ExecutionStackState } from './common';
import { CommonOpcodes } from './opcodes';
export declare const opVerify: <State extends StackState<Uint8Array> & ErrorState<Errors, CommonAuthenticationError>, Errors>() => Operation<State>;
export declare const conditionalFlowControlOperations: <Opcodes, State extends CommonState<Opcodes, Errors>, Errors>() => {
    [CommonOpcodes.OP_VERIFY]: Operation<State>;
};
export declare const opIf: <State extends StackState<Uint8Array> & ExecutionStackState & ErrorState<Errors, CommonAuthenticationError>, Errors>() => Operation<State>;
export declare const opNotIf: <State extends StackState<Uint8Array> & ExecutionStackState & ErrorState<Errors, CommonAuthenticationError>, Errors>() => Operation<State>;
export declare const opEndIf: <State extends ExecutionStackState & ErrorState<Errors, CommonAuthenticationError>, Errors>() => Operation<State>;
export declare const opElse: <State extends ExecutionStackState & ErrorState<Errors, CommonAuthenticationError>, Errors>() => Operation<State>;
export declare const unconditionalFlowControlOperations: <Opcodes, State extends CommonState<Opcodes, Errors>, Errors>() => {
    [CommonOpcodes.OP_IF]: Operation<State>;
    [CommonOpcodes.OP_NOTIF]: Operation<State>;
    [CommonOpcodes.OP_ELSE]: Operation<State>;
    [CommonOpcodes.OP_ENDIF]: Operation<State>;
};
