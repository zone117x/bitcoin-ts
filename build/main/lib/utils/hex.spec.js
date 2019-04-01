"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement no-magic-numbers
const ava_1 = __importDefault(require("ava"));
const fc = __importStar(require("fast-check"));
const hex_1 = require("./hex");
const maxUint8Number = 255;
const fcUint8Array = (minLength, maxLength) => fc
    .array(fc.integer(0, maxUint8Number), minLength, maxLength)
    .map(a => Uint8Array.from(a));
ava_1.default('range', t => {
    t.deepEqual(hex_1.range(3), [0, 1, 2]);
    t.deepEqual(hex_1.range(3, 1), [1, 2, 3]);
});
ava_1.default('splitEvery', t => {
    t.deepEqual(hex_1.splitEvery('abcd', 2), ['ab', 'cd']);
    t.deepEqual(hex_1.splitEvery('abcde', 2), ['ab', 'cd', 'e']);
});
ava_1.default('hexToBin', t => {
    t.deepEqual(hex_1.hexToBin('0001022a646566ff'), new Uint8Array([0, 1, 2, 42, 100, 101, 102, 255]));
});
ava_1.default('binToHex', t => {
    t.deepEqual(hex_1.binToHex(new Uint8Array([0, 1, 2, 42, 100, 101, 102, 255])), '0001022a646566ff');
});
ava_1.default('hexToBin <-> binToHex', t => {
    const inverse = fc.property(fcUint8Array(0, 100), input => hex_1.binToHex(hex_1.hexToBin(hex_1.binToHex(input))) === hex_1.binToHex(input));
    t.notThrows(() => {
        fc.assert(inverse);
    });
});
ava_1.default('swapEndianness', t => {
    t.deepEqual(hex_1.swapEndianness('0001022a646566ff'), 'ff6665642a020100');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWxzL2hleC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDBEQUEwRDtBQUMxRCw4Q0FBdUI7QUFDdkIsK0NBQWlDO0FBQ2pDLCtCQUE4RTtBQUU5RSxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDM0IsTUFBTSxZQUFZLEdBQUcsQ0FBQyxTQUFpQixFQUFFLFNBQWlCLEVBQUUsRUFBRSxDQUM1RCxFQUFFO0tBQ0MsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7S0FDMUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRWxDLGFBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDaEIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRTtJQUNyQixDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN6RCxDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDbkIsQ0FBQyxDQUFDLFNBQVMsQ0FDVCxjQUFRLENBQUMsa0JBQWtCLENBQUMsRUFDNUIsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FDbEQsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUNuQixDQUFDLENBQUMsU0FBUyxDQUNULGNBQVEsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQzNELGtCQUFrQixDQUNuQixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDaEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FDekIsWUFBWSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFDcEIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxjQUFRLENBQUMsY0FBUSxDQUFDLGNBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssY0FBUSxDQUFDLEtBQUssQ0FBQyxDQUNqRSxDQUFDO0lBQ0YsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDZixFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDekIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxvQkFBYyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUN0RSxDQUFDLENBQUMsQ0FBQyJ9