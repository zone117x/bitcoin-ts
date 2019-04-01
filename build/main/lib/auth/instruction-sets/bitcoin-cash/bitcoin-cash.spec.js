"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement no-magic-numbers
const ava_1 = __importDefault(require("ava"));
const utils_1 = require("../../../utils/utils");
ava_1.default('P2PKH Bitcoin Cash script', t => {
    // const vm = createAuthenticationVirtualMachine(bitcoinCashInstructionSet);
    // const vm = createBitcoinCashAuthenticationVM();
    const unlockingScript = utils_1.hexToBin('483045022100ab4c6d9ba51da83072615c33a9887b756478e6f9de381085f5183c97603fc6ff022029722188bd937f54c861582ca6fc685b8da2b40d05f06b368374d35e4af2b76401210376ea9e36a75d2ecf9c93a0be76885e36f822529db22acfdc761c9b5b4544f5c5');
    const lockingScript = utils_1.hexToBin('76a91415d16c84669ab46059313bf0747e781f1d13936d88ac');
    t.truthy(lockingScript);
    t.truthy(unlockingScript);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0Y29pbi1jYXNoLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9iaXRjb2luLWNhc2gvYml0Y29pbi1jYXNoLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBMEQ7QUFDMUQsOENBQXVCO0FBQ3ZCLGdEQUFnRDtBQUVoRCxhQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDcEMsNEVBQTRFO0lBQzVFLGtEQUFrRDtJQUVsRCxNQUFNLGVBQWUsR0FBRyxnQkFBUSxDQUM5Qix3TkFBd04sQ0FDek4sQ0FBQztJQUNGLE1BQU0sYUFBYSxHQUFHLGdCQUFRLENBQzVCLG9EQUFvRCxDQUNyRCxDQUFDO0lBRUYsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVCLENBQUMsQ0FBQyxDQUFDIn0=