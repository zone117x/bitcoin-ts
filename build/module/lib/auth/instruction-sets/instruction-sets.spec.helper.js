// tslint:disable:no-expression-statement
import test from 'ava';
const orderedSpread = (first, second) => 
// https://github.com/Microsoft/TypeScript/issues/10727
({
    ...first,
    ...second
    // tslint:disable-next-line:no-any
});
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
export const testVMOperation = (name, getVm, steps) => {
    const vm = getVm();
    steps.map((set, index) => {
        test(`${name}: test ${index + 1}`, t => {
            const before = set[0];
            const after = orderedSpread(before, set[1]);
            t.deepEqual(vm.evaluate(before), after);
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb24tc2V0cy5zcGVjLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYXV0aC9pbnN0cnVjdGlvbi1zZXRzL2luc3RydWN0aW9uLXNldHMuc3BlYy5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEseUNBQXlDO0FBQ3pDLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQU12QixNQUFNLGFBQWEsR0FBRyxDQUNwQixLQUFtQixFQUNuQixNQUE2QixFQUM3QixFQUFFO0FBQ0YsdURBQXVEO0FBQ3ZELENBQUU7SUFDQSxHQUFJLEtBQVk7SUFDaEIsR0FBSSxNQUFhO0lBQ2pCLGtDQUFrQztDQUNWLENBQUEsQ0FBQztBQUU3Qiw4Q0FBOEM7QUFDOUMsdUNBQXVDO0FBQ3ZDLHNCQUFzQjtBQUN0Qix5QkFBeUI7QUFDekIsaUNBQWlDO0FBQ2pDLDRDQUE0QztBQUM1QyxpREFBaUQ7QUFDakQsU0FBUztBQUNULCtCQUErQjtBQUMvQiwwQ0FBMEM7QUFDMUMscUVBQXFFO0FBQ3JFLG1CQUFtQjtBQUNuQiwyQ0FBMkM7QUFDM0MsNkNBQTZDO0FBQzdDLDBCQUEwQjtBQUMxQixvQkFBb0I7QUFDcEIsU0FBUztBQUNULG1CQUFtQjtBQUNuQixtREFBbUQ7QUFDbkQscURBQXFEO0FBQ3JELGtDQUFrQztBQUNsQyw0QkFBNEI7QUFDNUIsU0FBUztBQUNULGdFQUFnRTtBQUNoRSxRQUFRO0FBQ1IsS0FBSztBQUVMLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxDQUM3QixJQUFZLEVBQ1osS0FBdUQsRUFDdkQsS0FBK0MsRUFDL0MsRUFBRTtJQUNGLE1BQU0sRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDO0lBQ25CLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDdkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxVQUFVLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtZQUNyQyxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyJ9