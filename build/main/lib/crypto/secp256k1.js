"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secp256k1_wasm_1 = require("../bin/secp256k1/secp256k1-wasm");
/**
 * @param secp256k1Wasm a Secp256k1Wasm object
 * @param randomSeed a 32-byte random seed used to randomize the context after
 * creation
 */
const wrapSecp256k1Wasm = (secp256k1Wasm, randomSeed) => {
    /**
     * Currently, this wrapper creates a context with both SIGN and VERIFY
     * capabilities. For better initialization performance, consumers could
     * re-implement a wrapper with only the capabilities they require.
     */
    const contextPtr = secp256k1Wasm.contextCreate(secp256k1_wasm_1.ContextFlag.BOTH);
    /**
     * Since all of these methods are single-threaded and synchronous, we can
     * reuse allocated WebAssembly memory for each method without worrying about
     * calls interfering with each other. Likewise, these spaces never need to be
     * `free`d, since we will continue using them until this entire object (and
     * with it, the entire WebAssembly instance) is garbage collected.
     *
     * If malicious javascript gained access to this object, it should be
     * considered a critical vulnerability in the consumer. However, as a best
     * practice, we zero out private keys below when we're finished with them.
     */
    const sigScratch = secp256k1Wasm.malloc(72 /* maxSig */);
    const publicKeyScratch = secp256k1Wasm.malloc(65 /* maxPublicKey */);
    const messageHashScratch = secp256k1Wasm.malloc(32 /* messageHash */);
    const ecdhSecretScratch = secp256k1Wasm.malloc(32 /* ecdhSecret */);
    const internalPublicKeyPtr = secp256k1Wasm.malloc(64 /* internalPublicKey */);
    const internalSigPtr = secp256k1Wasm.malloc(64 /* internalSig */);
    const privateKeyPtr = secp256k1Wasm.malloc(32 /* privateKey */);
    const internalRSigPtr = secp256k1Wasm.malloc(65 /* recoverableSig */);
    // tslint:disable-next-line:no-magic-numbers
    const recoveryNumPtr = secp256k1Wasm.malloc(4);
    // tslint:disable-next-line:no-bitwise no-magic-numbers
    const recoveryNumPtrView32 = recoveryNumPtr >> 2;
    const getRecoveryNumPtr = () => secp256k1Wasm.heapU32[recoveryNumPtrView32];
    // tslint:disable-next-line:no-magic-numbers
    const lengthPtr = secp256k1Wasm.malloc(4);
    // tslint:disable-next-line:no-bitwise no-magic-numbers
    const lengthPtrView32 = lengthPtr >> 2;
    // tslint:disable:no-expression-statement no-if-statement
    const parsePublicKey = (publicKey) => {
        secp256k1Wasm.heapU8.set(publicKey, publicKeyScratch);
        return secp256k1Wasm.pubkeyParse(contextPtr, internalPublicKeyPtr, publicKeyScratch, 
        // tslint:disable-next-line:no-magic-numbers
        publicKey.length) === 1
            ? true
            : false;
    };
    const setLengthPtr = (value) => {
        secp256k1Wasm.heapU32.set([value], lengthPtrView32);
    };
    const getLengthPtr = () => secp256k1Wasm.heapU32[lengthPtrView32];
    const serializePublicKey = (length, flag) => {
        setLengthPtr(length);
        secp256k1Wasm.pubkeySerialize(contextPtr, publicKeyScratch, lengthPtr, internalPublicKeyPtr, flag);
        return secp256k1Wasm.readHeapU8(publicKeyScratch, getLengthPtr()).slice();
    };
    const getSerializedPublicKey = (compressed) => compressed
        ? serializePublicKey(33 /* compressedPublicKey */, secp256k1_wasm_1.CompressionFlag.COMPRESSED)
        : serializePublicKey(65 /* uncompressedPublicKey */, secp256k1_wasm_1.CompressionFlag.UNCOMPRESSED);
    const computeEcdhSecret = (publicKey, privateKey) => {
        if (!parsePublicKey(publicKey)) {
            throw new Error('Failed to parse public key.');
        }
        // tslint:disable-next-line: no-use-before-declare
        return withPrivateKey(privateKey, () => {
            const failed = secp256k1Wasm.ecdh(contextPtr, ecdhSecretScratch, internalPublicKeyPtr, privateKeyPtr) !== 1;
            if (failed) {
                throw new Error('Failed to compute EC Diffie-Hellman secret.');
            }
            return secp256k1Wasm
                .readHeapU8(ecdhSecretScratch, 32 /* ecdhSecret */)
                .slice();
        });
    };
    const convertPublicKey = (compressed) => publicKey => {
        if (!parsePublicKey(publicKey)) {
            throw new Error('Failed to parse public key.');
        }
        return getSerializedPublicKey(compressed);
    };
    const parseSignature = (signature, DER) => {
        secp256k1Wasm.heapU8.set(signature, sigScratch);
        return DER
            ? secp256k1Wasm.signatureParseDER(contextPtr, internalSigPtr, sigScratch, signature.length) === 1
            : secp256k1Wasm.signatureParseCompact(contextPtr, internalSigPtr, sigScratch) === 1;
    };
    const parseOrThrow = (signature, DER) => {
        if (!parseSignature(signature, DER)) {
            throw new Error('Failed to parse signature.');
        }
    };
    const getCompactSig = () => {
        secp256k1Wasm.signatureSerializeCompact(contextPtr, sigScratch, internalSigPtr);
        return secp256k1Wasm.readHeapU8(sigScratch, 64 /* compactSig */).slice();
    };
    const getDERSig = () => {
        setLengthPtr(72 /* maxSig */);
        secp256k1Wasm.signatureSerializeDER(contextPtr, sigScratch, lengthPtr, internalSigPtr);
        return secp256k1Wasm.readHeapU8(sigScratch, getLengthPtr()).slice();
    };
    const convertSignature = (wasDER) => signature => {
        parseOrThrow(signature, wasDER);
        return wasDER ? getCompactSig() : getDERSig();
    };
    const fillPrivateKeyPtr = (privateKey) => {
        secp256k1Wasm.heapU8.set(privateKey, privateKeyPtr);
    };
    const zeroOutPtr = (pointer, bytes) => {
        secp256k1Wasm.heapU8.fill(0, pointer, pointer + bytes);
    };
    const zeroOutPrivateKeyPtr = () => {
        zeroOutPtr(privateKeyPtr, 32 /* privateKey */);
    };
    const withPrivateKey = (privateKey, instructions) => {
        fillPrivateKeyPtr(privateKey);
        const ret = instructions();
        zeroOutPrivateKeyPtr();
        return ret;
    };
    const derivePublicKey = (compressed) => privateKey => {
        const invalid = withPrivateKey(privateKey, () => secp256k1Wasm.pubkeyCreate(contextPtr, internalPublicKeyPtr, privateKeyPtr) !== 1);
        if (invalid) {
            throw new Error('Cannot derive public key from invalid private key.');
        }
        return getSerializedPublicKey(compressed);
    };
    const fillMessageHashScratch = (messageHash) => {
        secp256k1Wasm.heapU8.set(messageHash, messageHashScratch);
    };
    const normalizeSignature = () => {
        secp256k1Wasm.signatureNormalize(contextPtr, internalSigPtr, internalSigPtr);
    };
    const modifySignature = (DER, normalize) => signature => {
        parseOrThrow(signature, DER);
        if (normalize) {
            normalizeSignature();
        }
        else {
            secp256k1Wasm.signatureMalleate(contextPtr, internalSigPtr, internalSigPtr);
        }
        return DER ? getDERSig() : getCompactSig();
    };
    const parseAndNormalizeSignature = (signature, DER, normalize) => {
        const ret = parseSignature(signature, DER);
        if (normalize) {
            normalizeSignature();
        }
        return ret;
    };
    const signMessageHash = (DER) => (privateKey, messageHash) => {
        fillMessageHashScratch(messageHash);
        return withPrivateKey(privateKey, () => {
            const failed = secp256k1Wasm.sign(contextPtr, internalSigPtr, messageHashScratch, privateKeyPtr) !== 1;
            if (failed) {
                throw new Error('Failed to sign message hash. The private key is not valid.');
            }
            if (DER) {
                setLengthPtr(72 /* maxSig */);
                secp256k1Wasm.signatureSerializeDER(contextPtr, sigScratch, lengthPtr, internalSigPtr);
                return secp256k1Wasm.readHeapU8(sigScratch, getLengthPtr()).slice();
            }
            else {
                secp256k1Wasm.signatureSerializeCompact(contextPtr, sigScratch, internalSigPtr);
                return secp256k1Wasm
                    .readHeapU8(sigScratch, 64 /* compactSig */)
                    .slice();
            }
        });
    };
    const verifyMessage = (messageHash) => {
        fillMessageHashScratch(messageHash);
        return (secp256k1Wasm.verify(contextPtr, internalSigPtr, messageHashScratch, internalPublicKeyPtr) === 1);
    };
    const verifySignature = (DER, normalize) => (signature, publicKey, messageHash) => parsePublicKey(publicKey) &&
        parseAndNormalizeSignature(signature, DER, normalize) &&
        verifyMessage(messageHash);
    const signMessageHashRecoverable = (privateKey, messageHash) => {
        fillMessageHashScratch(messageHash);
        return withPrivateKey(privateKey, () => {
            if (secp256k1Wasm.signRecoverable(contextPtr, internalRSigPtr, messageHashScratch, privateKeyPtr) !== 1) {
                throw new Error('Failed to sign message hash. The private key is not valid.');
            }
            secp256k1Wasm.recoverableSignatureSerialize(contextPtr, sigScratch, recoveryNumPtr, internalRSigPtr);
            return {
                recoveryId: getRecoveryNumPtr(),
                signature: secp256k1Wasm
                    .readHeapU8(sigScratch, 64 /* compactSig */)
                    .slice()
            };
        });
    };
    const recoverPublicKey = (compressed) => (signature, recoveryId, messageHash) => {
        fillMessageHashScratch(messageHash);
        secp256k1Wasm.heapU8.set(signature, sigScratch);
        if (secp256k1Wasm.recoverableSignatureParse(contextPtr, internalRSigPtr, sigScratch, recoveryId) !== 1) {
            throw new Error('Failed to recover public key. Could not parse signature.');
        }
        if (secp256k1Wasm.recover(contextPtr, internalPublicKeyPtr, internalRSigPtr, messageHashScratch) !== 1) {
            throw new Error('Failed to recover public key. The compact signature, recovery, or message hash is invalid.');
        }
        return getSerializedPublicKey(compressed);
    };
    const addTweakPrivateKey = (privateKey, tweakValue) => {
        fillMessageHashScratch(tweakValue);
        return withPrivateKey(privateKey, () => {
            if (secp256k1Wasm.privkeyTweakAdd(contextPtr, privateKeyPtr, messageHashScratch) !== 1) {
                throw new Error('Private key is invalid or adding failed.');
            }
            return secp256k1Wasm
                .readHeapU8(privateKeyPtr, 32 /* privateKey */)
                .slice();
        });
    };
    const mulTweakPrivateKey = (privateKey, tweakValue) => {
        fillMessageHashScratch(tweakValue);
        return withPrivateKey(privateKey, () => {
            if (secp256k1Wasm.privkeyTweakMul(contextPtr, privateKeyPtr, messageHashScratch) !== 1) {
                throw new Error('Private key is invalid or multiplying failed.');
            }
            return secp256k1Wasm
                .readHeapU8(privateKeyPtr, 32 /* privateKey */)
                .slice();
        });
    };
    const addTweakPublicKey = (compressed) => (publicKey, tweakValue) => {
        if (!parsePublicKey(publicKey)) {
            throw new Error('Failed to parse public key.');
        }
        fillMessageHashScratch(tweakValue);
        if (secp256k1Wasm.pubkeyTweakAdd(contextPtr, internalPublicKeyPtr, messageHashScratch) !== 1) {
            throw new Error('Adding failed');
        }
        return getSerializedPublicKey(compressed);
    };
    const mulTweakPublicKey = (compressed) => (publicKey, tweakValue) => {
        if (!parsePublicKey(publicKey)) {
            throw new Error('Failed to parse public key.');
        }
        fillMessageHashScratch(tweakValue);
        if (secp256k1Wasm.pubkeyTweakMul(contextPtr, internalPublicKeyPtr, messageHashScratch) !== 1) {
            throw new Error('Multiplying failed');
        }
        return getSerializedPublicKey(compressed);
    };
    /**
     * The value of this precaution is debatable, especially in the context of
     * javascript and WebAssembly.
     *
     * In the secp256k1 C library, context randomization is an additional layer of
     * security from side-channel attacks which attempt to extract private key
     * information by analyzing things like a CPU's emitted radio frequencies or
     * power usage.
     *
     * In this library, these attacks seem even less likely, since the "platform"
     * on which this code will be executed (e.g. V8) is likely to obscure any
     * such signals.
     *
     * Still, out of an abundance of caution (and because no one has produced a
     * definitive proof indicating that this is not helpful), this library exposes
     * the ability to randomize the context like the C library. Depending on the
     * intended application, consumers can decide whether or not to randomize.
     */
    if (randomSeed !== undefined) {
        const randomSeedPtr = messageHashScratch;
        secp256k1Wasm.heapU8.set(randomSeed, randomSeedPtr);
        secp256k1Wasm.contextRandomize(contextPtr, randomSeedPtr);
        zeroOutPtr(randomSeedPtr, 32 /* randomSeed */);
    }
    return {
        addTweakPrivateKey,
        addTweakPublicKeyCompressed: addTweakPublicKey(true),
        addTweakPublicKeyUncompressed: addTweakPublicKey(false),
        compressPublicKey: convertPublicKey(true),
        computeEcdhSecret,
        derivePublicKeyCompressed: derivePublicKey(true),
        derivePublicKeyUncompressed: derivePublicKey(false),
        malleateSignatureCompact: modifySignature(false, false),
        malleateSignatureDER: modifySignature(true, false),
        mulTweakPrivateKey,
        mulTweakPublicKeyCompressed: mulTweakPublicKey(true),
        mulTweakPublicKeyUncompressed: mulTweakPublicKey(false),
        normalizeSignatureCompact: modifySignature(false, true),
        normalizeSignatureDER: modifySignature(true, true),
        recoverPublicKeyCompressed: recoverPublicKey(true),
        recoverPublicKeyUncompressed: recoverPublicKey(false),
        signMessageHashCompact: signMessageHash(false),
        signMessageHashDER: signMessageHash(true),
        signMessageHashRecoverableCompact: signMessageHashRecoverable,
        signatureCompactToDER: convertSignature(false),
        signatureDERToCompact: convertSignature(true),
        uncompressPublicKey: convertPublicKey(false),
        validatePrivateKey: privateKey => withPrivateKey(privateKey, () => secp256k1Wasm.seckeyVerify(contextPtr, privateKeyPtr) === 1),
        verifySignatureCompact: verifySignature(false, true),
        verifySignatureCompactLowS: verifySignature(false, false),
        verifySignatureDER: verifySignature(true, true),
        verifySignatureDERLowS: verifySignature(true, false)
    };
    // tslint:enable:no-expression-statement no-if-statement
};
/**
 * This method is like `instantiateSecp256k1`, but requires the consumer to
 * `Window.fetch` or `fs.readFile` the `secp256k1.wasm` binary and provide it to
 * this method as `webassemblyBytes`. This skips a base64 decoding of an
 * embedded binary.
 *
 * ### Randomizing the Context with `randomSeed`
 * This method also accepts an optional, 32-byte `randomSeed`, which is passed
 * to the `contextRandomize` method in the underlying WebAssembly.
 *
 * The value of this precaution is debatable, especially in the context of
 * javascript and WebAssembly.
 *
 * In the secp256k1 C library, context randomization is an additional layer of
 * security from side-channel attacks which attempt to extract private key
 * information by analyzing things like a CPU's emitted radio frequencies or
 * power usage.
 *
 * In this library, these attacks seem even less likely, since the "platform"
 * on which this code will be executed (e.g. V8) is likely to obscure any
 * such signals.
 *
 * Still, out of an abundance of caution (and because no one has produced a
 * definitive proof indicating that this is not helpful), this library exposes
 * the ability to randomize the context like the C library. Depending on the
 * intended application, consumers can decide whether or not to randomize.
 *
 * @param webassemblyBytes an ArrayBuffer containing the bytes from bitcoin-ts'
 * `secp256k1.wasm` binary. Providing this buffer manually may be faster than
 * the internal base64 decode which happens in `instantiateSecp256k1`.
 * @param randomSeed a 32-byte random seed used to randomize the secp256k1
 * context after creation. See above for details.
 */
exports.instantiateSecp256k1Bytes = async (webassemblyBytes, randomSeed) => wrapSecp256k1Wasm(await secp256k1_wasm_1.instantiateSecp256k1WasmBytes(webassemblyBytes), randomSeed);
/**
 * Create and wrap a Secp256k1 WebAssembly instance to expose a set of
 * purely-functional Secp256k1 methods. For slightly faster initialization, use
 * `instantiateSecp256k1Bytes`.
 *
 * @param randomSeed a 32-byte random seed used to randomize the secp256k1
 * context after creation. See the description in `instantiateSecp256k1Bytes`
 * for details.
 */
exports.instantiateSecp256k1 = async (randomSeed) => 
// tslint:disable-next-line: max-file-line-count
wrapSecp256k1Wasm(await secp256k1_wasm_1.instantiateSecp256k1Wasm(), randomSeed);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jcnlwdG8vc2VjcDI1NmsxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0VBTXlDO0FBc2F6Qzs7OztHQUlHO0FBQ0gsTUFBTSxpQkFBaUIsR0FBRyxDQUN4QixhQUE0QixFQUM1QixVQUF1QixFQUNaLEVBQUU7SUFDYjs7OztPQUlHO0lBQ0gsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyw0QkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpFOzs7Ozs7Ozs7O09BVUc7SUFDSCxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsTUFBTSxpQkFBbUIsQ0FBQztJQUMzRCxNQUFNLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxNQUFNLHVCQUF5QixDQUFDO0lBQ3ZFLE1BQU0sa0JBQWtCLEdBQUcsYUFBYSxDQUFDLE1BQU0sc0JBQXdCLENBQUM7SUFDeEUsTUFBTSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsTUFBTSxxQkFBdUIsQ0FBQztJQUN0RSxNQUFNLG9CQUFvQixHQUFHLGFBQWEsQ0FBQyxNQUFNLDRCQUVoRCxDQUFDO0lBQ0YsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLE1BQU0sc0JBQXdCLENBQUM7SUFDcEUsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLE1BQU0scUJBQXVCLENBQUM7SUFFbEUsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLE1BQU0seUJBQTJCLENBQUM7SUFDeEUsNENBQTRDO0lBQzVDLE1BQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsdURBQXVEO0lBQ3ZELE1BQU0sb0JBQW9CLEdBQUcsY0FBYyxJQUFJLENBQUMsQ0FBQztJQUVqRCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FB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