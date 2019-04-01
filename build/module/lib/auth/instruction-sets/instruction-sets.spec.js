// tslint:disable:no-expression-statement no-magic-numbers no-object-mutation
import test from 'ava';
import { range } from '../../lib';
import { hexToBin } from '../../utils/hex';
import { BitcoinCashOpcodes } from './bitcoin-cash/bitcoin-cash-opcodes';
import { BitcoinOpcodes, disassembleParsedAuthenticationInstructions, parseScript, serializeAuthenticationInstructions, serializeParsedAuthenticationInstructions } from './instruction-sets';
test('Each Opcodes enum contains a single instruction for 0-255', t => {
    const expected = range(256);
    const names = (keys) => keys.filter(k => isNaN(parseInt(k, 10)));
    const numbers = (keys) => keys.map(k => parseInt(k, 10)).filter(k => !isNaN(k));
    const bch = Object.keys(BitcoinCashOpcodes);
    t.deepEqual(numbers(bch), expected);
    t.deepEqual(names(bch).length, expected.length);
    const btc = Object.keys(BitcoinOpcodes);
    t.deepEqual(numbers(btc), expected);
    t.deepEqual(names(btc).length, expected.length);
});
const defToFixtures = (tests) => Object.entries(tests).map(entry => {
    const hex = entry[0].split('0x')[1];
    const script = hexToBin(hex);
    const asm = entry[1].asm;
    // tslint:disable-next-line:cyclomatic-complexity
    const object = entry[1].parse.map(set => ({
        opcode: set[0],
        ...(set.length > 2 ? { malformed: true } : undefined),
        ...(set[1] !== undefined ? { data: hexToBin(set[1]) } : undefined),
        ...(set[2] !== undefined ? { expectedDataBytes: set[2] } : undefined),
        ...(set[3] !== undefined ? { length: hexToBin(set[3]) } : undefined),
        ...(set[4] !== undefined ? { expectedLengthBytes: set[4] } : undefined)
    }));
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
    t.deepEqual(parseScript(input), expected);
};
parse.title = title => `parse script: ${title}`.trim();
const disassemble = (t, input, expected) => {
    t.deepEqual(disassembleParsedAuthenticationInstructions(BitcoinCashOpcodes, input), expected);
};
disassemble.title = title => `disassemble script: ${title}`.trim();
const serialize = (t, input, expected) => {
    t.deepEqual(serializeAuthenticationInstructions(input), expected);
};
serialize.title = title => `serialize script: ${title}`.trim();
const reSerialize = (t, input, expected) => {
    t.deepEqual(serializeParsedAuthenticationInstructions(input), expected);
};
reSerialize.title = title => `re-serialize parsed script: ${title}`.trim();
// tslint:disable-next-line:no-unused-expression
defToFixtures(wellFormedScripts).map(({ asm, hex, script, object }) => {
    test(`0x${hex}`, parse, script, object);
    test(`0x${hex}`, disassemble, object, asm);
    test(`0x${hex}`, serialize, object, script);
    test(`0x${hex}`, reSerialize, object, script);
});
// tslint:disable-next-line:no-unused-expression
defToFixtures(malFormedPushes).map(({ asm, hex, script, object }) => {
    test(`0x${hex}`, parse, script, object);
    test(`0x${hex}`, disassemble, object, asm);
    test(`0x${hex}`, reSerialize, object, script);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb24tc2V0cy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvaW5zdHJ1Y3Rpb24tc2V0cy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZFQUE2RTtBQUM3RSxPQUFPLElBQWUsTUFBTSxLQUFLLENBQUM7QUFDbEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNsQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDekUsT0FBTyxFQUVMLGNBQWMsRUFDZCwyQ0FBMkMsRUFFM0MsV0FBVyxFQUNYLG1DQUFtQyxFQUNuQyx5Q0FBeUMsRUFDMUMsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QixJQUFJLENBQUMsMkRBQTJELEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDcEUsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBMkIsRUFBRSxFQUFFLENBQzVDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0MsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUEyQixFQUFFLEVBQUUsQ0FDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXhELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWhELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsRCxDQUFDLENBQUMsQ0FBQztBQXFCSCxNQUFNLGFBQWEsR0FBRyxDQUFDLEtBQW1DLEVBQUUsRUFBRSxDQUM1RCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUNoQyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ3pCLGlEQUFpRDtJQUNqRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDZCxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDckQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDbEUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNyRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNwRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0tBQ3hFLENBQUMsQ0FBQyxDQUFDO0lBQ0osT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBRUwsTUFBTSxpQkFBaUIsR0FBaUM7SUFDdEQsTUFBTSxFQUFFO1FBQ04sR0FBRyxFQUFFLE1BQU07UUFDWCxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNqQjtJQUNELDBCQUEwQixFQUFFO1FBQzFCLEdBQUcsRUFDRCwrRUFBK0U7UUFDakYsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMvRDtJQUNELDBJQUEwSSxFQUFFO1FBQzFJLEdBQUcsRUFDRCxrS0FBa0s7UUFDcEssS0FBSyxFQUFFO1lBQ0w7Z0JBQ0UsSUFBSTtnQkFDSixvSUFBb0k7YUFDckk7WUFDRCxDQUFDLElBQUksQ0FBQztTQUNQO0tBQ0Y7SUFDRCxZQUFZLEVBQUU7UUFDWixHQUFHLEVBQUUsd0JBQXdCO1FBQzdCLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3hCO0lBQ0Qsc0RBQXNELEVBQUU7UUFDdEQsR0FBRyxFQUNELHlHQUF5RztRQUMzRyxLQUFLLEVBQUU7WUFDTCxDQUFDLElBQUksQ0FBQztZQUNOLENBQUMsSUFBSSxDQUFDO1lBQ04sQ0FBQyxJQUFJLEVBQUUsMENBQTBDLENBQUM7WUFDbEQsQ0FBQyxJQUFJLENBQUM7WUFDTixDQUFDLElBQUksQ0FBQztTQUNQO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsTUFBTSxlQUFlLEdBQWlDO0lBQ3BELE1BQU0sRUFBRTtRQUNOLEdBQUcsRUFBRSxpQ0FBaUM7UUFDdEMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3ZCO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsR0FBRyxFQUFFLHFDQUFxQztRQUMxQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDekI7SUFDRCxNQUFNLEVBQUU7UUFDTixHQUFHLEVBQUUsb0NBQW9DO1FBQ3pDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUN4QjtJQUNELE1BQU0sRUFBRTtRQUNOLEdBQUcsRUFBRSxnQ0FBZ0M7UUFDckMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDN0M7SUFDRCxRQUFRLEVBQUU7UUFDUixHQUFHLEVBQUUsbUNBQW1DO1FBQ3hDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN2QjtJQUNELE1BQU0sRUFBRTtRQUNOLEdBQUcsRUFBRSxpQ0FBaUM7UUFDdEMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDN0M7SUFDRCxRQUFRLEVBQUU7UUFDUixHQUFHLEVBQUUsb0NBQW9DO1FBQ3pDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQy9DO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsR0FBRyxFQUFFLHVDQUF1QztRQUM1QyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDekI7SUFDRCxZQUFZLEVBQUU7UUFDWixHQUFHLEVBQUUsMkNBQTJDO1FBQ2hELEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztLQUMzQjtJQUNELE1BQU0sRUFBRTtRQUNOLEdBQUcsRUFBRSxpQ0FBaUM7UUFDdEMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDN0M7SUFDRCxRQUFRLEVBQUU7UUFDUixHQUFHLEVBQUUscUNBQXFDO1FBQzFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQy9DO0lBQ0QsY0FBYyxFQUFFO1FBQ2QsR0FBRyxFQUFFLGlEQUFpRDtRQUN0RCxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDOUI7SUFDRCxnQkFBZ0IsRUFBRTtRQUNoQixHQUFHLEVBQUUscURBQXFEO1FBQzFELEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNoQztDQUNGLENBQUM7QUFFRixNQUFNLEtBQUssR0FFUCxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUU7SUFDekIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBQ0YsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLGlCQUFpQixLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUV2RCxNQUFNLFdBQVcsR0FFYixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUU7SUFDekIsQ0FBQyxDQUFDLFNBQVMsQ0FDVCwyQ0FBMkMsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsRUFDdEUsUUFBUSxDQUNULENBQUM7QUFDSixDQUFDLENBQUM7QUFDRixXQUFXLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsdUJBQXVCLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBRW5FLE1BQU0sU0FBUyxHQUVYLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRTtJQUN6QixDQUFDLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3BFLENBQUMsQ0FBQztBQUNGLFNBQVMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFL0QsTUFBTSxXQUFXLEdBRWIsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFO0lBQ3pCLENBQUMsQ0FBQyxTQUFTLENBQUMseUNBQXlDLENBQUMsS0FBSyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUUsQ0FBQyxDQUFDO0FBQ0YsV0FBVyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLCtCQUErQixLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUUzRSxnREFBZ0Q7QUFDaEQsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO0lBQ3BFLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDaEQsQ0FBQyxDQUFDLENBQUM7QUFFSCxnREFBZ0Q7QUFDaEQsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTtJQUNsRSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoRCxDQUFDLENBQUMsQ0FBQyJ9