"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
const bitcoin_cash_1 = require("./bitcoin-cash/bitcoin-cash");
const bitcoin_1 = require("./bitcoin/bitcoin");
__export(require("./bitcoin/bitcoin"));
__export(require("./bitcoin-cash/bitcoin-cash"));
__export(require("./common/common"));
exports.authenticationInstructionIsMalformed = (instruction) => instruction
    .malformed === true;
exports.authenticationInstructionsAreMalformed = (instructions
// tslint:disable-next-line:readonly-array
) => exports.authenticationInstructionIsMalformed(instructions[instructions.length - 1]);
exports.authenticationInstructionsAreNotMalformed = (instructions
// tslint:disable-next-line:readonly-array
) => !exports.authenticationInstructionsAreMalformed(instructions);
var Bytes;
(function (Bytes) {
    Bytes[Bytes["Uint8"] = 1] = "Uint8";
    Bytes[Bytes["Uint16"] = 2] = "Uint16";
    Bytes[Bytes["Uint32"] = 4] = "Uint32";
})(Bytes = exports.Bytes || (exports.Bytes = {}));
/**
 * Note: this implementation assumes `script` is defined and long enough to read
 * the specified number of bytes. If necessary, validation should be done before
 * calling this method.
 *
 * @param script the Uint8Array from which to read
 * @param index the index from which to begin reading
 * @param length the number of bytes to read
 */
exports.readLittleEndianNumber = (script, index, length) => {
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
exports.writeLittleEndianNumber = (script, index, length, value) => {
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
exports.numberToLittleEndianBin = (value, length) => {
    const array = new Uint8Array(length);
    return exports.writeLittleEndianNumber(array, 0, length, value);
};
/**
 * Returns the number of bytes used to indicate the length of the push in this
 * operation.
 * @param opcode an opcode between 0x00 and 0x4e
 */
exports.lengthBytesForPushOpcode = (opcode) => opcode < 76 /* OP_PUSHDATA_1 */
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
exports.readAuthenticationInstruction = (script, index) => {
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
    const lengthBytes = exports.lengthBytesForPushOpcode(opcode);
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
        : exports.readLittleEndianNumber(script, index + 1, lengthBytes);
    const dataStart = index + 1 + lengthBytes;
    const dataEnd = dataStart + dataBytes;
    return {
        instruction: Object.assign({ data: script.slice(dataStart, dataEnd) }, (dataEnd > script.length
            ? {
                expectedDataBytes: dataEnd - dataStart,
                malformed: true
            }
            : undefined), { opcode: opcode }),
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
exports.parseScript = (script) => {
    // tslint:disable-next-line:readonly-array
    const instructions = [];
    // tslint:disable-next-line:no-let
    let i = 0;
    while (i < script.length) {
        const { instruction, nextIndex } = exports.readAuthenticationInstruction(script, i);
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
const formatAsmPushHex = (data) => data.length > 0 ? `0x${utils_1.binToHex(data)}` : '';
const formatMissingBytesAsm = (missing) => `[missing ${missing} byte${missing === 1 ? '' : 's'}]`;
const hasMalformedLength = (instruction) => 
// tslint:disable-next-line: strict-type-predicates
instruction
    .length !== undefined;
const isPushData = (pushOpcode) => exports.lengthBytesForPushOpcode(pushOpcode) > 0;
exports.disassembleParsedAuthenticationInstructionMalformed = (opcodes, instruction) => `${opcodes[instruction.opcode]} ${hasMalformedLength(instruction)
    ? `${formatAsmPushHex(instruction.length)}${formatMissingBytesAsm(instruction.expectedLengthBytes - instruction.length.length)}`
    : `${isPushData(instruction.opcode)
        ? `${instruction.expectedDataBytes} `
        : ''}${formatAsmPushHex(instruction.data)}${formatMissingBytesAsm(instruction.expectedDataBytes - instruction.data.length)}`}`;
exports.disassembleAuthenticationInstruction = (opcodes, instruction) => `${opcodes[instruction.opcode]}${isPush(instruction) &&
    isMultiWordPush(instruction.opcode)
    ? ` ${isPushData(instruction.opcode)
        ? `${instruction.data.length} `
        : ''}${formatAsmPushHex(instruction.data)}`
    : ''}`;
exports.disassembleParsedAuthenticationInstruction = (opcodes, instruction) => exports.authenticationInstructionIsMalformed(instruction)
    ? exports.disassembleParsedAuthenticationInstructionMalformed(opcodes, instruction)
    : exports.disassembleAuthenticationInstruction(opcodes, instruction);
/**
 * Disassemble an array of `ParsedAuthenticationInstructions` (including
 * potentially malformed instructions) into its ASM representation.
 *
 * @param script the array of instructions to disassemble
 */
exports.disassembleParsedAuthenticationInstructions = (opcodes, instructions) => instructions
    .map(instruction => exports.disassembleParsedAuthenticationInstruction(opcodes, instruction))
    .join(' ');
/**
 * Disassemble a serialized script into a lossless ASM representation.
 *
 * TODO: a similar method which re-formats ASM strings, converting HexLiterals to Script Numbers or UTF8Literals.
 *
 * @param opcodes the set to use when determining the name of opcodes, e.g. `BitcoinCashOpcodes`
 * @param script the serialized script to disassemble
 */
exports.disassembleScript = (opcodes, script) => exports.disassembleParsedAuthenticationInstructions(opcodes, exports.parseScript(script));
/**
 * Disassemble a serialized BCH script into its ASM representation.
 * @param script the serialized script to disassemble
 */
exports.disassembleScriptBCH = (script) => exports.disassembleParsedAuthenticationInstructions(bitcoin_cash_1.BitcoinCashOpcodes, exports.parseScript(script));
/**
 * Disassemble a serialized BTC script into its ASM representation.
 * @param script the serialized script to disassemble
 */
exports.disassembleScriptBTC = (script) => exports.disassembleParsedAuthenticationInstructions(bitcoin_1.BitcoinOpcodes, exports.parseScript(script));
const getLengthBytes = (instruction) => exports.numberToLittleEndianBin(instruction.data.length, exports.lengthBytesForPushOpcode(instruction.opcode));
exports.serializeAuthenticationInstruction = (instruction) => Uint8Array.from([
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
exports.serializeParsedAuthenticationInstructionMalformed = (instruction) => Uint8Array.from([
    instruction.opcode,
    ...(hasMalformedLength(instruction)
        ? instruction.length
        : isPushData(instruction.opcode)
            ? exports.numberToLittleEndianBin(instruction.expectedDataBytes, exports.lengthBytesForPushOpcode(instruction.opcode))
            : []),
    ...(!hasMalformedLength(instruction) ? instruction.data : [])
]);
exports.serializeParsedAuthenticationInstruction = (instruction) => exports.authenticationInstructionIsMalformed(instruction)
    ? exports.serializeParsedAuthenticationInstructionMalformed(instruction)
    : exports.serializeAuthenticationInstruction(instruction);
exports.serializeAuthenticationInstructions = (instructions) => utils_1.flattenBinArray(instructions.map(exports.serializeAuthenticationInstruction));
exports.serializeParsedAuthenticationInstructions = (instructions) => utils_1.flattenBinArray(instructions.map(exports.serializeParsedAuthenticationInstruction));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb24tc2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYXV0aC9pbnN0cnVjdGlvbi1zZXRzL2luc3RydWN0aW9uLXNldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUEwQixDQUFDLHlCQUF5Qjs7Ozs7QUFFcEQsNkNBQThEO0FBQzlELDhEQUFpRTtBQUNqRSwrQ0FBbUQ7QUFFbkQsdUNBQWtDO0FBQ2xDLGlEQUE0QztBQUM1QyxxQ0FBZ0M7QUF5R25CLFFBQUEsb0NBQW9DLEdBQUcsQ0FDbEQsV0FBcUQsRUFDYSxFQUFFLENBQ25FLFdBQWlFO0tBQy9ELFNBQVMsS0FBSyxJQUFJLENBQUM7QUFFWCxRQUFBLHNDQUFzQyxHQUFHLENBQ3BELFlBQXVEO0FBQ3ZELDBDQUEwQztFQUNnQyxFQUFFLENBQzVFLDRDQUFvQyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFakUsUUFBQSx5Q0FBeUMsR0FBRyxDQUN2RCxZQUF1RDtBQUN2RCwwQ0FBMEM7RUFDaUIsRUFBRSxDQUM3RCxDQUFDLDhDQUFzQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBU3hELElBQVksS0FJWDtBQUpELFdBQVksS0FBSztJQUNmLG1DQUFTLENBQUE7SUFDVCxxQ0FBVSxDQUFBO0lBQ1YscUNBQVUsQ0FBQTtBQUNaLENBQUMsRUFKVyxLQUFLLEdBQUwsYUFBSyxLQUFMLGFBQUssUUFJaEI7QUFFRDs7Ozs7Ozs7R0FRRztBQUNVLFFBQUEsc0JBQXNCLEdBQUcsQ0FDcEMsTUFBa0IsRUFDbEIsS0FBYSxFQUNiLE1BQWEsRUFDYixFQUFFO0lBQ0YsTUFBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUM7SUFDaEMs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