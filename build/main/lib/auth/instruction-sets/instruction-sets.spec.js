"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement no-magic-numbers no-object-mutation
const ava_1 = __importDefault(require("ava"));
const lib_1 = require("../../lib");
const hex_1 = require("../../utils/hex");
const bitcoin_cash_opcodes_1 = require("./bitcoin-cash/bitcoin-cash-opcodes");
const instruction_sets_1 = require("./instruction-sets");
ava_1.default('Each Opcodes enum contains a single instruction for 0-255', t => {
    const expected = lib_1.range(256);
    const names = (keys) => keys.filter(k => isNaN(parseInt(k, 10)));
    const numbers = (keys) => keys.map(k => parseInt(k, 10)).filter(k => !isNaN(k));
    const bch = Object.keys(bitcoin_cash_opcodes_1.BitcoinCashOpcodes);
    t.deepEqual(numbers(bch), expected);
    t.deepEqual(names(bch).length, expected.length);
    const btc = Object.keys(instruction_sets_1.BitcoinOpcodes);
    t.deepEqual(numbers(btc), expected);
    t.deepEqual(names(btc).length, expected.length);
});
const defToFixtures = (tests) => Object.entries(tests).map(entry => {
    const hex = entry[0].split('0x')[1];
    const script = hex_1.hexToBin(hex);
    const asm = entry[1].asm;
    // tslint:disable-next-line:cyclomatic-complexity
    const object = entry[1].parse.map(set => (Object.assign({ opcode: set[0] }, (set.length > 2 ? { malformed: true } : undefined), (set[1] !== undefined ? { data: hex_1.hexToBin(set[1]) } : undefined), (set[2] !== undefined ? { expectedDataBytes: set[2] } : undefined), (set[3] !== undefined ? { length: hex_1.hexToBin(set[3]) } : undefined), (set[4] !== undefined ? { expectedLengthBytes: set[4] } : undefined))));
    return { hex, script, asm, object };
});
const wellFormedScripts = {
    '0x00': {
        asm: 'OP_0',
        parse: [[0, '']]
    },
    '0x0001010202020303030376': {
        asm: 'OP_0 OP_PUSHBYTES_1 0x01 OP_PUSHBYTES_2 0x0202 OP_PUSHBYTES_3 0x030303 OP_DUP',
        parse: [[0, ''], [1, '01'], [2, '0202'], [3, '030303'], [118]]
    },
    '0x410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac': {
        asm: 'OP_PUSHBYTES_65 0x0411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3 OP_CHECKSIG',
        parse: [
            [
                0x41,
                '0411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3'
            ],
            [0xac]
        ]
    },
    '0x4c020304': {
        asm: 'OP_PUSHDATA_1 2 0x0304',
        parse: [[0x4c, '0304']]
    },
    '0x76a91411b366edfc0a8b66feebae5c2e25a7b6a5d1cf3188ac': {
        asm: 'OP_DUP OP_HASH160 OP_PUSHBYTES_20 0x11b366edfc0a8b66feebae5c2e25a7b6a5d1cf31 OP_EQUALVERIFY OP_CHECKSIG',
        parse: [
            [0x76],
            [0xa9],
            [0x14, '11b366edfc0a8b66feebae5c2e25a7b6a5d1cf31'],
            [0x88],
            [0xac]
        ]
    }
};
const malFormedPushes = {
    '0x01': {
        asm: 'OP_PUSHBYTES_1 [missing 1 byte]',
        parse: [[0x01, '', 1]]
    },
    '0x0201': {
        asm: 'OP_PUSHBYTES_2 0x01[missing 1 byte]',
        parse: [[0x02, '01', 2]]
    },
    '0x4b': {
        asm: 'OP_PUSHBYTES_75 [missing 75 bytes]',
        parse: [[0x4b, '', 75]]
    },
    '0x4c': {
        asm: 'OP_PUSHDATA_1 [missing 1 byte]',
        parse: [[0x4c, undefined, undefined, '', 1]]
    },
    '0x4c02': {
        asm: 'OP_PUSHDATA_1 2 [missing 2 bytes]',
        parse: [[0x4c, '', 2]]
    },
    '0x4d': {
        asm: 'OP_PUSHDATA_2 [missing 2 bytes]',
        parse: [[0x4d, undefined, undefined, '', 2]]
    },
    '0x4d01': {
        asm: 'OP_PUSHDATA_2 0x01[missing 1 byte]',
        parse: [[0x4d, undefined, undefined, '01', 2]]
    },
    '0x4d0101': {
        asm: 'OP_PUSHDATA_2 257 [missing 257 bytes]',
        parse: [[0x4d, '', 257]]
    },
    '0x4d010101': {
        asm: 'OP_PUSHDATA_2 257 0x01[missing 256 bytes]',
        parse: [[0x4d, '01', 257]]
    },
    '0x4e': {
        asm: 'OP_PUSHDATA_4 [missing 4 bytes]',
        parse: [[0x4e, undefined, undefined, '', 4]]
    },
    '0x4e01': {
        asm: 'OP_PUSHDATA_4 0x01[missing 3 bytes]',
        parse: [[0x4e, undefined, undefined, '01', 4]]
    },
    '0x4e01000001': {
        asm: 'OP_PUSHDATA_4 16777217 [missing 16777217 bytes]',
        parse: [[0x4e, '', 16777217]]
    },
    '0x4e0100000101': {
        asm: 'OP_PUSHDATA_4 16777217 0x01[missing 16777216 bytes]',
        parse: [[0x4e, '01', 16777217]]
    }
};
const parse = (t, input, expected) => {
    t.deepEqual(instruction_sets_1.parseScript(input), expected);
};
parse.title = title => `parse script: ${title}`.trim();
const disassemble = (t, input, expected) => {
    t.deepEqual(instruction_sets_1.disassembleParsedAuthenticationInstructions(bitcoin_cash_opcodes_1.BitcoinCashOpcodes, input), expected);
};
disassemble.title = title => `disassemble script: ${title}`.trim();
const serialize = (t, input, expected) => {
    t.deepEqual(instruction_sets_1.serializeAuthenticationInstructions(input), expected);
};
serialize.title = title => `serialize script: ${title}`.trim();
const reSerialize = (t, input, expected) => {
    t.deepEqual(instruction_sets_1.serializeParsedAuthenticationInstructions(input), expected);
};
reSerialize.title = title => `re-serialize parsed script: ${title}`.trim();
// tslint:disable-next-line:no-unused-expression
defToFixtures(wellFormedScripts).map(({ asm, hex, script, object }) => {
    ava_1.default(`0x${hex}`, parse, script, object);
    ava_1.default(`0x${hex}`, disassemble, object, asm);
    ava_1.default(`0x${hex}`, serialize, object, script);
    ava_1.default(`0x${hex}`, reSerialize, object, script);
});
// tslint:disable-next-line:no-unused-expression
defToFixtures(malFormedPushes).map(({ asm, hex, script, object }) => {
    ava_1.default(`0x${hex}`, parse, script, object);
    ava_1.default(`0x${hex}`, disassemble, object, asm);
    ava_1.default(`0x${hex}`, reSerialize, object, script);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb24tc2V0cy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvaW5zdHJ1Y3Rpb24tc2V0cy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkVBQTZFO0FBQzdFLDhDQUFrQztBQUNsQyxtQ0FBa0M7QUFDbEMseUNBQTJDO0FBQzNDLDhFQUF5RTtBQUN6RSx5REFRNEI7QUFFNUIsYUFBSSxDQUFDLDJEQUEyRCxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQ3BFLE1BQU0sUUFBUSxHQUFHLFdBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixNQUFNLEtBQUssR0FBRyxDQUFDLElBQTJCLEVBQUUsRUFBRSxDQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBMkIsRUFBRSxFQUFFLENBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV4RCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLHlDQUFrQixDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVoRCxNQUFNLEdB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