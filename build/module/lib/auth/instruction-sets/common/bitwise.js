/* istanbul ignore file */ // TODO: stabilize & test
import { combineOperations } from './combinators';
import { applyError, CommonAuthenticationError } from './common';
import { opVerify } from './flow-control';
import { CommonOpcodes } from './opcodes';
import { booleanToScriptNumber } from './types';
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
export const opEqual = () => (state) => {
    const element1 = state.stack.pop();
    const element2 = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!element1 || !element2) {
        return applyError(CommonAuthenticationError.emptyStack, state);
    }
    const result = booleanToScriptNumber(areEqual(element1, element2));
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(result);
    return state;
};
export const opEqualVerify = () => combineOperations(opEqual(), opVerify());
export const bitwiseOperations = () => ({
    [CommonOpcodes.OP_EQUAL]: opEqual(),
    [CommonOpcodes.OP_EQUALVERIFY]: opEqualVerify()
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0d2lzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYXV0aC9pbnN0cnVjdGlvbi1zZXRzL2NvbW1vbi9iaXR3aXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBCQUEwQixDQUFDLHlCQUF5QjtBQUlwRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSx5QkFBeUIsRUFBYyxNQUFNLFVBQVUsQ0FBQztBQUM3RSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUMxQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFaEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFhLEVBQUUsQ0FBYSxFQUFFLEVBQUU7SUFDaEQsMkNBQTJDO0lBQzNDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO1FBQ3pCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxrQ0FBa0M7SUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNqQixPQUFPLEtBQUssQ0FBQztTQUNkO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxHQUdELEVBQUUsQ0FBQyxDQUFDLEtBQVksRUFBRSxFQUFFO0lBQ3hDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbkMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNuQywyQ0FBMkM7SUFDM0MsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUMxQixPQUFPLFVBQVUsQ0FDZix5QkFBeUIsQ0FBQyxVQUFVLEVBQ3BDLEtBQUssQ0FDTixDQUFDO0tBQ0g7SUFDRCxNQUFNLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDbkUsbURBQW1EO0lBQ25ELEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pCLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLEdBR1AsRUFBRSxDQUN0QixpQkFBaUIsQ0FBQyxPQUFPLEVBQWlCLEVBQUUsUUFBUSxFQUFpQixDQUFDLENBQUM7QUFFekUsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsR0FJN0IsRUFBRSxDQUFDLENBQUM7SUFDTixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQWlCO0lBQ2xELENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLGFBQWEsRUFBaUI7Q0FDL0QsQ0FBQyxDQUFDIn0=