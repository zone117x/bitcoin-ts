import { CompressionFlag, ContextFlag, instantiateSecp256k1Wasm, instantiateSecp256k1WasmBytes } from '../bin/secp256k1/secp256k1-wasm';
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
    const contextPtr = secp256k1Wasm.contextCreate(ContextFlag.BOTH);
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
        ? serializePublicKey(33 /* compressedPublicKey */, CompressionFlag.COMPRESSED)
        : serializePublicKey(65 /* uncompressedPublicKey */, CompressionFlag.UNCOMPRESSED);
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
export const instantiateSecp256k1Bytes = async (webassemblyBytes, randomSeed) => wrapSecp256k1Wasm(await instantiateSecp256k1WasmBytes(webassemblyBytes), randomSeed);
/**
 * Create and wrap a Secp256k1 WebAssembly instance to expose a set of
 * purely-functional Secp256k1 methods. For slightly faster initialization, use
 * `instantiateSecp256k1Bytes`.
 *
 * @param randomSeed a 32-byte random seed used to randomize the secp256k1
 * context after creation. See the description in `instantiateSecp256k1Bytes`
 * for details.
 */
export const instantiateSecp256k1 = async (randomSeed) => 
// tslint:disable-next-line: max-file-line-count
wrapSecp256k1Wasm(await instantiateSecp256k1Wasm(), randomSeed);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jcnlwdG8vc2VjcDI1NmsxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxlQUFlLEVBQ2YsV0FBVyxFQUNYLHdCQUF3QixFQUN4Qiw2QkFBNkIsRUFFOUIsTUFBTSxpQ0FBaUMsQ0FBQztBQXNhekM7Ozs7R0FJRztBQUNILE1BQU0saUJBQWlCLEdBQUcsQ0FDeEIsYUFBNEIsRUFDNUIsVUFBdUIsRUFDWixFQUFFO0lBQ2I7Ozs7T0FJRztJQUNILE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpFOzs7Ozs7Ozs7O09BVUc7SUFDSCxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsTUFBTSxpQkFBbUIsQ0FBQztJQUMzRCxNQUFNLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxNQUFNLHVCQUF5QixDQUFDO0lBQ3ZFLE1BQU0sa0JBQWtCLEdBQUcsYUFBYSxDQUFDLE1BQU0sc0JBQXdCLENBQUM7SUFDeEUsTUFBTSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsTUFBTSxxQkFBdUIsQ0FBQztJQUN0RSxNQUFNLG9CQUFvQixHQUFHLGFBQWEsQ0FBQyxNQUFNLDRCQUVoRCxDQUFDO0lBQ0YsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLE1BQU0sc0JBQXdCLENBQUM7SUFDcEUsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLE1BQU0scUJBQXVCLENBQUM7SUFFbEUsTUFBTSxlQUFlLEdBQUcsYUFBYSxDQUFDLE1BQU0seUJBQTJCLENBQUM7SUFDeEUsNENBQTRDO0lBQzVDLE1BQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsdURBQXVEO0lBQ3ZELE1BQU0sb0JBQW9CLEdBQUcsY0FBYyxJQUFJLENBQUMsQ0FBQztJQUVqRCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUU1RSw0Q0FBNEM7SUFDNUMsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyx1REFBdUQ7SUFDdkQsTUFBTSxlQUFlLEdBQUcsU0FBUyxJQUFJLENBQUMsQ0FBQztJQUV2Qyx5REFBeUQ7SUFFekQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFxQixFQUFFLEVBQUU7UUFDL0MsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDdEQsT0FBTyxhQUFhLENBQUMsV0FBVyxDQUM5QixVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLGdCQUFnQjtRQUNoQiw0Q0FBNEM7UUFDNUMsU0FBUyxDQUFDLE1BQWlCLENBQzVCLEtBQUssQ0FBQztZQUNMLENBQUMsQ0FBQyxJQUFJO1lBQ04sQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNaLENBQUMsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7UUFDckMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUM7SUFFRixNQUFNLFlBQVksR0FBRyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRWxFLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxNQUFjLEVBQUUsSUFBWSxFQUFFLEVBQUU7UUFDMUQsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JCLGFBQWEsQ0FBQyxlQUFlLENBQzNCLFVBQVUsRUFDVixnQkFBZ0IsRUFDaEIsU0FBUyxFQUNULG9CQUFvQixFQUNwQixJQUFJLENBQ0wsQ0FBQztRQUNGLE9BQU8sYUFBYSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzVFLENBQUMsQ0FBQztJQUVGLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxVQUFtQixFQUFFLEVBQUUsQ0FDckQsVUFBVTtRQUNSLENBQUMsQ0FBQyxrQkFBa0IsK0JBRWhCLGVBQWUsQ0FBQyxVQUFVLENBQzNCO1FBQ0gsQ0FBQyxDQUFDLGtCQUFrQixpQ0FFaEIsZUFBZSxDQUFDLFlBQVksQ0FDN0IsQ0FBQztJQUVSLE1BQU0saUJBQWlCLEdBQUcsQ0FDeEIsU0FBcUIsRUFDckIsVUFBc0IsRUFDVixFQUFFO1FBQ2QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDaEQ7UUFDRCxrREFBa0Q7UUFDbEQsT0FBTyxjQUFjLENBQWEsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUNqRCxNQUFNLE1BQU0sR0FDVixhQUFhLENBQUMsSUFBSSxDQUNoQixVQUFVLEVBQ1YsaUJBQWlCLEVBQ2pCLG9CQUFvQixFQUNwQixhQUFhLENBQ2QsS0FBSyxDQUFDLENBQUM7WUFFVixJQUFJLE1BQU0sRUFBRTtnQkFDVixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7YUFDaEU7WUFDRCxPQUFPLGFBQWE7aUJBQ2pCLFVBQVUsQ0FBQyxpQkFBaUIsc0JBQXdCO2lCQUNwRCxLQUFLLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBRUYsTUFBTSxnQkFBZ0IsR0FBRyxDQUN2QixVQUFtQixFQUNzQixFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDeEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQztJQUVGLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBcUIsRUFBRSxHQUFZLEVBQUUsRUFBRTtRQUM3RCxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDaEQsT0FBTyxHQUFHO1lBQ1IsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FDN0IsVUFBVSxFQUNWLGNBQWMsRUFDZCxVQUFVLEVBQ1YsU0FBUyxDQUFDLE1BQU0sQ0FDakIsS0FBSyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FDakMsVUFBVSxFQUNWLGNBQWMsRUFDZCxVQUFVLENBQ1gsS0FBSyxDQUFDLENBQUM7SUFDZCxDQUFDLENBQUM7SUFFRixNQUFNLFlBQVksR0FBRyxDQUFDLFNBQXFCLEVBQUUsR0FBWSxFQUFFLEVBQUU7UUFDM0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQyxDQUFDO0lBRUYsTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUFFO1FBQ3pCLGFBQWEsQ0FBQyx5QkFBeUIsQ0FDckMsVUFBVSxFQUNWLFVBQVUsRUFDVixjQUFjLENBQ2YsQ0FBQztRQUNGLE9BQU8sYUFBYSxDQUFDLFVBQVUsQ0FBQyxVQUFVLHNCQUF3QixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzdFLENBQUMsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLEdBQUcsRUFBRTtRQUNyQixZQUFZLGlCQUFtQixDQUFDO1FBQ2hDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FDakMsVUFBVSxFQUNWLFVBQVUsRUFDVixTQUFTLEVBQ1QsY0FBYyxDQUNmLENBQUM7UUFDRixPQUFPLGFBQWEsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEUsQ0FBQyxDQUFDO0lBRUYsTUFBTSxnQkFBZ0IsR0FBRyxDQUN2QixNQUFlLEVBQzBCLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUN4RCxZQUFZLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDaEQsQ0FBQyxDQUFDO0lBRUYsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFVBQXNCLEVBQUUsRUFBRTtRQUNuRCxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDO0lBRUYsTUFBTSxVQUFVLEdBQUcsQ0FBQyxPQUFlLEVBQUUsS0FBYSxFQUFFLEVBQUU7UUFDcEQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDekQsQ0FBQyxDQUFDO0lBRUYsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLEVBQUU7UUFDaEMsVUFBVSxDQUFDLGFBQWEsc0JBQXdCLENBQUM7SUFDbkQsQ0FBQyxDQUFDO0lBRUYsTUFBTSxjQUFjLEdBQUcsQ0FDckIsVUFBc0IsRUFDdEIsWUFBcUIsRUFDbEIsRUFBRTtRQUNMLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLFlBQVksRUFBRSxDQUFDO1FBQzNCLG9CQUFvQixFQUFFLENBQUM7UUFDdkIsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDLENBQUM7SUFFRixNQUFNLGVBQWUsR0FBRyxDQUN0QixVQUFtQixFQUN1QixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDMUQsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUM1QixVQUFVLEVBQ1YsR0FBRyxFQUFFLENBQ0gsYUFBYSxDQUFDLFlBQVksQ0FDeEIsVUFBVSxFQUNWLG9CQUFvQixFQUNwQixhQUFhLENBQ2QsS0FBSyxDQUFDLENBQ1YsQ0FBQztRQUVGLElBQUksT0FBTyxFQUFFO1lBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1NBQ3ZFO1FBRUQsT0FBTyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUM7SUFFRixNQUFNLHNCQUFzQixHQUFHLENBQUMsV0FBdUIsRUFBRSxFQUFFO1FBQ3pELGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQztJQUVGLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxFQUFFO1FBQzlCLGFBQWEsQ0FBQyxrQkFBa0IsQ0FDOUIsVUFBVSxFQUNWLGNBQWMsRUFDZCxjQUFjLENBQ2YsQ0FBQztJQUNKLENBQUMsQ0FBQztJQUVGLE1BQU0sZUFBZSxHQUFHLENBQ3RCLEdBQVksRUFDWixTQUFrQixFQUN1QixFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDeEQsWUFBWSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLFNBQVMsRUFBRTtZQUNiLGtCQUFrQixFQUFFLENBQUM7U0FDdEI7YUFBTTtZQUNMLGFBQWEsQ0FBQyxpQkFBaUIsQ0FDN0IsVUFBVSxFQUNWLGNBQWMsRUFDZCxjQUFjLENBQ2YsQ0FBQztTQUNIO1FBQ0QsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM3QyxDQUFDLENBQUM7SUFFRixNQUFNLDBCQUEwQixHQUFHLENBQ2pDLFNBQXFCLEVBQ3JCLEdBQVksRUFDWixTQUFrQixFQUNsQixFQUFFO1FBQ0YsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLFNBQVMsRUFBRTtZQUNiLGtCQUFrQixFQUFFLENBQUM7U0FDdEI7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsQ0FBQztJQUVGLE1BQU0sZUFBZSxHQUFHLENBQ3RCLEdBQVksRUFDdUQsRUFBRSxDQUFDLENBQ3RFLFVBQVUsRUFDVixXQUFXLEVBQ1gsRUFBRTtRQUNGLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sY0FBYyxDQUFhLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDakQsTUFBTSxNQUFNLEdBQ1YsYUFBYSxDQUFDLElBQUksQ0FDaEIsVUFBVSxFQUNWLGNBQWMsRUFDZCxrQkFBa0IsRUFDbEIsYUFBYSxDQUNkLEtBQUssQ0FBQyxDQUFDO1lBRVYsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsTUFBTSxJQUFJLEtBQUssQ0FDYiw0REFBNEQsQ0FDN0QsQ0FBQzthQUNIO1lBRUQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsWUFBWSxpQkFBbUIsQ0FBQztnQkFDaEMsYUFBYSxDQUFDLHFCQUFxQixDQUNqQyxVQUFVLEVBQ1YsVUFBVSxFQUNWLFNBQVMsRUFDVCxjQUFjLENBQ2YsQ0FBQztnQkFDRixPQUFPLGFBQWEsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDckU7aUJBQU07Z0JBQ0wsYUFBYSxDQUFDLHlCQUF5QixDQUNyQyxVQUFVLEVBQ1YsVUFBVSxFQUNWLGNBQWMsQ0FDZixDQUFDO2dCQUNGLE9BQU8sYUFBYTtxQkFDakIsVUFBVSxDQUFDLFVBQVUsc0JBQXdCO3FCQUM3QyxLQUFLLEVBQUUsQ0FBQzthQUNaO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7SUFFRixNQUFNLGFBQWEsR0FBRyxDQUFDLFdBQXVCLEVBQUUsRUFBRTtRQUNoRCxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwQyxPQUFPLENBQ0wsYUFBYSxDQUFDLE1BQU0sQ0FDbEIsVUFBVSxFQUNWLGNBQWMsRUFDZCxrQkFBa0IsRUFDbEIsb0JBQW9CLENBQ3JCLEtBQUssQ0FBQyxDQUNSLENBQUM7SUFDSixDQUFDLENBQUM7SUFFRixNQUFNLGVBQWUsR0FBRyxDQUN0QixHQUFZLEVBQ1osU0FBa0IsRUFLTixFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQ3JELGNBQWMsQ0FBQyxTQUFTLENBQUM7UUFDekIsMEJBQTBCLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxTQUFTLENBQUM7UUFDckQsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRTdCLE1BQU0sMEJBQTBCLEdBQUcsQ0FDakMsVUFBc0IsRUFDdEIsV0FBdUIsRUFDRCxFQUFFO1FBQ3hCLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sY0FBYyxDQUF1QixVQUFVLEVBQUUsR0FBRyxFQUFFO1lBQzNELElBQ0UsYUFBYSxDQUFDLGVBQWUsQ0FDM0IsVUFBVSxFQUNWLGVBQWUsRUFDZixrQkFBa0IsRUFDbEIsYUFBYSxDQUNkLEtBQUssQ0FBQyxFQUNQO2dCQUNBLE1BQU0sSUFBSSxLQUFLLENBQ2IsNERBQTRELENBQzdELENBQUM7YUFDSDtZQUNELGFBQWEsQ0FBQyw2QkFBNkIsQ0FDekMsVUFBVSxFQUNWLFVBQVUsRUFDVixjQUFjLEVBQ2QsZUFBZSxDQUNoQixDQUFDO1lBRUYsT0FBTztnQkFDTCxVQUFVLEVBQUUsaUJBQWlCLEVBQWdCO2dCQUM3QyxTQUFTLEVBQUUsYUFBYTtxQkFDckIsVUFBVSxDQUFDLFVBQVUsc0JBQXdCO3FCQUM3QyxLQUFLLEVBQUU7YUFDWCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7SUFDRixNQUFNLGdCQUFnQixHQUFHLENBQ3ZCLFVBQW1CLEVBS0osRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsRUFBRTtRQUN6RCxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDaEQsSUFDRSxhQUFhLENBQUMseUJBQXlCLENBQ3JDLFVBQVUsRUFDVixlQUFlLEVBQ2YsVUFBVSxFQUNWLFVBQVUsQ0FDWCxLQUFLLENBQUMsRUFDUDtZQUNBLE1BQU0sSUFBSSxLQUFLLENBQ2IsMERBQTBELENBQzNELENBQUM7U0FDSDtRQUNELElBQ0UsYUFBYSxDQUFDLE9BQU8sQ0FDbkIsVUFBVSxFQUNWLG9CQUFvQixFQUNwQixlQUFlLEVBQ2Ysa0JBQWtCLENBQ25CLEtBQUssQ0FBQyxFQUNQO1lBQ0EsTUFBTSxJQUFJLEtBQUssQ0FDYiw0RkFBNEYsQ0FDN0YsQ0FBQztTQUNIO1FBQ0QsT0FBTyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUM7SUFFRixNQUFNLGtCQUFrQixHQUFHLENBQ3pCLFVBQXNCLEVBQ3RCLFVBQXNCLEVBQ1YsRUFBRTtRQUNkLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sY0FBYyxDQUFhLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDakQsSUFDRSxhQUFhLENBQUMsZUFBZSxDQUMzQixVQUFVLEVBQ1YsYUFBYSxFQUNiLGtCQUFrQixDQUNuQixLQUFLLENBQUMsRUFDUDtnQkFDQSxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7YUFDN0Q7WUFDRCxPQUFPLGFBQWE7aUJBQ2pCLFVBQVUsQ0FBQyxhQUFhLHNCQUF3QjtpQkFDaEQsS0FBSyxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztJQUVGLE1BQU0sa0JBQWtCLEdBQUcsQ0FDekIsVUFBc0IsRUFDdEIsVUFBc0IsRUFDVixFQUFFO1FBQ2Qsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsT0FBTyxjQUFjLENBQWEsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUNqRCxJQUNFLGFBQWEsQ0FBQyxlQUFlLENBQzNCLFVBQVUsRUFDVixhQUFhLEVBQ2Isa0JBQWtCLENBQ25CLEtBQUssQ0FBQyxFQUNQO2dCQUNBLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQzthQUNsRTtZQUNELE9BQU8sYUFBYTtpQkFDakIsVUFBVSxDQUFDLGFBQWEsc0JBQXdCO2lCQUNoRCxLQUFLLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBRUYsTUFBTSxpQkFBaUIsR0FBRyxDQUN4QixVQUFtQixFQUM4QyxFQUFFLENBQUMsQ0FDcEUsU0FBUyxFQUNULFVBQVUsRUFDVixFQUFFO1FBQ0YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDaEQ7UUFDRCxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuQyxJQUNFLGFBQWEsQ0FBQyxjQUFjLENBQzFCLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsa0JBQWtCLENBQ25CLEtBQUssQ0FBQyxFQUNQO1lBQ0EsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNsQztRQUNELE9BQU8sc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDO0lBRUYsTUFBTSxpQkFBaUIsR0FBRyxDQUN4QixVQUFtQixFQUM4QyxFQUFFLENBQUMsQ0FDcEUsU0FBUyxFQUNULFVBQVUsRUFDVixFQUFFO1FBQ0YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDaEQ7UUFDRCxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuQyxJQUNFLGFBQWEsQ0FBQyxjQUFjLENBQzFCLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsa0JBQWtCLENBQ25CLEtBQUssQ0FBQyxFQUNQO1lBQ0EsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsT0FBTyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUM7SUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FpQkc7SUFDSCxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7UUFDNUIsTUFBTSxhQUFhLEdBQUcsa0JBQWtCLENBQUM7UUFDekMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDMUQsVUFBVSxDQUFDLGFBQWEsc0JBQXdCLENBQUM7S0FDbEQ7SUFFRCxPQUFPO1FBQ0wsa0JBQWtCO1FBQ2xCLDJCQUEyQixFQUFFLGlCQUFpQixDQUFDLElBQUksQ0FBQztRQUNwRCw2QkFBNkIsRUFBRSxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7UUFDdkQsaUJBQWlCLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1FBQ3pDLGlCQUFpQjtRQUNqQix5QkFBeUIsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDO1FBQ2hELDJCQUEyQixFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUM7UUFDbkQsd0JBQXdCLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDdkQsb0JBQW9CLEVBQUUsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7UUFDbEQsa0JBQWtCO1FBQ2xCLDJCQUEyQixFQUFFLGlCQUFpQixDQUFDLElBQUksQ0FBQztRQUNwRCw2QkFBNkIsRUFBRSxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7UUFDdkQseUJBQXlCLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7UUFDdkQscUJBQXFCLEVBQUUsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7UUFDbEQsMEJBQTBCLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1FBQ2xELDRCQUE0QixFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQztRQUNyRCxzQkFBc0IsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDO1FBQzlDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUM7UUFDekMsaUNBQWlDLEVBQUUsMEJBQTBCO1FBQzdELHFCQUFxQixFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQztRQUM5QyxxQkFBcUIsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7UUFDN0MsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO1FBQzVDLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQy9CLGNBQWMsQ0FDWixVQUFVLEVBQ1YsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUNsRTtRQUNILHNCQUFzQixFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO1FBQ3BELDBCQUEwQixFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQ3pELGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1FBQy9DLHNCQUFzQixFQUFFLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO0tBQ3JELENBQUM7SUFDRix3REFBd0Q7QUFDMUQsQ0FBQyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0NHO0FBQ0gsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQUcsS0FBSyxFQUM1QyxnQkFBNkIsRUFDN0IsVUFBdUIsRUFDSCxFQUFFLENBQ3RCLGlCQUFpQixDQUNmLE1BQU0sNkJBQTZCLENBQUMsZ0JBQWdCLENBQUMsRUFDckQsVUFBVSxDQUNYLENBQUM7QUFFSjs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHLEtBQUssRUFDdkMsVUFBdUIsRUFDSCxFQUFFO0FBQ3RCLGdEQUFnRDtBQUNoRCxpQkFBaUIsQ0FBQyxNQUFNLHdCQUF3QixFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUMifQ==