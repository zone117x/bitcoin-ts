/* istanbul ignore file */ // TODO: stabilize & test
import { applyError, CommonAuthenticationError, isScriptNumberError, parseBytesAsScriptNumber } from './common';
export const incrementOperationCount = (operation) => (state) => {
    const nextState = operation(state);
    // tslint:disable-next-line:no-object-mutation no-expression-statement
    nextState.operationCount++;
    return nextState;
};
export const conditionallyEvaluate = (operation) => (state) => state.executionStack.every(item => item) ? operation(state) : state;
/**
 * Map a function over each operation in an `InstructionSet.operations` object,
 * assigning the result to the same `opcode` in the resulting object.
 * @param operations an operations map from an `InstructionSet`
 * @param combinator a function to apply to each operation
 */
export const mapOverOperations = (operations, combinator) => Object.keys(operations).reduce((result, operation) => ({
    ...result,
    [operation]: combinator(operations[parseInt(operation, 10)])
}), {});
export const useTwoScriptNumbers = (state, operation) => {
    const topItem = state.stack.pop();
    const secondItem = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!topItem || !secondItem) {
        return applyError(CommonAuthenticationError.emptyStack, state);
    }
    const firstValue = parseBytesAsScriptNumber(secondItem);
    const secondValue = parseBytesAsScriptNumber(topItem);
    // tslint:disable-next-line:no-if-statement
    if (isScriptNumberError(firstValue) || isScriptNumberError(secondValue)) {
        return applyError(CommonAuthenticationError.invalidNaturalNumber, state);
    }
    return operation(state, firstValue, secondValue);
};
/**
 * Pop one stack item off of `state.stack` and provide that item to `operation`.
 */
export const useOneStackItem = (state, operation) => {
    const item = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!item) {
        return applyError(CommonAuthenticationError.emptyStack, state);
    }
    return operation(state, item);
};
/**
 * Return the provided state with the provided value pushed to its stack.
 * @param state the state to update and return
 * @param data the value to push to the stack
 */
export const pushToStack = (state, data) => {
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(data);
    return state;
};
export const combineOperations = (firstOperation, secondOperation) => (state) => secondOperation(firstOperation(state));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9jb21tb24vY29tYmluYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEJBQTBCLENBQUMseUJBQXlCO0FBSXBELE9BQU8sRUFDTCxVQUFVLEVBQ1YseUJBQXlCLEVBQ3pCLG1CQUFtQixFQUNuQix3QkFBd0IsRUFDekIsTUFBTSxVQUFVLENBQUM7QUFFbEIsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsQ0FJckMsU0FBa0MsRUFDVCxFQUFFLENBQUMsQ0FBQyxLQUFtQixFQUFFLEVBQUU7SUFDcEQsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLHNFQUFzRTtJQUN0RSxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsQ0FJbkMsU0FBa0MsRUFDVCxFQUFFLENBQUMsQ0FBQyxLQUFtQixFQUFFLEVBQUUsQ0FDcEQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFFdEU7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxDQUMvQixVQUFzRCxFQUN0RCxVQUEyRSxFQUMzRSxFQUFFLENBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBRzVCLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0QixHQUFHLE1BQU07SUFDVCxDQUFDLFNBQVMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0NBQzdELENBQUMsRUFDRixFQUFFLENBQ0gsQ0FBQztBQUVKLE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLENBSWpDLEtBQVksRUFDWixTQUlVLEVBQ1YsRUFBRTtJQUNGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbEMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNyQywyQ0FBMkM7SUFDM0MsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUMzQixPQUFPLFVBQVUsQ0FDZix5QkFBeUIsQ0FBQyxVQUFVLEVBQ3BDLEtBQUssQ0FDTixDQUFDO0tBQ0g7SUFDRCxNQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4RCxNQUFNLFdBQVcsR0FBRyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV0RCwyQ0FBMkM7SUFDM0MsSUFBSSxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsRUFBRTtRQUN2RSxPQUFPLFVBQVUsQ0FDZix5QkFBeUIsQ0FBQyxvQkFBb0IsRUFDOUMsS0FBSyxDQUNOLENBQUM7S0FDSDtJQUNELE9BQU8sU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDbkQsQ0FBQyxDQUFDO0FBRUY7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsQ0FJN0IsS0FBWSxFQUNaLFNBQXlELEVBQ3pELEVBQUU7SUFDRixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQy9CLDJDQUEyQztJQUMzQyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1QsT0FBTyxVQUFVLENBQ2YseUJBQXlCLENBQUMsVUFBVSxFQUNwQyxLQUFLLENBQ04sQ0FBQztLQUNIO0lBQ0QsT0FBTyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hDLENBQUMsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FDekIsS0FBWSxFQUNaLElBQWdCLEVBQ2hCLEVBQUU7SUFDRixtREFBbUQ7SUFDbkQsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxDQUMvQixjQUFnQyxFQUNoQyxlQUFpQyxFQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyJ9