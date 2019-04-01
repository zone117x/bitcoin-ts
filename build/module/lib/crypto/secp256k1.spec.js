// TODO: all tests should include a "stateless" property – instantiate a new Secp256k1 and immediately call the method, verify it produces the same result as the existing instance
// tslint:disable:no-expression-statement no-magic-numbers no-unsafe-any no-void-expression
import test from 'ava';
import { randomBytes } from 'crypto';
import * as elliptic from 'elliptic';
import * as fc from 'fast-check';
import * as secp256k1Node from 'secp256k1';
import { getEmbeddedSecp256k1Binary } from '../bin/bin';
import { instantiateSecp256k1, instantiateSecp256k1Bytes } from './secp256k1';
// test vectors (from `zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong`, m/0 and m/1):
// prettier-ignore
const keyTweakVal = new Uint8Array([0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]);
// prettier-ignore
const messageHash = new Uint8Array([0xda, 0xde, 0x12, 0xe0, 0x6a, 0x5b, 0xbf, 0x5e, 0x11, 0x16, 0xf9, 0xbc, 0x44, 0x99, 0x8b, 0x87, 0x68, 0x13, 0xe9, 0x48, 0xe1, 0x07, 0x07, 0xdc, 0xb4, 0x80, 0x08, 0xa1, 0xda, 0xf3, 0x51, 0x2d]);
// prettier-ignore
const privkey = new Uint8Array([0xf8, 0x5d, 0x4b, 0xd8, 0xa0, 0x3c, 0xa1, 0x06, 0xc9, 0xde, 0xb4, 0x7b, 0x79, 0x18, 0x03, 0xda, 0xc7, 0xf0, 0x33, 0x38, 0x09, 0xe3, 0xf1, 0xdd, 0x04, 0xd1, 0x82, 0xe0, 0xab, 0xa6, 0xe5, 0x53]);
// prettier-ignore
const secp256k1OrderN = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xfe, 0xba, 0xae, 0xdc, 0xe6, 0xaf, 0x48, 0xa0, 0x3b, 0xbf, 0xd2, 0x5e, 0x8c, 0xd0, 0x36, 0x41, 0x41]);
// prettier-ignore
const pubkeyUncompressed = new Uint8Array([0x04, 0x76, 0xea, 0x9e, 0x36, 0xa7, 0x5d, 0x2e, 0xcf, 0x9c, 0x93, 0xa0, 0xbe, 0x76, 0x88, 0x5e, 0x36, 0xf8, 0x22, 0x52, 0x9d, 0xb2, 0x2a, 0xcf, 0xdc, 0x76, 0x1c, 0x9b, 0x5b, 0x45, 0x44, 0xf5, 0xc5, 0x6d, 0xd5, 0x3b, 0x07, 0xc7, 0xa9, 0x83, 0xbb, 0x2d, 0xdd, 0x71, 0x55, 0x1f, 0x06, 0x33, 0x19, 0x4a, 0x2f, 0xe3, 0x30, 0xf9, 0x0a, 0xaf, 0x67, 0x5d, 0xde, 0x25, 0xb1, 0x37, 0xef, 0xd2, 0x85]);
// prettier-ignore
const pubkeyCompressed = new Uint8Array([0x03, 0x76, 0xea, 0x9e, 0x36, 0xa7, 0x5d, 0x2e, 0xcf, 0x9c, 0x93, 0xa0, 0xbe, 0x76, 0x88, 0x5e, 0x36, 0xf8, 0x22, 0x52, 0x9d, 0xb2, 0x2a, 0xcf, 0xdc, 0x76, 0x1c, 0x9b, 0x5b, 0x45, 0x44, 0xf5, 0xc5]);
// prettier-ignore
const privkeyTweakedAdd = new Uint8Array([0xf9, 0x5e, 0x4c, 0xd9, 0xa1, 0x3d, 0xa2, 0x07, 0xca, 0xdf, 0xb5, 0x7c, 0x7a, 0x19, 0x04, 0xdb, 0xc8, 0xf1, 0x34, 0x39, 0x0a, 0xe4, 0xf2, 0xde, 0x05, 0xd2, 0x83, 0xe1, 0xac, 0xa7, 0xe6, 0x54]);
// prettier-ignore
const pubkeyTweakedAddUncompressed = new Uint8Array([0x04, 0x6f, 0x1d, 0xf3, 0x4a, 0x81, 0xdf, 0x8c, 0xec, 0x18, 0x33, 0x34, 0xce, 0xb2, 0x56, 0x49, 0x9e, 0xc6, 0xe7, 0x57, 0x04, 0x57, 0x57, 0x6a, 0x92, 0x37, 0x1b, 0x74, 0x75, 0xc3, 0x4f, 0x2c, 0x19, 0xa8, 0xed, 0xd5, 0xc4, 0x29, 0x44, 0x80, 0xc1, 0xb0, 0xb3, 0x3c, 0xc8, 0xa4, 0xfd, 0x0a, 0x5c, 0x53, 0xc3, 0xd8, 0x9b, 0xd7, 0x93, 0xa7, 0x1f, 0x78, 0x03, 0x5c, 0x74, 0x00, 0xab, 0x34, 0xfc]);
// prettier-ignore
const pubkeyTweakedAddCompressed = new Uint8Array([0x02, 0x6f, 0x1d, 0xf3, 0x4a, 0x81, 0xdf, 0x8c, 0xec, 0x18, 0x33, 0x34, 0xce, 0xb2, 0x56, 0x49, 0x9e, 0xc6, 0xe7, 0x57, 0x04, 0x57, 0x57, 0x6a, 0x92, 0x37, 0x1b, 0x74, 0x75, 0xc3, 0x4f, 0x2c, 0x19]);
// prettier-ignore
const privkeyTweakedMul = new Uint8Array([0x29, 0x9f, 0x6a, 0x4d, 0xe3, 0xa0, 0xfd, 0x06, 0x8c, 0x80, 0x31, 0xef, 0xd6, 0xcf, 0x3a, 0xc6, 0xb8, 0x89, 0x02, 0x5e, 0x65, 0xd2, 0xe6, 0x2d, 0x8e, 0xb9, 0xd6, 0x88, 0x2a, 0xc2, 0x1a, 0x4a]);
// prettier-ignore
const pubkeyTweakedMulUncompressed = new Uint8Array([0x04, 0xb7, 0x98, 0x58, 0x0c, 0x33, 0x8c, 0x02, 0xed, 0xc3, 0x8a, 0xd9, 0xb6, 0x19, 0x7d, 0x4c, 0x56, 0x64, 0xe6, 0xaa, 0x85, 0x49, 0x10, 0xad, 0xa7, 0x5d, 0xc6, 0x10, 0x14, 0x2b, 0x5a, 0x7a, 0x38, 0xb5, 0x0f, 0xb1, 0x55, 0x6c, 0x03, 0x3d, 0x7f, 0xb2, 0x24, 0x21, 0x69, 0x01, 0xc2, 0x86, 0x05, 0x26, 0xad, 0xeb, 0x74, 0xa8, 0x50, 0xf2, 0x9a, 0x50, 0x8f, 0x7a, 0xb3, 0x0b, 0x66, 0x20, 0x74]);
// prettier-ignore
const pubkeyTweakedMulCompressed = new Uint8Array([0x02, 0xb7, 0x98, 0x58, 0x0c, 0x33, 0x8c, 0x02, 0xed, 0xc3, 0x8a, 0xd9, 0xb6, 0x19, 0x7d, 0x4c, 0x56, 0x64, 0xe6, 0xaa, 0x85, 0x49, 0x10, 0xad, 0xa7, 0x5d, 0xc6, 0x10, 0x14, 0x2b, 0x5a, 0x7a, 0x38]);
// prettier-ignore
const sigDER = new Uint8Array([0x30, 0x45, 0x02, 0x21, 0x00, 0xab, 0x4c, 0x6d, 0x9b, 0xa5, 0x1d, 0xa8, 0x30, 0x72, 0x61, 0x5c, 0x33, 0xa9, 0x88, 0x7b, 0x75, 0x64, 0x78, 0xe6, 0xf9, 0xde, 0x38, 0x10, 0x85, 0xf5, 0x18, 0x3c, 0x97, 0x60, 0x3f, 0xc6, 0xff, 0x02, 0x20, 0x29, 0x72, 0x21, 0x88, 0xbd, 0x93, 0x7f, 0x54, 0xc8, 0x61, 0x58, 0x2c, 0xa6, 0xfc, 0x68, 0x5b, 0x8d, 0xa2, 0xb4, 0x0d, 0x05, 0xf0, 0x6b, 0x36, 0x83, 0x74, 0xd3, 0x5e, 0x4a, 0xf2, 0xb7, 0x64]);
// prettier-ignore
const sigDERHighS = new Uint8Array([0x30, 0x46, 0x02, 0x21, 0x00, 0xab, 0x4c, 0x6d, 0x9b, 0xa5, 0x1d, 0xa8, 0x30, 0x72, 0x61, 0x5c, 0x33, 0xa9, 0x88, 0x7b, 0x75, 0x64, 0x78, 0xe6, 0xf9, 0xde, 0x38, 0x10, 0x85, 0xf5, 0x18, 0x3c, 0x97, 0x60, 0x3f, 0xc6, 0xff, 0x02, 0x21, 0x00, 0xd6, 0x8d, 0xde, 0x77, 0x42, 0x6c, 0x80, 0xab, 0x37, 0x9e, 0xa7, 0xd3, 0x59, 0x03, 0x97, 0xa3, 0x2d, 0x0c, 0x28, 0xd9, 0xa9, 0x58, 0x35, 0x05, 0x3c, 0x5d, 0x8b, 0x2e, 0x85, 0x43, 0x89, 0xdd]);
// prettier-ignore
const sigCompact = new Uint8Array([0xab, 0x4c, 0x6d, 0x9b, 0xa5, 0x1d, 0xa8, 0x30, 0x72, 0x61, 0x5c, 0x33, 0xa9, 0x88, 0x7b, 0x75, 0x64, 0x78, 0xe6, 0xf9, 0xde, 0x38, 0x10, 0x85, 0xf5, 0x18, 0x3c, 0x97, 0x60, 0x3f, 0xc6, 0xff, 0x29, 0x72, 0x21, 0x88, 0xbd, 0x93, 0x7f, 0x54, 0xc8, 0x61, 0x58, 0x2c, 0xa6, 0xfc, 0x68, 0x5b, 0x8d, 0xa2, 0xb4, 0x0d, 0x05, 0xf0, 0x6b, 0x36, 0x83, 0x74, 0xd3, 0x5e, 0x4a, 0xf2, 0xb7, 0x64]);
// prettier-ignore
const sigCompactHighS = new Uint8Array([0xab, 0x4c, 0x6d, 0x9b, 0xa5, 0x1d, 0xa8, 0x30, 0x72, 0x61, 0x5c, 0x33, 0xa9, 0x88, 0x7b, 0x75, 0x64, 0x78, 0xe6, 0xf9, 0xde, 0x38, 0x10, 0x85, 0xf5, 0x18, 0x3c, 0x97, 0x60, 0x3f, 0xc6, 0xff, 0xd6, 0x8d, 0xde, 0x77, 0x42, 0x6c, 0x80, 0xab, 0x37, 0x9e, 0xa7, 0xd3, 0x59, 0x03, 0x97, 0xa3, 0x2d, 0x0c, 0x28, 0xd9, 0xa9, 0x58, 0x35, 0x05, 0x3c, 0x5d, 0x8b, 0x2e, 0x85, 0x43, 0x89, 0xdd]);
const sigRecovery = 1;
// bitcoin-ts setup
const secp256k1Promise = instantiateSecp256k1();
const binary = getEmbeddedSecp256k1Binary();
// elliptic setup & helpers
const ec = new elliptic.ec('secp256k1');
const setupElliptic = (privateKey) => {
    const key = ec.keyFromPrivate(privateKey);
    const pubUncompressed = new Uint8Array(key.getPublic().encode());
    const pubCompressed = new Uint8Array(key.getPublic().encodeCompressed());
    return {
        key,
        pubCompressed,
        pubUncompressed
    };
};
// tslint:disable-next-line:no-any
const ellipticSignMessageDER = (key, message) => new Uint8Array(key.sign(message).toDER());
const ellipticCheckSignature = (sig, 
// tslint:disable-next-line:no-any
key, message) => key.verify(message, sig);
// fast-check helpers
const fcUint8Array = (minLength, maxLength) => fc
    .array(fc.integer(0, 255), minLength, maxLength)
    .map(a => Uint8Array.from(a));
const fcUint8Array32 = () => fcUint8Array(32, 32);
const fcValidPrivateKey = (secp256k1) => fcUint8Array32().filter(generated => secp256k1.validatePrivateKey(generated));
test('instantiateSecp256k1 with binary', async (t) => {
    const secp256k1 = await instantiateSecp256k1Bytes(binary);
    t.true(secp256k1.verifySignatureDERLowS(sigDER, pubkeyCompressed, messageHash));
});
test('instantiateSecp256k1 with randomization', async (t) => {
    const secp256k1 = await instantiateSecp256k1(randomBytes(32));
    t.true(secp256k1.verifySignatureDERLowS(sigDER, pubkeyUncompressed, messageHash));
});
test('secp256k1.addTweakPrivateKey', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.addTweakPrivateKey(privkey, keyTweakVal), privkeyTweakedAdd);
    t.throws(() => secp256k1.addTweakPrivateKey(privkey, Buffer.alloc(32, 255)));
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        t.deepEqual(secp256k1.addTweakPrivateKey(privateKey, keyTweakVal), new Uint8Array(secp256k1Node.privateKeyTweakAdd(Buffer.from(privateKey), Buffer.from(keyTweakVal))));
    });
    t.notThrows(() => fc.assert(equivalentToSecp256k1Node));
    // the elliptic library doesn't implement public or private key tweaking.
    // perhaps future tests can do the math in JavaScript and compare with that.
});
test('secp256k1.addTweakPublicKeyCompressed', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.addTweakPublicKeyCompressed(pubkeyCompressed, keyTweakVal), pubkeyTweakedAddCompressed);
    t.throws(() => {
        secp256k1.addTweakPublicKeyCompressed(new Uint8Array(65), keyTweakVal);
    });
    t.throws(() => {
        secp256k1.addTweakPublicKeyCompressed(pubkeyCompressed, Buffer.alloc(32, 255));
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyC = secp256k1.derivePublicKeyCompressed(privateKey);
        t.deepEqual(secp256k1.addTweakPublicKeyCompressed(pubkeyC, keyTweakVal), new Uint8Array(secp256k1Node.publicKeyTweakAdd(Buffer.from(pubkeyC), Buffer.from(keyTweakVal), true)));
    });
    t.notThrows(() => fc.assert(equivalentToSecp256k1Node));
    // the elliptic library doesn't implement public or private key tweaking.
    // perhaps future tests can do the math in JavaScript and compare with that.
});
test('secp256k1.addTweakPublicKeyUncompressed', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.addTweakPublicKeyUncompressed(pubkeyUncompressed, keyTweakVal), pubkeyTweakedAddUncompressed);
    t.throws(() => {
        secp256k1.addTweakPublicKeyUncompressed(new Uint8Array(65), keyTweakVal);
    });
    t.throws(() => {
        secp256k1.addTweakPublicKeyUncompressed(pubkeyCompressed, Buffer.alloc(32, 255));
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyU = secp256k1.derivePublicKeyUncompressed(privateKey);
        t.deepEqual(secp256k1.addTweakPublicKeyUncompressed(pubkeyU, keyTweakVal), new Uint8Array(secp256k1Node.publicKeyTweakAdd(Buffer.from(pubkeyU), Buffer.from(keyTweakVal), false)));
    });
    t.notThrows(() => fc.assert(equivalentToSecp256k1Node));
    // the elliptic library doesn't implement public or private key tweaking.
    // perhaps future tests can do the math in JavaScript and compare with that.
});
test('secp256k1.compressPublicKey', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.compressPublicKey(pubkeyUncompressed), pubkeyCompressed);
    t.throws(() => secp256k1.compressPublicKey(new Uint8Array(65)));
    const reversesUncompress = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyC = secp256k1.derivePublicKeyCompressed(privateKey);
        t.deepEqual(pubkeyC, secp256k1.compressPublicKey(secp256k1.uncompressPublicKey(pubkeyC)));
    });
    t.notThrows(() => {
        fc.assert(reversesUncompress);
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyU = secp256k1.derivePublicKeyUncompressed(privateKey);
        t.deepEqual(secp256k1.compressPublicKey(pubkeyU), new Uint8Array(secp256k1Node.publicKeyConvert(Buffer.from(pubkeyU), true)));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
    const equivalentToElliptic = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyU = secp256k1.derivePublicKeyUncompressed(privateKey);
        t.deepEqual(secp256k1.compressPublicKey(pubkeyU), new Uint8Array(ec
            .keyFromPublic(pubkeyU)
            .getPublic()
            .encodeCompressed()));
    });
    t.notThrows(() => {
        fc.assert(equivalentToElliptic);
    });
});
test('secp256k1.derivePublicKeyCompressed', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.derivePublicKeyCompressed(privkey), pubkeyCompressed);
    t.throws(() => secp256k1.derivePublicKeyCompressed(secp256k1OrderN));
    const isEquivalentToDeriveUncompressedThenCompress = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyU = secp256k1.derivePublicKeyUncompressed(privateKey);
        const pubkeyC = secp256k1.derivePublicKeyCompressed(privateKey);
        t.deepEqual(pubkeyC, secp256k1.compressPublicKey(pubkeyU));
    });
    t.notThrows(() => {
        fc.assert(isEquivalentToDeriveUncompressedThenCompress);
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        t.deepEqual(secp256k1.derivePublicKeyCompressed(privateKey), new Uint8Array(secp256k1Node.publicKeyCreate(Buffer.from(privateKey), true)));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
    const equivalentToElliptic = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        t.deepEqual(secp256k1.derivePublicKeyCompressed(privateKey), setupElliptic(privateKey).pubCompressed);
    });
    t.notThrows(() => {
        fc.assert(equivalentToElliptic);
    });
});
test('secp256k1.derivePublicKeyUncompressed', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.derivePublicKeyUncompressed(privkey), pubkeyUncompressed);
    t.throws(() => secp256k1.derivePublicKeyUncompressed(secp256k1OrderN));
    const isEquivalentToDeriveCompressedThenUncompress = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyC = secp256k1.derivePublicKeyCompressed(privateKey);
        const pubkeyU = secp256k1.derivePublicKeyUncompressed(privateKey);
        t.deepEqual(pubkeyU, secp256k1.uncompressPublicKey(pubkeyC));
    });
    t.notThrows(() => {
        fc.assert(isEquivalentToDeriveCompressedThenUncompress);
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        t.deepEqual(secp256k1.derivePublicKeyUncompressed(privateKey), new Uint8Array(secp256k1Node.publicKeyCreate(Buffer.from(privateKey), false)));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
    const equivalentToElliptic = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        t.deepEqual(secp256k1.derivePublicKeyUncompressed(privateKey), setupElliptic(privateKey).pubUncompressed);
    });
    t.notThrows(() => {
        fc.assert(equivalentToElliptic);
    });
});
test('secp256k1.malleateSignatureDER', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.malleateSignatureDER(sigDER), sigDERHighS);
    const malleationIsJustNegation = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, message) => {
        const { key } = setupElliptic(privateKey);
        const pubkey = secp256k1.derivePublicKeyCompressed(privateKey);
        const sig = secp256k1.signMessageHashDER(privateKey, message);
        t.true(secp256k1.verifySignatureDERLowS(sig, pubkey, message));
        t.true(ellipticCheckSignature(sig, key, message));
        const malleated = secp256k1.malleateSignatureDER(sig);
        t.true(secp256k1.verifySignatureDER(malleated, pubkey, message));
        t.true(ellipticCheckSignature(malleated, key, message));
        t.false(secp256k1.verifySignatureDERLowS(malleated, pubkey, message));
        t.deepEqual(sig, secp256k1.malleateSignatureDER(malleated));
    });
    t.notThrows(() => {
        fc.assert(malleationIsJustNegation);
    });
});
test('secp256k1.malleateSignatureCompact', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.malleateSignatureCompact(sigCompact), sigCompactHighS);
    const malleationIsJustNegation = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, message) => {
        const pubkey = secp256k1.derivePublicKeyCompressed(privateKey);
        const sig = secp256k1.signMessageHashCompact(privateKey, message);
        t.true(secp256k1.verifySignatureCompactLowS(sig, pubkey, message));
        t.true(secp256k1Node.verify(Buffer.from(message), Buffer.from(sig), Buffer.from(pubkey)));
        const malleated = secp256k1.malleateSignatureCompact(sig);
        t.true(secp256k1.verifySignatureCompact(malleated, pubkey, message));
        t.false(secp256k1.verifySignatureCompactLowS(malleated, pubkey, message));
        t.false(secp256k1Node.verify(Buffer.from(message), Buffer.from(malleated), Buffer.from(pubkey)));
        const malleatedMalleated = secp256k1.malleateSignatureCompact(malleated);
        t.true(secp256k1Node.verify(Buffer.from(message), Buffer.from(malleatedMalleated), Buffer.from(pubkey)));
        t.true(secp256k1.verifySignatureCompactLowS(malleatedMalleated, pubkey, message));
        t.deepEqual(sig, malleatedMalleated);
    });
    t.notThrows(() => {
        fc.assert(malleationIsJustNegation);
    });
});
test('secp256k1.mulTweakPrivateKey', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.mulTweakPrivateKey(privkey, keyTweakVal), privkeyTweakedMul);
    t.throws(() => secp256k1.mulTweakPrivateKey(privkey, Buffer.alloc(32, 255)));
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        t.deepEqual(secp256k1.mulTweakPrivateKey(privateKey, keyTweakVal), new Uint8Array(secp256k1Node.privateKeyTweakMul(Buffer.from(privateKey), Buffer.from(keyTweakVal))));
    });
    t.notThrows(() => fc.assert(equivalentToSecp256k1Node));
    // the elliptic library doesn't implement public or private key tweaking.
    // perhaps future tests can do the math in JavaScript and compare with that.
});
test('secp256k1.mulTweakPublicKeyCompressed', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.mulTweakPublicKeyCompressed(pubkeyCompressed, keyTweakVal), pubkeyTweakedMulCompressed);
    t.throws(() => {
        secp256k1.mulTweakPublicKeyCompressed(new Uint8Array(65), keyTweakVal);
    });
    t.throws(() => {
        secp256k1.mulTweakPublicKeyCompressed(pubkeyCompressed, Buffer.alloc(32, 255));
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyC = secp256k1.derivePublicKeyCompressed(privateKey);
        t.deepEqual(secp256k1.mulTweakPublicKeyCompressed(pubkeyC, keyTweakVal), new Uint8Array(secp256k1Node.publicKeyTweakMul(Buffer.from(pubkeyC), Buffer.from(keyTweakVal), true)));
    });
    t.notThrows(() => fc.assert(equivalentToSecp256k1Node));
    // the elliptic library doesn't implement public or private key tweaking.
    // perhaps future tests can do the math in JavaScript and compare with that.
});
test('secp256k1.mulTweakPublicKeyUncompressed', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.mulTweakPublicKeyUncompressed(pubkeyUncompressed, keyTweakVal), pubkeyTweakedMulUncompressed);
    t.throws(() => {
        secp256k1.mulTweakPublicKeyUncompressed(new Uint8Array(65), keyTweakVal);
    });
    t.throws(() => {
        secp256k1.mulTweakPublicKeyUncompressed(pubkeyCompressed, Buffer.alloc(32, 255));
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyU = secp256k1.derivePublicKeyUncompressed(privateKey);
        t.deepEqual(secp256k1.mulTweakPublicKeyUncompressed(pubkeyU, keyTweakVal), new Uint8Array(secp256k1Node.publicKeyTweakMul(Buffer.from(pubkeyU), Buffer.from(keyTweakVal), false)));
    });
    t.notThrows(() => fc.assert(equivalentToSecp256k1Node));
    // the elliptic library doesn't implement public or private key tweaking.
    // perhaps future tests can do the math in JavaScript and compare with that.
});
test('secp256k1.normalizeSignatureCompact', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.normalizeSignatureCompact(sigCompactHighS), sigCompact);
    const malleateThenNormalizeEqualsInitial = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const sig = secp256k1.signMessageHashCompact(privateKey, hash);
        t.deepEqual(sig, secp256k1.normalizeSignatureCompact(secp256k1.malleateSignatureCompact(sig)));
    });
    t.notThrows(() => {
        fc.assert(malleateThenNormalizeEqualsInitial);
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const sig = secp256k1.signMessageHashCompact(Buffer.from(privateKey), Buffer.from(hash));
        const malleated = secp256k1.malleateSignatureCompact(sig);
        t.deepEqual(secp256k1.normalizeSignatureCompact(malleated), new Uint8Array(secp256k1Node.signatureNormalize(Buffer.from(malleated))));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
});
test('secp256k1.normalizeSignatureDER', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.normalizeSignatureDER(sigDERHighS), sigDER);
    const malleateThenNormalizeEqualsInitial = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const sig = secp256k1.signMessageHashDER(privateKey, hash);
        t.deepEqual(sig, secp256k1.normalizeSignatureDER(secp256k1.malleateSignatureDER(sig)));
    });
    t.notThrows(() => {
        fc.assert(malleateThenNormalizeEqualsInitial);
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const sig = secp256k1.signMessageHashDER(privateKey, hash);
        const malleated = secp256k1.malleateSignatureDER(sig);
        t.deepEqual(secp256k1.normalizeSignatureDER(malleated), new Uint8Array(secp256k1Node.signatureExport(secp256k1Node.signatureNormalize(secp256k1Node.signatureImport(Buffer.from(malleated))))));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
});
test('secp256k1.recoverPublicKeyCompressed', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.recoverPublicKeyCompressed(sigCompact, sigRecovery, messageHash), pubkeyCompressed);
    t.throws(() => secp256k1.recoverPublicKeyCompressed(new Uint8Array(64).fill(255), sigRecovery, messageHash));
    const failRecover = 2;
    t.throws(() => secp256k1.recoverPublicKeyCompressed(sigCompact, failRecover, messageHash));
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const recoverableStuff = secp256k1.signMessageHashRecoverableCompact(privateKey, hash);
        t.deepEqual(secp256k1.recoverPublicKeyCompressed(recoverableStuff.signature, recoverableStuff.recoveryId, hash), new Uint8Array(secp256k1Node.recover(Buffer.from(hash), Buffer.from(recoverableStuff.signature), recoverableStuff.recoveryId, true)));
    });
    t.notThrows(() => fc.assert(equivalentToSecp256k1Node));
    // TODO: equivalentToElliptic test for recoverable signatures.
    /*
    const equivalentToElliptic = fc.property();
    t.notThrows(() => fc.assert(equivalentToElliptic));
    */
});
test('secp256k1.recoverPublicKeyUncompressed', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.recoverPublicKeyUncompressed(sigCompact, sigRecovery, messageHash), pubkeyUncompressed);
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const recoverableStuff = secp256k1.signMessageHashRecoverableCompact(privateKey, hash);
        t.deepEqual(secp256k1.recoverPublicKeyUncompressed(recoverableStuff.signature, recoverableStuff.recoveryId, hash), new Uint8Array(secp256k1Node.recover(Buffer.from(hash), Buffer.from(recoverableStuff.signature), recoverableStuff.recoveryId, false)));
    });
    t.notThrows(() => fc.assert(equivalentToSecp256k1Node));
    // TODO: equivalentToElliptic test for recoverable signatures.
    /*
    const equivalentToElliptic = fc.property();
    t.notThrows(() => fc.assert(equivalentToElliptic));
    */
});
test('secp256k1.signMessageHashCompact', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.signMessageHashCompact(privkey, messageHash), sigCompact);
    t.throws(() => secp256k1.signMessageHashCompact(secp256k1OrderN, messageHash));
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        t.deepEqual(secp256k1.signMessageHashCompact(privateKey, hash), new Uint8Array(secp256k1Node.sign(Buffer.from(hash), Buffer.from(privateKey)).signature));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
    const equivalentToElliptic = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const { key } = setupElliptic(privateKey);
        t.deepEqual(secp256k1.signMessageHashCompact(privateKey, hash), secp256k1.signatureDERToCompact(secp256k1.normalizeSignatureDER(ellipticSignMessageDER(key, hash))));
    });
    t.notThrows(() => {
        fc.assert(equivalentToElliptic);
    });
});
test('secp256k1.signMessageHashDER', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.signMessageHashDER(privkey, messageHash), sigDER);
    t.throws(() => secp256k1.signMessageHashDER(secp256k1OrderN, messageHash));
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        t.deepEqual(secp256k1.signMessageHashDER(privateKey, hash), new Uint8Array(secp256k1Node.signatureExport(secp256k1Node.sign(Buffer.from(hash), Buffer.from(privateKey))
            .signature)));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
    const equivalentToElliptic = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const { key } = setupElliptic(privateKey);
        t.deepEqual(secp256k1.signMessageHashDER(privateKey, hash), secp256k1.normalizeSignatureDER(ellipticSignMessageDER(key, hash)));
    });
    t.notThrows(() => {
        fc.assert(equivalentToElliptic);
    });
});
test('secp256k1.signMessageHashRecoverableCompact', async (t) => {
    const secp256k1 = await secp256k1Promise;
    const recoverableStuff = secp256k1.signMessageHashRecoverableCompact(privkey, messageHash);
    t.is(recoverableStuff.recoveryId, sigRecovery);
    t.deepEqual(recoverableStuff.signature, sigCompact);
    t.throws(() => secp256k1.signMessageHashRecoverableCompact(secp256k1OrderN, messageHash));
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const nodeRecoverableStuff = secp256k1Node.sign(Buffer.from(hash), Buffer.from(privateKey));
        t.deepEqual(secp256k1.signMessageHashRecoverableCompact(privateKey, hash), {
            recoveryId: nodeRecoverableStuff.recovery,
            signature: new Uint8Array(nodeRecoverableStuff.signature)
        });
    });
    t.notThrows(() => fc.assert(equivalentToSecp256k1Node));
    // TODO: equivalentToElliptic test for recoverable signatures.
    /*
    const equivalentToElliptic = fc.property();
    t.notThrows(() => fc.assert(equivalentToElliptic));
    */
});
test('secp256k1.signatureCompactToDER', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.signatureCompactToDER(sigCompact), sigDER);
    const reversesCompress = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyU = secp256k1.derivePublicKeyUncompressed(privateKey);
        t.deepEqual(pubkeyU, secp256k1.uncompressPublicKey(secp256k1.compressPublicKey(pubkeyU)));
    });
    t.notThrows(() => {
        fc.assert(reversesCompress);
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const sig = secp256k1.signMessageHashCompact(privateKey, hash);
        t.deepEqual(new Uint8Array(secp256k1Node.signatureExport(Buffer.from(sig))), secp256k1.signatureCompactToDER(sig));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
});
test('secp256k1.signatureDERToCompact', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.signatureDERToCompact(sigDER), sigCompact);
    const sigDERWithBrokenEncoding = sigDER.slice().fill(0, 0, 1);
    t.throws(() => {
        secp256k1.signatureDERToCompact(sigDERWithBrokenEncoding);
    });
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), (privateKey, hash) => {
        const sig = secp256k1.signMessageHashDER(privateKey, hash);
        t.deepEqual(new Uint8Array(secp256k1Node.signatureImport(Buffer.from(sig))), secp256k1.signatureDERToCompact(sig));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
});
test('secp256k1.uncompressPublicKey', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.deepEqual(secp256k1.uncompressPublicKey(pubkeyCompressed), pubkeyUncompressed);
    t.throws(() => secp256k1.uncompressPublicKey(new Uint8Array(33)));
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), privateKey => {
        const pubkeyC = secp256k1.derivePublicKeyCompressed(privateKey);
        t.deepEqual(new Uint8Array(secp256k1Node.publicKeyConvert(Buffer.from(pubkeyC), false)), secp256k1.uncompressPublicKey(pubkeyC));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
});
test('secp256k1.validatePrivateKey', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.true(secp256k1.validatePrivateKey(privkey));
    t.false(secp256k1.validatePrivateKey(secp256k1OrderN));
    // invalid >= 0xFFFF FFFF FFFF FFFF FFFF FFFF FFFF FFFE BAAE DCE6 AF48 A03B BFD2 5E8C D036 4140
    const almostInvalid = Array(15).fill(255);
    const theRest = 32 - almostInvalid.length;
    const equivalentToSecp256k1Node = fc.property(fc
        .array(fc.integer(0, 255), theRest, theRest)
        .map(random => Uint8Array.from([...almostInvalid, ...random])), privateKey => secp256k1.validatePrivateKey(privateKey) ===
        secp256k1Node.privateKeyVerify(Buffer.from(privateKey)));
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
});
test('secp256k1.verifySignatureCompact', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.true(secp256k1.verifySignatureCompact(sigCompactHighS, pubkeyCompressed, messageHash));
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), fc.boolean(), fc.boolean(), (privateKey, message, compressed, invalidate) => {
        const pubUncompressed = secp256k1Node.publicKeyCreate(Buffer.from(privateKey), false);
        const pubCompressed = secp256k1Node.publicKeyCreate(Buffer.from(privateKey), true);
        const sig = secp256k1Node.sign(Buffer.from(message), Buffer.from(privateKey)).signature;
        const testSig = invalidate ? sig.fill(0, 6, 7) : sig;
        const pub = compressed ? pubCompressed : pubUncompressed;
        const malleated = secp256k1.malleateSignatureCompact(testSig);
        return (secp256k1Node.verify(Buffer.from(message), Buffer.from(testSig), Buffer.from(pub)) === secp256k1.verifySignatureCompact(malleated, pub, message));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
    const equivalentToElliptic = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), fc.boolean(), fc.boolean(), (privateKey, message, compressed, invalidate) => {
        const { key, pubUncompressed, pubCompressed } = setupElliptic(privateKey);
        const sig = ellipticSignMessageDER(key, message);
        const testSig = invalidate ? sig.fill(0, 6, 20) : sig;
        const pub = compressed ? pubCompressed : pubUncompressed;
        const compactSig = secp256k1.signatureDERToCompact(testSig);
        return (ellipticCheckSignature(testSig, key, message) ===
            secp256k1.verifySignatureCompact(compactSig, pub, message));
    });
    t.notThrows(() => {
        fc.assert(equivalentToElliptic);
    });
});
test('secp256k1.verifySignatureCompactLowS', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.true(secp256k1.verifySignatureCompactLowS(sigCompact, pubkeyCompressed, messageHash));
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), fc.boolean(), fc.boolean(), (privateKey, message, compressed, invalidate) => {
        const pubUncompressed = secp256k1Node.publicKeyCreate(Buffer.from(privateKey), false);
        const pubCompressed = secp256k1Node.publicKeyCreate(Buffer.from(privateKey), true);
        const sig = secp256k1Node.sign(Buffer.from(message), Buffer.from(privateKey)).signature;
        const testSig = invalidate ? sig.fill(0, 6, 7) : sig;
        const pub = compressed ? pubCompressed : pubUncompressed;
        return (secp256k1Node.verify(Buffer.from(message), Buffer.from(testSig), Buffer.from(pub)) === secp256k1.verifySignatureCompactLowS(testSig, pub, message));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
    const equivalentToElliptic = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), fc.boolean(), fc.boolean(), (privateKey, message, compressed, invalidate) => {
        const { key, pubUncompressed, pubCompressed } = setupElliptic(privateKey);
        const sig = secp256k1.normalizeSignatureDER(ellipticSignMessageDER(key, message));
        const testSig = invalidate ? sig.fill(0, 6, 20) : sig;
        const pub = compressed ? pubCompressed : pubUncompressed;
        const compactSig = secp256k1.signatureDERToCompact(testSig);
        return (ellipticCheckSignature(testSig, key, message) ===
            secp256k1.verifySignatureCompactLowS(compactSig, pub, message));
    });
    t.notThrows(() => {
        fc.assert(equivalentToElliptic);
    });
});
test('secp256k1.verifySignatureDER', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.true(secp256k1.verifySignatureDER(sigDERHighS, pubkeyCompressed, messageHash));
    // TODO: fast-check
});
test('secp256k1.computeEcdh', async (t) => {
    const secp256k1 = await secp256k1Promise;
    const keys = [
        '2e171b4bcc8a3f0cf90bc58443f7cf7fcbeba735ccfc402ea29e8ac8c45bb366',
        '561cdd4be52d3287bfc7dce747bbfa08708a1336a607e20e2fe3e363b93d32cd',
        'a8ea7fcd32a7611438acae1eea0fba06e010c0d9781e005cca0f99f79dda57be'
    ]
        .map(p => Buffer.from(p, 'hex'))
        .map(p => ({
        private: p,
        public: secp256k1.derivePublicKeyUncompressed(p)
    }));
    const secret1 = Buffer.from(secp256k1.computeEcdhSecret(keys[0].public, keys[1].private)).toString('hex');
    const secret2 = Buffer.from(secp256k1.computeEcdhSecret(keys[1].public, keys[0].private)).toString('hex');
    const secret3 = Buffer.from(secp256k1.computeEcdhSecret(keys[0].public, keys[0].private)).toString('hex');
    t.is(secret1, secret2);
    t.not(secret3, secret2);
});
test('secp256k1.verifySignatureDERLowS', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.true(secp256k1.verifySignatureDERLowS(sigDER, pubkeyCompressed, messageHash));
    const pubkeyWithBrokenEncoding = pubkeyCompressed.slice().fill(0, 0, 1);
    t.false(secp256k1.verifySignatureDERLowS(sigDER, pubkeyWithBrokenEncoding, messageHash));
    const sigDERWithBrokenEncoding = sigDER.slice().fill(0, 0, 1);
    t.false(secp256k1.verifySignatureDERLowS(sigDERWithBrokenEncoding, pubkeyCompressed, messageHash));
    const sigDERWithBadSignature = sigDER.slice().fill(0, 6, 7);
    t.false(secp256k1.verifySignatureDERLowS(sigDERWithBadSignature, pubkeyCompressed, messageHash));
    const equivalentToSecp256k1Node = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), fc.boolean(), fc.boolean(), (privateKey, message, compressed, invalidate) => {
        const pubUncompressed = secp256k1Node.publicKeyCreate(Buffer.from(privateKey), false);
        const pubCompressed = secp256k1Node.publicKeyCreate(Buffer.from(privateKey), true);
        const sig = secp256k1Node.signatureExport(secp256k1Node.sign(Buffer.from(message), Buffer.from(privateKey))
            .signature);
        const testSig = invalidate ? sig.fill(0, 6, 7) : sig;
        const pub = compressed ? pubCompressed : pubUncompressed;
        return (secp256k1Node.verify(Buffer.from(message), secp256k1Node.signatureImport(Buffer.from(testSig)), Buffer.from(pub)) === secp256k1.verifySignatureDERLowS(testSig, pub, message));
    });
    t.notThrows(() => {
        fc.assert(equivalentToSecp256k1Node);
    });
    const equivalentToElliptic = fc.property(fcValidPrivateKey(secp256k1), fcUint8Array32(), fc.boolean(), fc.boolean(), (privateKey, message, compressed, invalidate) => {
        const { key, pubUncompressed, pubCompressed } = setupElliptic(privateKey);
        const sig = ellipticSignMessageDER(key, message);
        const testSig = invalidate ? sig.fill(0, 6, 7) : sig;
        const pub = compressed ? pubCompressed : pubUncompressed;
        return (ellipticCheckSignature(testSig, key, message) ===
            secp256k1.verifySignatureDERLowS(secp256k1.normalizeSignatureDER(testSig), pub, message));
    });
    t.notThrows(() => {
        fc.assert(equivalentToElliptic);
    });
});
test.todo('Use fast-check to run random sets of library methods and confirm that results are as expected.'
// tslint:disable-next-line:max-file-line-count
);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NyeXB0by9zZWNwMjU2azEuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxtTEFBbUw7QUFDbkwsMkZBQTJGO0FBQzNGLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ3JDLE9BQU8sS0FBSyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxhQUFhLE1BQU0sV0FBVyxDQUFDO0FBQzNDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN4RCxPQUFPLEVBQ0wsb0JBQW9CLEVBQ3BCLHlCQUF5QixFQUUxQixNQUFNLGFBQWEsQ0FBQztBQUVyQix3RkFBd0Y7QUFFeEYsa0JBQWtCO0FBQ2xCLE1BQU0sV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFck8sa0JBQWtCO0FBQ2xCLE1BQU0sV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFck8sa0JBQWtCO0FBQ2xCLE1BQU0sT0FBTyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFak8sa0JBQWtCO0FBQ2xCLE1BQU0sZUFBZSxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFek8sa0JBQWtCO0FBQ2xCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUVsYixrQkFBa0I7QUFDbEIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUVoUCxrQkFBa0I7QUFDbEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTNPLGtCQUFrQjtBQUNsQixNQUFNLDRCQUE0QixHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFNWIsa0JBQWtCO0FBQ2xCLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFMVAsa0JBQWtCO0FBQ2xCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUUzTyxrQkFBa0I7QUFDbEIsTUFBTSw0QkFBNEIsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTViLGtCQUFrQjtBQUNsQixNQUFNLDBCQUEwQixHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTFQLGtCQUFrQjtBQUNsQixNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTFjLGtCQUFrQjtBQUNsQixNQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUVyZCxrQkFBa0I7QUFDbEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRXBhLGtCQUFrQjtBQUNsQixNQUFNLGVBQWUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJ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