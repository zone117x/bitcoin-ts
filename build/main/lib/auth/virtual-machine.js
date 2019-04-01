"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
/**
 * Create an AuthenticationVirtualMachine to evaluate authentication programs
 * constructed from operations in the `instructionSet`.
 * @param instructionSet an `InstructionSet`
 */
exports.createAuthenticationVirtualMachine = (instructionSet) => {
    const availableOpcodes = 256;
    const operators = utils_1.range(availableOpcodes).map(codepoint => 
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1tYWNoaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL3ZpcnR1YWwtbWFjaGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQTBCLENBQUMseUJBQXlCOztBQUVwRCwwQ0FBdUM7QUE0RnZDOzs7O0dBSUc7QUFDVSxRQUFBLGtDQUFrQyxHQUFHLENBR2hELGNBQTRDLEVBQ0EsRUFBRTtJQUM5QyxNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztJQUM3QixNQUFNLFNBQVMsR0FBRyxhQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7SUFDeEQsbURBQW1EO0lBQ25ELGNBQWMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssU0FBUztRQUNoRCxDQUFDLENBQUMsY0FBYyxDQUFDLFNBQVM7UUFDMUIsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQ3pDLENBQUM7SUFFRixNQUFNLFlBQVksR0FBRyxDQUFDLEtBQW1CLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTNFLE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBbUIsRUFBRSxFQUFFO1FBQ3BDLHNFQUFzRTtRQUN0RSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDWCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHLENBQUMsS0FBbUIsRUFBRSxFQUFFLENBQzNDLFNBQVMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFeEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFtQixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFOUU7OztPQUdHO0lBQ0gsTUFBTSxhQUFhLEdBQUcsQ0FDcEIsS0FBbUIsRUFDbkIsWUFBbUQsRUFDbkQsRUFBRTtRQUNGLE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQyw2RUFBNkU7WUFDN0UsS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQyxDQUFDO0lBRUYsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFtQixFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRW5FLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBbUIsRUFBRSxFQUFFLENBQ3ZDLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFMUMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFtQixFQUFFLEVBQUU7UUFDeEMsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQztJQUVGLE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBbUIsRUFBRSxFQUFFO1FBQ3BDLDhEQUE4RDtRQUM5RCxJQUFJLEtBQUssR0FBbUIsRUFBRSxDQUFDO1FBQy9CLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxZQUEwQixFQUFFLEVBQUU7WUFDbEQsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFDLG1EQUFtRDtZQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLENBQUM7SUFFRixNQUFNLElBQUksR0FBRyxDQUFDLEtBQW1CLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUUvRCxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUM7QUFDL0MsQ0FBQyxDQUFDIn0=