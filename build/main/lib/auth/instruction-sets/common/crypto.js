"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const instruction_sets_1 = require("../instruction-sets");
const combinators_1 = require("./combinators");
const common_1 = require("./common");
const encoding_1 = require("./encoding");
const flow_control_1 = require("./flow-control");
const opcodes_1 = require("./opcodes");
const signing_serialization_1 = require("./signing-serialization");
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
exports.opHash160 = (sha256, ripemd160) => (state) => combinators_1.useOneStackItem(state, (nextState, value) => combinators_1.pushToStack(nextState, ripemd160.hash(sha256.hash(value))));
exports.opCheckSig = (sha256, secp256k1) => (state) => {
    const publicKey = state.stack.pop();
    const bitcoinEncodedSignature = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (publicKey === undefined || bitcoinEncodedSignature === undefined) {
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    // tslint:disable-next-line:no-if-statement
    if (!encoding_1.isValidPublicKeyEncoding(publicKey)) {
        return common_1.applyError(common_1.CommonAuthenticationError.invalidPublicKeyEncoding, state);
    }
    // tslint:disable-next-line:no-if-statement
    if (!encoding_1.isValidSignatureEncoding(bitcoinEncodedSignature)) {
        return common_1.applyError(common_1.CommonAuthenticationError.invalidSignatureEncoding, state);
    }
    const coveredScript = instruction_sets_1.serializeAuthenticationInstructions(state.instructions).subarray(state.lastCodeSeparator + 1);
    const { signingSerializationType, signature } = encoding_1.decodeBitcoinSignature(bitcoinEncodedSignature);
    const serialization = signing_serialization_1.generateBitcoinCashSigningSerialization(state.version, state.transactionOutpointsHash, state.transactionSequenceNumbersHash, state.outpointTransactionHash, state.outpointIndex, coveredScript, state.outputValue, state.sequenceNumber, state.correspondingOutputHash, state.transactionOutputsHash, state.locktime, signingSerializationType);
    const digest = sha256.hash(sha256.hash(serialization));
    // tslint:disable-next-line:no-expression-statement
    state.stack.push(common_1.booleanToScriptNumber(secp256k1.verifySignatureDERLowS(signature, publicKey, digest)));
    return state;
};
exports.opCheckMultiSig = (sha256, secp256k1) => 
// tslint:disable-next-line:cyclomatic-complexity
(state) => {
    const potentialPublicKeysBytes = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (potentialPublicKeysBytes === undefined) {
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    const potentialPublicKeysParsed = common_1.parseBytesAsScriptNumber(potentialPublicKeysBytes);
    const potentialPublicKeys = Number(potentialPublicKeysParsed);
    // tslint:disable-next-line:no-if-statement
    if (common_1.isScriptNumberError(potentialPublicKeysParsed) ||
        potentialPublicKeys < 0) {
        return common_1.applyError(common_1.CommonAuthenticationError.invalidNaturalNumber, state);
    }
    // tslint:disable-next-line:no-if-statement
    if (potentialPublicKeys > 20 /* maximumPublicKeys */) {
        return common_1.applyError(common_1.CommonAuthenticationError.exceedsMaximumMultisigPublicKeyCount, state);
    }
    const publicKeys = state.stack.splice(-potentialPublicKeys);
    // tslint:disable-next-line:no-expression-statement no-object-mutation
    state.operationCount += potentialPublicKeys;
    // tslint:disable-next-line:no-if-statement
    if (state.operationCount > common_1.CommonConsensus.maximumOperationCount) {
        return common_1.applyError(common_1.CommonAuthenticationError.exceededMaximumOperationCount, state);
    }
    const requiredApprovingPublicKeysBytes = state.stack.pop();
    if (requiredApprovingPublicKeysBytes === undefined) {
        // tslint:disable-line:no-if-statement
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    const requiredApprovingPublicKeysParsed = common_1.parseBytesAsScriptNumber(requiredApprovingPublicKeysBytes);
    const requiredApprovingPublicKeys = Number(requiredApprovingPublicKeysParsed);
    // tslint:disable-next-line:no-if-statement
    if (common_1.isScriptNumberError(requiredApprovingPublicKeysParsed) ||
        requiredApprovingPublicKeys < 0) {
        return common_1.applyError(common_1.CommonAuthenticationError.invalidNaturalNumber, state);
    }
    // tslint:disable-next-line:no-if-statement
    if (requiredApprovingPublicKeys > potentialPublicKeys) {
        return common_1.applyError(common_1.CommonAuthenticationError.insufficientPublicKeys, state);
    }
    const signatures = state.stack.splice(-requiredApprovingPublicKeys);
    const protocolBugValue = state.stack.pop();
    // tslint:disable-next-line:no-if-statement
    if (protocolBugValue === undefined) {
        return common_1.applyError(common_1.CommonAuthenticationError.emptyStack, state);
    }
    // TODO: this is enforced for BTC, but will only be enforced on BCH in 2019May
    // tslint:disable-next-line:no-if-statement
    if (protocolBugValue.length !== 0) {
        return common_1.applyError(common_1.CommonAuthenticationError.invalidProtocolBugValue, state);
    }
    const coveredScript = instruction_sets_1.serializeAuthenticationInstructions(state.instructions).subarray(state.lastCodeSeparator + 1);
    let approvingPublicKeys = 0; // tslint:disable-line:no-let
    let remainingSignatures = signatures.length; // tslint:disable-line:no-let
    let remainingPublicKeys = publicKeys.length; // tslint:disable-line:no-let
    while (remainingSignatures > 0 &&
        approvingPublicKeys + remainingPublicKeys >= remainingSignatures &&
        approvingPublicKeys !== requiredApprovingPublicKeys) {
        const publicKey = publicKeys[remainingPublicKeys - 1];
        const bitcoinEncodedSignature = signatures[remainingSignatures - 1];
        // tslint:disable-next-line:no-if-statement
        if (!encoding_1.isValidPublicKeyEncoding(publicKey)) {
            return common_1.applyError(common_1.CommonAuthenticationError.invalidPublicKeyEncoding, state);
        }
        // tslint:disable-next-line:no-if-statement
        if (!encoding_1.isValidSignatureEncoding(bitcoinEncodedSignature)) {
            return common_1.applyError(common_1.CommonAuthenticationError.invalidSignatureEncoding, state);
        }
        const { signingSerializationType, signature } = encoding_1.decodeBitcoinSignature(bitcoinEncodedSignature);
        const serialization = signing_serialization_1.generateBitcoinCashSigningSerialization(state.version, state.transactionOutpointsHash, state.transactionSequenceNumbersHash, state.outpointTransactionHash, state.outpointIndex, coveredScript, state.outputValue, state.sequenceNumber, state.correspondingOutputHash, state.transactionOutputsHash, state.locktime, signingSerializationType);
        const digest = sha256.hash(sha256.hash(serialization));
        const signed = secp256k1.verifySignatureDERLowS(signature, publicKey, digest);
        // tslint:disable-next-line:no-if-statement
        if (signed) {
            approvingPublicKeys++; // tslint:disable-line:no-expression-statement
            remainingSignatures--; // tslint:disable-line:no-expression-statement
        }
        remainingPublicKeys--; // tslint:disable-line:no-expression-statement
    }
    return combinators_1.pushToStack(state, common_1.booleanToScriptNumber(approvingPublicKeys === requiredApprovingPublicKeys));
};
exports.opCheckSigVerify = (sha256, secp256k1) => combinators_1.combineOperations(exports.opCheckSig(sha256, secp256k1), flow_control_1.opVerify());
exports.opCheckMultiSigVerify = (sha256, secp256k1) => combinators_1.combineOperations(exports.opCheckMultiSig(sha256, secp256k1), flow_control_1.opVerify());
exports.cryptoOperations = (sha256, ripemd160, secp256k1) => ({
    [opcodes_1.CommonOpcodes.OP_HASH160]: exports.opHash160(sha256, ripemd160),
    [opcodes_1.CommonOpcodes.OP_CHECKSIG]: exports.opCheckSig(sha256, secp256k1),
    [opcodes_1.CommonOpcodes.OP_CHECKSIGVERIFY]: exports.opCheckSigVerify(sha256, secp256k1),
    [opcodes_1.CommonOpcodes.OP_CHECKMULTISIG]: exports.opCheckMultiSig(sha256, secp256k1),
    [opcodes_1.CommonOpcodes.OP_CHECKMULTISIGVERIFY]: exports.opCheckMultiSigVerify(sha256, secp256k1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5cHRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hdXRoL2luc3RydWN0aW9uLXNldHMvY29tbW9uL2NyeXB0by50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQTBCLENBQUMseUJBQXlCOztBQUtwRCwwREFBMEU7QUFDMUUsK0NBQWdGO0FBQ2hGLHFDQVNrQjtBQUNsQix5Q0FJb0I7QUFDcEIsaURBQTBDO0FBQzFDLHVDQUEwQztBQUMxQyxtRUFBa0Y7QUFJbEYsaUNBQWlDO0FBQ2pDLHNFQUFzRTtBQUN0RSxvQ0FBb0M7QUFDcEMsNkJBQTZCO0FBQzdCLGlGQUFpRjtBQUNqRiwwQ0FBMEM7QUFDMUMsNkVBQTZFO0FBQzdFLDBDQUEwQztBQUMxQyxvQkFBb0I7QUFDcEIsTUFBTTtBQUNOLE1BQU07QUFFTyxRQUFBLFNBQVMsR0FBRyxDQU92QixNQUFjLEVBQ2QsU0FBb0IsRUFDSyxFQUFFLENBQUMsQ0FBQyxLQUFtQixFQUFFLEVBQUUsQ0FDcEQsNkJBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FDMUMseUJBQVcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FDM0QsQ0FBQztBQUVTLFFBQUEsVUFBVSxHQUFHLENBS3hCLE1BQWMsRUFDZCxTQUFvQixFQUNLLEVBQUUsQ0FBQyxDQUFDLEtBQW1CLEVBQUUsRUFBRTtJQUNwRCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sdUJBQXVCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNsRCwyQ0FBMkM7SUFDM0MsSUFBSSxTQUFTLEtBQUssU0FBUyxJQUFJLHVCQUF1QixLQUFLLFNBQVMsRUFBRTtRQUNw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