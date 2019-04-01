// tslint:disable:no-expression-statement no-magic-numbers no-unsafe-any
import { stringify } from '../../../utils/log';
import { createEmptyBitcoinCashProgramState, instantiateBitcoinCashVirtualMachine } from './bitcoin-cash';
import { BitcoinCashOpcodes } from './bitcoin-cash-opcodes';
(async () => {
    const vm = await instantiateBitcoinCashVirtualMachine();
    const program = createEmptyBitcoinCashProgramState([
        { opcode: BitcoinCashOpcodes.OP_1 },
        { opcode: BitcoinCashOpcodes.OP_DROP }
    ]);
    // tslint:disable-next-line:no-console
    console.log(stringify(vm.debug(program)));
    // /*
    // testing individual opcodes:
    return true;
})().catch(error => {
    // tslint:disable-next-line:no-console
    console.error(error);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0Y29pbi1jYXNoLXZtLnNwZWMuZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9iaXRjb2luLWNhc2gvYml0Y29pbi1jYXNoLXZtLnNwZWMuZGVidWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsd0VBQXdFO0FBQ3hFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMvQyxPQUFPLEVBQ0wsa0NBQWtDLEVBQ2xDLG9DQUFvQyxFQUNyQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRTVELENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDVixNQUFNLEVBQUUsR0FBRyxNQUFNLG9DQUFvQyxFQUFFLENBQUM7SUFFeEQsTUFBTSxPQUFPLEdBQUcsa0NBQWtDLENBQUM7UUFDakQsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLENBQUMsSUFBSSxFQUFFO1FBQ25DLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixDQUFDLE9BQU8sRUFBRTtLQUN2QyxDQUFDLENBQUM7SUFFSCxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsS0FBSztJQUVMLDhCQUE4QjtJQUU5QixPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ2pCLHNDQUFzQztJQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyxDQUFDIn0=