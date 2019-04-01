 
export declare const isValidUncompressedPublicKeyEncoding: (publicKey: Uint8Array) => boolean;
export declare const isValidCompressedPublicKeyEncoding: (publicKey: Uint8Array) => boolean;
export declare const isValidPublicKeyEncoding: (publicKey: Uint8Array) => boolean;
/**
 * Validate a bitcoin-encoded signature.
 *
 * From the C++ implementation:
 *
 * A canonical signature exists of: <30> <total len> <02> <len R> <R> <02> <len
 * S> <S> <hashtype>, where R and S are not negative (their first byte has its
 * highest bit not set), and not excessively padded (do not start with a 0 byte,
 * unless an otherwise negative number follows, in which case a single 0 byte is
 * necessary and even required).
 *
 * See https://bitcointalk.org/index.php?topic=8392.msg127623#msg127623
 *
 * This function is consensus-critical since BIP66.
 */
export declare const isValidSignatureEncoding: (signature: Uint8Array) => boolean;
/**
 * Split a bitcoin-encoded signature into a signature and signing serialization
 * type.
 *
 * While a bitcoin-encoded signature only includes a single byte to encode the
 * signing serialization type, a 3-byte forkId can be appended to the signing
 * serialization to provide replay-protection between different forks. (See
 * Bitcoin Cash's Replay Protected Sighash spec for details.)
 *
 * @param signature a signature which passes `isValidSignatureEncoding`
 */
export declare const decodeBitcoinSignature: (encodedSignature: Uint8Array) => {
    signature: Uint8Array;
    signingSerializationType: Uint8Array;
};
