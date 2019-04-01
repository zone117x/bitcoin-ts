 
import { Secp256k1 } from '../../../crypto/crypto';
import { AuthenticationVirtualMachine, InstructionSet } from '../../virtual-machine';
import { AuthenticationProgram, CommonProgramInternalState, Ripemd160, Sha256, TransactionInputState } from '../common/common';
import { AuthenticationInstruction } from '../instruction-sets';
import { BitcoinCashOpcodes } from './bitcoin-cash-opcodes';
export { BitcoinCashOpcodes };
export declare enum BitcoinCashAuthenticationError {
    exceededMaximumOperationCount = "Script exceeded the maximum operation count (201 operations).",
    malformedP2shScript = "Redeem script was malformed prior to P2SH evaluation."
}
export interface BitcoinCashAuthenticationProgramExternalState extends TransactionInputState {
}
export interface BitcoinCashAuthenticationProgramInternalState<Opcodes = BitcoinCashOpcodes, Errors = BitcoinCashAuthenticationError> extends CommonProgramInternalState<Opcodes, Errors> {
}
export interface BitcoinCashAuthenticationProgramState<Opcodes = BitcoinCashOpcodes, Errors = BitcoinCashAuthenticationError> extends BitcoinCashAuthenticationProgramExternalState, BitcoinCashAuthenticationProgramInternalState<Opcodes, Errors> {
}
export declare const bitcoinCashInstructionSet: (sha256: Sha256, ripemd160: Ripemd160, secp256k1: Secp256k1) => InstructionSet<BitcoinCashAuthenticationProgramState<BitcoinCashOpcodes, BitcoinCashAuthenticationError>>;
export declare const isPayToScriptHash: <Opcodes>(verificationInstructions: ReadonlyArray<AuthenticationInstruction<Opcodes>>) => boolean;
/**
 * From C++ implementation:
 * Note that IsPushOnly() *does* consider OP_RESERVED to be a push-type
 * opcode, however execution of OP_RESERVED fails, so it's not relevant to
 * P2SH/BIP62 as the scriptSig would fail prior to the P2SH special
 * validation code being executed.
 */
/**
 * TODO: describe
 * @param program TODO
 * @param instructions TODO
 * @param stack TODO
 */
export declare const createBitcoinCashProgramState: <Opcodes = BitcoinCashOpcodes>(instructions: ReadonlyArray<AuthenticationInstruction<Opcodes>>, stack: Uint8Array[], programState: BitcoinCashAuthenticationProgramExternalState) => BitcoinCashAuthenticationProgramState<Opcodes, BitcoinCashAuthenticationError>;
export declare const createEmptyBitcoinCashProgramState: (instructions: ReadonlyArray<AuthenticationInstruction<BitcoinCashOpcodes>>, stack?: Uint8Array[] | undefined) => BitcoinCashAuthenticationProgramState<BitcoinCashOpcodes, BitcoinCashAuthenticationError>;
/**
 * Check whether a resulting `BitcoinCashAuthenticationProgramState` is valid
 * according to network consensus rules.
 *
 * @param state the `BitcoinCashAuthenticationProgramState` to validate
 */
export declare const validateBitcoinCashAuthenticationProgramState: (state: BitcoinCashAuthenticationProgramState<BitcoinCashOpcodes, BitcoinCashAuthenticationError>) => boolean;
export declare const evaluateBitcoinCashAuthenticationProgram: <Opcodes = BitcoinCashOpcodes>(vm: AuthenticationVirtualMachine<BitcoinCashAuthenticationProgramState<Opcodes, BitcoinCashAuthenticationError>>, program: AuthenticationProgram<Opcodes, BitcoinCashAuthenticationProgramExternalState>) => BitcoinCashAuthenticationProgramState<Opcodes, BitcoinCashAuthenticationError>;
export declare const instantiateBitcoinCashVirtualMachine: () => Promise<AuthenticationVirtualMachine<BitcoinCashAuthenticationProgramState<BitcoinCashOpcodes, BitcoinCashAuthenticationError>>>;
