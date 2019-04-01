"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement no-let no-unsafe-any
const asmCrypto = __importStar(require("asmcrypto.js"));
const ava_1 = __importDefault(require("ava"));
const bcrypto = __importStar(require("bcrypto"));
const chuhai_1 = __importDefault(require("chuhai"));
const crypto_1 = require("crypto");
const hashJs = __importStar(require("hash.js"));
exports.benchmarkHashingFunction = (hashFunctionName, hashFunctionPromise, nodeJsAlgorithm) => {
    const singlePassNodeBenchmark = (inputLength) => {
        const bcryptoAlgorithm = nodeJsAlgorithm.toUpperCase();
        ava_1.default(`node: ${hashFunctionName}: hash a ${inputLength}-byte input`, async (t) => {
            const hashFunction = await hashFunctionPromise;
            await chuhai_1.default(t.title, s => {
                let message;
                let hash;
                // we let Node.js use the message as a Node.js buffer
                // (may slightly overestimate Node.js native performance)
                let nodeJsBuffer;
                const nextCycle = () => {
                    message = crypto_1.randomBytes(inputLength);
                    nodeJsBuffer = Buffer.from(message);
                };
                nextCycle();
                s.bench('bitcoin-ts', () => {
                    hash = hashFunction.hash(message);
                });
                s.bench('hash.js', () => {
                    hash = hashJs[nodeJsAlgorithm]()
                        .update(message)
                        .digest();
                });
                s.bench('bcoin', () => {
                    hash = bcrypto[bcryptoAlgorithm].digest(Buffer.from(message));
                });
                s.bench('node.js native', () => {
                    hash = crypto_1.createHash(nodeJsAlgorithm)
                        .update(nodeJsBuffer)
                        .digest();
                });
                // tslint:disable-next-line:no-if-statement
                if (nodeJsAlgorithm !== 'ripemd160') {
                    const algorithm = nodeJsAlgorithm === 'sha1'
                        ? asmCrypto.Sha1
                        : nodeJsAlgorithm === 'sha256'
                            ? asmCrypto.Sha256
                            : asmCrypto.Sha512;
                    s.bench('asmcrypto.js', () => {
                        const instance = new algorithm();
                        hash = instance.process(message).finish().result;
                    });
                }
                s.cycle(() => {
                    // tslint:disable-next-line:no-if-statement
                    if (hash === null) {
                        t.fail(`asmcrypto.js failed to produce a hash for message: ${message}`);
                    }
                    else {
                        t.deepEqual(new Uint8Array(hash), hashFunction.hash(message));
                        nextCycle();
                    }
                });
            });
        });
    };
    const MB = 1000000;
    const incrementalNodeBenchmark = (totalInput, chunkSize) => {
        ava_1.default(`node: ${hashFunctionName}: incrementally hash a ${totalInput /
            MB}MB input in ${chunkSize / MB}MB chunks`, async (t) => {
            const hashFunction = await hashFunctionPromise;
            await chuhai_1.default(t.title, s => {
                let message;
                let messageChunks;
                let nodeJsChunks;
                let hash;
                const nextCycle = () => {
                    message = crypto_1.randomBytes(totalInput);
                    const chunkCount = Math.ceil(message.length / chunkSize);
                    messageChunks = Array.from({ length: chunkCount }).map((_, index) => message.slice(index * chunkSize, index * chunkSize + chunkSize));
                    nodeJsChunks = messageChunks.map(chunk => Buffer.from(chunk));
                };
                nextCycle();
                s.bench('bitcoin-ts', () => {
                    hash = hashFunction.final(messageChunks.reduce((state, chunk) => hashFunction.update(state, chunk), hashFunction.init()));
                });
                s.bench('hash.js', () => {
                    hash = messageChunks
                        .reduce((state, chunk) => state.update(chunk), hashJs[nodeJsAlgorithm]())
                        .digest();
                });
                s.bench('node.js native', () => {
                    hash = nodeJsChunks
                        .reduce((state, chunk) => state.update(chunk), crypto_1.createHash(nodeJsAlgorithm))
                        .digest();
                });
                // tslint:disable-next-line:no-if-statement
                if (nodeJsAlgorithm !== 'ripemd160') {
                    const algorithm = nodeJsAlgorithm === 'sha1'
                        ? asmCrypto.Sha1
                        : nodeJsAlgorithm === 'sha256'
                            ? asmCrypto.Sha256
                            : asmCrypto.Sha512;
                    s.bench('asmcrypto.js', () => {
                        const instance = new algorithm();
                        hash = instance.process(message).finish().result;
                    });
                }
                s.cycle(() => {
                    // tslint:disable-next-line:no-if-statement
                    if (hash === null) {
                        t.fail(`asmcrypto.js failed to produce a hash for message: ${message}`);
                    }
                    else {
                        t.deepEqual(new Uint8Array(hash), hashFunction.hash(message));
                        nextCycle();
                    }
                });
            });
        });
    };
    // tslint:disable:no-magic-numbers
    singlePassNodeBenchmark(32);
    singlePassNodeBenchmark(100);
    singlePassNodeBenchmark(1000);
    singlePassNodeBenchmark(10000);
    incrementalNodeBenchmark(MB * 32, MB);
    // tslint:disable:no-magic-numbers
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5iZW5jaC5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NyeXB0by9oYXNoLmJlbmNoLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw4REFBOEQ7QUFDOUQsd0RBQTBDO0FBQzFDLDhDQUF1QjtBQUN2QixpREFBbUM7QUFDbkMsb0RBQTJCO0FBQzNCLG1DQUFpRDtBQUNqRCxnREFBa0M7QUFHckIsUUFBQSx3QkFBd0IsR0FBRyxDQUN0QyxnQkFBd0IsRUFDeEIsbUJBQStCLEVBQy9CLGVBQTJELEVBQzNELEVBQUU7SUFDRixNQUFNLHVCQUF1QixHQUFHLENBQUMsV0FBbUIsRUFBRSxFQUFFO1FBQ3RELE1BQU0sZ0JBQWdCLEdBQUcsZUFBZSxDQUFDLFdBQVcsRUFJMUMsQ0FBQztRQUNYLGFBQUksQ0FBQyxTQUFTLGdCQUFnQixZQUFZLFdBQVcsYUFBYSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtZQUM1RSxNQUFNLFlBQVksR0FBRyxNQUFNLG1CQUFtQixDQUFDO1lBQy9DLE1BQU0sZ0JBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUN2QixJQUFJLE9BQW1CLENBQUM7Z0JBQ3hCLElBQUksSUFBK0MsQ0FBQztnQkFDcEQscURBQXFEO2dCQUNyRCx5REFBeUQ7Z0JBQ3pELElBQUksWUFBb0IsQ0FBQztnQkFDekIsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO29CQUNyQixPQUFPLEdBQUcsb0JBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDbkMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQztnQkFDRixTQUFTLEVBQUUsQ0FBQztnQkFDWixDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7b0JBQ3pCLElBQUksR0FB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