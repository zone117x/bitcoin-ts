"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonOpcodes;
(function (CommonOpcodes) {
    /**
     * A.K.A. `OP_FALSE` or `OP_PUSHBYTES_0`
     */
    CommonOpcodes[CommonOpcodes["OP_0"] = 0] = "OP_0";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_1"] = 1] = "OP_PUSHBYTES_1";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_2"] = 2] = "OP_PUSHBYTES_2";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_3"] = 3] = "OP_PUSHBYTES_3";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_4"] = 4] = "OP_PUSHBYTES_4";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_5"] = 5] = "OP_PUSHBYTES_5";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_6"] = 6] = "OP_PUSHBYTES_6";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_7"] = 7] = "OP_PUSHBYTES_7";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_8"] = 8] = "OP_PUSHBYTES_8";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_9"] = 9] = "OP_PUSHBYTES_9";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_10"] = 10] = "OP_PUSHBYTES_10";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_11"] = 11] = "OP_PUSHBYTES_11";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_12"] = 12] = "OP_PUSHBYTES_12";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_13"] = 13] = "OP_PUSHBYTES_13";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_14"] = 14] = "OP_PUSHBYTES_14";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_15"] = 15] = "OP_PUSHBYTES_15";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_16"] = 16] = "OP_PUSHBYTES_16";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_17"] = 17] = "OP_PUSHBYTES_17";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_18"] = 18] = "OP_PUSHBYTES_18";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_19"] = 19] = "OP_PUSHBYTES_19";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_20"] = 20] = "OP_PUSHBYTES_20";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_21"] = 21] = "OP_PUSHBYTES_21";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_22"] = 22] = "OP_PUSHBYTES_22";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_23"] = 23] = "OP_PUSHBYTES_23";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_24"] = 24] = "OP_PUSHBYTES_24";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_25"] = 25] = "OP_PUSHBYTES_25";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_26"] = 26] = "OP_PUSHBYTES_26";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_27"] = 27] = "OP_PUSHBYTES_27";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_28"] = 28] = "OP_PUSHBYTES_28";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_29"] = 29] = "OP_PUSHBYTES_29";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_30"] = 30] = "OP_PUSHBYTES_30";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_31"] = 31] = "OP_PUSHBYTES_31";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_32"] = 32] = "OP_PUSHBYTES_32";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_33"] = 33] = "OP_PUSHBYTES_33";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_34"] = 34] = "OP_PUSHBYTES_34";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_35"] = 35] = "OP_PUSHBYTES_35";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_36"] = 36] = "OP_PUSHBYTES_36";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_37"] = 37] = "OP_PUSHBYTES_37";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_38"] = 38] = "OP_PUSHBYTES_38";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_39"] = 39] = "OP_PUSHBYTES_39";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_40"] = 40] = "OP_PUSHBYTES_40";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_41"] = 41] = "OP_PUSHBYTES_41";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_42"] = 42] = "OP_PUSHBYTES_42";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_43"] = 43] = "OP_PUSHBYTES_43";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_44"] = 44] = "OP_PUSHBYTES_44";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_45"] = 45] = "OP_PUSHBYTES_45";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_46"] = 46] = "OP_PUSHBYTES_46";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_47"] = 47] = "OP_PUSHBYTES_47";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_48"] = 48] = "OP_PUSHBYTES_48";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_49"] = 49] = "OP_PUSHBYTES_49";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_50"] = 50] = "OP_PUSHBYTES_50";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_51"] = 51] = "OP_PUSHBYTES_51";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_52"] = 52] = "OP_PUSHBYTES_52";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_53"] = 53] = "OP_PUSHBYTES_53";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_54"] = 54] = "OP_PUSHBYTES_54";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_55"] = 55] = "OP_PUSHBYTES_55";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_56"] = 56] = "OP_PUSHBYTES_56";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_57"] = 57] = "OP_PUSHBYTES_57";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_58"] = 58] = "OP_PUSHBYTES_58";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_59"] = 59] = "OP_PUSHBYTES_59";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_60"] = 60] = "OP_PUSHBYTES_60";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_61"] = 61] = "OP_PUSHBYTES_61";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_62"] = 62] = "OP_PUSHBYTES_62";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_63"] = 63] = "OP_PUSHBYTES_63";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_64"] = 64] = "OP_PUSHBYTES_64";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_65"] = 65] = "OP_PUSHBYTES_65";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_66"] = 66] = "OP_PUSHBYTES_66";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_67"] = 67] = "OP_PUSHBYTES_67";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_68"] = 68] = "OP_PUSHBYTES_68";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_69"] = 69] = "OP_PUSHBYTES_69";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_70"] = 70] = "OP_PUSHBYTES_70";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_71"] = 71] = "OP_PUSHBYTES_71";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_72"] = 72] = "OP_PUSHBYTES_72";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_73"] = 73] = "OP_PUSHBYTES_73";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_74"] = 74] = "OP_PUSHBYTES_74";
    CommonOpcodes[CommonOpcodes["OP_PUSHBYTES_75"] = 75] = "OP_PUSHBYTES_75";
    CommonOpcodes[CommonOpcodes["OP_PUSHDATA_1"] = 76] = "OP_PUSHDATA_1";
    CommonOpcodes[CommonOpcodes["OP_PUSHDATA_2"] = 77] = "OP_PUSHDATA_2";
    CommonOpcodes[CommonOpcodes["OP_PUSHDATA_4"] = 78] = "OP_PUSHDATA_4";
    CommonOpcodes[CommonOpcodes["OP_1NEGATE"] = 79] = "OP_1NEGATE";
    CommonOpcodes[CommonOpcodes["OP_RESERVED"] = 80] = "OP_RESERVED";
    /**
     * A.K.A. `OP_TRUE`
     */
    CommonOpcodes[CommonOpcodes["OP_1"] = 81] = "OP_1";
    CommonOpcodes[CommonOpcodes["OP_2"] = 82] = "OP_2";
    CommonOpcodes[CommonOpcodes["OP_3"] = 83] = "OP_3";
    CommonOpcodes[CommonOpcodes["OP_4"] = 84] = "OP_4";
    CommonOpcodes[CommonOpcodes["OP_5"] = 85] = "OP_5";
    CommonOpcodes[CommonOpcodes["OP_6"] = 86] = "OP_6";
    CommonOpcodes[CommonOpcodes["OP_7"] = 87] = "OP_7";
    CommonOpcodes[CommonOpcodes["OP_8"] = 88] = "OP_8";
    CommonOpcodes[CommonOpcodes["OP_9"] = 89] = "OP_9";
    CommonOpcodes[CommonOpcodes["OP_10"] = 90] = "OP_10";
    CommonOpcodes[CommonOpcodes["OP_11"] = 91] = "OP_11";
    CommonOpcodes[CommonOpcodes["OP_12"] = 92] = "OP_12";
    CommonOpcodes[CommonOpcodes["OP_13"] = 93] = "OP_13";
    CommonOpcodes[CommonOpcodes["OP_14"] = 94] = "OP_14";
    CommonOpcodes[CommonOpcodes["OP_15"] = 95] = "OP_15";
    CommonOpcodes[CommonOpcodes["OP_16"] = 96] = "OP_16";
    CommonOpcodes[CommonOpcodes["OP_NOP"] = 97] = "OP_NOP";
    CommonOpcodes[CommonOpcodes["OP_VER"] = 98] = "OP_VER";
    CommonOpcodes[CommonOpcodes["OP_IF"] = 99] = "OP_IF";
    CommonOpcodes[CommonOpcodes["OP_NOTIF"] = 100] = "OP_NOTIF";
    CommonOpcodes[CommonOpcodes["OP_VERIF"] = 101] = "OP_VERIF";
    CommonOpcodes[CommonOpcodes["OP_VERNOTIF"] = 102] = "OP_VERNOTIF";
    CommonOpcodes[CommonOpcodes["OP_ELSE"] = 103] = "OP_ELSE";
    CommonOpcodes[CommonOpcodes["OP_ENDIF"] = 104] = "OP_ENDIF";
    CommonOpcodes[CommonOpcodes["OP_VERIFY"] = 105] = "OP_VERIFY";
    CommonOpcodes[CommonOpcodes["OP_RETURN"] = 106] = "OP_RETURN";
    CommonOpcodes[CommonOpcodes["OP_TOALTSTACK"] = 107] = "OP_TOALTSTACK";
    CommonOpcodes[CommonOpcodes["OP_FROMALTSTACK"] = 108] = "OP_FROMALTSTACK";
    CommonOpcodes[CommonOpcodes["OP_2DROP"] = 109] = "OP_2DROP";
    CommonOpcodes[CommonOpcodes["OP_2DUP"] = 110] = "OP_2DUP";
    CommonOpcodes[CommonOpcodes["OP_3DUP"] = 111] = "OP_3DUP";
    CommonOpcodes[CommonOpcodes["OP_2OVER"] = 112] = "OP_2OVER";
    CommonOpcodes[CommonOpcodes["OP_2ROT"] = 113] = "OP_2ROT";
    CommonOpcodes[CommonOpcodes["OP_2SWAP"] = 114] = "OP_2SWAP";
    CommonOpcodes[CommonOpcodes["OP_IFDUP"] = 115] = "OP_IFDUP";
    CommonOpcodes[CommonOpcodes["OP_DEPTH"] = 116] = "OP_DEPTH";
    CommonOpcodes[CommonOpcodes["OP_DROP"] = 117] = "OP_DROP";
    CommonOpcodes[CommonOpcodes["OP_DUP"] = 118] = "OP_DUP";
    CommonOpcodes[CommonOpcodes["OP_NIP"] = 119] = "OP_NIP";
    CommonOpcodes[CommonOpcodes["OP_OVER"] = 120] = "OP_OVER";
    CommonOpcodes[CommonOpcodes["OP_PICK"] = 121] = "OP_PICK";
    CommonOpcodes[CommonOpcodes["OP_ROLL"] = 122] = "OP_ROLL";
    CommonOpcodes[CommonOpcodes["OP_ROT"] = 123] = "OP_ROT";
    CommonOpcodes[CommonOpcodes["OP_SWAP"] = 124] = "OP_SWAP";
    CommonOpcodes[CommonOpcodes["OP_TUCK"] = 125] = "OP_TUCK";
    CommonOpcodes[CommonOpcodes["OP_CAT"] = 126] = "OP_CAT";
    CommonOpcodes[CommonOpcodes["OP_SPLIT"] = 127] = "OP_SPLIT";
    CommonOpcodes[CommonOpcodes["OP_NUM2BIN"] = 128] = "OP_NUM2BIN";
    CommonOpcodes[CommonOpcodes["OP_BIN2NUM"] = 129] = "OP_BIN2NUM";
    CommonOpcodes[CommonOpcodes["OP_SIZE"] = 130] = "OP_SIZE";
    CommonOpcodes[CommonOpcodes["OP_INVERT"] = 131] = "OP_INVERT";
    CommonOpcodes[CommonOpcodes["OP_AND"] = 132] = "OP_AND";
    CommonOpcodes[CommonOpcodes["OP_OR"] = 133] = "OP_OR";
    CommonOpcodes[CommonOpcodes["OP_XOR"] = 134] = "OP_XOR";
    CommonOpcodes[CommonOpcodes["OP_EQUAL"] = 135] = "OP_EQUAL";
    CommonOpcodes[CommonOpcodes["OP_EQUALVERIFY"] = 136] = "OP_EQUALVERIFY";
    CommonOpcodes[CommonOpcodes["OP_RESERVED1"] = 137] = "OP_RESERVED1";
    CommonOpcodes[CommonOpcodes["OP_RESERVED2"] = 138] = "OP_RESERVED2";
    CommonOpcodes[CommonOpcodes["OP_1ADD"] = 139] = "OP_1ADD";
    CommonOpcodes[CommonOpcodes["OP_1SUB"] = 140] = "OP_1SUB";
    CommonOpcodes[CommonOpcodes["OP_2MUL"] = 141] = "OP_2MUL";
    CommonOpcodes[CommonOpcodes["OP_2DIV"] = 142] = "OP_2DIV";
    CommonOpcodes[CommonOpcodes["OP_NEGATE"] = 143] = "OP_NEGATE";
    CommonOpcodes[CommonOpcodes["OP_ABS"] = 144] = "OP_ABS";
    CommonOpcodes[CommonOpcodes["OP_NOT"] = 145] = "OP_NOT";
    CommonOpcodes[CommonOpcodes["OP_0NOTEQUAL"] = 146] = "OP_0NOTEQUAL";
    CommonOpcodes[CommonOpcodes["OP_ADD"] = 147] = "OP_ADD";
    CommonOpcodes[CommonOpcodes["OP_SUB"] = 148] = "OP_SUB";
    CommonOpcodes[CommonOpcodes["OP_MUL"] = 149] = "OP_MUL";
    CommonOpcodes[CommonOpcodes["OP_DIV"] = 150] = "OP_DIV";
    CommonOpcodes[CommonOpcodes["OP_MOD"] = 151] = "OP_MOD";
    CommonOpcodes[CommonOpcodes["OP_LSHIFT"] = 152] = "OP_LSHIFT";
    CommonOpcodes[CommonOpcodes["OP_RSHIFT"] = 153] = "OP_RSHIFT";
    CommonOpcodes[CommonOpcodes["OP_BOOLAND"] = 154] = "OP_BOOLAND";
    CommonOpcodes[CommonOpcodes["OP_BOOLOR"] = 155] = "OP_BOOLOR";
    CommonOpcodes[CommonOpcodes["OP_NUMEQUAL"] = 156] = "OP_NUMEQUAL";
    CommonOpcodes[CommonOpcodes["OP_NUMEQUALVERIFY"] = 157] = "OP_NUMEQUALVERIFY";
    CommonOpcodes[CommonOpcodes["OP_NUMNOTEQUAL"] = 158] = "OP_NUMNOTEQUAL";
    CommonOpcodes[CommonOpcodes["OP_LESSTHAN"] = 159] = "OP_LESSTHAN";
    CommonOpcodes[CommonOpcodes["OP_GREATERTHAN"] = 160] = "OP_GREATERTHAN";
    CommonOpcodes[CommonOpcodes["OP_LESSTHANOREQUAL"] = 161] = "OP_LESSTHANOREQUAL";
    CommonOpcodes[CommonOpcodes["OP_GREATERTHANOREQUAL"] = 162] = "OP_GREATERTHANOREQUAL";
    CommonOpcodes[CommonOpcodes["OP_MIN"] = 163] = "OP_MIN";
    CommonOpcodes[CommonOpcodes["OP_MAX"] = 164] = "OP_MAX";
    CommonOpcodes[CommonOpcodes["OP_WITHIN"] = 165] = "OP_WITHIN";
    CommonOpcodes[CommonOpcodes["OP_RIPEMD160"] = 166] = "OP_RIPEMD160";
    CommonOpcodes[CommonOpcodes["OP_SHA1"] = 167] = "OP_SHA1";
    CommonOpcodes[CommonOpcodes["OP_SHA256"] = 168] = "OP_SHA256";
    CommonOpcodes[CommonOpcodes["OP_HASH160"] = 169] = "OP_HASH160";
    CommonOpcodes[CommonOpcodes["OP_HASH256"] = 170] = "OP_HASH256";
    CommonOpcodes[CommonOpcodes["OP_CODESEPARATOR"] = 171] = "OP_CODESEPARATOR";
    CommonOpcodes[CommonOpcodes["OP_CHECKSIG"] = 172] = "OP_CHECKSIG";
    CommonOpcodes[CommonOpcodes["OP_CHECKSIGVERIFY"] = 173] = "OP_CHECKSIGVERIFY";
    CommonOpcodes[CommonOpcodes["OP_CHECKMULTISIG"] = 174] = "OP_CHECKMULTISIG";
    CommonOpcodes[CommonOpcodes["OP_CHECKMULTISIGVERIFY"] = 175] = "OP_CHECKMULTISIGVERIFY";
    CommonOpcodes[CommonOpcodes["OP_NOP1"] = 176] = "OP_NOP1";
    /**
     * Previously `OP_NOP2`
     */
    CommonOpcodes[CommonOpcodes["OP_CHECKLOCKTIMEVERIFY"] = 177] = "OP_CHECKLOCKTIMEVERIFY";
    /**
     * Previously `OP_NOP2`
     */
    CommonOpcodes[CommonOpcodes["OP_CHECKSEQUENCEVERIFY"] = 178] = "OP_CHECKSEQUENCEVERIFY";
    CommonOpcodes[CommonOpcodes["OP_NOP4"] = 179] = "OP_NOP4";
    CommonOpcodes[CommonOpcodes["OP_NOP5"] = 180] = "OP_NOP5";
    CommonOpcodes[CommonOpcodes["OP_NOP6"] = 181] = "OP_NOP6";
    CommonOpcodes[CommonOpcodes["OP_NOP7"] = 182] = "OP_NOP7";
    CommonOpcodes[CommonOpcodes["OP_NOP8"] = 183] = "OP_NOP8";
    CommonOpcodes[CommonOpcodes["OP_NOP9"] = 184] = "OP_NOP9";
    CommonOpcodes[CommonOpcodes["OP_NOP10"] = 185] = "OP_NOP10";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN186"] = 186] = "OP_UNKNOWN186";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN187"] = 187] = "OP_UNKNOWN187";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN188"] = 188] = "OP_UNKNOWN188";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN189"] = 189] = "OP_UNKNOWN189";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN190"] = 190] = "OP_UNKNOWN190";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN191"] = 191] = "OP_UNKNOWN191";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN192"] = 192] = "OP_UNKNOWN192";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN193"] = 193] = "OP_UNKNOWN193";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN194"] = 194] = "OP_UNKNOWN194";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN195"] = 195] = "OP_UNKNOWN195";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN196"] = 196] = "OP_UNKNOWN196";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN197"] = 197] = "OP_UNKNOWN197";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN198"] = 198] = "OP_UNKNOWN198";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN199"] = 199] = "OP_UNKNOWN199";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN200"] = 200] = "OP_UNKNOWN200";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN201"] = 201] = "OP_UNKNOWN201";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN202"] = 202] = "OP_UNKNOWN202";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN203"] = 203] = "OP_UNKNOWN203";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN204"] = 204] = "OP_UNKNOWN204";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN205"] = 205] = "OP_UNKNOWN205";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN206"] = 206] = "OP_UNKNOWN206";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN207"] = 207] = "OP_UNKNOWN207";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN208"] = 208] = "OP_UNKNOWN208";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN209"] = 209] = "OP_UNKNOWN209";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN210"] = 210] = "OP_UNKNOWN210";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN211"] = 211] = "OP_UNKNOWN211";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN212"] = 212] = "OP_UNKNOWN212";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN213"] = 213] = "OP_UNKNOWN213";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN214"] = 214] = "OP_UNKNOWN214";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN215"] = 215] = "OP_UNKNOWN215";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN216"] = 216] = "OP_UNKNOWN216";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN217"] = 217] = "OP_UNKNOWN217";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN218"] = 218] = "OP_UNKNOWN218";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN219"] = 219] = "OP_UNKNOWN219";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN220"] = 220] = "OP_UNKNOWN220";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN221"] = 221] = "OP_UNKNOWN221";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN222"] = 222] = "OP_UNKNOWN222";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN223"] = 223] = "OP_UNKNOWN223";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN224"] = 224] = "OP_UNKNOWN224";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN225"] = 225] = "OP_UNKNOWN225";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN226"] = 226] = "OP_UNKNOWN226";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN227"] = 227] = "OP_UNKNOWN227";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN228"] = 228] = "OP_UNKNOWN228";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN229"] = 229] = "OP_UNKNOWN229";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN230"] = 230] = "OP_UNKNOWN230";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN231"] = 231] = "OP_UNKNOWN231";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN232"] = 232] = "OP_UNKNOWN232";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN233"] = 233] = "OP_UNKNOWN233";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN234"] = 234] = "OP_UNKNOWN234";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN235"] = 235] = "OP_UNKNOWN235";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN236"] = 236] = "OP_UNKNOWN236";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN237"] = 237] = "OP_UNKNOWN237";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN238"] = 238] = "OP_UNKNOWN238";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN239"] = 239] = "OP_UNKNOWN239";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN240"] = 240] = "OP_UNKNOWN240";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN241"] = 241] = "OP_UNKNOWN241";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN242"] = 242] = "OP_UNKNOWN242";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN243"] = 243] = "OP_UNKNOWN243";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN244"] = 244] = "OP_UNKNOWN244";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN245"] = 245] = "OP_UNKNOWN245";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN246"] = 246] = "OP_UNKNOWN246";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN247"] = 247] = "OP_UNKNOWN247";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN248"] = 248] = "OP_UNKNOWN248";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN249"] = 249] = "OP_UNKNOWN249";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN250"] = 250] = "OP_UNKNOWN250";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN251"] = 251] = "OP_UNKNOWN251";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN252"] = 252] = "OP_UNKNOWN252";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN253"] = 253] = "OP_UNKNOWN253";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN254"] = 254] = "OP_UNKNOWN254";
    CommonOpcodes[CommonOpcodes["OP_UNKNOWN255"] = 255] = "OP_UNKNOWN255";
})(CommonOpcodes = exports.CommonOpcodes || (exports.CommonOpcodes = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3Bjb2Rlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYXV0aC9pbnN0cnVjdGlvbi1zZXRzL2NvbW1vbi9vcGNvZGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBWSxhQTZRWDtBQTdRRCxXQUFZLGFBQWE7SUFDdkI7O09BRUc7SUFDSCxpREFBVyxDQUFBO0lBQ1gscUVBQXFCLENBQUE7SUFDckIscUVBQXFCLENBQUE7SUFDckIscUVBQXFCLENBQUE7SUFDckIscUVBQXFCLENBQUE7SUFDckIscUVBQXFCLENBQUE7SUFDckIscUVBQXFCLENBQUE7SUFDckIscUVBQXFCLENBQUE7SUFDckIscUVBQXFCLENBQUE7SUFDckIscUVBQXFCLENBQUE7SUFDckIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsd0VBQXNCLENBQUE7SUFDdEIsb0VBQW9CLENBQUE7SUFDcEIsb0VBQW9CLENBQUE7SUFDcEIsb0VBQW9CLENBQUE7SUFDcEIsOERBQWlCLENBQUE7SUFDakIsZ0VBQWtCLENBQUE7SUFDbEI7O09BRUc7SUFDSCxrREFBVyxDQUFBO0lBQ1gsa0RBQVcsQ0FBQTtJQUNYLGtEQUFXLENBQUE7SUFDWCxrREFBVyxDQUFBO0lBQ1gsa0RBQVcsQ0FBQTtJQUNYLGtEQUFXLENBQUE7SUFDWCxrREFBVyxDQUFBO0lBQ1gsa0RBQVcsQ0FBQTtJQUNYLGtE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SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7SUFDcEIscUVBQW9CLENBQUE7QUFDdEIsQ0FBQyxFQTdRVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQTZReEIifQ==