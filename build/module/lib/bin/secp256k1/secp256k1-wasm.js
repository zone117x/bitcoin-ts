import { base64ToBin } from '../../utils/base64';
import { secp256k1Base64Bytes } from './secp256k1.base64';
// bitflags used in secp256k1's public API (translated from secp256k1.h)
// tslint:disable:no-bitwise no-magic-numbers
/** All flags' lower 8 bits indicate what they're for. Do not use directly. */
// const SECP256K1_FLAGS_TYPE_MASK = (1 << 8) - 1;
const SECP256K1_FLAGS_TYPE_CONTEXT = 1 << 0;
const SECP256K1_FLAGS_TYPE_COMPRESSION = 1 << 1;
/** The higher bits contain the actual data. Do not use directly. */
const SECP256K1_FLAGS_BIT_CONTEXT_VERIFY = 1 << 8;
const SECP256K1_FLAGS_BIT_CONTEXT_SIGN = 1 << 9;
const SECP256K1_FLAGS_BIT_COMPRESSION = 1 << 8;
/** Flags to pass to secp256k1_context_create. */
const SECP256K1_CONTEXT_VERIFY = SECP256K1_FLAGS_TYPE_CONTEXT | SECP256K1_FLAGS_BIT_CONTEXT_VERIFY;
const SECP256K1_CONTEXT_SIGN = SECP256K1_FLAGS_TYPE_CONTEXT | SECP256K1_FLAGS_BIT_CONTEXT_SIGN;
const SECP256K1_CONTEXT_NONE = SECP256K1_FLAGS_TYPE_CONTEXT;
/** Flag to pass to secp256k1_ec_pubkey_serialize and secp256k1_ec_privkey_export. */
const SECP256K1_EC_COMPRESSED = SECP256K1_FLAGS_TYPE_COMPRESSION | SECP256K1_FLAGS_BIT_COMPRESSION;
const SECP256K1_EC_UNCOMPRESSED = SECP256K1_FLAGS_TYPE_COMPRESSION;
// /** Prefix byte used to tag various encoded curvepoints for specific purposes */
// const SECP256K1_TAG_PUBKEY_EVEN = 0x02;
// const SECP256K1_TAG_PUBKEY_ODD = 0x03;
// const SECP256K1_TAG_PUBKEY_UNCOMPRESSED = 0x04;
// const SECP256K1_TAG_PUBKEY_HYBRID_EVEN = 0x06;
// const SECP256K1_TAG_PUBKEY_HYBRID_ODD = 0x07;
/**
 * Flag to pass to a Secp256k1.contextCreate method.
 *
 * The purpose of context structures is to cache large precomputed data tables
 * that are expensive to construct, and also to maintain the randomization data
 * for blinding.
 *
 * You can create a context with only VERIFY or only SIGN capabilities, or you
 * can use BOTH. (NONE can be used for conversion/serialization.)
 */
export var ContextFlag;
(function (ContextFlag) {
    ContextFlag[ContextFlag["NONE"] = SECP256K1_CONTEXT_NONE] = "NONE";
    ContextFlag[ContextFlag["VERIFY"] = SECP256K1_CONTEXT_VERIFY] = "VERIFY";
    ContextFlag[ContextFlag["SIGN"] = SECP256K1_CONTEXT_SIGN] = "SIGN";
    ContextFlag[ContextFlag["BOTH"] = SECP256K1_CONTEXT_SIGN | SECP256K1_CONTEXT_VERIFY] = "BOTH";
})(ContextFlag || (ContextFlag = {}));
/**
 * Flag to pass a Secp256k1 public key serialization method.
 *
 * You can indicate COMPRESSED (33 bytes, header byte 0x02 or 0x03) or
 * UNCOMPRESSED (65 bytes, header byte 0x04) format.
 */
export var CompressionFlag;
(function (CompressionFlag) {
    CompressionFlag[CompressionFlag["COMPRESSED"] = SECP256K1_EC_COMPRESSED] = "COMPRESSED";
    CompressionFlag[CompressionFlag["UNCOMPRESSED"] = SECP256K1_EC_UNCOMPRESSED] = "UNCOMPRESSED";
})(CompressionFlag || (CompressionFlag = {}));
// tslint:enable:no-mixed-interface
// tslint:disable:no-unsafe-any
const wrapSecp256k1Wasm = (instance, heapU8, heapU32) => ({
    contextCreate: context => instance.exports._secp256k1_context_create(context),
    contextRandomize: (contextPtr, seedPtr) => instance.exports._secp256k1_context_randomize(contextPtr, seedPtr),
    ecdh: (contextPtr, resultPtr, pubkeyPtr, privkeyPtr) => instance.exports._secp256k1_ecdh(contextPtr, resultPtr, pubkeyPtr, privkeyPtr),
    free: pointer => instance.exports._free(pointer),
    heapU32,
    heapU8,
    instance,
    malloc: bytes => instance.exports._malloc(bytes),
    mallocSizeT: num => {
        // tslint:disable-next-line:no-magic-numbers
        const pointer = instance.exports._malloc(4);
        // tslint:disable-next-line:no-bitwise no-magic-numbers
        const pointerView32 = pointer >> 2;
        // tslint:disable-next-line:no-expression-statement
        heapU32.set([num], pointerView32);
        return pointer;
    },
    mallocUint8Array: array => {
        const pointer = instance.exports._malloc(array.length);
        // tslint:disable-next-line:no-expression-statement
        heapU8.set(array, pointer);
        return pointer;
    },
    privkeyTweakAdd: (contextPtr, secretKeyPtr, tweakNum256Ptr) => instance.exports._secp256k1_ec_privkey_tweak_add(contextPtr, secretKeyPtr, tweakNum256Ptr),
    privkeyTweakMul: (contextPtr, secretKeyPtr, tweakNum256Ptr) => instance.exports._secp256k1_ec_privkey_tweak_mul(contextPtr, secretKeyPtr, tweakNum256Ptr),
    pubkeyCreate: (contextPtr, publicKeyPtr, secretKeyPtr) => instance.exports._secp256k1_ec_pubkey_create(contextPtr, publicKeyPtr, secretKeyPtr),
    pubkeyParse: (contextPtr, publicKeyOutPtr, publicKeyInPtr, publicKeyInLength) => instance.exports._secp256k1_ec_pubkey_parse(contextPtr, publicKeyOutPtr, publicKeyInPtr, publicKeyInLength),
    pubkeySerialize: (contextPtr, outputPtr, outputLengthPtr, publicKeyPtr, compression) => instance.exports._secp256k1_ec_pubkey_serialize(contextPtr, outputPtr, outputLengthPtr, publicKeyPtr, compression),
    pubkeyTweakAdd: (contextPtr, publicKeyPtr, tweakNum256Ptr) => instance.exports._secp256k1_ec_pubkey_tweak_add(contextPtr, publicKeyPtr, tweakNum256Ptr),
    pubkeyTweakMul: (contextPtr, publicKeyPtr, tweakNum256Ptr) => instance.exports._secp256k1_ec_pubkey_tweak_mul(contextPtr, publicKeyPtr, tweakNum256Ptr),
    readHeapU8: (pointer, bytes) => new Uint8Array(heapU8.buffer, pointer, bytes),
    readSizeT: pointer => {
        // tslint:disable-next-line:no-bitwise no-magic-numbers
        const pointerView32 = pointer >> 2;
        return heapU32[pointerView32];
    },
    recover: (contextPtr, outputPubkeyPointer, rSigPtr, msg32Ptr) => instance.exports._secp256k1_ecdsa_recover(contextPtr, outputPubkeyPointer, rSigPtr, msg32Ptr),
    recoverableSignatureParse: (contextPtr, outputRSigPtr, inputSigPtr, rid) => instance.exports._secp256k1_ecdsa_recoverable_signature_parse_compact(contextPtr, outputRSigPtr, inputSigPtr, rid),
    recoverableSignatureSerialize: (contextPtr, sigOutPtr, recIDOutPtr, rSigPtr) => instance.exports._secp256k1_ecdsa_recoverable_signature_serialize_compact(contextPtr, sigOutPtr, recIDOutPtr, rSigPtr),
    seckeyVerify: (contextPtr, secretKeyPtr) => instance.exports._secp256k1_ec_seckey_verify(contextPtr, secretKeyPtr),
    sign: (contextPtr, outputSigPtr, msg32Ptr, secretKeyPtr) => instance.exports._secp256k1_ecdsa_sign(contextPtr, outputSigPtr, msg32Ptr, secretKeyPtr),
    signRecoverable: (contextPtr, outputRSigPtr, msg32Ptr, secretKeyPtr) => instance.exports._secp256k1_ecdsa_sign_recoverable(contextPtr, outputRSigPtr, msg32Ptr, secretKeyPtr),
    signatureMalleate: (contextPtr, outputSigPtr, inputSigPtr) => instance.exports._secp256k1_ecdsa_signature_malleate(contextPtr, outputSigPtr, inputSigPtr),
    signatureNormalize: (contextPtr, outputSigPtr, inputSigPtr) => instance.exports._secp256k1_ecdsa_signature_normalize(contextPtr, outputSigPtr, inputSigPtr),
    signatureParseCompact: (contextPtr, sigOutPtr, compactSigInPtr) => instance.exports._secp256k1_ecdsa_signature_parse_compact(contextPtr, sigOutPtr, compactSigInPtr),
    signatureParseDER: (contextPtr, sigOutPtr, sigDERInPtr, sigDERInLength) => instance.exports._secp256k1_ecdsa_signature_parse_der(contextPtr, sigOutPtr, sigDERInPtr, sigDERInLength),
    signatureSerializeCompact: (contextPtr, outputCompactSigPtr, inputSigPtr) => instance.exports._secp256k1_ecdsa_signature_serialize_compact(contextPtr, outputCompactSigPtr, inputSigPtr),
    signatureSerializeDER: (contextPtr, outputDERSigPtr, outputDERSigLengthPtr, inputSigPtr) => instance.exports._secp256k1_ecdsa_signature_serialize_der(contextPtr, outputDERSigPtr, outputDERSigLengthPtr, inputSigPtr),
    verify: (contextPtr, sigPtr, msg32Ptr, pubkeyPtr) => instance.exports._secp256k1_ecdsa_verify(contextPtr, sigPtr, msg32Ptr, pubkeyPtr)
});
// tslint:enable:no-unsafe-any
/**
 * Method extracted from Emscripten's preamble.js
 */
const isLittleEndian = (buffer) => {
    const littleEndian = true;
    const notLittleEndian = false;
    const heap16 = new Int16Array(buffer);
    const heap32 = new Int32Array(buffer);
    const heapU8 = new Uint8Array(buffer);
    // tslint:disable:no-expression-statement no-object-mutation no-magic-numbers
    heap32[0] = 1668509029;
    heap16[1] = 25459;
    // tslint:enable:no-expression-statement no-object-mutation
    // tslint:disable-next-line:no-magic-numbers
    return heapU8[2] !== 115 || heapU8[3] !== 99
        ? /* istanbul ignore next */ notLittleEndian
        : littleEndian;
};
/**
 * Method derived from Emscripten's preamble.js
 */
const alignMemory = (factor, size) => Math.ceil(size / factor) * factor;
/**
 * The most performant way to instantiate secp256k1 functionality. To avoid
 * using Node.js or DOM-specific APIs, you can use `instantiateSecp256k1`.
 *
 * Note, most of this method is translated and boiled-down from Emscripten's
 * preamble.js. Significant changes to the WASM build or breaking updates to
 * Emscripten will likely require modifications to this method.
 *
 * @param webassemblyBytes A buffer containing the secp256k1 binary.
 */
export const instantiateSecp256k1WasmBytes = async (webassemblyBytes) => {
    const STACK_ALIGN = 16;
    const GLOBAL_BASE = 1024;
    const WASM_PAGE_SIZE = 65536;
    const TOTAL_STACK = 5242880;
    const TOTAL_MEMORY = 16777216;
    const wasmMemory = new WebAssembly.Memory({
        initial: TOTAL_MEMORY / WASM_PAGE_SIZE,
        maximum: TOTAL_MEMORY / WASM_PAGE_SIZE
    });
    /* istanbul ignore if  */
    // tslint:disable-next-line:no-if-statement
    if (!isLittleEndian(wasmMemory.buffer)) {
        // note: this block is excluded from test coverage. It's A) hard to test
        // (must be either tested on big-endian hardware or a big-endian buffer
        // mock) and B) extracted from Emscripten's preamble.js, where it should
        // be tested properly.
        throw new Error('Runtime error: expected the system to be little-endian.');
    }
    // tslint:disable:no-magic-numbers
    const STATIC_BASE = GLOBAL_BASE;
    const STATICTOP_INITIAL = STATIC_BASE + 67696 + 16;
    const DYNAMICTOP_PTR = STATICTOP_INITIAL;
    const DYNAMICTOP_PTR_SIZE = 4;
    // tslint:disable-next-line:no-bitwise
    const STATICTOP = (STATICTOP_INITIAL + DYNAMICTOP_PTR_SIZE + 15) & -16;
    const STACKTOP = alignMemory(STACK_ALIGN, STATICTOP);
    const STACK_BASE = STACKTOP;
    const STACK_MAX = STACK_BASE + TOTAL_STACK;
    const DYNAMIC_BASE = alignMemory(STACK_ALIGN, STACK_MAX);
    const heapU8 = new Uint8Array(wasmMemory.buffer);
    const heap32 = new Int32Array(wasmMemory.buffer);
    const heapU32 = new Uint32Array(wasmMemory.buffer);
    // tslint:disable-next-line:no-expression-statement no-bitwise no-object-mutation
    heap32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
    const TABLE_SIZE = 6;
    const MAX_TABLE_SIZE = 6;
    // tslint:enable:no-magic-numbers
    // tslint:disable-next-line:no-let
    let getErrNoLocation;
    // note: A number of methods below are excluded from test coverage. They are
    // a) not part of the regular usage of this library (should only be evaluated
    // if the consumer mis-implements the library and exist only to make
    // debugging easier) and B) already tested adequately in Emscripten, from
    // which this section is extracted.
    const env = {
        DYNAMICTOP_PTR,
        STACKTOP,
        ___setErrNo: /* istanbul ignore next */ (value) => {
            // tslint:disable-next-line:no-if-statement
            if (getErrNoLocation !== undefined) {
                // tslint:disable-next-line:no-bitwise no-expression-statement no-object-mutation no-magic-numbers
                heap32[getErrNoLocation() >> 2] = value;
            }
            return value;
        },
        _abort: /* istanbul ignore next */ (err = 'Secp256k1 Error') => {
            throw new Error(err);
        },
        _emscripten_memcpy_big: /* istanbul ignore next */ (dest, src, num) => {
            // tslint:disable-next-line:no-expression-statement
            heapU8.set(heapU8.subarray(src, src + num), dest);
            return dest;
        },
        abort: /* istanbul ignore next */ (err = 'Secp256k1 Error') => {
            throw new Error(err);
        },
        abortOnCannotGrowMemory: /* istanbul ignore next */ () => {
            throw new Error('Secp256k1 Error: abortOnCannotGrowMemory was called.');
        },
        enlargeMemory: /* istanbul ignore next */ () => {
            throw new Error('Secp256k1 Error: enlargeMemory was called.');
        },
        getTotalMemory: () => TOTAL_MEMORY
    };
    const info = {
        env: {
            ...env,
            memory: wasmMemory,
            memoryBase: STATIC_BASE,
            table: new WebAssembly.Table({
                element: 'anyfunc',
                initial: TABLE_SIZE,
                maximum: MAX_TABLE_SIZE
            }),
            tableBase: 0
        },
        global: { NaN, Infinity }
    };
    return WebAssembly.instantiate(webassemblyBytes, info).then(result => {
        //
        // tslint:disable-next-line:no-expression-statement no-unsafe-any
        getErrNoLocation = result.instance.exports.___errno_location;
        return wrapSecp256k1Wasm(result.instance, heapU8, heapU32);
    });
};
export const getEmbeddedSecp256k1Binary = () => base64ToBin(secp256k1Base64Bytes).buffer;
/**
 * An ultimately-portable (but slower) version of `instantiateSecp256k1Bytes`
 * which does not require the consumer to provide the secp256k1 binary buffer.
 */
export const instantiateSecp256k1Wasm = async () => instantiateSecp256k1WasmBytes(getEmbeddedSecp256k1Binary());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLXdhc20uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2Jpbi9zZWNwMjU2azEvc2VjcDI1NmsxLXdhc20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTFELHdFQUF3RTtBQUV4RSw2Q0FBNkM7QUFDN0MsOEVBQThFO0FBQzlFLGtEQUFrRDtBQUNsRCxNQUFNLDRCQUE0QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsTUFBTSxnQ0FBZ0MsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELG9FQUFvRTtBQUNwRSxNQUFNLGtDQUFrQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsTUFBTSxnQ0FBZ0MsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELE1BQU0sK0JBQStCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUUvQyxpREFBaUQ7QUFDakQsTUFBTSx3QkFBd0IsR0FDNUIsNEJBQTRCLEdBQUcsa0NBQWtDLENBQUM7QUFDcEUsTUFBTSxzQkFBc0IsR0FDMUIsNEJBQTRCLEdBQUcsZ0NBQWdDLENBQUM7QUFDbEUsTUFBTSxzQkFBc0IsR0FBRyw0QkFBNEIsQ0FBQztBQUU1RCxxRkFBcUY7QUFDckYsTUFBTSx1QkFBdUIsR0FDM0IsZ0NBQWdDLEdBQUcsK0JBQStCLENBQUM7QUFDckUsTUFBTSx5QkFBeUIsR0FBRyxnQ0FBZ0MsQ0FBQztBQUVuRSxtRkFBbUY7QUFDbkYsMENBQTBDO0FBQzFDLHlDQUF5QztBQUN6QyxrREFBa0Q7QUFDbEQsaURBQWlEO0FBQ2pELGdEQUFnRDtBQUVoRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLENBQU4sSUFBWSxXQUtYO0FBTEQsV0FBWSxXQUFXO0lBQ3JCLGtD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