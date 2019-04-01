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
// tslint:disable:no-expression-statement no-unsafe-any
const ava_1 = __importDefault(require("ava"));
const bcrypto = __importStar(require("bcrypto"));
const crypto_1 = require("crypto");
const fc = __importStar(require("fast-check"));
const fs_1 = require("fs");
const hashJs = __importStar(require("hash.js"));
const path_1 = require("path");
const testLength = 10000;
const stringToCharsUint8Array = (str) => new Uint8Array([...str].map(c => c.charCodeAt(0)));
const maxUint8Number = 255;
const fcUint8Array = (minLength, maxLength) => fc
    .array(fc.integer(0, maxUint8Number), minLength, maxLength)
    .map(a => Uint8Array.from(a));
exports.testHashFunction = (hashFunctionName, getEmbeddedBinary, instantiate, instantiateBytes, abcHash, testHash, bitcoinTsHash, nodeJsAlgorithm) => {
    const binary = getEmbeddedBinary();
    const bcryptoAlgorithm = nodeJsAlgorithm.toUpperCase();
    ava_1.default(`${hashFunctionName} getEmbeddedBinary returns the proper binary`, t => {
        const path = path_1.join(__dirname, '..', 'bin', `${hashFunctionName}`, `${hashFunctionName}.wasm`);
        const binaryFromDisk = fs_1.readFileSync(path).buffer;
        t.deepEqual(binary, binaryFromDisk);
    });
    ava_1.default(`${hashFunctionName} instantiated with embedded binary`, async (t) => {
        const hashFunction = await instantiate();
        t.deepEqual(hashFunction.hash(stringToCharsUint8Array('abc')), abcHash);
        t.deepEqual(hashFunction.hash(stringToCharsUint8Array('test')), testHash);
        t.deepEqual(hashFunction.hash(stringToCharsUint8Array('bitcoin-ts')), bitcoinTsHash);
    });
    ava_1.default(`${hashFunctionName} instantiated with bytes`, async (t) => {
        const hashFunction = await instantiateBytes(binary);
        const equivalentToNative = fc.property(fcUint8Array(0, testLength), message => {
            const hash = crypto_1.createHash(nodeJsAlgorithm);
            t.deepEqual(new Uint8Array(hash.update(Buffer.from(message)).digest()), hashFunction.hash(message));
        });
        t.notThrows(() => {
            fc.assert(equivalentToNative);
        });
        const equivalentToBcoin = fc.property(fcUint8Array(0, testLength), message => {
            t.deepEqual(new Uint8Array(bcrypto[bcryptoAlgorithm].digest(Buffer.from(message))), hashFunction.hash(message));
        });
        t.notThrows(() => {
            fc.assert(equivalentToBcoin);
        });
        const equivalentToHashJs = fc.property(fcUint8Array(0, testLength), message => {
            t.deepEqual(new Uint8Array(hashJs[nodeJsAlgorithm]()
                .update(message)
                .digest()), hashFunction.hash(message));
        });
        t.notThrows(() => {
            fc.assert(equivalentToHashJs);
        });
    });
    ava_1.default(`${hashFunctionName} incremental hashing`, async (t) => {
        const hashFunction = await instantiate();
        t.deepEqual(hashFunction.final(hashFunction.update(hashFunction.update(hashFunction.update(hashFunction.init(), stringToCharsUint8Array('a')), stringToCharsUint8Array('b')), stringToCharsUint8Array('c'))), abcHash);
        t.deepEqual(hashFunction.final(hashFunction.update(hashFunction.init(), stringToCharsUint8Array('test'))), testHash);
        t.deepEqual(hashFunction.final(hashFunction.update(hashFunction.update(hashFunction.init(), stringToCharsUint8Array('bitcoin')), stringToCharsUint8Array('-ts'))), bitcoinTsHash);
        const equivalentToSinglePass = fc.property(fcUint8Array(1, testLength), fc.integer(1, testLength), (message, chunkSize) => {
            const chunkCount = Math.ceil(message.length / chunkSize);
            const chunks = Array.from({ length: chunkCount })
                .map((_, index) => index * chunkSize)
                // tslint:disable-next-line:restrict-plus-operands
                .map(startIndex => message.slice(startIndex, startIndex + chunkSize));
            const incrementalResult = hashFunction.final(chunks.reduce((state, chunk) => hashFunction.update(state, chunk), hashFunction.init()));
            const singlePassResult = hashFunction.hash(message);
            t.deepEqual(incrementalResult, singlePassResult);
        });
        t.notThrows(() => {
            fc.assert(equivalentToSinglePass);
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5zcGVjLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY3J5cHRvL2hhc2guc3BlYy5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsdURBQXVEO0FBQ3ZELDhDQUF1QjtBQUN2QixpREFBbUM7QUFDbkMsbUNBQW9DO0FBQ3BDLCtDQUFpQztBQUNqQywyQkFBa0M7QUFDbEMsZ0RBQWtDO0FBQ2xDLCtCQUE0QjtBQUc1QixNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFFekIsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQzlDLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVyRCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDM0IsTUFBTSxZQUFZLEdBQUcsQ0FBQyxTQUFpQixFQUFFLFNBQWlCLEVBQUUsRUFBRSxDQUM1RCxFQUFFO0tBQ0MsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7S0FDMUQsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXJCLFFBQUEsZ0JBQWdCLEdBQUcsQ0FDOUIsZ0JBQXdCLEVBQ3hCLGlCQUFvQyxFQUNwQyxXQUE2QixFQUM3QixnQkFBK0QsRUFDL0QsT0FBbUIsRUFDbkIsUUFBb0IsRUFDcEIsYUFBeUIsRUFDekIsZUFBMkQsRUFDM0QsRUFBRTtJQUNGLE1BQU0sTUFBTSxHQUFHLGlCQUFpQixFQUFFLENBQUM7SUFDbkMsTUFBTSxnQkFBZ0IsR0FBRyxlQUFl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