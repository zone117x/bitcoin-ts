// tslint:disable:no-expression-statement no-let no-unsafe-any
import * as asmCrypto from 'asmcrypto.js';
import test from 'ava';
import * as bcrypto from 'bcrypto';
import suite from 'chuhai';
import { createHash, randomBytes } from 'crypto';
import * as hashJs from 'hash.js';
export const benchmarkHashingFunction = (hashFunctionName, hashFunctionPromise, nodeJsAlgorithm) => {
    const singlePassNodeBenchmark = (inputLength) => {
        const bcryptoAlgorithm = nodeJsAlgorithm.toUpperCase();
        test(`node: ${hashFunctionName}: hash a ${inputLength}-byte input`, async (t) => {
            const hashFunction = await hashFunctionPromise;
            await suite(t.title, s => {
                let message;
                let hash;
                // we let Node.js use the message as a Node.js buffer
                // (may slightly overestimate Node.js native performance)
                let nodeJsBuffer;
                const nextCycle = () => {
                    message = randomBytes(inputLength);
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
                    hash = createHash(nodeJsAlgorithm)
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
        test(`node: ${hashFunctionName}: incrementally hash a ${totalInput /
            MB}MB input in ${chunkSize / MB}MB chunks`, async (t) => {
            const hashFunction = await hashFunctionPromise;
            await suite(t.title, s => {
                let message;
                let messageChunks;
                let nodeJsChunks;
                let hash;
                const nextCycle = () => {
                    message = randomBytes(totalInput);
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
                        .reduce((state, chunk) => state.update(chunk), createHash(nodeJsAlgorithm))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5iZW5jaC5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NyeXB0by9oYXNoLmJlbmNoLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsT0FBTyxLQUFLLFNBQVMsTUFBTSxjQUFjLENBQUM7QUFDMUMsT0FBTyxJQUFJLE1BQU0sS0FBSyxDQUFDO0FBQ3ZCLE9BQU8sS0FBSyxPQUFPLE1BQU0sU0FBUyxDQUFDO0FBQ25DLE9BQU8sS0FBSyxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNqRCxPQUFPLEtBQUssTUFBTSxNQUFNLFNBQVMsQ0FBQztBQUdsQyxNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBRyxDQUN0QyxnQkFBd0IsRUFDeEIsbUJBQStCLEVBQy9CLGVBQTJELEVBQzNELEVBQUU7SUFDRixNQUFNLHVCQUF1QixHQUFHLENBQUMsV0FBbUIsRUFBRSxFQUFFO1FBQ3RELE1BQU0sZ0JBQWdCLEdBQUcsZUFBZSxDQUFDLFdBQVcsRUFJMUMsQ0FBQztRQUNYLElBQUksQ0FBQyxTQUFTLGdCQUFnQixZQUFZLFdBQVcsYUFBYSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtZQUM1RSxNQUFNLFlBQVksR0FBRyxNQUFNLG1CQUFtQixDQUFDO1lBQy9DLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3ZCLElBQUksT0FBbUIsQ0FBQztnQkFDeEIsSUFBSSxJQUErQyxDQUFDO2dCQUNwRCxxREFBcUQ7Z0JBQ3JELHlEQUF5RDtnQkFDekQsSUFBSSxZQUFvQixDQUFDO2dCQUN6QixNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7b0JBQ3JCLE9BQU8sR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ25DLFlBQVks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