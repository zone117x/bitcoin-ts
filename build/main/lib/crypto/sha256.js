"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bin_1 = require("../bin/bin");
const utils_1 = require("../utils/utils");
/**
 * The most performant way to instantiate sha256 functionality. To avoid
 * using Node.js or DOM-specific APIs, you can use `instantiateSha256`.
 *
 * @param webassemblyBytes A buffer containing the sha256 binary.
 */
exports.instantiateSha256Bytes = async (webassemblyBytes) => {
    const wasm = await bin_1.instantiateRustWasm(webassemblyBytes, './sha256', 'sha256', 'sha256_init', 'sha256_update', 'sha256_final');
    return {
        final: wasm.final,
        hash: wasm.hash,
        init: wasm.init,
        update: wasm.update
    };
};
exports.getEmbeddedSha256Binary = () => utils_1.base64ToBin(bin_1.sha256Base64Bytes).buffer;
/**
 * An ultimately-portable (but slower) version of `instantiateSha256Bytes`
 * which does not require the consumer to provide the sha256 binary buffer.
 */
exports.instantiateSha256 = async () => exports.instantiateSha256Bytes(exports.getEmbeddedSha256Binary());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhMjU2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jcnlwdG8vc2hhMjU2LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBSW9CO0FBQ3BCLDBDQUE2QztBQXFEN0M7Ozs7O0dBS0c7QUFDVSxRQUFBLHNCQUFzQixHQUFHLEtBQUssRUFDekMsZ0JBQTZCLEVBQ1osRUFBRTtJQUNuQixNQUFNLElBQUksR0FBRyxNQUFNLHlCQUFtQixDQUNwQyxnQkFBZ0IsRUFDaEIsVUFBVSxFQUNWLFFBQVEsRUFDUixhQUFhLEVBQ2IsZUFBZSxFQUNmLGNBQWMsQ0FDZixDQUFDO0lBQ0YsT0FBTztRQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztRQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7UUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7UUFDZixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07S0FDcEIsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVXLFFBQUEsdUJBQXVCLEdBQUcsR0FBRyxFQUFFLENBQzFDLG1CQUFXLENBQUMsdUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFFeEM7OztHQUdHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBRyxLQUFLLElBQXFCLEVBQUUsQ0FDM0QsOEJBQXNCLENBQUMsK0JBQXVCLEVBQUUsQ0FBQyxDQUFDIn0=