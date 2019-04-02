"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base64_1 = require("../../utils/base64");
const secp256k1_base64_1 = require("./secp256k1.base64");
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
var ContextFlag;
(function (ContextFlag) {
    ContextFlag[ContextFlag["NONE"] = SECP256K1_CONTEXT_NONE] = "NONE";
    ContextFlag[ContextFlag["VERIFY"] = SECP256K1_CONTEXT_VERIFY] = "VERIFY";
    ContextFlag[ContextFlag["SIGN"] = SECP256K1_CONTEXT_SIGN] = "SIGN";
    ContextFlag[ContextFlag["BOTH"] = SECP256K1_CONTEXT_SIGN | SECP256K1_CONTEXT_VERIFY] = "BOTH";
})(ContextFlag = exports.ContextFlag || (exports.ContextFlag = {}));
/**
 * Flag to pass a Secp256k1 public key serialization method.
 *
 * You can indicate COMPRESSED (33 bytes, header byte 0x02 or 0x03) or
 * UNCOMPRESSED (65 bytes, header byte 0x04) format.
 */
var CompressionFlag;
(function (CompressionFlag) {
    CompressionFlag[CompressionFlag["COMPRESSED"] = SECP256K1_EC_COMPRESSED] = "COMPRESSED";
    CompressionFlag[CompressionFlag["UNCOMPRESSED"] = SECP256K1_EC_UNCOMPRESSED] = "UNCOMPRESSED";
})(CompressionFlag = exports.CompressionFlag || (exports.CompressionFlag = {}));
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
exports.instantiateSecp256k1WasmBytes = async (webassemblyBytes) => {
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
        env: Object.assign({}, env, { memory: wasmMemory, memoryBase: STATIC_BASE, table: new WebAssembly.Table({
                element: 'anyfunc',
                initial: TABLE_SIZE,
                maximum: MAX_TABLE_SIZE
            }), tableBase: 0 }),
        global: { NaN, Infinity }
    };
    return WebAssembly.instantiate(webassemblyBytes, info).then(result => {
        //
        // tslint:disable-next-line:no-expression-statement no-unsafe-any
        getErrNoLocation = result.instance.exports.___errno_location;
        return wrapSecp256k1Wasm(result.instance, heapU8, heapU32);
    });
};
exports.getEmbeddedSecp256k1Binary = () => base64_1.base64ToBin(secp256k1_base64_1.secp256k1Base64Bytes).buffer;
/**
 * An ultimately-portable (but slower) version of `instantiateSecp256k1Bytes`
 * which does not require the consumer to provide the secp256k1 binary buffer.
 */
exports.instantiateSecp256k1Wasm = async () => exports.instantiateSecp256k1WasmBytes(exports.getEmbeddedSecp256k1Binary());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLXdhc20uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2Jpbi9zZWNwMjU2azEvc2VjcDI1NmsxLXdhc20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBaUQ7QUFDakQseURBQTBEO0FBRTFELHdFQUF3RTtBQUV4RSw2Q0FBNkM7QUFDN0MsOEVBQThFO0FBQzlFLGtEQUFrRDtBQUNsRCxNQUFNLDRCQUE0QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsTUFBTSxnQ0FBZ0MsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELG9FQUFvRTtBQUNwRSxNQUFNLGtDQUFrQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsTUFBTSxnQ0FBZ0MsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELE1BQU0sK0JBQStCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUUvQyxpREFBaUQ7QUFDakQsTUFBTSx3QkFBd0IsR0FDNUIsNEJBQTRCLEdBQUcsa0NBQWtDLENBQUM7QUFDcEUsTUFBTSxzQkFBc0IsR0FDMUIsNEJBQTRCLEdBQUcsZ0NBQWdDLENBQUM7QUFDbEUsTUFBTSxzQkFBc0IsR0FBRyw0QkFBNEIsQ0FBQztBQUU1RCxxRkFBcUY7QUFDckYsTUFBTSx1QkFBdUIsR0FDM0IsZ0NBQWdDLEdBQUcsK0JBQStCLENBQUM7QUFDckUsTUFBTSx5QkFBeUIsR0FBRyxnQ0FBZ0MsQ0FBQztBQUVuRSxtRkFBbUY7QUFDbkYsMENBQTBDO0FBQzFDLHlDQUF5QztBQUN6QyxrREFBa0Q7QUFDbEQsaURBQWlEO0FBQ2pELGdEQUFnRDtBQUVoRDs7Ozs7Ozs7O0dBU0c7QUFDSCxJQUFZLFdBS1g7QUFMRCxXQUFZLFdBQVc7SUFDckIsa0NBQU8sc0JBQTJCLFVBQUEsQ0FBQTtJQUNsQyxvQ0FBUyx3QkFBK0IsWUFBQSxDQUFBO0lBQ3hDLGtDQUFPLHNCQUE2QixV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