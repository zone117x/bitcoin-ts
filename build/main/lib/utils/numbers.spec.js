"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement no-magic-numbers
const ava_1 = __importDefault(require("ava"));
const numbers_1 = require("./numbers");
ava_1.default('numberToBinUint16LE', t => {
    t.deepEqual(numbers_1.numberToBinUint16LE(0x1234), new Uint8Array([0x34, 0x12]));
});
ava_1.default('binToNumberUint16LE', t => {
    t.deepEqual(numbers_1.binToNumberUint16LE(new Uint8Array([0x34, 0x12])), 0x1234);
});
ava_1.default('numberToBinUint32LE', t => {
    t.deepEqual(numbers_1.numberToBinUint32LE(0x12345678), new Uint8Array([0x78, 0x56, 0x34, 0x12]));
});
ava_1.default('binToNumberUint32LE', t => {
    t.deepEqual(numbers_1.binToNumberUint32LE(new Uint8Array([0x78, 0x56, 0x34, 0x12])), 0x12345678);
});
// TODO: When BigInt lands in TypeScript, include more cases here
ava_1.default('bigIntToBinUint64LE', t => {
    t.deepEqual(numbers_1.bigIntToBinUint64LE(BigInt(0x12345678)), new Uint8Array([0x78, 0x56, 0x34, 0x12, 0, 0, 0, 0]));
});
ava_1.default('binToBigIntUint64LE', t => {
    t.deepEqual(numbers_1.binToBigIntUint64LE(new Uint8Array([0x78, 0x56, 0x34, 0x12, 0, 0, 0, 0])), BigInt(0x12345678));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVycy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi91dGlscy9udW1iZXJzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBMEQ7QUFDMUQsOENBQXVCO0FBQ3ZCLHVDQU9tQjtBQUVuQixhQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDOUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyw2QkFBbUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekUsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDOUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyw2QkFBbUIsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekUsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDOUIsQ0FBQyxDQUFDLFNBQVMsQ0FDVCw2QkFBbUIsQ0FBQyxVQUFVLENBQUMsRUFDL0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUN6QyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDOUIsQ0FBQyxDQUFDLFNBQVMsQ0FDVCw2QkFBbUIsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDN0QsVUFBVSxDQUNYLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILGlFQUFpRTtBQUNqRSxhQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDOUIsQ0FBQyxDQUFDLFNBQVMsQ0FDVCw2QkFBbUIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFDdkMsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDckQsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQzlCLENBQUMsQ0FBQyxTQUFTLENBQ1QsNkJBQW1CLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN6RSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQ25CLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyJ9