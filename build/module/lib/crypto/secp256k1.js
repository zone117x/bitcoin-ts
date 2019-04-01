import { CompressionFlag, ContextFlag, instantiateSecp256k1Wasm, instantiateSecp256k1WasmBytes } from '../bin/bin';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jcnlwdG8vc2VjcDI1NmsxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxlQUFlLEVBQ2YsV0FBVyxFQUNYLHdCQUF3QixFQUN4Qiw2QkFBNkIsRUFFOUIsTUFBTSxZQUFZLENBQUM7QUFzYXBCOzs7O0dBSUc7QUFDSCxNQUFNLGlCQUFpQixHQUFHLENBQ3hCLGFBQTRCLEVBQzVCLFVBQXVCLEVBQ1osRUFBRTtJQUNiOzs7O09BSUc7SUFDSCxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVqRTs7Ozs7Ozs7OztPQVVHO0lBQ0gsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLE1BQU0saUJBQW1CLENBQUM7SUFDM0QsTUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsTUFBTSx1QkFBeUIsQ0FBQztJQUN2RSxNQUFNLGtCQUFrQixHQUFHLGFBQWEsQ0FBQyxNQUFNLHNCQUF3QixDQUFDO0lBQ3hFLE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLE1BQU0scUJBQXVCLENBQUM7SUFDdEUsTUFBTSxvQkFBb0IsR0FBRyxhQUFhLENBQUMsTUFBTSw0QkFFaEQsQ0FBQztJQUNGLE1BQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxNQUFNLHNCQUF3QixDQUFDO0lBQ3BFLE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxNQUFNLHFCQUF1QixDQUFDO0lBRWxFLE1BQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQyxNQUFNLHlCQUEyQixDQUFDO0lBQ3hFLDRDQUE0QztJQUM1QyxNQUFNLGNBQWMsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLHVEQUF1RDtJQUN2RCxNQUFNLG9CQUFvQixHQUFHLGNBQWMsSUFBSSxDQUFDLENBQUM7SUFFakQsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFFNUUsNENBQTRDO0lBQzVDLE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsdURBQXVEO0lBQ3ZELE1BQU0sZUFBZSxHQUFHLFNBQVMsSUFBSSxDQUFDLENBQUM7SUFFdkMseURBQXlEO0lBRXpELE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBcUIsRUFBRSxFQUFFO1FBQy9DLGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sYUFBYSxDQUFDLFdBQVcsQ0FDOUIsVUFBVSxFQUNWLG9CQUFvQixFQUNwQixnQkFBZ0I7UUFDaEIsNENBQTRDO1FBQzVDLFNBQVMsQ0FBQyxNQUFpQixDQUM1QixLQUFLLENBQUM7WUFDTCxDQUFDLENBQUMsSUFBSTtZQUNOLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDWixDQUFDLENBQUM7SUFFRixNQUFNLFlBQVksR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO1FBQ3JDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQUcsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUVsRSxNQUFNLGtCQUFrQixHQUFHLENBQUMsTUFBYyxFQUFFLElBQVksRUFBRSxFQUFFO1FBQzFELFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQixhQUFhLENBQUMsZUFBZSxDQUMzQixVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCxvQkFBb0IsRUFDcEIsSUFBSSxDQUNMLENBQUM7UUFDRixPQUFPLGFBQWEsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM1RSxDQUFDLENBQUM7SUFFRixNQUFNLHNCQUFzQixHQUFHLENBQUMsVUFBbUIsRUFBRSxFQUFFLENBQ3JELFVBQVU7UUFDUixDQUFDLENBQUMsa0JBQWtCLCtCQUVoQixlQUFlLENBQUMsVUFBVSxDQUMzQjtRQUNILENBQUMsQ0FBQyxrQkFBa0IsaUNBRWhCLGVBQWUsQ0FBQyxZQUFZLENBQzdCLENBQUM7SUFFUixNQUFNLGlCQUFpQixHQUFHLENBQ3hCLFNBQXFCLEVBQ3JCLFVBQXNCLEVBQ1YsRUFBRTtRQUNkLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0Qsa0RBQWtEO1FBQ2xELE9BQU8sY0FBYyxDQUFhLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDakQsTUFBTSxNQUFNLEdBQ1YsYUFBYSxDQUFDLElBQUksQ0FDaEIsVUFBVSxFQUNWLGlCQUFpQixFQUNqQixvQkFBb0IsRUFDcEIsYUFBYSxDQUNkLEtBQUssQ0FBQyxDQUFDO1lBRVYsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO2FBQ2hFO1lBQ0QsT0FBTyxhQUFhO2lCQUNqQixVQUFVLENBQUMsaUJBQWlCLHNCQUF3QjtpQkFDcEQsS0FBSyxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztJQUVGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FDdkIsVUFBbUIsRUFDc0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3hELElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUM7SUFFRixNQUFNLGNBQWMsR0FBRyxDQUFDLFNBQXFCLEVBQUUsR0FBWSxFQUFFLEVBQUU7UUFDN0QsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sR0FBRztZQUNSLENBQUMsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQzdCLFVBQVUsRUFDVixjQUFjLEVBQ2QsVUFBVSxFQUNWLFNBQVMsQ0FBQyxNQUFNLENBQ2pCLEtBQUssQ0FBQztZQUNULENBQUMsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQ2pDLFVBQVUsRUFDVixjQUFjLEVBQ2QsVUFBVSxDQUNYLEtBQUssQ0FBQyxDQUFDO0lBQ2QsQ0FBQyxDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxTQUFxQixFQUFFLEdBQVksRUFBRSxFQUFFO1FBQzNELElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUMsQ0FBQztJQUVGLE1BQU0sYUFBYSxHQUFHLEdBQUcsRUFBRTtRQUN6QixhQUFhLENBQUMseUJBQXlCLENBQ3JDLFVBQVUsRUFDVixVQUFVLEVBQ1YsY0FBYyxDQUNmLENBQUM7UUFDRixPQUFPLGFBQWEsQ0FBQyxVQUFVLENBQUMsVUFBVSxzQkFBd0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM3RSxDQUFDLENBQUM7SUFFRixNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7UUFDckIsWUFBWSxpQkFBbUIsQ0FBQztRQUNoQyxhQUFhLENBQUMscUJBQXFCLENBQ2pDLFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxFQUNULGNBQWMsQ0FDZixDQUFDO1FBQ0YsT0FBTyxhQUFhLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3RFLENBQUMsQ0FBQztJQUVGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FDdkIsTUFBZSxFQUMwQixFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDeEQsWUFBWSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2hELENBQUMsQ0FBQztJQUVGLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxVQUFzQixFQUFFLEVBQUU7UUFDbkQsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3RELENBQUMsQ0FBQztJQUVGLE1BQU0sVUFBVSxHQUFHLENBQUMsT0FBZSxFQUFFLEtBQWEsRUFBRSxFQUFFO1FBQ3BELGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3pELENBQUMsQ0FBQztJQUVGLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxFQUFFO1FBQ2hDLFVBQVUsQ0FBQyxhQUFhLHNCQUF3QixDQUFDO0lBQ25ELENBQUMsQ0FBQztJQUVGLE1BQU0sY0FBYyxHQUFHLENBQ3JCLFVBQXNCLEVBQ3RCLFlBQXFCLEVBQ2xCLEVBQUU7UUFDTCxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxZQUFZLEVBQUUsQ0FBQztRQUMzQixvQkFBb0IsRUFBRSxDQUFDO1FBQ3ZCLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQyxDQUFDO0lBRUYsTUFBTSxlQUFlLEdBQUcsQ0FDdEIsVUFBbUIsRUFDdUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQzFELE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FDNUIsVUFBVSxFQUNWLEdBQUcsRUFBRSxDQUNILGFBQWEsQ0FBQyxZQUFZLENBQ3hCLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsYUFBYSxDQUNkLEtBQUssQ0FBQyxDQUNWLENBQUM7UUFFRixJQUFJLE9BQU8sRUFBRTtZQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUN2RTtRQUVELE9BQU8sc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDO0lBRUYsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLFdBQXVCLEVBQUUsRUFBRTtRQUN6RCxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUM7SUFFRixNQUFNLGtCQUFrQixHQUFHLEdBQUcsRUFBRTtRQUM5QixhQUFhLENBQUMsa0JBQWtCLENBQzlCLFVBQVUsRUFDVixjQUFjLEVBQ2QsY0FBYyxDQUNmLENBQUM7SUFDSixDQUFDLENBQUM7SUFFRixNQUFNLGVBQWUsR0FBRyxDQUN0QixHQUFZLEVBQ1osU0FBa0IsRUFDdUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3hELFlBQVksQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxTQUFTLEVBQUU7WUFDYixrQkFBa0IsRUFBRSxDQUFDO1NBQ3RCO2FBQU07WUFDTCxhQUFhLENBQUMsaUJBQWlCLENBQzdCLFVBQVUsRUFDVixjQUFjLEVBQ2QsY0FBYyxDQUNmLENBQUM7U0FDSDtRQUNELE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDN0MsQ0FBQyxDQUFDO0lBRUYsTUFBTSwwQkFBMEIsR0FBRyxDQUNqQyxTQUFxQixFQUNyQixHQUFZLEVBQ1osU0FBa0IsRUFDbEIsRUFBRTtRQUNGLE1BQU0sR0FBRyxHQUFHLGNBQWMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0MsSUFBSSxTQUFTLEVBQUU7WUFDYixrQkFBa0IsRUFBRSxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDLENBQUM7SUFFRixNQUFNLGVBQWUsR0FBRyxDQUN0QixHQUFZLEVBQ3VELEVBQUUsQ0FBQyxDQUN0RSxVQUFVLEVBQ1YsV0FBVyxFQUNYLEVBQUU7UUFDRixzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwQyxPQUFPLGNBQWMsQ0FBYSxVQUFVLEVBQUUsR0FBRyxFQUFFO1lBQ2pELE1BQU0sTUFBTSxHQUNWLGFBQWEsQ0FBQyxJQUFJLENBQ2hCLFVBQVUsRUFDVixjQUFjLEVBQ2Qsa0JBQWtCLEVBQ2xCLGFBQWEsQ0FDZCxLQUFLLENBQUMsQ0FBQztZQUVWLElBQUksTUFBTSxFQUFFO2dCQUNWLE1BQU0sSUFBSSxLQUFLLENBQ2IsNERBQTRELENBQzdELENBQUM7YUFDSDtZQUVELElBQUksR0FBRyxFQUFFO2dCQUNQLFlBQVksaUJBQW1CLENBQUM7Z0JBQ2hDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FDakMsVUFBVSxFQUNWLFVBQVUsRUFDVixTQUFTLEVBQ1QsY0FBYyxDQUNmLENBQUM7Z0JBQ0YsT0FBTyxhQUFhLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ3JFO2lCQUFNO2dCQUNMLGFBQWEsQ0FBQyx5QkFBeUIsQ0FDckMsVUFBVSxFQUNWLFVBQVUsRUFDVixjQUFjLENBQ2YsQ0FBQztnQkFDRixPQUFPLGFBQWE7cUJBQ2pCLFVBQVUsQ0FBQyxVQUFVLHNCQUF3QjtxQkFDN0MsS0FBSyxFQUFFLENBQUM7YUFDWjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBRUYsTUFBTSxhQUFhLEdBQUcsQ0FBQyxXQUF1QixFQUFFLEVBQUU7UUFDaEQsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUNMLGFBQWEsQ0FBQyxNQUFNLENBQ2xCLFVBQVUsRUFDVixjQUFjLEVBQ2Qsa0JBQWtCLEVBQ2xCLG9CQUFvQixDQUNyQixLQUFLLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBRUYsTUFBTSxlQUFlLEdBQUcsQ0FDdEIsR0FBWSxFQUNaLFNBQWtCLEVBS04sRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUNyRCxjQUFjLENBQUMsU0FBUyxDQUFDO1FBQ3pCLDBCQUEwQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDO1FBQ3JELGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUU3QixNQUFNLDBCQUEwQixHQUFHLENBQ2pDLFVBQXNCLEVBQ3RCLFdBQXVCLEVBQ0QsRUFBRTtRQUN4QixzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwQyxPQUFPLGNBQWMsQ0FBdUIsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUMzRCxJQUNFLGFBQWEsQ0FBQyxlQUFlLENBQzNCLFVBQVUsRUFDVixlQUFlLEVBQ2Ysa0JBQWtCLEVBQ2xCLGFBQWEsQ0FDZCxLQUFLLENBQUMsRUFDUDtnQkFDQSxNQUFNLElBQUksS0FBSyxDQUNiLDREQUE0RCxDQUM3RCxDQUFDO2FBQ0g7WUFDRCxhQUFhLENBQUMsNkJBQTZCLENBQ3pDLFVBQVUsRUFDVixVQUFVLEVBQ1YsY0FBYyxFQUNkLGVBQWUsQ0FDaEIsQ0FBQztZQUVGLE9BQU87Z0JBQ0wsVUFBVSxFQUFFLGlCQUFpQixFQUFnQjtnQkFDN0MsU0FBUyxFQUFFLGFBQWE7cUJBQ3JCLFVBQVUsQ0FBQyxVQUFVLHNCQUF3QjtxQkFDN0MsS0FBSyxFQUFFO2FBQ1gsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxDQUN2QixVQUFtQixFQUtKLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLEVBQUU7UUFDekQsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELElBQ0UsYUFBYSxDQUFDLHlCQUF5QixDQUNyQyxVQUFVLEVBQ1YsZUFBZSxFQUNmLFVBQVUsRUFDVixVQUFVLENBQ1gsS0FBSyxDQUFDLEVBQ1A7WUFDQSxNQUFNLElBQUksS0FBSyxDQUNiLDBEQUEwRCxDQUMzRCxDQUFDO1NBQ0g7UUFDRCxJQUNFLGFBQWEsQ0FBQyxPQUFPLENBQ25CLFVBQVUsRUFDVixvQkFBb0IsRUFDcEIsZUFBZSxFQUNmLGtCQUFrQixDQUNuQixLQUFLLENBQUMsRUFDUDtZQUNBLE1BQU0sSUFBSSxLQUFLLENBQ2IsNEZBQTRGLENBQzdGLENBQUM7U0FDSDtRQUNELE9BQU8sc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDO0lBRUYsTUFBTSxrQkFBa0IsR0FBRyxDQUN6QixVQUFzQixFQUN0QixVQUFzQixFQUNWLEVBQUU7UUFDZCxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuQyxPQUFPLGNBQWMsQ0FBYSxVQUFVLEVBQUUsR0FBRyxFQUFFO1lBQ2pELElBQ0UsYUFBYSxDQUFDLGVBQWUsQ0FDM0IsVUFBVSxFQUNWLGFBQWEsRUFDYixrQkFBa0IsQ0FDbkIsS0FBSyxDQUFDLEVBQ1A7Z0JBQ0EsTUFBTSxJQUFJLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO2FBQzdEO1lBQ0QsT0FBTyxhQUFhO2lCQUNqQixVQUFVLENBQUMsYUFBYSxzQkFBd0I7aUJBQ2hELEtBQUssRUFBRSxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7SUFFRixNQUFNLGtCQUFrQixHQUFHLENBQ3pCLFVBQXNCLEVBQ3RCLFVBQXNCLEVBQ1YsRUFBRTtRQUNkLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sY0FBYyxDQUFhLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDakQsSUFDRSxhQUFhLENBQUMsZUFBZSxDQUMzQixVQUFVLEVBQ1YsYUFBYSxFQUNiLGtCQUFrQixDQUNuQixLQUFLLENBQUMsRUFDUDtnQkFDQSxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7YUFDbEU7WUFDRCxPQUFPLGFBQWE7aUJBQ2pCLFVBQVUsQ0FBQyxhQUFhLHNCQUF3QjtpQkFDaEQsS0FBSyxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztJQUVGLE1BQU0saUJBQWlCLEdBQUcsQ0FDeEIsVUFBbUIsRUFDOEMsRUFBRSxDQUFDLENBQ3BFLFNBQVMsRUFDVCxVQUFVLEVBQ1YsRUFBRTtRQUNGLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0Qsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsSUFDRSxhQUFhLENBQUMsY0FBYyxDQUMxQixVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLGtCQUFrQixDQUNuQixLQUFLLENBQUMsRUFDUDtZQUNBLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDbEM7UUFDRCxPQUFPLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQztJQUVGLE1BQU0saUJBQWlCLEdBQUcsQ0FDeEIsVUFBbUIsRUFDOEMsRUFBRSxDQUFDLENBQ3BFLFNBQVMsRUFDVCxVQUFVLEVBQ1YsRUFBRTtRQUNGLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0Qsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsSUFDRSxhQUFhLENBQUMsY0FBYyxDQUMxQixVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLGtCQUFrQixDQUNuQixLQUFLLENBQUMsRUFDUDtZQUNBLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUN2QztRQUNELE9BQU8sc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDO0lBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7O09BaUJHO0lBQ0gsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO1FBQzVCLE1BQU0sYUFBYSxHQUFHLGtCQUFrQixDQUFDO1FBQ3pDLGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRCxhQUFhLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzFELFVBQVUsQ0FBQyxhQUFhLHNCQUF3QixDQUFDO0tBQ2xEO0lBRUQsT0FBTztRQUNMLGtCQUFrQjtRQUNsQiwyQkFBMkIsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7UUFDcEQsNkJBQTZCLEVBQUUsaUJBQWlCLENBQUMsS0FBSyxDQUFDO1FBQ3ZELGlCQUFpQixFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQztRQUN6QyxpQkFBaUI7UUFDakIseUJBQXlCLEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQztRQUNoRCwyQkFBMkIsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDO1FBQ25ELHdCQUF3QixFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO1FBQ3ZELG9CQUFvQixFQUFFLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1FBQ2xELGtCQUFrQjtRQUNsQiwyQkFBMkIsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7UUFDcEQsNkJBQTZCLEVBQUUsaUJBQWlCLENBQUMsS0FBSyxDQUFDO1FBQ3ZELHlCQUF5QixFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO1FBQ3ZELHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1FBQ2xELDBCQUEwQixFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQztRQUNsRCw0QkFBNEIsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUM7UUFDckQsc0JBQXNCLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQztRQUM5QyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDO1FBQ3pDLGlDQUFpQyxFQUFFLDBCQUEwQjtRQUM3RCxxQkFBcUIsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUM7UUFDOUMscUJBQXFCLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1FBQzdDLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQztRQUM1QyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUMvQixjQUFjLENBQ1osVUFBVSxFQUNWLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FDbEU7UUFDSCxzQkFBc0IsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztRQUNwRCwwQkFBMEIsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztRQUN6RCxrQkFBa0IsRUFBRSxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztRQUMvQyxzQkFBc0IsRUFBRSxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztLQUNyRCxDQUFDO0lBQ0Ysd0RBQXdEO0FBQzFELENBQUMsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdDRztBQUNILE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHLEtBQUssRUFDNUMsZ0JBQTZCLEVBQzdCLFVBQXVCLEVBQ0gsRUFBRSxDQUN0QixpQkFBaUIsQ0FDZixNQUFNLDZCQUE2QixDQUFDLGdCQUFnQixDQUFDLEVBQ3JELFVBQVUsQ0FDWCxDQUFDO0FBRUo7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxLQUFLLEVBQ3ZDLFVBQXVCLEVBQ0gsRUFBRTtBQUN0QixnREFBZ0Q7QUFDaEQsaUJBQWlCLENBQUMsTUFBTSx3QkFBd0IsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDIn0=