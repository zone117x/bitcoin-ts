// tslint:disable:no-expression-statement no-let no-unsafe-any
import test from 'ava';
import suite from 'chuhai';
import { randomBytes } from 'crypto';
import * as elliptic from 'elliptic';
import * as secp256k1Node from 'secp256k1';
import { instantiateSecp256k1 } from './secp256k1';
const secp256k1Promise = instantiateSecp256k1();
const privKeyLength = 32;
const getValidPrivateKey = (secp256k1) => {
    let privKey;
    do {
        privKey = randomBytes(privKeyLength);
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
test('bench: secp256k1: verify signature Low-S, uncompressed pubkey', async (t) => {
    const { ellipticEc, secp256k1 } = await setup();
    await suite(t.title, s => {
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
            messageHash = randomBytes(privKeyLength);
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
test('bench: secp256k1: verify signature Low-S, compressed pubkey', async (t) => {
    const { ellipticEc, secp256k1 } = await setup();
    await suite(t.title, s => {
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
            messageHash = randomBytes(privKeyLength);
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
test('bench: secp256k1: derive compressed pubkey', async (t) => {
    const { ellipticEc, secp256k1 } = await setup();
    await suite(t.title, s => {
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
test('bench: secp256k1: create DER Low-S signature', async (t) => {
    const { ellipticEc, secp256k1 } = await setup();
    await suite(t.title, s => {
        let privKey;
        let nodePrivKey;
        let messageHash;
        let nodeMessageHash;
        let sigDERExpected;
        let sigDERBenchmark;
        const nextCycle = () => {
            privKey = getValidPrivateKey(secp256k1);
            nodePrivKey = Buffer.from(privKey);
            messageHash = randomBytes(privKeyLength);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLmJlbmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jcnlwdG8vc2VjcDI1NmsxLmJlbmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhEQUE4RDtBQUM5RCxPQUFPLElBQUksTUFBTSxLQUFLLENBQUM7QUFDdkIsT0FBTyxLQUFLLE1BQU0sUUFBUSxDQUFDO0FBQzNCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDckMsT0FBTyxLQUFLLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDckMsT0FBTyxLQUFLLGFBQWEsTUFBTSxXQUFXLENBQUM7QUFDM0MsT0FBTyxFQUFFLG9CQUFvQixFQUFhLE1BQU0sYUFBYSxDQUFDO0FBRTlELE1BQU0sZ0JBQWdCLEdBQUcsb0JBQW9CLEVBQUUsQ0FBQztBQUNoRCxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDekIsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQW9CLEVBQWMsRUFBRTtJQUM5RCxJQUFJLE9BQW1CLENBQUM7SUFDeEIsR0FBRztRQUNELE9BQU8sR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDdEMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtJQUNqRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDLENBQUM7QUFFRixNQUFNLEtBQUssR0FBRyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekIsVUFBVSxFQUFFLElBQUksUUFBUSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUM7SUFDeEMsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCO0NBQ2xDLENBQUMsQ0FBQztBQUVIOzs7Ozs7O0dBT0c7QUFDSCxJQUFJLENBQUMsK0RBQStELEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzlFLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEdBQUcsTUFB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