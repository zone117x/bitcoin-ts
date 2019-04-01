"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement no-magic-numbers no-unsafe-any
const log_1 = require("../../../utils/log");
const bitcoin_cash_1 = require("./bitcoin-cash");
const bitcoin_cash_opcodes_1 = require("./bitcoin-cash-opcodes");
(async () => {
    const vm = await bitcoin_cash_1.instantiateBitcoinCashVirtualMachine();
    const program = bitcoin_cash_1.createEmptyBitcoinCashProgramState([
        { opcode: bitcoin_cash_opcodes_1.BitcoinCashOpcodes.OP_1 },
        { opcode: bitcoin_cash_opcodes_1.BitcoinCashOpcodes.OP_DROP }
    ]);
    // tslint:disable-next-line:no-console
    console.log(log_1.stringify(vm.debug(program)));
    // /*
    // testing individual opcodes:
    return true;
})().catch(error => {
    // tslint:disable-next-line:no-console
    console.error(error);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0Y29pbi1jYXNoLXZtLnNwZWMuZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9iaXRjb2luLWNhc2gvYml0Y29pbi1jYXNoLXZtLnNwZWMuZGVidWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3RUFBd0U7QUFDeEUsNENBQStDO0FBQy9DLGlEQUd3QjtBQUN4QixpRUFBNEQ7QUFFNUQsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNWLE1BQU0sRUFBRSxHQUFHLE1BQU0sbURBQW9DLEVBQUUsQ0FBQztJQUV4RCxNQUFNLE9BQU8sR0FBRyxpREFBa0MsQ0FBQztRQUNqRCxFQUFFLE1BQU0sRUFBRSx5Q0FBa0IsQ0FBQyxJQUFJLEVBQUU7UUFDbkMsRUFBRSxNQUFNLEVBQUUseUNBQWtCLENBQUMsT0FBTyxFQUFFO0tBQ3ZDLENBQUMsQ0FBQztJQUVILHNDQUFzQztJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxLQUFLO0lBRUwsOEJBQThCO0lBRTlCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDakIsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsQ0FBQyxDQUFDLENBQUMifQ==