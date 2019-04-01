import { instantiateRustWasm, sha256Base64Bytes } from '../bin/bin';
import { base64ToBin } from '../utils/utils';
/**
 * The most performant way to instantiate sha256 functionality. To avoid
 * using Node.js or DOM-specific APIs, you can use `instantiateSha256`.
 *
 * @param webassemblyBytes A buffer containing the sha256 binary.
 */
export const instantiateSha256Bytes = async (webassemblyBytes) => {
    const wasm = await instantiateRustWasm(webassemblyBytes, './sha256', 'sha256', 'sha256_init', 'sha256_update', 'sha256_final');
    return {
        final: wasm.final,
        hash: wasm.hash,
        init: wasm.init,
        update: wasm.update
    };
};
export const getEmbeddedSha256Binary = () => base64ToBin(sha256Base64Bytes).buffer;
/**
 * An ultimately-portable (but slower) version of `instantiateSha256Bytes`
 * which does not require the consumer to provide the sha256 binary buffer.
 */
export const instantiateSha256 = async () => instantiateSha256Bytes(getEmbeddedSha256Binary());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhMjU2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jcnlwdG8vc2hhMjU2LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxtQkFBbUIsRUFDbkIsaUJBQWlCLEVBQ2xCLE1BQU0sWUFBWSxDQUFDO0FBQ3BCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQXFEN0M7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxLQUFLLEVBQ3pDLGdCQUE2QixFQUNaLEVBQUU7SUFDbkIsTUFBTSxJQUFJLEdBQUcsTUFBTSxtQkFBbUIsQ0FDcEMsZ0JBQWdCLEVBQ2hCLFVBQVUsRUFDVixRQUFRLEVBQ1IsYUFBYSxFQUNiLGVBQWUsRUFDZixjQUFjLENBQ2YsQ0FBQztJQUNGLE9BQU87UUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7UUFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0tBQ3BCLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRyxHQUFHLEVBQUUsQ0FDMUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDO0FBRXhDOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLEtBQUssSUFBcUIsRUFBRSxDQUMzRCxzQkFBc0IsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUMifQ==