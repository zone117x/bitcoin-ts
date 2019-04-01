"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("../transaction");
const instruction_sets_1 = require("./instruction-sets/instruction-sets");
var AuthenticationProgramCreationError;
(function (AuthenticationProgramCreationError) {
    AuthenticationProgramCreationError["initializationInstructions"] = "The lockingScript in the provided output is malformed.";
    AuthenticationProgramCreationError["verificationInstructions"] = "The unlockingScript in the selected input of the provided transaction is malformed.";
})(AuthenticationProgramCreationError = exports.AuthenticationProgramCreationError || (exports.AuthenticationProgramCreationError = {}));
/**
 * TODO: document
 * TODO: fix types
 */
exports.createAuthenticationProgram = (spendingTransaction, inputIndex, sourceOutput, sha256) => {
    const initializationInstructions = instruction_sets_1.parseScript(spendingTransaction.inputs[inputIndex].unlockingScript);
    const verificationInstructions = instruction_sets_1.parseScript(sourceOutput.lockingScript);
    return instruction_sets_1.authenticationInstructionsAreNotMalformed(initializationInstructions)
        ? instruction_sets_1.authenticationInstructionsAreNotMalformed(verificationInstructions)
            ? {
                initializationInstructions,
                // tslint:disable-next-line:no-object-literal-type-assertion
                state: {
                    correspondingOutputHash: transaction_1.getOutputHash(spendingTransaction.outputs[inputIndex], sha256),
                    locktime: spendingTransaction.locktime,
                    outpointIndex: spendingTransaction.inputs[inputIndex].outpointIndex,
                    outpointTransactionHash: spendingTransaction.inputs[inputIndex].outpointTransactionHash,
                    outputValue: sourceOutput.satoshis,
                    sequenceNumber: spendingTransaction.inputs[inputIndex].sequenceNumber,
                    transactionOutpointsHash: transaction_1.getOutpointsHash(spendingTransaction.inputs, sha256),
                    transactionOutputsHash: transaction_1.getOutputsHash(spendingTransaction.outputs, sha256),
                    transactionSequenceNumbersHash: transaction_1.getSequenceNumbersHash(spendingTransaction.inputs, sha256),
                    version: spendingTransaction.version
                },
                verificationInstructions
            }
            : AuthenticationProgramCreationError.verificationInstructions
        : AuthenticationProgramCreationError.initializationInstructions;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvc3RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUEwQixDQUFDLHlCQUF5Qjs7QUFHcEQsZ0RBT3dCO0FBRXhCLDBFQUk2QztBQThLN0MsSUFBWSxrQ0FHWDtBQUhELFdBQVksa0NBQWtDO0lBQzVDLDJIQUFxRixDQUFBO0lBQ3JGLHNKQUFnSCxDQUFBO0FBQ2xILENBQUMsRUFIVyxrQ0FBa0MsR0FBbEMsMENBQWtDLEtBQWxDLDBDQUFrQyxRQUc3QztBQUVEOzs7R0FHRztBQUNVLFFBQUEsMkJBQTJCLEdBQUcsQ0FJekMsbUJBQWdDLEVBQ2hDLFVBQWtCLEVBQ2xCLFlBQW9CLEVBQ3BCLE1BQWMsRUFHdUIsRUFBRTtJQUN2QyxNQUFNLDBCQUEwQixHQUFHLDhCQUFXLENBQzVDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxlQUFlLENBQ3ZELENBQUM7SUFDRixNQUFNLHdCQUF3QixHQUFHLDhCQUFXLENBQzFDLFlBQVksQ0FBQyxhQUFhLENBQzNCLENBQUM7SUFDRixPQUFPLDREQUF5QyxDQUFDLDBCQUEwQixDQUFDO1FBQzFFLENBQUMsQ0FBQyw0REFBeUMsQ0FBQyx3QkFBd0IsQ0FBQztZQUNuRSxDQUFDLENBQUM7Z0JBQ0UsMEJBQTBCO2dCQUMxQiw0REFBNEQ7Z0JBQzVELEtBQUssRUFBRztvQkFDTix1QkFBdUIsRUFBRSwyQkFBYSxDQUNwQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQ3ZDLE1BQU0sQ0FDUDtvQkFDRCxRQUFRLEVBQUUsbUJBQW1CLENBQUMsUUFBUTtvQkFDdEMsYUFBYSxFQUFFLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhO29CQUNuRSx1QkFBdUIsRUFDckIsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLHVCQUF1QjtvQkFDaEUsV0FBVyxFQUFFLFlBQVksQ0FBQyxRQUFRO29CQUNsQyxjQUFjLEVBQ1osbUJBQW1CLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGNBQWM7b0JBQ3ZELHdCQUF3QixFQUFFLDhCQUFnQixDQUN4QyxtQkFBbUIsQ0FBQyxNQUFNLEVBQzFCLE1BQU0sQ0FDUDtvQkFDRCxzQkFBc0IsRUFBRSw0QkFBYyxDQUNwQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQzNCLE1BQU0sQ0FDUDtvQkFDRCw4QkFBOEIsRUFBRSxvQ0FBc0IsQ0FDcEQsbUJBQW1CLENBQUMsTUFBTSxFQUMxQixNQUFNLENBQ1A7b0JBQ0QsT0FBTyxFQUFFLG1CQUFtQixDQUFDLE9BQU87aUJBQ1I7Z0JBQzlCLHdCQUF3QjthQUN6QjtZQUNILENBQUMsQ0FBQyxrQ0FBa0MsQ0FBQyx3QkFBd0I7UUFDL0QsQ0FBQyxDQUFDLGtDQUFrQyxDQUFDLDBCQUEwQixDQUFDO0FBQ3BFLENBQUMsQ0FBQyJ9