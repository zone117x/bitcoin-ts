 
import { Ripemd160, Secp256k1, Sha256 } from '../../../crypto/crypto';
import { CommonState, StackState } from '../../state';
import { Operation } from '../../virtual-machine';
import { CommonAuthenticationError, ErrorState, MinimumProgramState } from './common';
import { CommonOpcodes } from './opcodes';
export { Ripemd160, Sha256, Secp256k1 };
export declare const opHash160: <Opcodes, ProgramState extends MinimumProgramState<Opcodes> & StackState<Uint8Array> & ErrorState<InstructionSetError, CommonAuthenticationError>, InstructionSetError>(sha256: Sha256, ripemd160: Ripemd160) => Operation<ProgramState>;
export declare const opCheckSig: <Opcodes, ProgramState extends CommonState<Opcodes, InstructionSetError>, InstructionSetError>(sha256: Sha256, secp256k1: Secp256k1) => Operation<ProgramState>;
export declare const opCheckMultiSig: <Opcodes, ProgramState extends CommonState<Opcodes, InstructionSetError>, InstructionSetError>(sha256: Sha256, secp256k1: Secp256k1) => (state: ProgramState) => ProgramState;
export declare const opCheckSigVerify: <Opcodes, ProgramState extends CommonState<Opcodes, InstructionSetError>, InstructionSetError>(sha256: Sha256, secp256k1: Secp256k1) => Operation<ProgramState>;
export declare const opCheckMultiSigVerify: <Opcodes, ProgramState extends CommonState<Opcodes, InstructionSetError>, InstructionSetError>(sha256: Sha256, secp256k1: Secp256k1) => Operation<ProgramState>;
export declare const cryptoOperations: <Opcodes, ProgramState extends CommonState<Opcodes, InstructionSetError>, InstructionSetError>(sha256: Sha256, ripemd160: Ripemd160, secp256k1: Secp256k1) => {
    [CommonOpcodes.OP_HASH160]: Operation<ProgramState>;
    [CommonOpcodes.OP_CHECKSIG]: Operation<ProgramState>;
    [CommonOpcodes.OP_CHECKSIGVERIFY]: Operation<ProgramState>;
    [CommonOpcodes.OP_CHECKMULTISIG]: (state: ProgramState) => ProgramState;
    [CommonOpcodes.OP_CHECKMULTISIGVERIFY]: Operation<ProgramState>;
};
