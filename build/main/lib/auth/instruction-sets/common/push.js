"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const hex_1 = require("../../../utils/hex");
const instruction_sets_1 = require("../instruction-sets");
const opcodes_1 = require("./opcodes");
const types_1 = require("./types");
var PushOperationConstants;
(function (PushOperationConstants) {
    /**
     * OP_PUSHBYTES_75
     */
    PushOperationConstants[PushOperationConstants["maximumPushByteOperationSize"] = 75] = "maximumPushByteOperationSize";
    PushOperationConstants[PushOperationConstants["OP_PUSHDATA_1"] = 76] = "OP_PUSHDATA_1";
    PushOperationConstants[PushOperationConstants["OP_PUSHDATA_2"] = 77] = "OP_PUSHDATA_2";
    PushOperationConstants[PushOperationConstants["OP_PUSHDATA_4"] = 78] = "OP_PUSHDATA_4";
    /**
     * OP_PUSHDATA_4
     */
    PushOperationConstants[PushOperationConstants["highestPushDataOpcode"] = 78] = "highestPushDataOpcode";
    /**
     * For OP_1 to OP_16, `opcode` is the number offset by `0x50` (80):
     *
     * `OP_N = 0x50 + N`
     *
     * OP_0 is really OP_PUSHBYTES_0 (`0x00`), so it does not follow this pattern.
     */
    PushOperationConstants[PushOperationConstants["pushNumberOpcodesOffset"] = 80] = "pushNumberOpcodesOffset";
    /** OP_1 through OP_16 */
    PushOperationConstants[PushOperationConstants["pushNumberOpcodes"] = 16] = "pushNumberOpcodes";
    /**
     * 256 - 1
     */
    PushOperationConstants[PushOperationConstants["maximumPushData1Size"] = 255] = "maximumPushData1Size";
    /**
     * Standard consensus parameter for most Bitcoin forks.
     */
    PushOperationConstants[PushOperationConstants["maximumPushSize"] = 520] = "maximumPushSize";
    /**
     * 256 ** 2 - 1
     */
    PushOperationConstants[PushOperationConstants["maximumPushData2Size"] = 65536] = "maximumPushData2Size";
    /**
     * 256 ** 4 - 1
     */
    PushOperationConstants[PushOperationConstants["maximumPushData4Size"] = 4294967295] = "maximumPushData4Size";
})(PushOperationConstants = exports.PushOperationConstants || (exports.PushOperationConstants = {}));
/**
 * Prefix a `Uint8Array` with the proper opcode and push length bytes (if
 * necessary) to create a push instruction for `data`.
 *
 * Note, the maximum `bytecode` length which can be encoded for a push in the
 * Bitcoin system is `4294967295` (~4GB). This method assumes a smaller input – if
 * `bytecode` has the potential to be longer, it should be checked (and the
 * error handled) prior to calling this method.
 *
 * @param data the Uint8Array to push to the stack
 */
// tslint:disable-next-line:cyclomatic-complexity
exports.prefixDataPush = (data) => data.length <= PushOperationConstants.maximumPushByteOperationSize
    ? data.length === 1 && data[0] <= PushOperationConstants.pushNumberOpcodes
        ? Uint8Array.of(data[0] + PushOperationConstants.pushNumberOpcodesOffset)
        : Uint8Array.from([data.length, ...data])
    : data.length <= PushOperationConstants.maximumPushData1Size
        ? Uint8Array.from([
            PushOperationConstants.OP_PUSHDATA_1,
            ...instruction_sets_1.numberToLittleEndianBin(data.length, instruction_sets_1.Bytes.Uint8),
            ...data
        ])
        : data.length <= PushOperationConstants.maximumPushData2Size
            ? Uint8Array.from([
                PushOperationConstants.OP_PUSHDATA_2,
                ...instruction_sets_1.numberToLittleEndianBin(data.length, instruction_sets_1.Bytes.Uint16),
                ...data
            ])
            : Uint8Array.from([
                PushOperationConstants.OP_PUSHDATA_4,
                ...instruction_sets_1.numberToLittleEndianBin(data.length, instruction_sets_1.Bytes.Uint32),
                ...data
            ]);
exports.pushByteOpcodes = [
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_1,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_2,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_3,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_4,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_5,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_6,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_7,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_8,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_9,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_10,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_11,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_12,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_13,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_14,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_15,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_16,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_17,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_18,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_19,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_20,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_21,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_22,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_23,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_24,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_25,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_26,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_27,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_28,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_29,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_30,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_31,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_32,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_33,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_34,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_35,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_36,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_37,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_38,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_39,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_40,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_41,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_42,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_43,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_44,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_45,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_46,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_47,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_48,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_49,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_50,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_51,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_52,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_53,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_54,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_55,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_56,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_57,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_58,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_59,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_60,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_61,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_62,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_63,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_64,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_65,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_66,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_67,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_68,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_69,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_70,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_71,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_72,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_73,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_74,
    opcodes_1.CommonOpcodes.OP_PUSHBYTES_75
];
exports.pushOperation = () => (state) => {
    const instruction = state.instructions[state.ip];
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(instruction.data);
    return state;
};
exports.pushOperations = () => {
    const push = exports.pushOperation();
    return hex_1.range(PushOperationConstants.highestPushDataOpcode + 1).reduce((group, i) => (Object.assign({}, group, { [i]: push })), {});
};
exports.pushNumberOpcodes = [
    opcodes_1.CommonOpcodes.OP_1NEGATE,
    opcodes_1.CommonOpcodes.OP_1,
    opcodes_1.CommonOpcodes.OP_2,
    opcodes_1.CommonOpcodes.OP_3,
    opcodes_1.CommonOpcodes.OP_4,
    opcodes_1.CommonOpcodes.OP_5,
    opcodes_1.CommonOpcodes.OP_6,
    opcodes_1.CommonOpcodes.OP_7,
    opcodes_1.CommonOpcodes.OP_8,
    opcodes_1.CommonOpcodes.OP_9,
    opcodes_1.CommonOpcodes.OP_10,
    opcodes_1.CommonOpcodes.OP_11,
    opcodes_1.CommonOpcodes.OP_12,
    opcodes_1.CommonOpcodes.OP_13,
    opcodes_1.CommonOpcodes.OP_14,
    opcodes_1.CommonOpcodes.OP_15,
    opcodes_1.CommonOpcodes.OP_16
];
exports.pushNumberOperations = () => exports.pushNumberOpcodes
    .map((opcode, i) => [
    opcode,
    [-1, ...hex_1.range(PushOperationConstants.pushNumberOpcodes, 1)]
        .map(BigInt)
        .map(types_1.bigIntToScriptNumber)[i]
])
    .reduce((group, pair) => (Object.assign({}, group, { [pair[0]]: (state) => {
        // tslint:disable-next-line:no-expression-statement
        state.stack.push(pair[1].slice());
        return state;
    } })), {});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYXV0aC9pbnN0cnVjdGlvbi1zZXRzL2NvbW1vbi9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7O0FBRXBELDRDQUEyQztBQUczQywwREFJNkI7QUFDN0IsdUNBQTBDO0FBQzFDLG1DQUErQztBQUUvQyxJQUFZLHNCQXNDWDtBQXRDRCxXQUFZLHNCQUFzQjtJQUNoQzs7T0FFRztJQUNILG9IQUFtQyxDQUFBO0lBQ25DLHNGQUFvQixDQUFBO0lBQ3BCLHNGQUFvQixDQUFBO0lBQ3BCLHNGQUFvQixDQUFBO0lBQ3BCOztPQUVHO0lBQ0gsc0dBQXFDLENBQUE7SUFDckM7Ozs7OztPQU1HO0lBQ0gsMEdBQThCLENBQUE7SUFDOUIseUJBQXlCO0lBQ3pCLDhGQUFzQixDQUFBO0lBQ3RCOztPQUVHO0lBQ0gscUdBQTBCLENBQUE7SUFDMUI7O09BRUc7SUFDSCwyRkFBcUIsQ0FBQTtJQUNyQjs7T0FFRztJQUNILHVHQUE0QixDQUFBO0lBQzVCOztPQUVHO0lBQ0gsNEdBQWlDLENBQUE7QUFDbkMsQ0FBQyxFQXRDVyxzQkFBc0IsR0FBdEIsOEJBQXNCLEtBQXRCLDhCQUFzQixRQXNDakM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsaURBQWlEO0FBQ3BDLFFBQUEsY0FBYyxHQUFHLENBQUMsSUFBZ0IsRUFBRSxFQUFFLENBQ2pELElBQUksQ0FBQyxNQUFNLElBQUksc0JBQXNCLENBQUMsNEJBQTRCO0lBQ2hFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksc0JBQXNCLENBQUMsaUJBQWlCO1FBQ3hFLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxzQkFBc0IsQ0FBQyx1QkFBdUIsQ0FBQztRQUN6RSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxzQkFBc0IsQ0FBQyxvQkFBb0I7UUFDNUQsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDZCxzQkFBc0IsQ0FBQyxhQUFhO1lBQ3BDLEdBQUcsMENBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSx3QkFBSyxDQUFDLEtBQUssQ0FBQztZQUNwRCxHQUFHLElBQUk7U0FDUixDQUFDO1FBQ0osQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksc0JBQXNCLENBQUMsb0JBQW9CO1lBQzVELENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUNkLHNCQUFzQixDQUFDLGFBQWE7Z0JBQ3BDLEdBQUcsMENBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSx3QkFBSyxDQUFDLE1BQU0sQ0FBQztnQkFDckQsR0FBRyxJQUFJO2FBQ1IsQ0FBQztZQUNKLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUNkLHNCQUFzQixDQUFDLGFBQWE7Z0JBQ3BDLEdBQUcsMENBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSx3QkFBSyxDQUFDLE1BQU0sQ0FBQztnQkFDckQsR0FBRyxJQUFJO2FBQ1IsQ0FBQyxDQUFDO0FBRUksUUFBQSxlQUFlLEdBQWlDO0lBQzNELHVCQUFhLENBQUMsY0FBYztJQUM1Qix1QkFBYSxDQUFDLGNBQWM7SUFDNUIsdUJBQWEsQ0FBQyxjQUFjO0lBQzVCLHVCQUFhLENBQUMsY0FBYztJQUM1Qix1QkFBYSxDQUFDLGNBQWM7SUFDNUIsdUJBQWEsQ0FBQyxjQUFjO0lBQzVCLHVCQUFhLENBQUMsY0FBYztJQUM1Qix1QkFBYSxDQUFDLGNBQWM7SUFDNUIsdUJBQWEsQ0FBQyxjQUFjO0lBQzVCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFhLENBQUMsZUFBZTtJQUM3Qix1QkFBYSxDQUFDLGVBQWU7SUFDN0IsdUJBQWEsQ0FBQyxlQUFlO0lBQzdCLHVCQUFh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