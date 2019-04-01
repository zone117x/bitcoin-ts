/* istanbul ignore file */ // TODO: stabilize & test
import { getOutpointsHash, getOutputHash, getOutputsHash, getSequenceNumbersHash } from '../transaction';
import { authenticationInstructionsAreNotMalformed, parseScript } from './instruction-sets/instruction-sets';
export var AuthenticationProgramCreationError;
(function (AuthenticationProgramCreationError) {
    AuthenticationProgramCreationError["initializationInstructions"] = "The lockingScript in the provided output is malformed.";
    AuthenticationProgramCreationError["verificationInstructions"] = "The unlockingScript in the selected input of the provided transaction is malformed.";
})(AuthenticationProgramCreationError || (AuthenticationProgramCreationError = {}));
/**
 * TODO: document
 * TODO: fix types
 */
export const createAuthenticationProgram = (spendingTransaction, inputIndex, sourceOutput, sha256) => {
    const initializationInstructions = parseScript(spendingTransaction.inputs[inputIndex].unlockingScript);
    const verificationInstructions = parseScript(sourceOutput.lockingScript);
    return authenticationInstructionsAreNotMalformed(initializationInstructions)
        ? authenticationInstructionsAreNotMalformed(verificationInstructions)
            ? {
                initializationInstructions,
                // tslint:disable-next-line:no-object-literal-type-assertion
                state: {
                    correspondingOutputHash: getOutputHash(spendingTransaction.outputs[inputIndex], sha256),
                    locktime: spendingTransaction.locktime,
                    outpointIndex: spendingTransaction.inputs[inputIndex].outpointIndex,
                    outpointTransactionHash: spendingTransaction.inputs[inputIndex].outpointTransactionHash,
                    outputValue: sourceOutput.satoshis,
                    sequenceNumber: spendingTransaction.inputs[inputIndex].sequenceNumber,
                    transactionOutpointsHash: getOutpointsHash(spendingTransaction.inputs, sha256),
                    transactionOutputsHash: getOutputsHash(spendingTransaction.outputs, sha256),
                    transactionSequenceNumbersHash: getSequenceNumbersHash(spendingTransaction.inputs, sha256),
                    version: spendingTransaction.version
                },
                verificationInstructions
            }
            : AuthenticationProgramCreationError.verificationInstructions
        : AuthenticationProgramCreationError.initializationInstructions;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvc3RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEJBQTBCLENBQUMseUJBQXlCO0FBR3BELE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLGNBQWMsRUFDZCxzQkFBc0IsRUFHdkIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBRUwseUNBQXlDLEVBQ3pDLFdBQVcsRUFDWixNQUFNLHFDQUFxQyxDQUFDO0FBOEs3QyxNQUFNLENBQU4sSUFBWSxrQ0FHWDtBQUhELFdBQVksa0NBQWtDO0lBQzVDLDJIQUFxRixDQUFBO0lBQ3JGLHNKQUFnSCxDQUFBO0FBQ2xILENBQUMsRUFIVyxrQ0FBa0MsS0FBbEMsa0NBQWtDLFFBRzdDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQUcsQ0FJekMsbUJBQWdDLEVBQ2hDLFVBQWtCLEVBQ2xCLFlBQW9CLEVBQ3BCLE1BQWMsRUFHdUIsRUFBRTtJQUN2QyxNQUFNLDBCQUEwQixHQUFHLFdBQVcsQ0FDNUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGVBQWUsQ0FDdkQsQ0FBQztJQUNGLE1BQU0sd0JBQXdCLEdBQUcsV0FBVyxDQUMxQyxZQUFZLENBQUMsYUFBYSxDQUMzQixDQUFDO0lBQ0YsT0FBTyx5Q0FBeUMsQ0FBQywwQkFBMEIsQ0FBQztRQUMxRSxDQUFDLENBQUMseUNBQXlDLENBQUMsd0JBQXdCLENBQUM7WUFDbkUsQ0FBQyxDQUFDO2dCQUNFLDBCQUEwQjtnQkFDMUIsNERBQTREO2dCQUM1RCxLQUFLLEVBQUc7b0JBQ04sdUJBQXVCLEVBQUUsYUFBYSxDQUNwQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQ3ZDLE1BQU0sQ0FDUDtvQkFDRCxRQUFRLEVBQUUsbUJBQW1CLENBQUMsUUFBUTtvQkFDdEMsYUFBYSxFQUFFLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhO29CQUNuRSx1QkFBdUIsRUFDckIsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLHVCQUF1QjtvQkFDaEUsV0FBVyxFQUFFLFlBQVksQ0FBQyxRQUFRO29CQUNsQyxjQUFjLEVBQ1osbUJBQW1CLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGNBQWM7b0JBQ3ZELHdCQUF3QixFQUFFLGdCQUFnQixDQUN4QyxtQkFBbUIsQ0FBQyxNQUFNLEVBQzFCLE1BQU0sQ0FDUDtvQkFDRCxzQkFBc0IsRUFBRSxjQUFjLENBQ3BDLG1CQUFtQixDQUFDLE9BQU8sRUFDM0IsTUFBTSxDQUNQO29CQUNELDhCQUE4QixFQUFFLHNCQUFzQixDQUNwRCxtQkFBbUIsQ0FBQyxNQUFNLEVBQzFCLE1BQU0sQ0FDUDtvQkFDRCxPQUFPLEVBQUUsbUJBQW1CLENBQUMsT0FBTztpQkFDUjtnQkFDOUIsd0JBQXdCO2FBQ3pCO1lBQ0gsQ0FBQyxDQUFDLGtDQUFrQyxDQUFDLHdCQUF3QjtRQUMvRCxDQUFDLENBQUMsa0NBQWtDLENBQUMsMEJBQTBCLENBQUM7QUFDcEUsQ0FBQyxDQUFDIn0=