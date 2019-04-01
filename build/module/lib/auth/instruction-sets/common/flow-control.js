/* istanbul ignore file */ // TODO: stabilize & test
import { opNot } from './arithmetic';
import { applyError, CommonAuthenticationError, stackElementIsTruthy } from './common';
import { CommonOpcodes } from './opcodes';
export const opVerify = () => (state) => {
    const element = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!element) {
        return applyError(CommonAuthenticationError.emptyStack, state);
    }
    return stackElementIsTruthy(element)
        ? state
        : applyError(CommonAuthenticationError.failedVerify, state);
};
export const conditionalFlowControlOperations = () => ({
    [CommonOpcodes.OP_VERIFY]: opVerify()
});
export const opIf = () => (state) => {
    const element = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!element) {
        return applyError(CommonAuthenticationError.emptyStack, state);
    }
    // tslint:disable-next-line:no-expression-statement
    state.executionStack.push(stackElementIsTruthy(element)); // TODO: are any chains not using `SCRIPT_VERIFY_MINIMALIF` ?
    return state;
};
export const opNotIf = () => {
    const not = opNot();
    const ifOp = opIf();
    return (state) => ifOp(not(state));
};
export const opEndIf = () => (state) => {
    const element = state.executionStack.pop();
    // tslint:disable-next-line:no-if-statement
    if (element === undefined) {
        return applyError(CommonAuthenticationError.unexpectedEndIf, state);
    }
    return state;
};
export const opElse = () => (state) => {
    const top = state.executionStack[state.executionStack.length - 1];
    // tslint:disable-next-line:no-if-statement
    if (top === undefined) {
        return applyError(CommonAuthenticationError.unexpectedElse, state);
    }
    // tslint:disable-next-line:no-object-mutation no-expression-statement
    state.executionStack[state.executionStack.length - 1] = !top;
    return state;
};
export const unconditionalFlowControlOperations = () => ({
    [CommonOpcodes.OP_IF]: opIf(),
    [CommonOpcodes.OP_NOTIF]: opNotIf(),
    [CommonOpcodes.OP_ELSE]: opElse(),
    [CommonOpcodes.OP_ENDIF]: opEndIf()
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvdy1jb250cm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvY29tbW9uL2Zsb3ctY29udHJvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7QUFJcEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNyQyxPQUFPLEVBQ0wsVUFBVSxFQUNWLHlCQUF5QixFQUd6QixvQkFBb0IsRUFDckIsTUFBTSxVQUFVLENBQUM7QUFDbEIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUUxQyxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsR0FHRixFQUFFLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRTtJQUN4QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2xDLDJDQUEyQztJQUMzQyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osT0FBTyxVQUFVLENBQ2YseUJBQXlCLENBQUMsVUFBVSxFQUNwQyxLQUFLLENBQ04sQ0FBQztLQUNIO0lBQ0QsT0FBTyxvQkFBb0IsQ0FBQyxPQUFPLENBQUM7UUFDbEMsQ0FBQyxDQUFDLEtBQUs7UUFDUCxDQUFDLENBQUMsVUFBVSxDQUFnQix5QkFBeUIsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0UsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sZ0NBQWdDLEdBQUcsR0FJNUMsRUFBRSxDQUFDLENBQUM7SUFDTixDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQWlCO0NBQ3JELENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxHQUdFLEVBQUUsQ0FBQyxDQUFDLEtBQVksRUFBRSxFQUFFO0lBQ3hDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbEMsMkNBQTJDO0lBQzNDLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLFVBQVUsQ0FDZix5QkFBeUIsQ0FBQyxVQUFVLEVBQ3BDLEtBQUssQ0FDTixDQUFDO0tBQ0g7SUFDRCxtREFBbUQ7SUFDbkQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLDZEQUE2RDtJQUN2SCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxHQUdELEVBQUU7SUFDdEIsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFpQixDQUFDO0lBQ25DLE1BQU0sSUFBSSxHQUFHLElBQUksRUFBaUIsQ0FBQztJQUNuQyxPQUFPLENBQUMsS0FBWSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEdBR0QsRUFBRSxDQUFDLENBQUMsS0FBWSxFQUFFLEVBQUU7SUFDeEMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMzQywyQ0FBMkM7SUFDM0MsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO1FBQ3pCLE9BQU8sVUFBVSxDQUNmLHlCQUF5QixDQUFDLGVBQWUsRUFDekMsS0FBSyxDQUNOLENBQUM7S0FDSDtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLEdBR0EsRUFBRSxDQUFDLENBQUMsS0FBWSxFQUFFLEVBQUU7SUFDeEMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBRW5ELENBQUM7SUFDZCwyQ0FBMkM7SUFDM0MsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQ3JCLE9BQU8sVUFBVSxDQUNmLHlCQUF5QixDQUFDLGNBQWMsRUFDeEMsS0FBSyxDQUNOLENBQUM7S0FDSDtJQUNELHNFQUFzRTtJQUN0RSxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQzdELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sa0NBQWtDLEdBQUcsR0FJOUMsRUFBRSxDQUFDLENBQUM7SUFDTixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQWlCO0lBQzVDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBaUI7SUFDbEQsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFpQjtJQUNoRCxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQWlCO0NBQ25ELENBQUMsQ0FBQyJ9