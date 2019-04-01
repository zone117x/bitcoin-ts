/* istanbul ignore file */ // TODO: stabilize & test
import { binToHex, flattenBinArray } from '../../utils/utils';
import { BitcoinCashOpcodes } from './bitcoin-cash/bitcoin-cash';
import { BitcoinOpcodes } from './bitcoin/bitcoin';
export * from './bitcoin/bitcoin';
export * from './bitcoin-cash/bitcoin-cash';
export * from './common/common';
export const authenticationInstructionIsMalformed = (instruction) => instruction
    .malformed === true;
export const authenticationInstructionsAreMalformed = (instructions
// tslint:disable-next-line:readonly-array
) => authenticationInstructionIsMalformed(instructions[instructions.length - 1]);
export const authenticationInstructionsAreNotMalformed = (instructions
// tslint:disable-next-line:readonly-array
) => !authenticationInstructionsAreMalformed(instructions);
export var Bytes;
(function (Bytes) {
    Bytes[Bytes["Uint8"] = 1] = "Uint8";
    Bytes[Bytes["Uint16"] = 2] = "Uint16";
    Bytes[Bytes["Uint32"] = 4] = "Uint32";
})(Bytes || (Bytes = {}));
/**
 * Note: this implementation assumes `script` is defined and long enough to read
 * the specified number of bytes. If necessary, validation should be done before
 * calling this method.
 *
 * @param script the Uint8Array from which to read
 * @param index the index from which to begin reading
 * @param length the number of bytes to read
 */
export const readLittleEndianNumber = (script, index, length) => {
    const view = new DataView(script.buffer, index, length);
    const readAsLittleEndian = true;
    return length === Bytes.Uint8
        ? view.getUint8(0)
        : length === Bytes.Uint16
            ? view.getUint16(0, readAsLittleEndian)
            : view.getUint32(0, readAsLittleEndian);
};
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
export const writeLittleEndianNumber = (script, index, length, value) => {
    const view = new DataView(script.buffer, index, length);
    const writeAsLittleEndian = true;
    // tslint:disable-next-line:no-expression-statement
    length === Bytes.Uint8
        ? view.setUint8(0, value) // tslint:disable-line: no-void-expression
        : length === Bytes.Uint16
            ? view.setUint16(0, value, writeAsLittleEndian) // tslint:disable-line: no-void-expression
            : view.setUint32(0, value, writeAsLittleEndian); // tslint:disable-line: no-void-expression
    return script;
};
export const numberToLittleEndianBin = (value, length) => {
    const array = new Uint8Array(length);
    return writeLittleEndianNumber(array, 0, length, value);
};
/**
 * Returns the number of bytes used to indicate the length of the push in this
 * operation.
 * @param opcode an opcode between 0x00 and 0x4e
 */
export const lengthBytesForPushOpcode = (opcode) => opcode < 76 /* OP_PUSHDATA_1 */
    ? 0
    : opcode === 76 /* OP_PUSHDATA_1 */
        ? Bytes.Uint8
        : opcode === 77 /* OP_PUSHDATA_2 */
            ? Bytes.Uint16
            : Bytes.Uint32;
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
// tslint:disable-next-line:cyclomatic-complexity
export const readAuthenticationInstruction = (script, index) => {
    const opcode = script[index];
    // tslint:disable-next-line:no-if-statement
    if (opcode > 78 /* OP_PUSHDATA_4 */) {
        return {
            instruction: {
                opcode: opcode
            },
            nextIndex: index + 1
        };
    }
    const lengthBytes = lengthBytesForPushOpcode(opcode);
    const pushBytes = lengthBytes === 0;
    // tslint:disable-next-line:no-if-statement
    if (!pushBytes && index + lengthBytes >= script.length) {
        const sliceStart = index + 1;
        const sliceEnd = sliceStart + lengthBytes;
        return {
            instruction: {
                expectedLengthBytes: lengthBytes,
                length: script.slice(sliceStart, sliceEnd),
                malformed: true,
                opcode: opcode
            },
            nextIndex: sliceEnd
        };
    }
    const dataBytes = pushBytes
        ? opcode
        : readLittleEndianNumber(script, index + 1, lengthBytes);
    const dataStart = index + 1 + lengthBytes;
    const dataEnd = dataStart + dataBytes;
    return {
        instruction: {
            data: script.slice(dataStart, dataEnd),
            ...(dataEnd > script.length
                ? {
                    expectedDataBytes: dataEnd - dataStart,
                    malformed: true
                }
                : undefined),
            opcode: opcode
        },
        nextIndex: dataEnd
    };
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
export const parseScript = (script) => {
    // tslint:disable-next-line:readonly-array
    const instructions = [];
    // tslint:disable-next-line:no-let
    let i = 0;
    while (i < script.length) {
        const { instruction, nextIndex } = readAuthenticationInstruction(script, i);
        // tslint:disable-next-line:no-expression-statement
        i = nextIndex;
        // tslint:disable-next-line:no-expression-statement
        instructions.push(instruction);
    }
    return instructions;
};
const isPush = (instruction) => 
// tslint:disable-next-line: strict-type-predicates
instruction.data !== undefined;
/**
 * OP_0 is the only single-word push. All other push instructions will
 * disassemble to multiple ASM words.
 */
const isMultiWordPush = (opcode) => opcode !== 0 /* OP_0 */;
const formatAsmPushHex = (data) => data.length > 0 ? `0x${binToHex(data)}` : '';
const formatMissingBytesAsm = (missing) => `[missing ${missing} byte${missing === 1 ? '' : 's'}]`;
const hasMalformedLength = (instruction) => 
// tslint:disable-next-line: strict-type-predicates
instruction
    .length !== undefined;
const isPushData = (pushOpcode) => lengthBytesForPushOpcode(pushOpcode) > 0;
export const disassembleParsedAuthenticationInstructionMalformed = (opcodes, instruction) => `${opcodes[instruction.opcode]} ${hasMalformedLength(instruction)
    ? `${formatAsmPushHex(instruction.length)}${formatMissingBytesAsm(instruction.expectedLengthBytes - instruction.length.length)}`
    : `${isPushData(instruction.opcode)
        ? `${instruction.expectedDataBytes} `
        : ''}${formatAsmPushHex(instruction.data)}${formatMissingBytesAsm(instruction.expectedDataBytes - instruction.data.length)}`}`;
export const disassembleAuthenticationInstruction = (opcodes, instruction) => `${opcodes[instruction.opcode]}${isPush(instruction) &&
    isMultiWordPush(instruction.opcode)
    ? ` ${isPushData(instruction.opcode)
        ? `${instruction.data.length} `
        : ''}${formatAsmPushHex(instruction.data)}`
    : ''}`;
export const disassembleParsedAuthenticationInstruction = (opcodes, instruction) => authenticationInstructionIsMalformed(instruction)
    ? disassembleParsedAuthenticationInstructionMalformed(opcodes, instruction)
    : disassembleAuthenticationInstruction(opcodes, instruction);
/**
 * Disassemble an array of `ParsedAuthenticationInstructions` (including
 * potentially malformed instructions) into its ASM representation.
 *
 * @param script the array of instructions to disassemble
 */
export const disassembleParsedAuthenticationInstructions = (opcodes, instructions) => instructions
    .map(instruction => disassembleParsedAuthenticationInstruction(opcodes, instruction))
    .join(' ');
/**
 * Disassemble a serialized script into a lossless ASM representation.
 *
 * TODO: a similar method which re-formats ASM strings, converting HexLiterals to Script Numbers or UTF8Literals.
 *
 * @param opcodes the set to use when determining the name of opcodes, e.g. `BitcoinCashOpcodes`
 * @param script the serialized script to disassemble
 */
export const disassembleScript = (opcodes, script) => disassembleParsedAuthenticationInstructions(opcodes, parseScript(script));
/**
 * Disassemble a serialized BCH script into its ASM representation.
 * @param script the serialized script to disassemble
 */
export const disassembleScriptBCH = (script) => disassembleParsedAuthenticationInstructions(BitcoinCashOpcodes, parseScript(script));
/**
 * Disassemble a serialized BTC script into its ASM representation.
 * @param script the serialized script to disassemble
 */
export const disassembleScriptBTC = (script) => disassembleParsedAuthenticationInstructions(BitcoinOpcodes, parseScript(script));
const getLengthBytes = (instruction) => numberToLittleEndianBin(instruction.data.length, lengthBytesForPushOpcode(instruction.opcode));
export const serializeAuthenticationInstruction = (instruction) => Uint8Array.from([
    instruction.opcode,
    ...(isPush(instruction)
        ? [
            ...(isPushData(instruction.opcode)
                ? getLengthBytes(instruction)
                : []),
            ...instruction.data
        ]
        : [])
]);
export const serializeParsedAuthenticationInstructionMalformed = (instruction) => Uint8Array.from([
    instruction.opcode,
    ...(hasMalformedLength(instruction)
        ? instruction.length
        : isPushData(instruction.opcode)
            ? numberToLittleEndianBin(instruction.expectedDataBytes, lengthBytesForPushOpcode(instruction.opcode))
            : []),
    ...(!hasMalformedLength(instruction) ? instruction.data : [])
]);
export const serializeParsedAuthenticationInstruction = (instruction) => authenticationInstructionIsMalformed(instruction)
    ? serializeParsedAuthenticationInstructionMalformed(instruction)
    : serializeAuthenticationInstruction(instruction);
export const serializeAuthenticationInstructions = (instructions) => flattenBinArray(instructions.map(serializeAuthenticationInstruction));
export const serializeParsedAuthenticationInstructions = (instructions) => flattenBinArray(instructions.map(serializeParsedAuthenticationInstruction));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb24tc2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYXV0aC9pbnN0cnVjdGlvbi1zZXRzL2luc3RydWN0aW9uLXNldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEJBQTBCLENBQUMseUJBQXlCO0FBRXBELE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDakUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRW5ELGNBQWMsbUJBQW1CLENBQUM7QUFDbEMsY0FBYyw2QkFBNkIsQ0FBQztBQUM1QyxjQUFjLGlCQUFpQixDQUFDO0FBeUdoQyxNQUFNLENBQUMsTUFBTSxvQ0FBb0MsR0FBRyxDQUNsRCxXQUFxRCxFQUNhLEVBQUUsQ0FDbkUsV0FBaUU7S0FDL0QsU0FBUyxLQUFLLElBQUksQ0FBQztBQUV4QixNQUFNLENBQUMsTUFBTSxzQ0FBc0MsR0FBRyxDQUNwRCxZQUF1RDtBQUN2RCwwQ0FBMEM7RUFDZ0MsRUFBRSxDQUM1RSxvQ0FBb0MsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRTlFLE1BQU0sQ0FBQyxNQUFNLHlDQUF5QyxHQUFHLENBQ3ZELFlBQXVEO0FBQ3ZELDBDQUEwQztFQUNpQixFQUFFLENBQzdELENBQUMsc0NBQXNDLENBQUMsWUFBWSxDQUFDLENBQUM7QUFTeEQsTUFBTSxDQUFOLElBQVksS0FJWDtBQUpELFdBQVksS0FBSztJQUNmLG1DQUFTLENBQUE7SUFDVCxxQ0FBVSxDQUFBO0lBQ1YscUNBQVUsQ0FBQTtBQUNaLENBQUMsRUFKVyxLQUFLLEtBQUwsS0FBSyxRQUloQjtBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0JBQXNC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