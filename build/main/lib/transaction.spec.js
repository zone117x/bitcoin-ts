"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement no-magic-numbers no-unsafe-any readonly-array
const ava_1 = __importDefault(require("ava"));
const transaction_1 = require("./transaction");
const utils_1 = require("./utils/utils");
ava_1.default('decodeRawTransaction', t => {
    const tx = utils_1.hexToBin('3eb87070042d16f9469b0080a3c1fe8de0feae345200beef8b1e0d7c62501ae0df899dca1e03000000066a0065525365ffffffffd14a9a335e8babddd89b5d0b6a0f41dd6b18848050a0fc48ce32d892e11817fd030000000863acac00535200527ff62cf3ad30d9064e180eaed5e6303950121a8086b5266b55156e4f7612f2c7ebf223e0020000000100ffffffff6273ca3aceb55931160fa7a3064682b4790ee016b4a5c0c0d101fd449dff88ba01000000055351ac526aa3b8223d0421f25b0400000000026552f92db70500000000075253516a656a53c4a908010000000000b5192901000000000652525251516aa148ca38');
    t.deepEqual(transaction_1.decodeRawTransaction(tx), {
        inputs: [
            {
                outpointIndex: 3,
                outpointTransactionHash: utils_1.hexToBin('1eca9d89dfe01a50627c0d1e8befbe005234aefee08dfec1a380009b46f9162d'),
                sequenceNumber: 4294967295,
                unlockingScript: utils_1.hexToBin('6a0065525365')
            },
            {
                outpointIndex: 3,
                outpointTransactionHash: utils_1.hexToBin('fd1718e192d832ce48fca0508084186bdd410f6a0b5d9bd8ddab8b5e339a4ad1'),
                sequenceNumber: 4079810175,
                unlockingScript: utils_1.hexToBin('63acac0053520052')
            },
            {
                outpointIndex: 2,
                outpointTransactionHash: utils_1.hexToBin('e023f2ebc7f212764f6e15556b26b586801a12503930e6d5ae0e184e06d930ad'),
                sequenceNumber: 4294967295,
                unlockingScript: utils_1.hexToBin('00')
            },
            {
                outpointIndex: 1,
                outpointTransactionHash: utils_1.hexToBin('ba88ff9d44fd01d1c0c0a5b416e00e79b4824606a3a70f163159b5ce3aca7362'),
                sequenceNumber: 1025685667,
                unlockingScript: utils_1.hexToBin('5351ac526a')
            }
        ],
        locktime: 952780961,
        outputs: [
            {
                lockingScript: utils_1.hexToBin('6552'),
                satoshis: BigInt(73134625)
            },
            {
                lockingScript: utils_1.hexToBin('5253516a656a53'),
                satoshis: BigInt(95890937)
            },
            {
                lockingScript: utils_1.hexToBin(''),
                satoshis: BigInt(17344964)
            },
            {
                lockingScript: utils_1.hexToBin('52525251516a'),
                satoshis: BigInt(19470773)
            }
        ],
        version: 1886435390
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdHJhbnNhY3Rpb24uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHVGQUF1RjtBQUN2Riw4Q0FBdUI7QUFDdkIsK0NBQXFEO0FBQ3JELHlDQUF5QztBQUV6QyxhQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDL0IsTUFBTSxFQUFFLEdBQUcsZ0JBQVEsQ0FDakIsNGVBQTRlLENBQzdlLENBQUM7SUFDRixDQUFDLENBQUMsU0FBUyxDQUFDLGtDQUFvQixDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ3BDLE1BQU0sRUFBRTtZQUNOO2dCQUNFLGFBQWEsRUFBRSxDQUFDO2dCQUNoQix1QkFBdUIsRUFBRSxnQkFBUSxDQUMvQixrRUFBa0UsQ0FDbkU7Z0JBQ0QsY0FBYyxFQUFFLFVBQVU7Z0JBQzFCLGVBQWUsRUFBRSxnQkFBUSxDQUFDLGNBQWMsQ0FBQzthQUMxQztZQUNEO2dCQUNFLGFBQWEsRUFBRSxDQUFDO2dCQUNoQix1QkFBdUIsRUFBRSxnQkFBUSxDQUMvQixrRUFBa0UsQ0FDbkU7Z0JBQ0QsY0FBYyxFQUFFLFVBQVU7Z0JBQzFCLGVBQWUsRUFBRSxnQkFBUSxDQUFDLGtCQUFrQixDQUFDO2FBQzlDO1lBQ0Q7Z0JBQ0UsYUFBYSxFQUFFLENBQUM7Z0JBQ2hCLHVCQUF1QixFQUFFLGdCQUFRLENBQy9CLGtFQUFrRSxDQUNuRTtnQkFDRCxjQUFjLEVBQUUsVUFBVTtnQkFDMUIsZUFBZSxFQUFFLGdCQUFRLENBQUMsSUFBSSxDQUFDO2FBQ2hDO1lBQ0Q7Z0JBQ0UsYUFBYSxFQUFFLENBQUM7Z0JBQ2hCLHVCQUF1QixFQUFFLGdCQUFRLENBQy9CLGtFQUFrRSxDQUNuRTtnQkFDRCxjQUFjLEVBQUUsVUFBVTtnQkFDMUIsZUFBZSxFQUFFLGdCQUFRLENBQUMsWUFBWSxDQUFDO2FBQ3hDO1NBQ0Y7UUFDRCxRQUFRLEVBQUUsU0FBUztRQUNuQixPQUFPLEVBQUU7WUFDUDtnQkFDRSxhQUFhLEVBQUUsZ0JBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQy9CLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDO2FBQzNCO1lBQ0Q7Z0JBQ0UsYUFBYSxFQUFFLGdCQUFRLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3pDLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDO2FBQzNCO1lBQ0Q7Z0JBQ0UsYUFBYSxFQUFFLGdCQUFRLENBQUMsRUFBRSxDQUFDO2dCQUMzQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQzthQUMzQjtZQUNEO2dCQUNFLGFBQWEsRUFBRSxnQkFBUSxDQUFDLGNBQWMsQ0FBQztnQkFDdkMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUM7YUFDM0I7U0FDRjtRQUNELE9BQU8sRUFBRSxVQUFVO0tBQ3BCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=