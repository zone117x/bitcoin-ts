"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleSig = Object.assign({
    name: 'Single-Factor'
}, { description: 'A standard single-factor authentication template which uses Pay-to-Public-Key-Hash (P2PKH).\nThis is currently the most common template in use on the network.', entities: [
        {
            description: 'The individual who can spend from this wallet.',
            id: 'owner',
            name: 'Owner',
            variables: [
                {
                    derivationHardened: false,
                    derivationIndex: 0,
                    description: 'The private key which controls this wallet.',
                    id: 'key',
                    mock: '0x0000',
                    name: 'Key',
                    type: 'HDKey'
                }
            ]
        },
        {
            description: 'An entity which can generate addresses but cannot spend funds from this wallet.',
            id: 'observer',
            name: 'Observer (Watch-Only)',
            scripts: ['lock']
        }
    ], scripts: [
        {
            id: 'lock',
            script: 'OP_DUP OP_HASH160 <$(<key.public> OP_HASH160)> OP_EQUALVERIFY OP_CHECKSIG'
        },
        {
            id: 'unlock',
            script: '<key.signature.all> <key.public>',
            unlocks: 'lock'
        }
    ], supported: ['BCH_2018_11', 'BCH_2019_05'], version: 1 });
const createCosigner = (id, name, suffix, scripts) => ({
    id,
    name,
    scripts: ['checksum', 'lock', ...scripts],
    variables: [
        {
            derivationHardened: false,
            derivationIndex: 0,
            id: `key${suffix}`,
            type: 'HDKey'
        }
    ]
});
/**
 * 2-of-3 P2SH
 * This is a mostly-hard-coded 2-of-3 example. A more general function could be written to generate m-of-n wallets
 */
exports.twoOfThree = Object.assign({
    name: 'Multi-Factor (2-of-3)'
}, { description: 'A multi-factor template using standard 2-of-3 P2SH authentication template', entities: [
        createCosigner('cosigner_1', 'Cosigner 1', '1', ['1_and_2', '1_and_3']),
        createCosigner('cosigner_2', 'Cosigner 2', '2', ['1_and_2', '2_and_3']),
        createCosigner('cosigner_3', 'Cosigner 3', '3', ['1_and_3', '2_and_3'])
    ], scripts: [
        {
            id: 'checksum',
            script: '$(<key1.public> OP_SHA256 <key2.public> OP_SHA256 OP_CAT OP_SHA256 <key3.public> OP_SHA256 OP_CAT OP_SHA256 OP_HASH160)',
            tests: [
                {
                    check: '<TODO:checksum> OP_EQUAL'
                }
            ]
        },
        {
            id: 'redeem_script',
            script: 'OP_2 <key2.public> <key2.public> <key3.public> OP_3 OP_CHECKMULTISIG'
        },
        {
            id: 'lock',
            script: 'OP_HASH160 <$(<redeem_script> OP_HASH160)> OP_EQUAL'
        },
        {
            id: '1_and_2',
            name: 'Cosigner 1 & 2',
            script: 'OP_0 <key1.signature.all> <key2.signature.all> <redeem_script>',
            unlocks: 'lock'
        },
        {
            id: '1_and_3',
            name: 'Cosigner 1 & 3',
            script: 'OP_0 <key1.signature.all> <key3.signature.all> <redeem_script>',
            unlocks: 'lock'
        },
        {
            id: '2_and_3',
            name: 'Cosigner 2 & 3',
            script: 'OP_0 <key2.signature.all> <key3.signature.all> <redeem_script>',
            unlocks: 'lock'
        }
    ], supported: ['BCH_2018_11', 'BCH_2019_05'], version: 1 });
/**
 * This is a mostly-hard-coded 1-of-8 example. A more general function could
 * be written to create m-of-n wallets.
 */
exports.treeSig = Object.assign({
    name: '1-of-8 Tree Signature'
}, { description: `A 1-of-8 P2SH tree signature authentication template, based on: https://www.yours.org/content/tree-signature-variations-using-commutative-hash-trees-8a898830203a

         root
        /    \
       a1     a2
      / \     / \
    b1  b2   b3  b4
    /\  /\   /\   /\
 c | |  | |  | |  | |
   1 2  3 4  5 6  7 8

 The tree contains 5 levels:
 - root
 - a - concat and hash of b
 - b - concat and hash of c
 - c - hash of each respective public key
 - # - each respective public key`, entities: [1, 2, 3, 4, 5, 6, 7, 8].map(id => ({
        id: `signer_${id}`,
        name: `Signer ${id}`,
        scripts: [`Key ${id}`],
        variables: [
            {
                derivationHardened: false,
                derivationIndex: 0,
                id: `key${id}`,
                type: 'HDKey'
            }
        ]
    })), scripts: [
        {
            id: 'checksum',
            script: '$(<key1.public> OP_SHA256 <key2.public> OP_SHA256 OP_CAT OP_SHA256 <key3.public> OP_SHA256 OP_CAT OP_SHA256 <key4.public> OP_SHA256 OP_CAT OP_SHA256 <key5.public> OP_SHA256 OP_CAT OP_SHA256 <key6.public> OP_SHA256 OP_CAT OP_SHA256 <key7.public> OP_SHA256 OP_CAT OP_SHA256 <key8.public> OP_SHA256 OP_CAT OP_SHA256 OP_HASH160)'
        },
        ...[
            ['root', 'a1', 'a2'],
            ['a1', 'b1', 'b2'],
            ['a2', 'b3', 'b4'],
            ['b1', 'c1', 'c2'],
            ['b2', 'c3', 'c4'],
            ['b3', 'c5', 'c6'],
            ['b4', 'c7', 'c8']
        ].map(([id, left, right]) => ({
            id,
            script: `${left} ${right} hash_node`
        })),
        ...[1, 2, 3, 4, 5, 6, 7, 8].map(i => ({
            id: `c${i}`,
            script: `<key${i}.public> OP_HASH160`
        })),
        {
            id: 'hash_node',
            script: 'sort_cat OP_HASH160'
        },
        {
            id: 'sort_cat',
            script: 'OP_LESSTHAN OP_IF OP_SWAP OP_ENDIF OP_CAT'
        },
        {
            id: 'lock',
            script: 'OP_HASH160 <$(<OP_4 OP_PICK OP_HASH160 sort_cat OP_HASH160 sort_cat OP_HASH160 sort_cat OP_HASH160 <$(root)> OP_EQUALVERIFY OP_CHECKSIG> OP_HASH160)> OP_EQUAL'
        },
        ...[
            [1, 2, 2, 2],
            [2, 1, 2, 2],
            [3, 4, 1, 2],
            [4, 3, 1, 2],
            [5, 6, 4, 1],
            [6, 5, 4, 1],
            [7, 8, 3, 1],
            [8, 7, 3, 1]
        ].map(([key, sibling, bSibling, aSibling]) => ({
            id: `unlock_${key}`,
            script: `<key${key}.signature.all> <key${key}.public> <$(a${aSibling})> <$(b${bSibling})> <$(c${sibling})> <redeem_script>`,
            unlocks: 'lock'
        }))
    ], supported: ['BCH_2018_11', 'BCH_2019_05'], version: 1 });
exports.sigOfSig = Object.assign({
    name: 'Sig-of-Sig Example (2-of-2)'
}, { description: 'A contrived example of a template which must be signed in a specific order. Credit: Antony Zegers', entities: [
        {
            id: 'signer_1',
            name: 'First Signer',
            variables: [
                {
                    derivationHardened: false,
                    derivationIndex: 0,
                    id: 'first',
                    type: 'HDKey'
                }
            ]
        },
        {
            id: 'signer_2',
            name: 'Second Signer',
            variables: [
                {
                    derivationHardened: false,
                    derivationIndex: 0,
                    id: 'second',
                    type: 'HDKey'
                }
            ]
        }
    ], scripts: [
        {
            id: 'checksum',
            script: '$(<key1.public> OP_SHA256 <key2.public> OP_SHA256 OP_CAT OP_SHA256 OP_HASH160)'
        },
        {
            id: 'lock',
            script: 'OP_HASH160 <$(<OP_2 OP_PICK <second.public> OP_CHECKDATASIGVERIFY OP_DUP OP_HASH160 <$(<key.public> OP_HASH160)> OP_EQUALVERIFY OP_CHECKSIG> OP_HASH160)> OP_EQUAL'
        },
        {
            id: 'spend',
            script: '<first.signature.all> <first.public> <second.signature.data.first.signature.all> <redeem_script>'
        }
    ], supported: ['BCH_2018_11', 'BCH_2019_05'], version: 1 });
exports.trustedRecovery = Object.assign({
    name: '2-of-2 with Business Continuity'
}, { description: 'A 2-of-2 wallet, which after a specified delay, can be recovered by either of the original two keys and a signature from a trusted user (e.g. an attorney).\nThis scheme is described in more detail in BIP-65.', entities: [
        {
            id: 'signer_1',
            name: 'Signer 1',
            scripts: ['checksum', 'spend', 'recover_1'],
            variables: [
                {
                    derivationHardened: false,
                    derivationIndex: 0,
                    id: `first`,
                    type: 'HDKey'
                },
                {
                    id: 'block_time',
                    type: 'CurrentBlockTime'
                },
                {
                    description: 'The waiting period (from the time the wallet is created) after which the Trusted Party can assist with delayed recoveries. The delay is measured in seconds, e.g. 1 day is `86400`.',
                    id: 'delay_seconds',
                    name: 'Recovery Delay (Seconds)',
                    type: 'WalletData'
                }
            ]
        },
        {
            id: 'signer_2',
            name: 'Signer 2',
            scripts: ['checksum', 'spend', 'recover_2'],
            variables: [
                {
                    derivationHardened: false,
                    derivationIndex: 0,
                    id: `second`,
                    type: 'HDKey'
                }
            ]
        },
        {
            id: 'trusted_party',
            name: 'Trusted Party',
            scripts: ['checksum', 'recover_1', 'recover_2'],
            variables: [
                {
                    derivationHardened: false,
                    derivationIndex: 0,
                    id: `trusted`,
                    type: 'HDKey'
                }
            ]
        }
    ], scripts: [
        {
            id: 'checksum',
            script: '$(<hot.public> OP_SHA256 <delayed.public> OP_SHA256 OP_CAT OP_SHA256 OP_HASH160)'
        },
        {
            id: 'lock',
            script: `OP_HASH160 <$(<
OP_IF
  <$(
    <block_time>
    <delay_seconds>
    OP_ADD
  )>
  OP_CHECKLOCKTIMEVERIFY OP_DROP
  <trusted.public_key>
  OP_CHECKSIGVERIFY
  <1>
OP_ELSE
  <2>
OP_ENDIF
<first.public_key> <second.public_key> <2>
OP_CHECKMULTISIG
> OP_HASH160)> OP_EQUAL`
        },
        {
            id: 'spend',
            name: 'Standard Spend',
            script: '<0> <first.signature.all> <second.signature.all> <0> <lock.redeem_script>',
            unlocks: 'lock'
        },
        {
            id: 'recover_1',
            name: 'Recovery – Signer 1',
            script: '<0>\n<first.signature.all>\n<trusted.signature.all>\n<1> <lock.redeem_script>',
            unlocks: 'lock'
        },
        {
            id: 'recover_2',
            name: 'Recovery – Signer 2',
            script: '<0> <second.signature.all> <trusted.signature.all> <1> <lock.redeem_script>',
            unlocks: 'lock'
        }
    ], supported: ['BCH_2018_11', 'BCH_2019_05'], version: 1 });
exports.zeroConfirmationForfeits = Object.assign({ name: 'Zero-Confirmation Forfeits (ZCF)' }, { description: `TODO`, entities: [], scripts: [
        {
            id: 'lock',
            script: 'TODO'
        }
    ], supported: ['BCH_2018_11', 'BCH_2019_05'], version: 1 });
// tslint:disable-next-line:no-console
// console.log(JSON.stringify(singleSig, undefined, 2));
(async () => {
    //
})().catch(error => {
    // tslint:disable-next-line:no-console
    console.error(error);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVzLnNwZWMuZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvdGVtcGxhdGVzL3RlbXBsYXRlcy5zcGVjLmRlYnVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR2EsUUFBQSxTQUFTLGlCQUNqQjtJQUNELElBQUksRUFBRSxlQUFlO0NBQ3RCLElBQ0QsV0FBVyxFQUNULGdLQUFnSyxFQUNsSyxRQUFRLEVBQUU7UUFDUjtZQUNFLFdBQVcsRUFBRSxnREFBZ0Q7WUFDN0QsRUFBRSxFQUFFLE9BQU87WUFDWCxJQUFJLEVBQUUsT0FBTztZQUNiLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxrQkFBa0IsRUFBRSxLQUFLO29CQUN6QixlQUFlLEVBQUUsQ0FBQztvQkFDbEIsV0FBVyxFQUFFLDZDQUE2QztvQkFDMUQsRUFBRSxFQUFFLEtBQUs7b0JBQ1QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsSUFBSSxFQUFFLE9BQU87aUJBQ2Q7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxXQUFXLEVBQ1QsaUZBQWlGO1lBQ25GLEVBQUUsRUFBRSxVQUFVO1lBQ2QsSUFBSSxFQUFFLHVCQUF1QjtZQUM3QixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7U0FDbEI7S0FDRixFQUNELE9BQU8sRUFBRTtRQUNQO1lBQ0UsRUFBRSxFQUFFLE1BQU07WUFDVixNQUFNLEVBQ0osMkVBQTJFO1NBQzlFO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsUUFBUTtZQUNaLE1BQU0sRUFBRSxrQ0FBa0M7WUFDMUMsT0FBTyxFQUFFLE1BQU07U0FDaEI7S0FDRixFQUNELFNBQVMsRUFBRSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsRUFDekMsT0FBTyxFQUFFLENBQUMsSUFDVjtBQUVGLE1BQU0sY0FBYyxHQUFHLENBQ3JCLEVBQVUsRUFDVixJQUFZLEVBQ1osTUFBYyxFQUNkLE9BQWlCLEVBQ2Es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