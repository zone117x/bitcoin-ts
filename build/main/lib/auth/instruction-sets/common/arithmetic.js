"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const combinators_1 = require("./combinators");
const common_1 = require("./common");
const opcodes_1 = require("./opcodes");
const types_1 = require("./types");
exports.opNot = () => (state) => {
    const element = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (!element) {
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    const value = types_1.parseBytesAsScriptNumber(element);
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(value === BigInt(0)
        ? types_1.bigIntToScriptNumber(BigInt(1))
        : types_1.bigIntToScriptNumber(BigInt(0)));
    return state;
};
exports.opAdd = () => (state) => combinators_1.useTwoScriptNumbers(state, (nextState, firstValue, secondValue) => 
// tslint:disable-next-line: restrict-plus-operands
combinators_1.pushToStack(nextState, types_1.bigIntToScriptNumber(firstValue + secondValue)));
exports.opSub = () => (state) => combinators_1.useTwoScriptNumbers(state, (nextState, firstValue, secondValue) => combinators_1.pushToStack(nextState, types_1.bigIntToScriptNumber(firstValue - secondValue)));
exports.opBoolAnd = () => (state) => combinators_1.useTwoScriptNumbers(state, (nextState, firstValue, secondValue) => combinators_1.pushToStack(nextState, types_1.booleanToScriptNumber(firstValue !== BigInt(0) && secondValue !== BigInt(0))));
exports.opBoolOr = () => (state) => combinators_1.useTwoScriptNumbers(state, (nextState, firstValue, secondValue) => combinators_1.pushToStack(nextState, types_1.booleanToScriptNumber(firstValue !== BigInt(0) || secondValue !== BigInt(0))));
exports.opNumEqual = () => (state) => combinators_1.useTwoScriptNumbers(state, (nextState, firstValue, secondValue) => combinators_1.pushToStack(nextState, types_1.booleanToScriptNumber(firstValue === secondValue)));
exports.opNumNotEqual = () => (state) => combinators_1.useTwoScriptNumbers(state, (nextState, firstValue, secondValue) => combinators_1.pushToStack(nextState, types_1.booleanToScriptNumber(firstValue !== secondValue)));
exports.opLessThan = () => (state) => combinators_1.useTwoScriptNumbers(state, (nextState, firstValue, secondValue) => combinators_1.pushToStack(nextState, types_1.booleanToScriptNumber(firstValue < secondValue)));
exports.opLessThanOrEqual = () => (state) => combinators_1.useTwoScriptNumbers(state, (nextState, firstValue, secondValue) => combinators_1.pushToStack(nextState, types_1.booleanToScriptNumber(firstValue <= secondValue)));
exports.opGreaterThan = () => (state) => combinators_1.useTwoScriptNumbers(state, (nextState, firstValue, secondValue) => combinators_1.pushToStack(nextState, types_1.booleanToScriptNumber(firstValue > secondValue)));
exports.opGreaterThanOrEqual = () => (state) => combinators_1.useTwoScriptNumbers(state, (nextState, firstValue, secondValue) => combinators_1.pushToStack(nextState, types_1.booleanToScriptNumber(firstValue >= secondValue)));
exports.arithmeticOperations = () => ({
    [opcodes_1.CommonOpcodes.OP_NOT]: exports.opNot(),
    [opcodes_1.CommonOpcodes.OP_ADD]: exports.opAdd(),
    [opcodes_1.CommonOpcodes.OP_SUB]: exports.opSub(),
    [opcodes_1.CommonOpcodes.OP_BOOLAND]: exports.opBoolAnd(),
    [opcodes_1.CommonOpcodes.OP_BOOLOR]: exports.opBoolOr(),
    [opcodes_1.CommonOpcodes.OP_NUMEQUAL]: exports.opNumEqual(),
    [opcodes_1.CommonOpcodes.OP_NUMNOTEQUAL]: exports.opNumNotEqual(),
    [opcodes_1.CommonOpcodes.OP_LESSTHAN]: exports.opLessThan(),
    [opcodes_1.CommonOpcodes.OP_LESSTHANOREQUAL]: exports.opLessThanOrEqual(),
    [opcodes_1.CommonOpcodes.OP_GREATERTHAN]: exports.opGreaterThan(),
    [opcodes_1.CommonOpcodes.OP_GREATERTHANOREQUAL]: exports.opGreaterThanOrEqual()
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJpdGhtZXRpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYXV0aC9pbnN0cnVjdGlvbi1zZXRzL2NvbW1vbi9hcml0aG1ldGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7O0FBR3BELCtDQUFpRTtBQUNqRSxxQ0FBNkU7QUFDN0UsdUNBQTBDO0FBQzFDLG1DQUlpQjtBQUVKLFFBQUEsS0FBSyxHQUFHLEdBR2pCLEVBQUUsQ0FBQyxDQUFDLEtBQVksRUFBRSxFQUFFO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbEMsMkNBQTJDO0lBQzNDLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLG1CQUFVLENBQ2Ysa0NBQXlCLENBQUMsVUFBVSxFQUNwQyxLQUFLLENBQ04sQ0FBQztLQUNIO0lBQ0QsTUFBTSxLQUFLLEdBQUcsZ0NBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEQsbURBQW1EO0lBQ25ELEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUNkLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyw0QkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLDRCQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNwQyxDQUFDO0lBQ0YsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFVyxRQUFBLEtBQUssR0FBRyxHQUdqQixFQUFFLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRSxDQUN0QixpQ0FBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxFQUFFO0FBQ2hFLG1EQUFtRDtBQUNuRCx5QkFBVyxDQUFDLFNBQVMsRUFBRSw0QkFBb0Is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