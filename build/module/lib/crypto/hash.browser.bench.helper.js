// tslint:disable:no-expression-statement no-unsafe-any
import * as asmCrypto from 'asmcrypto.js';
import suite from 'chuhai';
import * as hashJs from 'hash.js';
import { instantiateRipemd160, instantiateSha1, instantiateSha256, instantiateSha512 } from './crypto';
// tslint:disable-next-line:no-any
const isUint8Array = (array) => array && array.constructor.name === 'Uint8Array';
const compare = (a, b) => {
    // tslint:disable-next-line:no-if-statement
    if (!isUint8Array(a) || !isUint8Array(b) || a.toString() !== b.toString()) {
        benchError(`
  Invalid result: ${a} is not equal to ${b}
  `);
    }
};
const randomBytes = (bytes) => crypto.getRandomValues(new Uint8Array(bytes));
const singlePassBrowserBenchmark = async (hashFunction, hashFunctionName, inputLength, subtleCryptoAlgorithmName) => suite(`browser: ${hashFunctionName}: hash a ${inputLength}-byte input`, s => {
    // tslint:disable:no-let prefer-const
    let message = randomBytes(inputLength);
    let hash;
    s.cycle(() => {
        // tslint:disable-next-line:no-if-statement strict-boolean-expressions
        if (hash) {
            compare(hash, hashFunction.hash(message));
        }
        else {
            benchError(`asmcrypto.js produced a null result given message: ${message}`);
        }
        message = randomBytes(inputLength);
    });
    s.bench('bitcoin-ts', () => {
        hash = hashFunction.hash(message);
    });
    s.bench('hash.js', () => {
        hash = new Uint8Array(hashJs[hashFunctionName]()
            .update(message)
            .digest());
    });
    // tslint:disable-next-line:no-if-statement
    if (subtleCryptoAlgorithmName) {
        s.bench('crypto.subtle', deferred => {
            window.crypto.subtle
                .digest(subtleCryptoAlgorithmName, message)
                .then(buffer => {
                hash = new Uint8Array(buffer);
                deferred.resolve();
            });
        }, {
            defer: true
        });
        const algorithm = subtleCryptoAlgorithmName === 'SHA-1'
            ? asmCrypto.Sha1
            : subtleCryptoAlgorithmName === 'SHA-256'
                ? asmCrypto.Sha256
                : asmCrypto.Sha512;
        s.bench('asmcrypto.js', () => {
            const instance = new algorithm();
            hash = instance.process(message).finish().result;
        });
    }
});
const MB = 1000000;
const incrementalBrowserBenchmark = async (hashFunction, hashFunctionName, totalInput, chunkSize) => suite(`browser: ${hashFunctionName}: incrementally hash a ${totalInput /
    MB}MB input in ${chunkSize / MB}MB chunks`, s => {
    let message;
    let messageChunks;
    let hash;
    const nextCycle = () => {
        /**
         * We can't get this much entropy, so we just use 0s here.
         */
        message = new Uint8Array(totalInput).fill(0);
        const chunkCount = Math.ceil(message.length / chunkSize);
        messageChunks = Array.from({ length: chunkCount }).map((_, index) => message.slice(index * chunkSize, index * chunkSize + chunkSize));
    };
    nextCycle();
    s.cycle(() => {
        // tslint:disable-next-line:no-if-statement strict-boolean-expressions
        if (hash) {
            compare(new Uint8Array(hash), hashFunction.hash(message));
        }
        else {
            benchError(`asmcrypto.js produced a null result given message: ${message}`);
        }
        nextCycle();
    });
    s.bench('bitcoin-ts', () => {
        hash = hashFunction.final(messageChunks.reduce((state, chunk) => hashFunction.update(state, chunk), hashFunction.init()));
    });
    s.bench('hash.js', () => {
        hash = messageChunks
            .reduce((state, chunk) => state.update(chunk), hashJs[hashFunctionName]())
            .digest();
    });
    // tslint:disable-next-line:no-if-statement
    if (hashFunctionName !== 'ripemd160') {
        const algorithm = hashFunctionName === 'sha1'
            ? asmCrypto.Sha1
            : hashFunctionName === 'sha256'
                ? asmCrypto.Sha256
                : asmCrypto.Sha512;
        s.bench('asmcrypto.js', () => {
            const instance = new algorithm();
            hash = instance.process(message).finish().result;
        });
    }
});
const browserBenchmarks = async (func, name, subtle) => {
    // tslint:disable:no-magic-numbers
    await singlePassBrowserBenchmark(func, name, 32, subtle);
    await singlePassBrowserBenchmark(func, name, 100, subtle);
    await singlePassBrowserBenchmark(func, name, 1000, subtle);
    await singlePassBrowserBenchmark(func, name, 10000, subtle);
    await incrementalBrowserBenchmark(func, name, MB * 32, MB);
};
(async () => {
    const sha1 = await instantiateSha1();
    const sha256 = await instantiateSha256();
    const sha512 = await instantiateSha512();
    const ripemd160 = await instantiateRipemd160();
    await browserBenchmarks(sha1, 'sha1', 'SHA-1');
    await browserBenchmarks(sha256, 'sha256', 'SHA-256');
    await browserBenchmarks(sha512, 'sha512', 'SHA-512');
    await browserBenchmarks(ripemd160, 'ripemd160');
    benchComplete();
})().catch(err => {
    // tslint:disable-next-line:no-console
    console.error(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5icm93c2VyLmJlbmNoLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY3J5cHRvL2hhc2guYnJvd3Nlci5iZW5jaC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsdURBQXVEO0FBQ3ZELE9BQU8sS0FBSyxTQUFTLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sS0FBSyxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLEtBQUssTUFBTSxNQUFNLFNBQVMsQ0FBQztBQUVsQyxPQUFPLEVBQ0wsb0JBQW9CLEVBQ3BCLGVBQWUsRUFDZixpQkFBaUIsRUFDakIsaUJBQWlCLEVBQ2xCLE1BQU0sVUFBVSxDQUFDO0FBS2xCLGtDQUFrQztBQUNsQyxNQUFNLFlBQVksR0FBRyxDQUFDLEtBQVUsRUFBdUIsRUFBRSxDQUN2RCxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDO0FBRW5ELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBYyxFQUFFLENBQWMsRUFBRSxFQUFFO0lBQ2pELDJDQUEyQztJQUMzQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDekUsVUFBVSxDQUFDO29CQUNLLENBQUMsb0JBQW9CLENBQUM7R0FDdkMsQ0FBQyxDQUFDO0tBQ0Y7QUFDSCxDQUFDLENBQUM7QUFFRixNQUFNLFdBQVcsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQ3BDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUVoRCxNQUFNLDBCQUEwQixHQUFHLEtBQUssRUFDdEMsWUFBMEIsRUFDMUIsZ0JBQTRELEVBQzVELFdBQW1CLEVBQ25CLHlC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