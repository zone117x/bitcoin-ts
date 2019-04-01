"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const combinators_1 = require("./combinators");
const common_1 = require("./common");
const flow_control_1 = require("./flow-control");
const opcodes_1 = require("./opcodes");
const types_1 = require("./types");
const areEqual = (a, b) => {
    // tslint:disable-next-line:no-if-statement
    if (a.length !== b.length) {
        return false;
    }
    // tslint:disable-next-line:no-let
    for (let i = 0; i < a.length; i++) {
        // tslint:disable-next-line:no-if-statement
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};
exports.opEqual = () => (state) => {
    const element1 = state.stack.pop();
    const element2 = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!element1 || !element2) {
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    const result = types_1.booleanToScriptNumber(areEqual(element1, element2));
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(result);
    return state;
};
exports.opEqualVerify = () => combinators_1.combineOperations(exports.opEqual(), flow_control_1.opVerify());
exports.bitwiseOperations = () => ({
    [opcodes_1.CommonOpcodes.OP_EQUAL]: exports.opEqual(),
    [opcodes_1.CommonOpcodes.OP_EQUALVERIFY]: exports.opEqualVerify()
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0d2lzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYXV0aC9pbnN0cnVjdGlvbi1zZXRzL2NvbW1vbi9iaXR3aXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7O0FBSXBELCtDQUFrRDtBQUNsRCxxQ0FBNkU7QUFDN0UsaURBQTBDO0FBQzFDLHVDQUEwQztBQUMxQyxtQ0FBZ0Q7QUFFaEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFhLEVBQUUsQ0FBYSxFQUFFLEVBQUU7SUFDaEQsMkNBQTJDO0lBQzNDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO1FBQ3pCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxrQ0FBa0M7SUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNqQixPQUFPLEtBQUssQ0FBQztTQUNkO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUVXLFFBQUEsT0FBTyxHQUFHLEdBR0QsRUFBRSxDQUFDLENBQUMsS0FBWSxFQUFFLEVBQUU7SUFDeEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNuQyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ25DLDJDQUEyQztJQUMzQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQzFCLE9BQU8sbUJBQVUsQ0FDZixrQ0FBeUIsQ0FBQyxVQUFVLEVBQ3BDLEtBQUssQ0FDTixDQUFDO0tBQ0g7SUFDRCxNQUFNLE1BQU0sR0FBRyw2QkFBcUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDbkUsbURBQW1EO0lBQ25ELEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pCLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRVcsUUFBQSxhQUFhLEdBQUcsR0FHUCxFQUFFLENBQ3RCLCtCQUFpQixDQUFDLGVBQU8sRUFBaUIsRUFBRSx1QkFBUSxFQUFpQixDQUFDLENBQUM7QUFFNUQsUUFBQSxpQkFBaUIsR0FBRyxHQUk3QixFQUFFLENBQUMsQ0FBQztJQUNOLENBQUMsdUJBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFPLEVBQWlCO0lBQ2xELENBQUMsdUJBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRSxxQkFBYSxFQUFpQjtDQUMvRCxDQUFDLENBQUMifQ==