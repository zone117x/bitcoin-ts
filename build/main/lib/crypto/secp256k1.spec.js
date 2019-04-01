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
// TODO: all tests should include a "stateless" property – instantiate a new Secp256k1 and immediately call the method, verify it produces the same result as the existing instance
// tslint:disable:no-expression-statement no-magic-numbers no-unsafe-any no-void-expression
const ava_1 = __importDefault(require("ava"));
const crypto_1 = require("crypto");
const elliptic = __importStar(require("elliptic"));
const fc = __importStar(require("fast-check"));
const secp256k1Node = __importStar(require("secp256k1"));
const bin_1 = require("../bin/bin");
const secp256k1_1 = require("./secp256k1");
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
const secp256k1Promise = secp256k1_1.instantiateSecp256k1();
const binary = bin_1.getEmbeddedSecp256k1Binary();
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
ava_1.default('instantiateSecp256k1 with binary', async (t) => {
    const secp256k1 = await secp256k1_1.instantiateSecp256k1Bytes(binary);
    t.true(secp256k1.verifySignatureDERLowS(sigDER, pubkeyCompressed, messageHash));
});
ava_1.default('instantiateSecp256k1 with randomization', async (t) => {
    const secp256k1 = await secp256k1_1.instantiateSecp256k1(crypto_1.randomBytes(32));
    t.true(secp256k1.verifySignatureDERLowS(sigDER, pubkeyUncompressed, messageHash));
});
ava_1.default('secp256k1.addTweakPrivateKey', async (t) => {
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
ava_1.default('secp256k1.addTweakPublicKeyCompressed', async (t) => {
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
ava_1.default('secp256k1.addTweakPublicKeyUncompressed', async (t) => {
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
ava_1.default('secp256k1.compressPublicKey', async (t) => {
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
ava_1.default('secp256k1.derivePublicKeyCompressed', async (t) => {
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
ava_1.default('secp256k1.derivePublicKeyUncompressed', async (t) => {
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
ava_1.default('secp256k1.malleateSignatureDER', async (t) => {
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
ava_1.default('secp256k1.malleateSignatureCompact', async (t) => {
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
ava_1.default('secp256k1.mulTweakPrivateKey', async (t) => {
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
ava_1.default('secp256k1.mulTweakPublicKeyCompressed', async (t) => {
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
ava_1.default('secp256k1.mulTweakPublicKeyUncompressed', async (t) => {
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
ava_1.default('secp256k1.normalizeSignatureCompact', async (t) => {
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
ava_1.default('secp256k1.normalizeSignatureDER', async (t) => {
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
ava_1.default('secp256k1.recoverPublicKeyCompressed', async (t) => {
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
ava_1.default('secp256k1.recoverPublicKeyUncompressed', async (t) => {
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
ava_1.default('secp256k1.signMessageHashCompact', async (t) => {
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
ava_1.default('secp256k1.signMessageHashDER', async (t) => {
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
ava_1.default('secp256k1.signMessageHashRecoverableCompact', async (t) => {
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
ava_1.default('secp256k1.signatureCompactToDER', async (t) => {
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
ava_1.default('secp256k1.signatureDERToCompact', async (t) => {
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
ava_1.default('secp256k1.uncompressPublicKey', async (t) => {
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
ava_1.default('secp256k1.validatePrivateKey', async (t) => {
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
ava_1.default('secp256k1.verifySignatureCompact', async (t) => {
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
ava_1.default('secp256k1.verifySignatureCompactLowS', async (t) => {
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
ava_1.default('secp256k1.verifySignatureDER', async (t) => {
    const secp256k1 = await secp256k1Promise;
    t.true(secp256k1.verifySignatureDER(sigDERHighS, pubkeyCompressed, messageHash));
    // TODO: fast-check
});
ava_1.default('secp256k1.computeEcdh', async (t) => {
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
ava_1.default('secp256k1.verifySignatureDERLowS', async (t) => {
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
ava_1.default.todo('Use fast-check to run random sets of library methods and confirm that results are as expected.'
// tslint:disable-next-line:max-file-line-count
);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NyeXB0by9zZWNwMjU2azEuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtTEFBbUw7QUFDbkwsMkZBQTJGO0FBQzNGLDhDQUF1QjtBQUN2QixtQ0FBcUM7QUFDckMsbURBQXFDO0FBQ3JDLCtDQUFpQztBQUNqQyx5REFBMkM7QUFDM0Msb0NBQXdEO0FBQ3hELDJDQUlxQjtBQUVyQix3RkFBd0Y7QUFFeEYsa0JBQWtCO0FBQ2xCLE1BQU0sV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFck8sa0JBQWtCO0FBQ2xCLE1BQU0sV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFck8sa0JBQWtCO0FBQ2xCLE1BQU0sT0FBTyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFak8sa0JBQWtCO0FBQ2xCLE1BQU0sZUFBZSxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFek8sa0JBQWtCO0FBQ2xCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUVsYixrQkFBa0I7QUFDbEIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUVoUCxrQkFBa0I7QUFDbEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTNPLGtCQUFrQjtBQUNsQixNQUFNLDRCQUE0QixHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFNWIsa0JBQWtCO0FBQ2xCLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFMVAsa0JBQWtCO0FBQ2xCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUUzTyxrQkFBa0I7QUFDbEIsTUFBTSw0QkFBNEIsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTViLGtCQUFrQjtBQUNsQixNQUFNLDBCQUEwQixHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTFQLGtCQUFrQjtBQUNsQixNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTFjLGtCQUFrQjtBQUNsQixNQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUVyZCxrQkFBa0I7QUFDbEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUks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