/**
 * Note, most of this method is translated and boiled-down from the wasm-pack
 * workflow. Significant changes to wasm-bindgen or wasm-pack build will likely
 * require modifications to this method.
 */
export const instantiateRustWasm = async (webassemblyBytes, expectedImportModuleName, hashExportName, initExportName, updateExportName, finalExportName) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9iaW4vaGFzaGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLEVBQ3RDLGdCQUE2QixFQUM3Qix3QkFBZ0MsRUFDaEMsY0FBc0IsRUFDdEIsY0FBc0IsRUFDdEIsZ0JBQXdCLEVBQ3hCLGVBQXVCLEVBQ0EsRUFBRTtJQUN6QixNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sV0FBVyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRTtRQUM1RCxDQUFDLHdCQUF3QixDQUFDLEVBQUU7WUFDMUI7Ozs7ZUFJRztZQUNILGdCQUFnQixFQUFFLDBCQUEwQixDQUFDLENBQzNDLEdBQVcsRUFDWCxHQUFXLEVBQ1gsRUFBRTtnQkFDRixNQUFNLElBQUksS0FBSyxDQUNiLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7cUJBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3BDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDWixDQUFDO1lBQ0osQ0FBQztTQUNGO0tBQ0YsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztJQUVyQiw4RUFBOEU7SUFDOUUsSUFBSSxpQkFBeUMsQ0FBQztJQUM5QyxJQUFJLGtCQUEyQyxDQUFDO0lBQ2hELElBQUksdUJBQTJDLENBQUM7SUFFaEQsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLEVBQUU7UUFDN0IsSUFBSSx1QkFBdUIsS0FBSyxTQUFTLEVBQUU7WUFDekMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLDhCQUE4QixFQUFZLENBQUM7U0FDM0U7UUFDRCxPQUFPLHVC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