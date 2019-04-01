"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement
const ava_1 = __importDefault(require("ava"));
const orderedSpread = (first, second) => 
// https://github.com/Microsoft/TypeScript/issues/10727
(Object.assign({}, first, second
// tslint:disable-next-line:no-any
));
// export const testOperator = <ProgramState>(
//   operator: Operation<ProgramState>,
//   testName: string,
//   expectedAsm: string,
//   expectedDescription: string,
//   expectation: Expectation<ProgramState>,
//   clone: (state: ProgramState) => ProgramState
// ) => {
//   test(`${testName}`, t => {
//     const beforeState = expectation[0];
//     const afterState = orderedSpread(beforeState, expectation[1]);
//     t.deepEqual(
//       typeof operator.asm === 'function'
//         ? operator.asm(clone(beforeState))
//         : operator.asm,
//       expectedAsm
//     );
//     t.deepEqual(
//       typeof operator.description === 'function'
//         ? operator.description(clone(beforeState))
//         : operator.description,
//       expectedDescription
//     );
//     t.deepEqual(operator.operation(beforeState), afterState);
//   });
// };
exports.testVMOperation = (name, getVm, steps) => {
    const vm = getVm();
    steps.map((set, index) => {
        ava_1.default(`${name}: test ${index + 1}`, t => {
            const before = set[0];
            const after = orderedSpread(before, set[1]);
            t.deepEqual(vm.evaluate(before), after);
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb24tc2V0cy5zcGVjLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYXV0aC9pbnN0cnVjdGlvbi1zZXRzL2luc3RydWN0aW9uLXNldHMuc3BlYy5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5Q0FBeUM7QUFDekMsOENBQXVCO0FBTXZCLE1BQU0sYUFBYSxHQUFHLENBQ3BCLEtBQW1CLEVBQ25CLE1BQTZCLEVBQzdCLEVBQUU7QUFDRix1REFBdUQ7QUFDdkQsQ0FBRSxrQkFDSSxLQUFZLEVBQ1osTUFBYTtBQUNqQixrQ0FBa0M7Q0FDVixDQUFBLENBQUM7QUFFN0IsOENBQThDO0FBQzlDLHVDQUF1QztBQUN2QyxzQkFBc0I7QUFDdEIseUJBQXlCO0FBQ3pCLGlDQUFpQztBQUNqQyw0Q0FBNEM7QUFDNUMsaURBQWlEO0FBQ2pELFNBQVM7QUFDVCwrQkFBK0I7QUFDL0IsMENBQTBDO0FBQzFDLHFFQUFxRTtBQUNyRSxtQkFBbUI7QUFDbkIsMkNBQTJDO0FBQzNDLDZDQUE2QztBQUM3QywwQkFBMEI7QUFDMUIsb0JBQW9CO0FBQ3BCLFNBQVM7QUFDVCxtQkFBbUI7QUFDbkIsbURBQW1EO0FBQ25ELHFEQUFxRDtBQUNyRCxrQ0FBa0M7QUFDbEMsNEJBQTRCO0FBQzVCLFNBQVM7QUFDVCxnRUFBZ0U7QUFDaEUsUUFBUTtBQUNSLEtBQUs7QUFFUSxRQUFBLGVBQWUsR0FBRyxDQUM3QixJQUFZLEVBQ1osS0FBdUQsRUFDdkQsS0FBK0MsRUFDL0MsRUFBRTtJQUNGLE1BQU0sRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDO0lBQ25CLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDdkIsYUFBSSxDQUFDLEdBQUcsSUFBSSxVQUFVLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtZQUNyQyxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyJ9