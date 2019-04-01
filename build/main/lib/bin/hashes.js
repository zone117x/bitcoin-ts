"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Note, most of this method is translated and boiled-down from the wasm-pack
 * workflow. Significant changes to wasm-bindgen or wasm-pack build will likely
 * require modifications to this method.
 */
exports.instantiateRustWasm = async (webassemblyBytes, expectedImportModuleName, hashExportName, initExportName, updateExportName, finalExportName) => {
    const wasm = (await WebAssembly.instantiate(webassemblyBytes, {
        [expectedImportModuleName]: {
            /**
             * This would only be called in cases where a `__wbindgen_malloc` failed.
             * Since `__wbindgen_malloc` isn't exposed to consumers, this error
             * can only be encountered if the code below is broken.
             */
            __wbindgen_throw: /* istanbul ignore next */ (ptr, len) => {
                throw new Error(Array.from(getUint8Memory().subarray(ptr, ptr + len))
                    .map(num => String.fromCharCode(num))
                    .join(''));
            }
        }
    })).instance.exports;
    // tslint:disable:no-let no-if-statement no-expression-statement no-unsafe-any
    let cachedUint8Memory;
    let cachedUint32Memory;
    let cachedGlobalArgumentPtr;
    const globalArgumentPtr = () => {
        if (cachedGlobalArgumentPtr === undefined) {
            cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
        }
        return cachedGlobalArgumentPtr;
    };
    /**
     * Must be hoisted for `__wbindgen_throw`.
     */
    // tslint:disable-next-line:only-arrow-functions
    function getUint8Memory() {
        if (cachedUint8Memory === undefined ||
            cachedUint8Memory.buffer !== wasm.memory.buffer) {
            cachedUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8Memory;
    }
    const getUint32Memory = () => {
        if (cachedUint32Memory === undefined ||
            cachedUint32Memory.buffer !== wasm.memory.buffer) {
            cachedUint32Memory = new Uint32Array(wasm.memory.buffer);
        }
        return cachedUint32Memory;
    };
    // tslint:enable:no-let no-if-statement
    const passArray8ToWasm = (array) => {
        const ptr = wasm.__wbindgen_malloc(array.length);
        getUint8Memory().set(array, ptr);
        return [ptr, array.length];
    };
    const getArrayU8FromWasm = (ptr, len) => getUint8Memory().subarray(ptr, ptr + len);
    // tslint:disable:no-magic-numbers
    const hash = (input) => {
        const [ptr0, len0] = passArray8ToWasm(input);
        const retPtr = globalArgumentPtr();
        try {
            wasm[hashExportName](retPtr, ptr0, len0);
            const mem = getUint32Memory();
            const ptr = mem[retPtr / 4];
            const len = mem[retPtr / 4 + 1];
            const realRet = getArrayU8FromWasm(ptr, len).slice();
            wasm.__wbindgen_free(ptr, len);
            return realRet;
        }
        finally {
            wasm.__wbindgen_free(ptr0, len0);
        }
    };
    const init = () => {
        const retPtr = globalArgumentPtr();
        wasm[initExportName](retPtr);
        const mem = getUint32Memory();
        const ptr = mem[retPtr / 4];
        const len = mem[retPtr / 4 + 1];
        const realRet = getArrayU8FromWasm(ptr, len).slice();
        wasm.__wbindgen_free(ptr, len);
        return realRet;
    };
    const update = (rawState, input) => {
        const [ptr0, len0] = passArray8ToWasm(rawState);
        const [ptr1, len1] = passArray8ToWasm(input);
        const retPtr = globalArgumentPtr();
        try {
            wasm[updateExportName](retPtr, ptr0, len0, ptr1, len1);
            const mem = getUint32Memory();
            const ptr = mem[retPtr / 4];
            const len = mem[retPtr / 4 + 1];
            const realRet = getArrayU8FromWasm(ptr, len).slice();
            wasm.__wbindgen_free(ptr, len * 1);
            return realRet;
        }
        finally {
            rawState.set(getUint8Memory().subarray(ptr0 / 1, ptr0 / 1 + len0));
            wasm.__wbindgen_free(ptr0, len0 * 1);
            wasm.__wbindgen_free(ptr1, len1 * 1);
        }
    };
    const final = (rawState) => {
        const [ptr0, len0] = passArray8ToWasm(rawState);
        const retPtr = globalArgumentPtr();
        try {
            wasm[finalExportName](retPtr, ptr0, len0);
            const mem = getUint32Memory();
            const ptr = mem[retPtr / 4];
            const len = mem[retPtr / 4 + 1];
            const realRet = getArrayU8FromWasm(ptr, len).slice();
            wasm.__wbindgen_free(ptr, len * 1);
            return realRet;
        }
        finally {
            rawState.set(getUint8Memory().subarray(ptr0 / 1, ptr0 / 1 + len0));
            wasm.__wbindgen_free(ptr0, len0 * 1);
        }
    };
    // tslint:enable:no-expression-statement
    return {
        final,
        hash,
        init,
        update
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9iaW4vaGFzaGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0E7Ozs7R0FJRztBQUNVLFFBQUEsbUJBQW1CLEdBQUcsS0FBSyxFQUN0QyxnQkFBNkIsRUFDN0Isd0JBQWdDLEVBQ2hDLGNBQXNCLEVBQ3RCLGNBQXNCLEVBQ3RCLGdCQUF3QixFQUN4QixlQUF1QixFQUNBLEVBQUU7SUFDekIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLFdBQVcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7UUFDNUQsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO1lBQzFCOzs7O2VBSUc7WUFDSCxnQkFBZ0IsRUFBRSwwQkFBMEIsQ0FBQyxDQUMzQyxHQUFXLEVBQ1gsR0FBVyxFQUNYLEVBQUU7Z0JBQ0YsTUFBTSxJQUFJLEtBQUssQ0FDYixLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO3FCQUNsRCxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUNwQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQ1osQ0FBQztZQUNKLENBQUM7U0FDRjtLQUNGLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFFckIsOEVBQThFO0lBQzlFLElBQUksaUJBQXlDLENBQUM7SUFDOUMsSUFBSSxrQkFBMkMsQ0FBQztJQUNoRCxJQUFJLHVCQUEyQyxDQUFDO0lBRWhELE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO1FBQzdCLElBQUksdUJBQXVCLEtBQUssU0FBUyxFQUFFO1lBQ3pDLHVCQUF1QixHQUFHLElBQUksQ0FBQyw4QkFBOEIsRUFBWSxDQUFDO1NBQzNFO1FBQ0QsT0FBTyx1QkFBdUIsQ0FB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