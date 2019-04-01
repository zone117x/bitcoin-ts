/* istanbul ignore file */ // TODO: stabilize & test
import { useOneStackItem } from './combinators';
import { applyError, CommonAuthenticationError } from './common';
import { CommonOpcodes } from './opcodes';
// TODO: unit test:
// empty stack
// element is clone (mutations to one element don't affect the other)
// duplicates
export const opDup = () => (state) => {
    // tslint:disable-next-line:no-if-statement
    if (state.stack.length === 0) {
        return applyError(CommonAuthenticationError.emptyStack, state);
    }
    const element = state.stack[state.stack.length - 1];
    const clone = element.slice();
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(clone);
    return state;
};
export const opDrop = () => (state) => useOneStackItem(state, (nextState, _) => nextState);
export const stackOperations = () => ({
    [CommonOpcodes.OP_DUP]: opDup(),
    [CommonOpcodes.OP_DROP]: opDrop()
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9jb21tb24vc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEJBQTBCLENBQUMseUJBQXlCO0FBRXBELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEQsT0FBTyxFQUNMLFVBQVUsRUFDVix5QkFBeUIsRUFHMUIsTUFBTSxVQUFVLENBQUM7QUFDbEIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUUxQyxtQkFBbUI7QUFDbkIsY0FBYztBQUNkLHFFQUFxRTtBQUNyRSxhQUFhO0FBQ2IsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEdBR2pCLEVBQUUsQ0FBQyxDQUFDLEtBQVksRUFBRSxFQUFFO0lBQ3RCLDJDQUEyQztJQUMzQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUM1QixPQUFPLFVBQVUsQ0FDZix5QkFBeUIsQ0FBQyxVQUFVLEVBQ3BDLEtBQUssQ0FDTixDQUFDO0tBQ0g7SUFDRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QixtREFBbUQ7SUFDbkQsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsR0FBNkIsRUFBRSxDQUFDLENBQUMsS0FBWSxFQUFFLEVBQUUsQ0FDckUsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRXRELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxHQUczQixFQUFFLENBQUMsQ0FBQztJQUNOLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBaUI7SUFDOUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFTO0NBQ3pDLENBQUMsQ0FBQyJ9