"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
exports.incrementOperationCount = (operation) => (state) => {
    const nextState = operation(state);
    // tslint:disable-next-line:no-object-mutation no-expression-statement
    nextState.operationCount++;
    return nextState;
};
exports.conditionallyEvaluate = (operation) => (state) => state.executionStack.every(item => item) ? operation(state) : state;
/**
 * Map a function over each operation in an `InstructionSet.operations` object,
 * assigning the result to the same `opcode` in the resulting object.
 * @param operations an operations map from an `InstructionSet`
 * @param combinator a function to apply to each operation
 */
exports.mapOverOperations = (operations, combinator) => Object.keys(operations).reduce((result, operation) => (Object.assign({}, result, { [operation]: combinator(operations[parseInt(operation, 10)]) })), {});
exports.useTwoScriptNumbers = (state, operation) => {
    const topItem = state.stack.pop();
    const secondItem = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!topItem || !secondItem) {
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    const firstValue = common_1.parseBytesAsScriptNumber(secondItem);
    const secondValue = common_1.parseBytesAsScriptNumber(topItem);
    // tslint:disable-next-line:no-if-statement
    if (common_1.isScriptNumberError(firstValue) || common_1.isScriptNumberError(secondValue)) {
        return common_1.applyError(common_1.CommonAuthenticationError.invalidNaturalNumber, state);
    }
    return operation(state, firstValue, secondValue);
};
/**
 * Pop one stack item off of `state.stack` and provide that item to `operation`.
 */
exports.useOneStackItem = (state, operation) => {
    const item = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!item) {
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    return operation(state, item);
};
/**
 * Return the provided state with the provided value pushed to its stack.
 * @param state the state to update and return
 * @param data the value to push to the stack
 */
exports.pushToStack = (state, data) => {
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(data);
    return state;
};
exports.combineOperations = (firstOperation, secondOperation) => (state) => secondOperation(firstOperation(state));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9jb21tb24vY29tYmluYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUEwQixDQUFDLHlCQUF5Qjs7QUFJcEQscUNBS2tCO0FBRUwsUUFBQSx1QkFBdUIsR0FBRyxDQUlyQyxTQUFrQyxFQUNULEVBQUUsQ0FBQyxDQUFDLEtBQW1CLEVBQUUsRUFBRTtJQUNwRCxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsc0VBQXNFO0lBQ3RFLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQixPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDLENBQUM7QUFFVyxRQUFBLHFCQUFxQixHQUFHLENBSW5DLFNBQWtDLEVBQ1QsRUFBRSxDQUFDLENBQUMsS0FBbUIsRUFBRSxFQUFFLENBQ3BELEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBRXRFOzs7OztHQUtHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBRyxDQUMvQixVQUFzRCxFQUN0RCxVQUEyRSxFQUMzRSxFQUFFLENBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBRzVCLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsbUJBQ2xCLE1BQU0sSUFDVCxDQUFDLFNBQVMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQzVELEVBQ0YsRUFBRSxDQUNILENBQUM7QUFFUyxRQUFBLG1CQUFtQixHQUFHLENBSWpDLEtBQVksRUFDWixTQUlVLEVBQ1YsRUFBRTtJQUNGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbEMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNyQywyQ0FBMkM7SUFDM0MsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUMzQixPQUFPLG1CQUFVLENBQ2Ysa0NBQXlCLENBQUMsVUFBVSxFQUNwQyxLQUFLLENBQ04sQ0FBQztLQUNIO0lBQ0QsTUFBTSxVQUFVLEdBQUcsaUNBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEQsTUFBTSxXQUFXLEdBQUcsaUNBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFdEQsMkNBQTJDO0lBQzNDLElBQUksNEJBQW1CLENBQUMsVUFBVSxDQUFDLElBQUksNEJBQW1CLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDdkUsT0FBTyxtQkFBVSxDQUNmLGtDQUF5QixDQUFDLG9CQUFvQixFQUM5QyxLQUFLLENBQ04sQ0FBQztLQUNIO0lBQ0QsT0FBTyxTQUFTLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNuRCxDQUFDLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsZUFBZSxHQUFHLENBSTdCLEtBQVksRUFDWixTQUF5RCxFQUN6RCxFQUFFO0lBQ0YsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMvQiwyQ0FBMkM7SUFDM0MsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNULE9BQU8sbUJBQVUsQ0FDZixrQ0FBeUIsQ0FBQyxVQUFVLEVBQ3BDLEtBQUssQ0FDTixDQUFDO0tBQ0g7SUFDRCxPQUFPLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNVLFFBQUEsV0FBVyxHQUFHLENBQ3pCLEtBQVksRUFDWixJQUFnQixFQUNoQixFQUFFO0lBQ0YsbURBQW1EO0lBQ25ELEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRVcsUUFBQSxpQkFBaUIsR0FBRyxDQUMvQixjQUFnQyxFQUNoQyxlQUFpQyxFQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyJ9