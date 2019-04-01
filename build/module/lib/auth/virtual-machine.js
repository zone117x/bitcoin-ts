/* istanbul ignore file */ // TODO: stabilize & test
import { range } from '../utils/utils';
/**
 * Create an AuthenticationVirtualMachine to evaluate authentication programs
 * constructed from operations in the `instructionSet`.
 * @param instructionSet an `InstructionSet`
 */
export const createAuthenticationVirtualMachine = (instructionSet) => {
    const availableOpcodes = 256;
    const operators = range(availableOpcodes).map(codepoint => 
    // tslint:disable-next-line: strict-type-predicates
    instructionSet.operations[codepoint] === undefined
        ? instructionSet.undefined
        : instructionSet.operations[codepoint]);
    const getCodepoint = (state) => state.instructions[state.ip];
    const after = (state) => {
        // tslint:disable-next-line:no-object-mutation no-expression-statement
        state.ip++;
        return state;
    };
    const getOperation = (state) => operators[getCodepoint(state).opcode];
    const stepMutate = (state) => after(getOperation(state)(state));
    /**
     * When we get real tail call optimization, this can be replaced
     * with recursion.
     */
    const untilComplete = (state, stepFunction) => {
        while (instructionSet.continue(state)) {
            // tslint:disable-next-line:no-parameter-reassignment no-expression-statement
            state = stepFunction(state);
        }
        return state;
    };
    const clone = (state) => instructionSet.clone(state);
    const evaluate = (state) => untilComplete(clone(state), stepMutate);
    const stepDebug = (state) => {
        const operator = getOperation(state);
        return after(operator(clone(state)));
    };
    const debug = (state) => {
        // tslint:disable-next-line:prefer-const no-let readonly-array
        let trace = [];
        untilComplete(state, (currentState) => {
            const nextState = stepDebug(currentState);
            // tslint:disable-next-line:no-expression-statement
            trace.push(nextState);
            return nextState;
        });
        return trace;
    };
    const step = (state) => stepMutate(clone(state));
    return { debug, evaluate, step, stepMutate };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1tYWNoaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL3ZpcnR1YWwtbWFjaGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7QUFFcEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBNEZ2Qzs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sa0NBQWtDLEdBQUcsQ0FHaEQsY0FBNEMsRUFDQSxFQUFFO0lBQzlDLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0lBQzdCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtJQUN4RCxtREFBbUQ7SUFDbkQsY0FBYyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTO1FBQ2hELENBQUMsQ0FBQyxjQUFjLENBQUMsU0FBUztRQUMxQixDQUFDLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FDekMsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHLENBQUMsS0FBbUIsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFM0UsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFtQixFQUFFLEVBQUU7UUFDcEMsc0VBQXNFO1FBQ3RFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNYLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQyxDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxLQUFtQixFQUFFLEVBQUUsQ0FDM0MsU0FBUyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV4QyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQW1CLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUU5RTs7O09BR0c7SUFDSCxNQUFNLGFBQWEsR0FBRyxDQUNwQixLQUFtQixFQUNuQixZQUFtRCxFQUNuRCxFQUFFO1FBQ0YsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JDLDZFQUE2RTtZQUM3RSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLENBQUM7SUFFRixNQUFNLEtBQUssR0FBRyxDQUFDLEtBQW1CLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFbkUsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFtQixFQUFFLEVBQUUsQ0FDdkMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUUxQyxNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQW1CLEVBQUUsRUFBRTtRQUN4QyxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDO0lBRUYsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFtQixFQUFFLEVBQUU7UUFDcEMsOERBQThEO1FBQzlELElBQUksS0FBSyxHQUFtQixFQUFFLENBQUM7UUFDL0IsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLFlBQTBCLEVBQUUsRUFBRTtZQUNsRCxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDMUMsbURBQW1EO1lBQ25ELEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEIsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBbUIsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRS9ELE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQztBQUMvQyxDQUFDLENBQUMifQ==