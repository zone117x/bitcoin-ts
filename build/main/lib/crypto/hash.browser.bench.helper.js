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
// tslint:disable:no-expression-statement no-unsafe-any
const asmCrypto = __importStar(require("asmcrypto.js"));
const chuhai_1 = __importDefault(require("chuhai"));
const hashJs = __importStar(require("hash.js"));
const crypto_1 = require("./crypto");
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
const singlePassBrowserBenchmark = async (hashFunction, hashFunctionName, inputLength, subtleCryptoAlgorithmName) => chuhai_1.default(`browser: ${hashFunctionName}: hash a ${inputLength}-byte input`, s => {
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
const incrementalBrowserBenchmark = async (hashFunction, hashFunctionName, totalInput, chunkSize) => chuhai_1.default(`browser: ${hashFunctionName}: incrementally hash a ${totalInput /
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
    const sha1 = await crypto_1.instantiateSha1();
    const sha256 = await crypto_1.instantiateSha256();
    const sha512 = await crypto_1.instantiateSha512();
    const ripemd160 = await crypto_1.instantiateRipemd160();
    await browserBenchmarks(sha1, 'sha1', 'SHA-1');
    await browserBenchmarks(sha256, 'sha256', 'SHA-256');
    await browserBenchmarks(sha512, 'sha512', 'SHA-512');
    await browserBenchmarks(ripemd160, 'ripemd160');
    benchComplete();
})().catch(err => {
    // tslint:disable-next-line:no-console
    console.error(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5icm93c2VyLmJlbmNoLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY3J5cHRvL2hhc2guYnJvd3Nlci5iZW5jaC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsdURBQXVEO0FBQ3ZELHdEQUEwQztBQUMxQyxvREFBMkI7QUFDM0IsZ0RBQWtDO0FBRWxDLHFDQUtrQjtBQUtsQixrQ0FBa0M7QUFDbEMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxLQUFVLEVBQXVCLEVBQUUsQ0FDdkQsS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQztBQUVuRCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQWMsRUFBRSxDQUFjLEVBQUUsRUFBRTtJQUNqRCwyQ0FBMkM7SUFDM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQ3pFLFVBQVUsQ0FBQztvQkFDSyxDQUFDLG9CQUFvQixDQUFDO0dBQ3ZDLENBQUMsQ0FBQztLQUNGO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUNwQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFFaEQsTUFBTSwwQkFBMEIsR0FBRyxLQUFLLEVBQ3RDLFlBQTBCLEVBQzFCLGdCQUE0RCxFQUM1RCxXQUFtQixFQUNuQix5QkFBMkQsRUFDM0QsRUFBRSxDQUNGLGdCQUFLLENBQUMsWUFBWSxnQkFBZ0IsWUFBWSxXQUFXLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUMxRSxxQ0FBcUM7SUFDckMsSUFBSSxPQUFPLEdBQUcsV0FBVyxD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