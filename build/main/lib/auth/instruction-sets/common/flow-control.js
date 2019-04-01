"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const arithmetic_1 = require("./arithmetic");
const common_1 = require("./common");
const opcodes_1 = require("./opcodes");
exports.opVerify = () => (state) => {
    const element = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!element) {
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    return common_1.stackElementIsTruthy(element)
        ? state
        : common_1.applyError(common_1.CommonAuthenticationError.failedVerify, state);
};
exports.conditionalFlowControlOperations = () => ({
    [opcodes_1.CommonOpcodes.OP_VERIFY]: exports.opVerify()
});
exports.opIf = () => (state) => {
    const element = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!element) {
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    // tslint:disable-next-line:no-expression-statement
    state.executionStack.push(common_1.stackElementIsTruthy(element)); // TODO: are any chains not using `SCRIPT_VERIFY_MINIMALIF` ?
    return state;
};
exports.opNotIf = () => {
    const not = arithmetic_1.opNot();
    const ifOp = exports.opIf();
    return (state) => ifOp(not(state));
};
exports.opEndIf = () => (state) => {
    const element = state.executionStack.pop();
    // tslint:disable-next-line:no-if-statement
    if (element === undefined) {
        return common_1.applyError(common_1.CommonAuthenticationError.unexpectedEndIf, state);
    }
    return state;
};
exports.opElse = () => (state) => {
    const top = state.executionStack[state.executionStack.length - 1];
    // tslint:disable-next-line:no-if-statement
    if (top === undefined) {
        return common_1.applyError(common_1.CommonAuthenticationError.unexpectedElse, state);
    }
    // tslint:disable-next-line:no-object-mutation no-expression-statement
    state.executionStack[state.executionStack.length - 1] = !top;
    return state;
};
exports.unconditionalFlowControlOperations = () => ({
    [opcodes_1.CommonOpcodes.OP_IF]: exports.opIf(),
    [opcodes_1.CommonOpcodes.OP_NOTIF]: exports.opNotIf(),
    [opcodes_1.CommonOpcodes.OP_ELSE]: exports.opElse(),
    [opcodes_1.CommonOpcodes.OP_ENDIF]: exports.opEndIf()
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvdy1jb250cm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvY29tbW9uL2Zsb3ctY29udHJvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQTBCLENBQUMseUJBQXlCOztBQUlwRCw2Q0FBcUM7QUFDckMscUNBTWtCO0FBQ2xCLHVDQUEwQztBQUU3QixRQUFBLFFBQVEsR0FBRyxHQUdGLEVBQUUsQ0FBQyxDQUFDLEtBQVksRUFBRSxFQUFFO0lBQ3hDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbEMsMkNBQTJDO0lBQzNDLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLG1CQUFVLENBQ2Ysa0NBQXlCLENBQUMsVUFBVSxFQUNwQyxLQUFLLENBQ04sQ0FBQztLQUNIO0lBQ0QsT0FBTyw2QkFBb0IsQ0FBQyxPQUFPLENBQUM7UUFDbEMsQ0FBQyxDQUFDLEtBQUs7UUFDUCxDQUFDLENBQUMsbUJBQVUsQ0FBZ0Isa0NBQXlCLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9FLENBQUMsQ0FBQztBQUVXLFFBQUEsZ0NBQWdDLEdBQUcsR0FJNUMsRUFBRSxDQUFDLENBQUM7SUFDTixDQUFDLHVCQUFhLENBQUMsU0FBUyxDQUFDLEVBQUUsZ0JBQVEsRUFBaUI7Q0FDckQsQ0FBQyxDQUFDO0FBRVUsUUFBQSxJQUFJLEdBQUcsR0FHRSxFQUFFLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRTtJQUN4QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLDJDQUEyQztJQUMzQyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osT0FBTyxtQkFBVSxDQUNmLGtDQUF5QixDQUFDLFVBQVUsRUFDcEMsS0FBSyxDQUNOLENBQUM7S0FDSDtJQUNELG1EQUFtRDtJQUNuRCxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyw2QkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsNkRBQTZEO0lBQ3ZILE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRVcsUUFBQSxPQUFPLEdBQUcsR0FHRCxFQUFFO0lBQ3RCLE1BQU0sR0FBRyxHQUFHLGtCQUFLLEVBQWlCLENBQUM7SUFDbkMsTUFBTSxJQUFJLEdBQUcsWUFBSSxFQUFpQixDQUFDO0lBQ25DLE9BQU8sQ0FBQyxLQUFZLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUM7QUFFVyxRQUFBLE9BQU8sR0FBRyxHQUdELEVBQUUsQ0FBQyxDQUFDLEtBQVksRUFBRSxFQUFFO0lBQ3hDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDM0MsMkNBQTJDO0lBQzNDLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtRQUN6QixPQUFPLG1CQUFVLENBQ2Ysa0NBQXlCLENBQUMsZUFBZSxFQUN6QyxLQUFLLENBQ04sQ0FBQztLQUNIO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFVyxRQUFBLE1BQU0sR0FBRyxHQUdBLEVBQUUsQ0FBQyxDQUFDLEtBQVksRUFBRSxFQUFFO0lBQ3hDLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUVuRCxDQUFDO0lBQ2QsMkNBQTJDO0lBQzNDLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUNyQixPQUFPLG1CQUFVLENBQ2Ysa0NBQXlCLENBQUMsY0FBYyxFQUN4QyxLQUFLLENBQ04sQ0FBQztLQUNIO0lBQ0Qsc0VBQXNFO0lBQ3RFLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDN0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFVyxRQUFBLGtDQUFrQyxHQUFHLEdBSTlDLEVBQUUsQ0FBQyxDQUFDO0lBQ04sQ0FBQyx1QkFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLFlBQUksRUFBaUI7SUFDNUMsQ0FBQyx1QkFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQU8sRUFBaUI7SUFDbEQsQ0FBQyx1QkFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLGNBQU0sRUFBaUI7SUFDaEQsQ0FBQyx1QkFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQU8sRUFBaUI7Q0FDbkQsQ0FBQyxDQUFDIn0=