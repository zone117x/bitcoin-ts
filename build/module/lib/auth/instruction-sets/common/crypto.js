/* istanbul ignore file */ // TODO: stabilize & test
import { serializeAuthenticationInstructions } from '../instruction-sets';
import { combineOperations, pushToStack, useOneStackItem } from './combinators';
import { applyError, booleanToScriptNumber, CommonAuthenticationError, CommonConsensus, isScriptNumberError, parseBytesAsScriptNumber } from './common';
import { decodeBitcoinSignature, isValidPublicKeyEncoding, isValidSignatureEncoding } from './encoding';
import { opVerify } from './flow-control';
import { CommonOpcodes } from './opcodes';
import { generateBitcoinCashSigningSerialization } from './signing-serialization';
// export const codeSeparator = <
// todo  ProgramState extends MinimumProgramState & CommonProgramState
// >(): Operator<ProgramState> => ({
//   asm: 'OP_CODESEPARATOR',
//   description: 'Mark this byte as the beginning of this scripts signed data.',
//   operation: (state: ProgramState) => {
//     // tslint:disable-next-line:no-expression-statement no-object-mutation
//     state.lastCodeSeparator = state.ip;
//     return state;
//   }
// });
export const opHash160 = (sha256, ripemd160) => (state) => useOneStackItem(state, (nextState, value) => pushToStack(nextState, ripemd160.hash(sha256.hash(value))));
export const opCheckSig = (sha256, secp256k1) => (state) => {
    const publicKey = state.stack.pop();
    const bitcoinEncodedSignature = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (publicKey === undefined || bitcoinEncodedSignature === undefined) {
        return applyError(CommonAuthenticationError.emptyStack, state);
    }
    // tslint:disable-next-line:no-if-statement
    if (!isValidPublicKeyEncoding(publicKey)) {
        return applyError(CommonAuthenticationError.invalidPublicKeyEncoding, state);
    }
    // tslint:disable-next-line:no-if-statement
    if (!isValidSignatureEncoding(bitcoinEncodedSignature)) {
        return applyError(CommonAuthenticationError.invalidSignatureEncoding, state);
    }
    const coveredScript = serializeAuthenticationInstructions(state.instructions).subarray(state.lastCodeSeparator + 1);
    const { signingSerializationType, signature } = decodeBitcoinSignature(bitcoinEncodedSignature);
    const serialization = generateBitcoinCashSigningSerialization(state.version, state.transactionOutpointsHash, state.transactionSequenceNumbersHash, state.outpointTransactionHash, state.outpointIndex, coveredScript, state.outputValue, state.sequenceNumber, state.correspondingOutputHash, state.transactionOutputsHash, state.locktime, signingSerializationType);
    const digest = sha256.hash(sha256.hash(serialization));
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(booleanToScriptNumber(secp256k1.verifySignatureDERLowS(signature, publicKey, digest)));
    return state;
};
export const opCheckMultiSig = (sha256, secp256k1) => 
// tslint:disable-next-line:cyclomatic-complexity
(state) => {
    const potentialPublicKeysBytes = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (potentialPublicKeysBytes === undefined) {
        return applyError(CommonAuthenticationError.emptyStack, state);
    }
    const potentialPublicKeysParsed = parseBytesAsScriptNumber(potentialPublicKeysBytes);
    const potentialPublicKeys = Number(potentialPublicKeysParsed);
    // tslint:disable-next-line:no-if-statement
    if (isScriptNumberError(potentialPublicKeysParsed) ||
        potentialPublicKeys < 0) {
        return applyError(CommonAuthenticationError.invalidNaturalNumber, state);
    }
    // tslint:disable-next-line:no-if-statement
    if (potentialPublicKeys > 20 /* maximumPublicKeys */) {
        return applyError(CommonAuthenticationError.exceedsMaximumMultisigPublicKeyCount, state);
    }
    const publicKeys = state.stack.splice(-potentialPublicKeys);
    // tslint:disable-next-line:no-expression-statement no-object-mutation
    state.operationCount += potentialPublicKeys;
    // tslint:disable-next-line:no-if-statement
    if (state.operationCount > CommonConsensus.maximumOperationCount) {
        return applyError(CommonAuthenticationError.exceededMaximumOperationCount, state);
    }
    const requiredApprovingPublicKeysBytes = state.stack.pop();
    if (requiredApprovingPublicKeysBytes === undefined) {
        // tslint:disable-line:no-if-statement
        return applyError(CommonAuthenticationError.emptyStack, state);
    }
    const requiredApprovingPublicKeysParsed = parseBytesAsScriptNumber(requiredApprovingPublicKeysBytes);
    const requiredApprovingPublicKeys = Number(requiredApprovingPublicKeysParsed);
    // tslint:disable-next-line:no-if-statement
    if (isScriptNumberError(requiredApprovingPublicKeysParsed) ||
        requiredApprovingPublicKeys < 0) {
        return applyError(CommonAuthenticationError.invalidNaturalNumber, state);
    }
    // tslint:disable-next-line:no-if-statement
    if (requiredApprovingPublicKeys > potentialPublicKeys) {
        return applyError(CommonAuthenticationError.insufficientPublicKeys, state);
    }
    const signatures = state.stack.splice(-requiredApprovingPublicKeys);
    const protocolBugValue = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (protocolBugValue === undefined) {
        return applyError(CommonAuthenticationError.emptyStack, state);
    }
    // TODO: this is enforced for BTC, but will only be enforced on BCH in 2019May
    // tslint:disable-next-line:no-if-statement
    if (protocolBugValue.length !== 0) {
        return applyError(CommonAuthenticationError.invalidProtocolBugValue, state);
    }
    const coveredScript = serializeAuthenticationInstructions(state.instructions).subarray(state.lastCodeSeparator + 1);
    let approvingPublicKeys = 0; // tslint:disable-line:no-let
    let remainingSignatures = signatures.length; // tslint:disable-line:no-let
    let remainingPublicKeys = publicKeys.length; // tslint:disable-line:no-let
    while (remainingSignatures > 0 &&
        approvingPublicKeys + remainingPublicKeys >= remainingSignatures &&
        approvingPublicKeys !== requiredApprovingPublicKeys) {
        const publicKey = publicKeys[remainingPublicKeys - 1];
        const bitcoinEncodedSignature = signatures[remainingSignatures - 1];
        // tslint:disable-next-line:no-if-statement
        if (!isValidPublicKeyEncoding(publicKey)) {
            return applyError(CommonAuthenticationError.invalidPublicKeyEncoding, state);
        }
        // tslint:disable-next-line:no-if-statement
        if (!isValidSignatureEncoding(bitcoinEncodedSignature)) {
            return applyError(CommonAuthenticationError.invalidSignatureEncoding, state);
        }
        const { signingSerializationType, signature } = decodeBitcoinSignature(bitcoinEncodedSignature);
        const serialization = generateBitcoinCashSigningSerialization(state.version, state.transactionOutpointsHash, state.transactionSequenceNumbersHash, state.outpointTransactionHash, state.outpointIndex, coveredScript, state.outputValue, state.sequenceNumber, state.correspondingOutputHash, state.transactionOutputsHash, state.locktime, signingSerializationType);
        const digest = sha256.hash(sha256.hash(serialization));
        const signed = secp256k1.verifySignatureDERLowS(signature, publicKey, digest);
        // tslint:disable-next-line:no-if-statement
        if (signed) {
            approvingPublicKeys++; // tslint:disable-line:no-expression-statement
            remainingSignatures--; // tslint:disable-line:no-expression-statement
        }
        remainingPublicKeys--; // tslint:disable-line:no-expression-statement
    }
    return pushToStack(state, booleanToScriptNumber(approvingPublicKeys === requiredApprovingPublicKeys));
};
export const opCheckSigVerify = (sha256, secp256k1) => combineOperations(opCheckSig(sha256, secp256k1), opVerify());
export const opCheckMultiSigVerify = (sha256, secp256k1) => combineOperations(opCheckMultiSig(sha256, secp256k1), opVerify());
export const cryptoOperations = (sha256, ripemd160, secp256k1) => ({
    [CommonOpcodes.OP_HASH160]: opHash160(sha256, ripemd160),
    [CommonOpcodes.OP_CHECKSIG]: opCheckSig(sha256, secp256k1),
    [CommonOpcodes.OP_CHECKSIGVERIFY]: opCheckSigVerify(sha256, secp256k1),
    [CommonOpcodes.OP_CHECKMULTISIG]: opCheckMultiSig(sha256, secp256k1),
    [CommonOpcodes.OP_CHECKMULTISIGVERIFY]: opCheckMultiSigVerify(sha256, secp256k1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5cHRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvY29tbW9uL2NyeXB0by50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7QUFLcEQsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEYsT0FBTyxFQUNMLFVBQVUsRUFDVixxQkFBcUIsRUFDckIseUJBQXlCLEVBQ3pCLGVBQWUsRUFFZixtQkFBbUIsRUFFbkIsd0JBQXdCLEVBQ3pCLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsd0JBQXdCLEVBQ3hCLHdCQUF3QixFQUN6QixNQUFNLFlBQVksQ0FBQztBQUNwQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUMxQyxPQUFPLEVBQUUsdUNBQXVDLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUlsRixpQ0FBaUM7QUFDakMsc0VBQXNFO0FBQ3RFLG9DQUFvQztBQUNwQyw2QkFBNkI7QUFDN0IsaUZBQWlGO0FBQ2pGLDBDQUEwQztBQUMxQyw2RUFBNkU7QUFDN0UsMENBQTBDO0FBQzFDLG9CQUFvQjtBQUNwQixNQUFNO0FBQ04sTUFBTTtBQUVOLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxDQU92QixNQUFjLEVBQ2QsU0FBb0IsRUFDSyxFQUFFLENBQUMsQ0FBQyxLQUFtQixFQUFFLEVBQUUsQ0FDcEQsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUMxQyxXQUFXLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FB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