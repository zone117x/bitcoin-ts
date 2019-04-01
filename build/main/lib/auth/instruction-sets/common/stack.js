"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const combinators_1 = require("./combinators");
const common_1 = require("./common");
const opcodes_1 = require("./opcodes");
// TODO: unit test:
// empty stack
// element is clone (mutations to one element don't affect the other)
// duplicates
exports.opDup = () => (state) => {
    // tslint:disable-next-line:no-if-statement
    if (state.stack.length === 0) {
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    const element = state.stack[state.stack.length - 1];
    const clone = element.slice();
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(clone);
    return state;
};
exports.opDrop = () => (state) => combinators_1.useOneStackItem(state, (nextState, _) => nextState);
exports.stackOperations = () => ({
    [opcodes_1.CommonOpcodes.OP_DUP]: exports.opDup(),
    [opcodes_1.CommonOpcodes.OP_DROP]: exports.opDrop()
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9jb21tb24vc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUEwQixDQUFDLHlCQUF5Qjs7QUFFcEQsK0NBQWdEO0FBQ2hELHFDQUtrQjtBQUNsQix1Q0FBMEM7QUFFMUMsbUJBQW1CO0FBQ25CLGNBQWM7QUFDZCxxRUFBcUU7QUFDckUsYUFBYTtBQUNBLFFBQUEsS0FBSyxHQUFHLEdBR2pCLEVBQUUsQ0FBQyxDQUFDLEtBQVksRUFBRSxFQUFFO0lBQ3RCLDJDQUEyQztJQUMzQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUM1QixPQUFPLG1CQUFVLENBQ2Ysa0NBQXlCLENBQUMsVUFBVSxFQUNwQyxLQUFLLENBQ04sQ0FBQztLQUNIO0lBQ0QsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUIsbURBQW1EO0lBQ25ELEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRVcsUUFBQSxNQUFNLEdBQUcsR0FBNkIsRUFBRSxDQUFDLENBQUMsS0FBWSxFQUFFLEVBQUUsQ0FDckUsNkJBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUV6QyxRQUFBLGVBQWUsR0FBRyxHQUczQixFQUFFLENBQUMsQ0FBQztJQUNOLENBQUMsdUJBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxhQUFLLEVBQWlCO0lBQzlDLENBQUMsdUJBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxjQUFNLEVBQVM7Q0FDekMsQ0FBQyxDQUFDIn0=