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
// tslint:disable:no-expression-statement no-let no-unsafe-any
const ava_1 = __importDefault(require("ava"));
const chuhai_1 = __importDefault(require("chuhai"));
const crypto_1 = require("crypto");
const elliptic = __importStar(require("elliptic"));
const secp256k1Node = __importStar(require("secp256k1"));
const secp256k1_1 = require("./secp256k1");
const secp256k1Promise = secp256k1_1.instantiateSecp256k1();
const privKeyLength = 32;
const getValidPrivateKey = (secp256k1) => {
    let privKey;
    do {
        privKey = crypto_1.randomBytes(privKeyLength);
    } while (!secp256k1.validatePrivateKey(privKey));
    return privKey;
};
const setup = async () => ({
    ellipticEc: new elliptic.ec('secp256k1'),
    secp256k1: await secp256k1Promise
});
/**
 * Note: elliptic doesn't document an equivalent to verifySignatureDERLowS, so
 * these benchmarks slightly overestimate elliptic's performance in applications
 * where Low-S verification is required (i.e. Bitcoin).
 *
 * We also help secp256k1-node a bit by converting each of it's inputs into
 * Node.js `Buffer` objects. So its performance here is a best case.
 */
ava_1.default('bench: secp256k1: verify signature Low-S, uncompressed pubkey', async (t) => {
    const { ellipticEc, secp256k1 } = await setup();
    await chuhai_1.default(t.title, s => {
        let messageHash;
        let pubkeyUncompressed;
        let sigDER;
        let result;
        // tslint:disable-next-line:no-any
        let ellipticPublicKey;
        let nodeMessageHash;
        let nodePubkeyUncompressed;
        let nodeSigDER;
        const nextCycle = () => {
            const privKey = getValidPrivateKey(secp256k1);
            messageHash = crypto_1.randomBytes(privKeyLength);
            nodeMessageHash = Buffer.from(messageHash);
            pubkeyUncompressed = secp256k1.derivePublicKeyUncompressed(privKey);
            nodePubkeyUncompressed = Buffer.from(pubkeyUncompressed);
            ellipticPublicKey = ellipticEc.keyFromPublic(nodePubkeyUncompressed.toString('hex'), 'hex');
            sigDER = secp256k1.signMessageHashDER(privKey, messageHash);
            nodeSigDER = Buffer.from(sigDER);
            result = false;
        };
        nextCycle();
        s.bench('bitcoin-ts', () => {
            result = secp256k1.verifySignatureDERLowS(sigDER, pubkeyUncompressed, messageHash);
        });
        s.bench('elliptic', () => {
            result = ellipticEc
                .keyFromPublic(ellipticPublicKey)
                .verify(messageHash, sigDER);
        });
        s.bench('secp256k1-node', () => {
            result = secp256k1Node.verify(nodeMessageHash, secp256k1Node.signatureImport(nodeSigDER), nodePubkeyUncompressed);
        });
        s.cycle(() => {
            t.true(result);
            nextCycle();
        });
    });
});
ava_1.default('bench: secp256k1: verify signature Low-S, compressed pubkey', async (t) => {
    const { ellipticEc, secp256k1 } = await setup();
    await chuhai_1.default(t.title, s => {
        let messageHash;
        let pubkeyCompressed;
        let sigDER;
        let result;
        // tslint:disable-next-line:no-any
        let ellipticPublicKey;
        let nodeMessageHash;
        let nodePubkeyCompressed;
        let nodeSigDER;
        const nextCycle = () => {
            const privKey = getValidPrivateKey(secp256k1);
            messageHash = crypto_1.randomBytes(privKeyLength);
            nodeMessageHash = Buffer.from(messageHash);
            pubkeyCompressed = secp256k1.derivePublicKeyCompressed(privKey);
            nodePubkeyCompressed = Buffer.from(pubkeyCompressed);
            ellipticPublicKey = ellipticEc.keyFromPublic(nodePubkeyCompressed.toString('hex'), 'hex');
            sigDER = secp256k1.signMessageHashDER(privKey, messageHash);
            nodeSigDER = Buffer.from(sigDER);
            result = false;
        };
        nextCycle();
        s.bench('bitcoin-ts', () => {
            result = secp256k1.verifySignatureDERLowS(sigDER, pubkeyCompressed, messageHash);
        });
        s.bench('elliptic', () => {
            result = ellipticEc
                .keyFromPublic(ellipticPublicKey)
                .verify(messageHash, sigDER);
        });
        s.bench('secp256k1-node', () => {
            result = secp256k1Node.verify(nodeMessageHash, secp256k1Node.signatureImport(nodeSigDER), Buffer.from(nodePubkeyCompressed));
        });
        s.cycle(() => {
            t.true(result);
            nextCycle();
        });
    });
});
ava_1.default('bench: secp256k1: derive compressed pubkey', async (t) => {
    const { ellipticEc, secp256k1 } = await setup();
    await chuhai_1.default(t.title, s => {
        let privKey;
        let nodePrivKey;
        let pubkeyCompressedExpected;
        let pubkeyCompressedBenchmark;
        const nextCycle = () => {
            privKey = getValidPrivateKey(secp256k1);
            nodePrivKey = Buffer.from(privKey);
            pubkeyCompressedExpected = secp256k1.derivePublicKeyCompressed(privKey);
        };
        nextCycle();
        s.bench('bitcoin-ts', () => {
            pubkeyCompressedBenchmark = secp256k1.derivePublicKeyCompressed(privKey);
        });
        s.bench('elliptic', () => {
            pubkeyCompressedBenchmark = ellipticEc
                .keyFromPrivate(privKey)
                .getPublic()
                .encodeCompressed();
        });
        s.bench('secp256k1-node', () => {
            pubkeyCompressedBenchmark = secp256k1Node.publicKeyCreate(nodePrivKey, true);
        });
        s.cycle(() => {
            t.deepEqual(pubkeyCompressedExpected, new Uint8Array(pubkeyCompressedBenchmark));
            nextCycle();
        });
    });
});
ava_1.default('bench: secp256k1: create DER Low-S signature', async (t) => {
    const { ellipticEc, secp256k1 } = await setup();
    await chuhai_1.default(t.title, s => {
        let privKey;
        let nodePrivKey;
        let messageHash;
        let nodeMessageHash;
        let sigDERExpected;
        let sigDERBenchmark;
        const nextCycle = () => {
            privKey = getValidPrivateKey(secp256k1);
            nodePrivKey = Buffer.from(privKey);
            messageHash = crypto_1.randomBytes(privKeyLength);
            nodeMessageHash = Buffer.from(messageHash);
            sigDERExpected = secp256k1.signMessageHashDER(privKey, messageHash);
        };
        nextCycle();
        s.bench('bitcoin-ts', () => {
            sigDERBenchmark = secp256k1.signMessageHashDER(privKey, messageHash);
        });
        s.bench('elliptic', () => {
            sigDERBenchmark = ellipticEc
                .keyFromPrivate(privKey)
                .sign(messageHash)
                .toDER();
        });
        s.bench('secp256k1-node', () => {
            sigDERBenchmark = secp256k1Node.signatureExport(secp256k1Node.sign(nodeMessageHash, nodePrivKey).signature);
        });
        s.cycle(() => {
            /**
             * Since Elliptic doesn't document a way to create Low-S signatures, we
             * normalize the results to validate them. This may overestimate
             * Elliptic's performance slightly.
             */
            t.deepEqual(sigDERExpected, secp256k1.normalizeSignatureDER(new Uint8Array(sigDERBenchmark)));
            nextCycle();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLmJlbmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jcnlwdG8vc2VjcDI1NmsxLmJlbmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDhEQUE4RDtBQUM5RCw4Q0FBdUI7QUFDdkIsb0RBQTJCO0FBQzNCLG1DQUFxQztBQUNyQyxtREFBcUM7QUFDckMseURBQTJDO0FBQzNDLDJDQUE4RDtBQUU5RCxNQUFNLGdCQUFnQixHQUFHLGdDQUFvQixFQUFFLENBQUM7QUFDaEQsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxTQUFvQixFQUFjLEVBQUU7SUFDOUQsSUFBSSxPQUFtQixDQUFDO0lBQ3hCLEdBQUc7UUFDRCxPQUFPLEdBQUcsb0JBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUN0QyxRQUFRLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ2pELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLE1BQU0sS0FBSyxHQUFHLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN6QixVQUFVLEVBQUUsSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQztJQUN4QyxTQUFTLEVBQUUsTUFBTSxnQkFBZ0I7Q0FDbEMsQ0FBQyxDQUFDO0FBRUg7Ozs7Ozs7R0FPRztBQUNILGFBQUksQ0FBQywrREFBK0QsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDOUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsR0FBRyxNQUFNLEtBQUssRUFBRSxDQUFDO0lBQ2hELE1BQU0sZ0JBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFO1FBQ3ZCLElBQUksV0FBdUIsQ0FBQztRQUM1QixJQUFJLGtCQUE4QixDQUFDO1FBQ25DLElB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