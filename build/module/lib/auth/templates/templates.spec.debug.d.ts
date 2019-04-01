import { AuthenticationTemplate } from './types';
export declare const singleSig: AuthenticationTemplate;
/**
 * 2-of-3 P2SH
 * This is a mostly-hard-coded 2-of-3 example. A more general function could be written to generate m-of-n wallets
 */
export declare const twoOfThree: AuthenticationTemplate;
/**
 * This is a mostly-hard-coded 1-of-8 example. A more general function could
 * be written to create m-of-n wallets.
 */
export declare const treeSig: AuthenticationTemplate;
export declare const sigOfSig: AuthenticationTemplate;
export declare const trustedRecovery: AuthenticationTemplate;
export declare const zeroConfirmationForfeits: AuthenticationTemplate;
