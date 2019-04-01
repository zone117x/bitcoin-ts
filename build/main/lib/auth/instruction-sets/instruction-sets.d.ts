 
export * from './bitcoin/bitcoin';
export * from './bitcoin-cash/bitcoin-cash';
export * from './common/common';
export interface AuthenticationInstructionPush<Opcodes = number> {
    /**
     * The data to be pushed to the stack.
     */
    readonly data: Uint8Array;
    /**
     * The opcode used to serialize this data.
     */
    readonly opcode: Opcodes;
}
export interface AuthenticationInstructionOperation<Opcodes = number> {
    /**
     * The opcode of this instruction's operation.
     */
    readonly opcode: Opcodes;
}
/**
 * A properly-formed instruction used by an `AuthenticationVirtualMachine`.
 */
export declare type AuthenticationInstruction<Opcodes = number> = AuthenticationInstructionPush<Opcodes> | AuthenticationInstructionOperation<Opcodes>;
export declare type AuthenticationInstructions<Opcodes = number> = Array<AuthenticationInstruction<Opcodes>>;
export interface ParsedAuthenticationInstructionPushMalformedLength<Opcodes = number> {
    /**
     * The expected number of length bytes (`length.length`) for this `PUSHDATA` operation.
     */
    readonly expectedLengthBytes: Bytes.Uint8 | Bytes.Uint16 | Bytes.Uint32;
    /**
     * The length `Uint8Array` provided. This instruction is malformed because the length of this `Uint8Array` is shorter than the `expectedLengthBytes`.
     */
    readonly length: Uint8Array;
    readonly malformed: true;
    readonly opcode: Opcodes;
}
export interface ParsedAuthenticationInstructionPushMalformedData<Opcodes = number> {
    /**
     * The data `Uint8Array` provided. This instruction is malformed because the length of this `Uint8Array` is shorter than the `expectedDataBytes`.
     */
    readonly data: Uint8Array;
    /**
     * The expected number of data bytes (`data.length`) for this push operation.
     */
    readonly expectedDataBytes: number;
    readonly malformed: true;
    readonly opcode: Opcodes;
}
export declare type ParsedAuthenticationInstructionMalformed<Opcodes = number> = ParsedAuthenticationInstructionPushMalformedLength<Opcodes> | ParsedAuthenticationInstructionPushMalformedData<Opcodes>;
/**
 * A potentially-malformed `AuthenticationInstruction`. If `malformed` is
 * `true`, this could be either
 * `ParsedAuthenticationInstructionPushMalformedLength` or
 * `ParsedAuthenticationInstructionPushMalformedData`
 *
 * If the final instruction is a push operation which requires more bytes than
 * are available in the remaining portion of a serialized script, that
 * instruction will have a `malformed` property with a value of `true`.
 * .
 */
export declare type ParsedAuthenticationInstruction<Opcodes = number> = AuthenticationInstruction<Opcodes> | ParsedAuthenticationInstructionMalformed<Opcodes>;
/**
 * An array of authentication instructions which may end with a malformed
 * instruction.
 *
 * **Implementation note**: this type can be improved by only marking the final
 * element as potentially malformed. This is waiting on:
 * https://github.com/Microsoft/TypeScript/issues/1360
 *
 * The following type can be used when it doesn't produce the error,
 * `A rest element must be last in a tuple type. [1256]`:
 * ```ts
 * export type ParsedAuthenticationInstructions<Opcodes = number> = [
 *   ...AuthenticationInstruction<Opcodes>,
 *   ParsedAuthenticationInstruction<Opcodes>
 * ];
 * ```
 */
export declare type ParsedAuthenticationInstructions<Opcodes = number> = Array<AuthenticationInstruction<Opcodes> | ParsedAuthenticationInstruction<Opcodes>>;
export declare const authenticationInstructionIsMalformed: <Opcodes>(instruction: ParsedAuthenticationInstruction<Opcodes>) => instruction is ParsedAuthenticationInstructionMalformed<Opcodes>;
export declare const authenticationInstructionsAreMalformed: <Opcodes>(instructions: ParsedAuthenticationInstruction<Opcodes>[]) => instructions is ParsedAuthenticationInstructionMalformed<Opcodes>[];
export declare const authenticationInstructionsAreNotMalformed: <Opcodes>(instructions: ParsedAuthenticationInstruction<Opcodes>[]) => instructions is AuthenticationInstruction<Opcodes>[];
export declare enum Bytes {
    Uint8 = 1,
    Uint16 = 2,
    Uint32 = 4
}
/**
 * Note: this implementation assumes `script` is defined and long enough to read
 * the specified number of bytes. If necessary, validation should be done before
 * calling this method.
 *
 * @param script the Uint8Array from which to read
 * @param index the index from which to begin reading
 * @param length the number of bytes to read
 */
export declare const readLittleEndianNumber: (script: Uint8Array, index: number, length: Bytes) => number;
/**
 * Note: this implementation assumes `script` is defined and long enough to
 * write the specified number of bytes. It also assumes the provided `number` is
 * representable in `length` bytes.
 *
 * If necessary, validation should be done before calling this method.
 *
 * @param script the Uint8Array to which the number should be written
 * @param index the index at which to begin reading
 * @param length the number of bytes to use
 * @param value the number to write at `script[index]`
 */
export declare const writeLittleEndianNumber: (script: Uint8Array, index: number, length: Bytes, value: number) => Uint8Array;
export declare const numberToLittleEndianBin: (value: number, length: Bytes) => Uint8Array;
/**
 * Returns the number of bytes used to indicate the length of the push in this
 * operation.
 * @param opcode an opcode between 0x00 and 0x4e
 */
export declare const lengthBytesForPushOpcode: (opcode: number) => number;
/**
 * Parse one instruction from the provided script.
 *
 * Returns an object with an `instruction` referencing a
 * `ParsedAuthenticationInstruction`, and a `nextIndex` indicating the next
 * index from which to read. If the next index is greater than or equal to the
 * length of the script, the script has been fully parsed.
 *
 * The final `ParsedAuthenticationInstruction` from a serialized script may be
 * malformed if 1) the final operation is a push and 2) too few bytes remain for
 * the push operation to complete.
 *
 * @param script the script from which to read the next instruction
 * @param index the offset from which to begin reading
 */
export declare const readAuthenticationInstruction: <Opcodes = number>(script: Uint8Array, index: number) => {
    readonly instruction: ParsedAuthenticationInstruction<Opcodes>;
    readonly nextIndex: number;
};
/**
 * Parse a serialized script into `ParsedAuthenticationInstructions`. The method
 * `authenticationInstructionsAreMalformed` can be used to check if these
 * instructions include a malformed instruction. If not, they are valid
 * `AuthenticationInstructions`.
 *
 * This implementation is common to most bitcoin forks, but the type parameter
 * can be used to strongly type the resulting instructions. For example:
 *
 * ```js
 *  const instructions = parseScript<BitcoinCashOpcodes>(script);
 * ```
 *
 * @param script the serialized script to parse
 */
export declare const parseScript: <Opcodes = number>(script: Uint8Array) => ParsedAuthenticationInstruction<Opcodes>[];
export declare const disassembleParsedAuthenticationInstructionMalformed: <Opcodes = number>(opcodes: {
    readonly [opcode: number]: string;
}, instruction: ParsedAuthenticationInstructionMalformed<Opcodes>) => string;
export declare const disassembleAuthenticationInstruction: <Opcodes = number>(opcodes: {
    readonly [opcode: number]: string;
}, instruction: AuthenticationInstruction<Opcodes>) => string;
export declare const disassembleParsedAuthenticationInstruction: <Opcodes = number>(opcodes: {
    readonly [opcode: number]: string;
}, instruction: ParsedAuthenticationInstruction<Opcodes>) => string;
/**
 * Disassemble an array of `ParsedAuthenticationInstructions` (including
 * potentially malformed instructions) into its ASM representation.
 *
 * @param script the array of instructions to disassemble
 */
export declare const disassembleParsedAuthenticationInstructions: <Opcodes = number>(opcodes: {
    readonly [opcode: number]: string;
}, instructions: ReadonlyArray<ParsedAuthenticationInstruction<Opcodes>>) => string;
/**
 * Disassemble a serialized script into a lossless ASM representation.
 *
 * TODO: a similar method which re-formats ASM strings, converting HexLiterals to Script Numbers or UTF8Literals.
 *
 * @param opcodes the set to use when determining the name of opcodes, e.g. `BitcoinCashOpcodes`
 * @param script the serialized script to disassemble
 */
export declare const disassembleScript: <Opcode = number>(opcodes: {
    readonly [opcode: number]: string;
}, script: Uint8Array) => string;
/**
 * Disassemble a serialized BCH script into its ASM representation.
 * @param script the serialized script to disassemble
 */
export declare const disassembleScriptBCH: (script: Uint8Array) => string;
/**
 * Disassemble a serialized BTC script into its ASM representation.
 * @param script the serialized script to disassemble
 */
export declare const disassembleScriptBTC: (script: Uint8Array) => string;
export declare const serializeAuthenticationInstruction: <Opcodes = number>(instruction: AuthenticationInstruction<Opcodes>) => Uint8Array;
export declare const serializeParsedAuthenticationInstructionMalformed: <Opcodes = number>(instruction: ParsedAuthenticationInstructionMalformed<Opcodes>) => Uint8Array;
export declare const serializeParsedAuthenticationInstruction: <Opcodes = number>(instruction: ParsedAuthenticationInstruction<Opcodes>) => Uint8Array;
export declare const serializeAuthenticationInstructions: <Opcodes = number>(instructions: ReadonlyArray<AuthenticationInstruction<Opcodes>>) => Uint8Array;
export declare const serializeParsedAuthenticationInstructions: <Opcodes = number>(instructions: ReadonlyArray<ParsedAuthenticationInstruction<Opcodes>>) => Uint8Array;
