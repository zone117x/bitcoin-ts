"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BitcoinCashOpcodes;
(function (BitcoinCashOpcodes) {
    /**
     * A.K.A. `OP_FALSE` or `OP_PUSHBYTES_0`
     */
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_0"] = 0] = "OP_0";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_1"] = 1] = "OP_PUSHBYTES_1";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_2"] = 2] = "OP_PUSHBYTES_2";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_3"] = 3] = "OP_PUSHBYTES_3";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_4"] = 4] = "OP_PUSHBYTES_4";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_5"] = 5] = "OP_PUSHBYTES_5";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_6"] = 6] = "OP_PUSHBYTES_6";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_7"] = 7] = "OP_PUSHBYTES_7";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_8"] = 8] = "OP_PUSHBYTES_8";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_9"] = 9] = "OP_PUSHBYTES_9";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_10"] = 10] = "OP_PUSHBYTES_10";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_11"] = 11] = "OP_PUSHBYTES_11";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_12"] = 12] = "OP_PUSHBYTES_12";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_13"] = 13] = "OP_PUSHBYTES_13";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_14"] = 14] = "OP_PUSHBYTES_14";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_15"] = 15] = "OP_PUSHBYTES_15";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_16"] = 16] = "OP_PUSHBYTES_16";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_17"] = 17] = "OP_PUSHBYTES_17";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_18"] = 18] = "OP_PUSHBYTES_18";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_19"] = 19] = "OP_PUSHBYTES_19";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_20"] = 20] = "OP_PUSHBYTES_20";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_21"] = 21] = "OP_PUSHBYTES_21";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_22"] = 22] = "OP_PUSHBYTES_22";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_23"] = 23] = "OP_PUSHBYTES_23";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_24"] = 24] = "OP_PUSHBYTES_24";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_25"] = 25] = "OP_PUSHBYTES_25";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_26"] = 26] = "OP_PUSHBYTES_26";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_27"] = 27] = "OP_PUSHBYTES_27";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_28"] = 28] = "OP_PUSHBYTES_28";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_29"] = 29] = "OP_PUSHBYTES_29";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_30"] = 30] = "OP_PUSHBYTES_30";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_31"] = 31] = "OP_PUSHBYTES_31";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_32"] = 32] = "OP_PUSHBYTES_32";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_33"] = 33] = "OP_PUSHBYTES_33";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_34"] = 34] = "OP_PUSHBYTES_34";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_35"] = 35] = "OP_PUSHBYTES_35";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_36"] = 36] = "OP_PUSHBYTES_36";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_37"] = 37] = "OP_PUSHBYTES_37";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_38"] = 38] = "OP_PUSHBYTES_38";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_39"] = 39] = "OP_PUSHBYTES_39";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_40"] = 40] = "OP_PUSHBYTES_40";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_41"] = 41] = "OP_PUSHBYTES_41";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_42"] = 42] = "OP_PUSHBYTES_42";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_43"] = 43] = "OP_PUSHBYTES_43";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_44"] = 44] = "OP_PUSHBYTES_44";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_45"] = 45] = "OP_PUSHBYTES_45";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_46"] = 46] = "OP_PUSHBYTES_46";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_47"] = 47] = "OP_PUSHBYTES_47";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_48"] = 48] = "OP_PUSHBYTES_48";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_49"] = 49] = "OP_PUSHBYTES_49";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_50"] = 50] = "OP_PUSHBYTES_50";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_51"] = 51] = "OP_PUSHBYTES_51";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_52"] = 52] = "OP_PUSHBYTES_52";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_53"] = 53] = "OP_PUSHBYTES_53";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_54"] = 54] = "OP_PUSHBYTES_54";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_55"] = 55] = "OP_PUSHBYTES_55";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_56"] = 56] = "OP_PUSHBYTES_56";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_57"] = 57] = "OP_PUSHBYTES_57";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_58"] = 58] = "OP_PUSHBYTES_58";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_59"] = 59] = "OP_PUSHBYTES_59";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_60"] = 60] = "OP_PUSHBYTES_60";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_61"] = 61] = "OP_PUSHBYTES_61";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_62"] = 62] = "OP_PUSHBYTES_62";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_63"] = 63] = "OP_PUSHBYTES_63";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_64"] = 64] = "OP_PUSHBYTES_64";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_65"] = 65] = "OP_PUSHBYTES_65";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_66"] = 66] = "OP_PUSHBYTES_66";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_67"] = 67] = "OP_PUSHBYTES_67";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_68"] = 68] = "OP_PUSHBYTES_68";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_69"] = 69] = "OP_PUSHBYTES_69";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_70"] = 70] = "OP_PUSHBYTES_70";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_71"] = 71] = "OP_PUSHBYTES_71";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_72"] = 72] = "OP_PUSHBYTES_72";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_73"] = 73] = "OP_PUSHBYTES_73";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_74"] = 74] = "OP_PUSHBYTES_74";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHBYTES_75"] = 75] = "OP_PUSHBYTES_75";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHDATA_1"] = 76] = "OP_PUSHDATA_1";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHDATA_2"] = 77] = "OP_PUSHDATA_2";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PUSHDATA_4"] = 78] = "OP_PUSHDATA_4";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_1NEGATE"] = 79] = "OP_1NEGATE";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_RESERVED"] = 80] = "OP_RESERVED";
    /**
     * A.K.A. `OP_TRUE`
     */
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_1"] = 81] = "OP_1";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_2"] = 82] = "OP_2";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_3"] = 83] = "OP_3";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_4"] = 84] = "OP_4";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_5"] = 85] = "OP_5";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_6"] = 86] = "OP_6";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_7"] = 87] = "OP_7";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_8"] = 88] = "OP_8";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_9"] = 89] = "OP_9";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_10"] = 90] = "OP_10";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_11"] = 91] = "OP_11";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_12"] = 92] = "OP_12";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_13"] = 93] = "OP_13";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_14"] = 94] = "OP_14";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_15"] = 95] = "OP_15";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_16"] = 96] = "OP_16";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOP"] = 97] = "OP_NOP";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_VER"] = 98] = "OP_VER";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_IF"] = 99] = "OP_IF";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOTIF"] = 100] = "OP_NOTIF";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_VERIF"] = 101] = "OP_VERIF";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_VERNOTIF"] = 102] = "OP_VERNOTIF";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_ELSE"] = 103] = "OP_ELSE";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_ENDIF"] = 104] = "OP_ENDIF";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_VERIFY"] = 105] = "OP_VERIFY";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_RETURN"] = 106] = "OP_RETURN";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_TOALTSTACK"] = 107] = "OP_TOALTSTACK";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_FROMALTSTACK"] = 108] = "OP_FROMALTSTACK";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_2DROP"] = 109] = "OP_2DROP";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_2DUP"] = 110] = "OP_2DUP";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_3DUP"] = 111] = "OP_3DUP";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_2OVER"] = 112] = "OP_2OVER";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_2ROT"] = 113] = "OP_2ROT";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_2SWAP"] = 114] = "OP_2SWAP";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_IFDUP"] = 115] = "OP_IFDUP";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_DEPTH"] = 116] = "OP_DEPTH";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_DROP"] = 117] = "OP_DROP";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_DUP"] = 118] = "OP_DUP";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NIP"] = 119] = "OP_NIP";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_OVER"] = 120] = "OP_OVER";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_PICK"] = 121] = "OP_PICK";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_ROLL"] = 122] = "OP_ROLL";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_ROT"] = 123] = "OP_ROT";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_SWAP"] = 124] = "OP_SWAP";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_TUCK"] = 125] = "OP_TUCK";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_CAT"] = 126] = "OP_CAT";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_SPLIT"] = 127] = "OP_SPLIT";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NUM2BIN"] = 128] = "OP_NUM2BIN";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_BIN2NUM"] = 129] = "OP_BIN2NUM";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_SIZE"] = 130] = "OP_SIZE";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_INVERT"] = 131] = "OP_INVERT";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_AND"] = 132] = "OP_AND";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_OR"] = 133] = "OP_OR";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_XOR"] = 134] = "OP_XOR";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_EQUAL"] = 135] = "OP_EQUAL";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_EQUALVERIFY"] = 136] = "OP_EQUALVERIFY";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_RESERVED1"] = 137] = "OP_RESERVED1";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_RESERVED2"] = 138] = "OP_RESERVED2";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_1ADD"] = 139] = "OP_1ADD";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_1SUB"] = 140] = "OP_1SUB";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_2MUL"] = 141] = "OP_2MUL";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_2DIV"] = 142] = "OP_2DIV";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NEGATE"] = 143] = "OP_NEGATE";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_ABS"] = 144] = "OP_ABS";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOT"] = 145] = "OP_NOT";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_0NOTEQUAL"] = 146] = "OP_0NOTEQUAL";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_ADD"] = 147] = "OP_ADD";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_SUB"] = 148] = "OP_SUB";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_MUL"] = 149] = "OP_MUL";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_DIV"] = 150] = "OP_DIV";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_MOD"] = 151] = "OP_MOD";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_LSHIFT"] = 152] = "OP_LSHIFT";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_RSHIFT"] = 153] = "OP_RSHIFT";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_BOOLAND"] = 154] = "OP_BOOLAND";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_BOOLOR"] = 155] = "OP_BOOLOR";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NUMEQUAL"] = 156] = "OP_NUMEQUAL";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NUMEQUALVERIFY"] = 157] = "OP_NUMEQUALVERIFY";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NUMNOTEQUAL"] = 158] = "OP_NUMNOTEQUAL";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_LESSTHAN"] = 159] = "OP_LESSTHAN";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_GREATERTHAN"] = 160] = "OP_GREATERTHAN";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_LESSTHANOREQUAL"] = 161] = "OP_LESSTHANOREQUAL";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_GREATERTHANOREQUAL"] = 162] = "OP_GREATERTHANOREQUAL";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_MIN"] = 163] = "OP_MIN";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_MAX"] = 164] = "OP_MAX";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_WITHIN"] = 165] = "OP_WITHIN";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_RIPEMD160"] = 166] = "OP_RIPEMD160";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_SHA1"] = 167] = "OP_SHA1";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_SHA256"] = 168] = "OP_SHA256";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_HASH160"] = 169] = "OP_HASH160";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_HASH256"] = 170] = "OP_HASH256";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_CODESEPARATOR"] = 171] = "OP_CODESEPARATOR";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_CHECKSIG"] = 172] = "OP_CHECKSIG";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_CHECKSIGVERIFY"] = 173] = "OP_CHECKSIGVERIFY";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_CHECKMULTISIG"] = 174] = "OP_CHECKMULTISIG";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_CHECKMULTISIGVERIFY"] = 175] = "OP_CHECKMULTISIGVERIFY";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOP1"] = 176] = "OP_NOP1";
    /**
     * Previously `OP_NOP2`
     */
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_CHECKLOCKTIMEVERIFY"] = 177] = "OP_CHECKLOCKTIMEVERIFY";
    /**
     * Previously `OP_NOP2`
     */
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_CHECKSEQUENCEVERIFY"] = 178] = "OP_CHECKSEQUENCEVERIFY";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOP4"] = 179] = "OP_NOP4";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOP5"] = 180] = "OP_NOP5";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOP6"] = 181] = "OP_NOP6";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOP7"] = 182] = "OP_NOP7";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOP8"] = 183] = "OP_NOP8";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOP9"] = 184] = "OP_NOP9";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_NOP10"] = 185] = "OP_NOP10";
    /**
     * Previously `OP_UNKNOWN186`
     */
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_CHECKDATASIG"] = 186] = "OP_CHECKDATASIG";
    /**
     * Previously `OP_UNKNOWN187`
     */
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_CHECKDATASIGVERIFY"] = 187] = "OP_CHECKDATASIGVERIFY";
    /**
     * A.K.A. `FIRST_UNDEFINED_OP_VALUE`
     */
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN188"] = 188] = "OP_UNKNOWN188";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN189"] = 189] = "OP_UNKNOWN189";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN190"] = 190] = "OP_UNKNOWN190";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN191"] = 191] = "OP_UNKNOWN191";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN192"] = 192] = "OP_UNKNOWN192";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN193"] = 193] = "OP_UNKNOWN193";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN194"] = 194] = "OP_UNKNOWN194";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN195"] = 195] = "OP_UNKNOWN195";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN196"] = 196] = "OP_UNKNOWN196";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN197"] = 197] = "OP_UNKNOWN197";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN198"] = 198] = "OP_UNKNOWN198";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN199"] = 199] = "OP_UNKNOWN199";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN200"] = 200] = "OP_UNKNOWN200";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN201"] = 201] = "OP_UNKNOWN201";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN202"] = 202] = "OP_UNKNOWN202";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN203"] = 203] = "OP_UNKNOWN203";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN204"] = 204] = "OP_UNKNOWN204";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN205"] = 205] = "OP_UNKNOWN205";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN206"] = 206] = "OP_UNKNOWN206";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN207"] = 207] = "OP_UNKNOWN207";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN208"] = 208] = "OP_UNKNOWN208";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN209"] = 209] = "OP_UNKNOWN209";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN210"] = 210] = "OP_UNKNOWN210";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN211"] = 211] = "OP_UNKNOWN211";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN212"] = 212] = "OP_UNKNOWN212";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN213"] = 213] = "OP_UNKNOWN213";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN214"] = 214] = "OP_UNKNOWN214";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN215"] = 215] = "OP_UNKNOWN215";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN216"] = 216] = "OP_UNKNOWN216";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN217"] = 217] = "OP_UNKNOWN217";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN218"] = 218] = "OP_UNKNOWN218";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN219"] = 219] = "OP_UNKNOWN219";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN220"] = 220] = "OP_UNKNOWN220";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN221"] = 221] = "OP_UNKNOWN221";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN222"] = 222] = "OP_UNKNOWN222";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN223"] = 223] = "OP_UNKNOWN223";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN224"] = 224] = "OP_UNKNOWN224";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN225"] = 225] = "OP_UNKNOWN225";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN226"] = 226] = "OP_UNKNOWN226";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN227"] = 227] = "OP_UNKNOWN227";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN228"] = 228] = "OP_UNKNOWN228";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN229"] = 229] = "OP_UNKNOWN229";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN230"] = 230] = "OP_UNKNOWN230";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN231"] = 231] = "OP_UNKNOWN231";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN232"] = 232] = "OP_UNKNOWN232";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN233"] = 233] = "OP_UNKNOWN233";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN234"] = 234] = "OP_UNKNOWN234";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN235"] = 235] = "OP_UNKNOWN235";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN236"] = 236] = "OP_UNKNOWN236";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN237"] = 237] = "OP_UNKNOWN237";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN238"] = 238] = "OP_UNKNOWN238";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN239"] = 239] = "OP_UNKNOWN239";
    /**
     * A.K.A. `OP_PREFIX_BEGIN`
     */
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN240"] = 240] = "OP_UNKNOWN240";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN241"] = 241] = "OP_UNKNOWN241";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN242"] = 242] = "OP_UNKNOWN242";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN243"] = 243] = "OP_UNKNOWN243";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN244"] = 244] = "OP_UNKNOWN244";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN245"] = 245] = "OP_UNKNOWN245";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN246"] = 246] = "OP_UNKNOWN246";
    /**
     * A.K.A. `OP_PREFIX_END`
     */
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN247"] = 247] = "OP_UNKNOWN247";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN248"] = 248] = "OP_UNKNOWN248";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN249"] = 249] = "OP_UNKNOWN249";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN250"] = 250] = "OP_UNKNOWN250";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN251"] = 251] = "OP_UNKNOWN251";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN252"] = 252] = "OP_UNKNOWN252";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN253"] = 253] = "OP_UNKNOWN253";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN254"] = 254] = "OP_UNKNOWN254";
    BitcoinCashOpcodes[BitcoinCashOpcodes["OP_UNKNOWN255"] = 255] = "OP_UNKNOWN255";
})(BitcoinCashOpcodes = exports.BitcoinCashOpcodes || (exports.BitcoinCashOpcodes = {}));
var BitcoinCashOpcodeAlternateNames;
(function (BitcoinCashOpcodeAlternateNames) {
    /**
     * A.K.A. `OP_0`
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_FALSE"] = 0] = "OP_FALSE";
    /**
     * A.K.A. `OP_0`
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_PUSHBYTES_0"] = 0] = "OP_PUSHBYTES_0";
    /**
     * A.K.A. `OP_1`
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_TRUE"] = 81] = "OP_TRUE";
    /**
     * A.K.A. `OP_CHECKLOCKTIMEVERIFY`
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_NOP2"] = 177] = "OP_NOP2";
    /**
     * A.K.A. `OP_CHECKSEQUENCEVERIFY`
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_NOP3"] = 178] = "OP_NOP3";
    /**
     * A.K.A. `OP_CHECKDATASIG`
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_UNKNOWN186"] = 186] = "OP_UNKNOWN186";
    /**
     * A.K.A. `OP_CHECKDATASIGVERIFY`
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_UNKNOWN187"] = 187] = "OP_UNKNOWN187";
    /**
     * A.K.A. `OP_UNKNOWN188`
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["FIRST_UNDEFINED_OP_VALUE"] = 188] = "FIRST_UNDEFINED_OP_VALUE";
    /**
     * A.K.A. `OP_UNKNOWN240`. Some implementations have reserved opcodes
     * `0xf0` through `0xf7` for a future range of multi-byte opcodes, though none
     * are yet available on the network.
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_PREFIX_BEGIN"] = 240] = "OP_PREFIX_BEGIN";
    /**
     * A.K.A. `OP_UNKNOWN247`. Some implementations have reserved opcodes
     * `0xf0` through `0xf7` for a future range of multi-byte opcodes, though none
     * are yet available on the network.
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_PREFIX_END"] = 247] = "OP_PREFIX_END";
    /**
     * `OP_SMALLINTEGER` is used internally for template matching in the C++
     * implementation. When found on the network, it is `OP_UNKNOWN250`.
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_SMALLINTEGER"] = 250] = "OP_SMALLINTEGER";
    /**
     * `OP_PUBKEYS` is used internally for template matching in the C++
     * implementation. When found on the network, it is `OP_UNKNOWN251`.
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_PUBKEYS"] = 251] = "OP_PUBKEYS";
    /**
     * `OP_PUBKEYHASH` is used internally for template matching in the C++
     * implementation. When found on the network, it is `OP_UNKNOWN253`.
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_PUBKEYHASH"] = 253] = "OP_PUBKEYHASH";
    /**
     * `OP_PUBKEY` is used internally for template matching in the C++
     * implementation. When found on the network, it is `OP_UNKNOWN254`.
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_PUBKEY"] = 254] = "OP_PUBKEY";
    /**
     * `OP_INVALIDOPCODE` is described as such for testing in the C++
     * implementation. When found on the network, it is `OP_UNKNOWN255`.
     */
    BitcoinCashOpcodeAlternateNames[BitcoinCashOpcodeAlternateNames["OP_INVALIDOPCODE"] = 255] = "OP_INVALIDOPCODE";
})(BitcoinCashOpcodeAlternateNames = exports.BitcoinCashOpcodeAlternateNames || (exports.BitcoinCashOpcodeAlternateNames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0Y29pbi1jYXNoLW9wY29kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2F1dGgvaW5zdHJ1Y3Rpb24tc2V0cy9iaXRjb2luLWNhc2gvYml0Y29pbi1jYXNoLW9wY29kZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFZLGtCQTRSWDtBQTVSRCxXQUFZLGtCQUFrQjtJQUM1Qjs7T0FFRztJQUNILDJEQUFXLENBQUE7SUFDWCwrRUFBcUIsQ0FBQTtJQUNyQiwrRUFBcUIsQ0FBQTtJQUNyQiwrRUFBcUIsQ0FBQTtJQUNyQiwrRUFBcUIsQ0FBQTtJQUNyQiwrRUFBcUIsQ0FBQTtJQUNyQiwrRUFBcUIsQ0FBQTtJQUNyQiwrRUFBcUIsQ0FBQTtJQUNyQiwrRUFBcUIsQ0FBQTtJQUNyQiwrRUFBcUIsQ0FBQTtJQUNyQixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0QixrRkFBc0IsQ0FBQTtJQUN0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QiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQiwrRUFBb0IsQ0FBQTtJQUNwQjs7T0FFRztJQUNILCtFQUFvQixDQUFBO0lBQ3BCLCtFQUFvQixDQUFBO0lBQ3BCLCtFQUFvQixDQUFBO0lBQ3BCLCtFQUFvQixDQUFBO0lBQ3BCLCtFQUFvQixDQUFBO0lBQ3BCLCtFQUFvQixDQUFBO0lBQ3BCLCtFQUFvQixDQUFBO0lBQ3BCOztPQUVHO0lBQ0gsK0VBQW9CLENBQUE7SUFDcEIsK0VBQW9CLENBQUE7SUFDcEIsK0VBQW9CLENBQUE7SUFDcEIsK0VBQW9CLENBQUE7SUFDcEIsK0VBQW9CLENBQUE7SUFDcEIsK0VBQW9CLENBQUE7SUFDcEIsK0VBQW9CLENBQUE7SUFDcEIsK0VBQW9CLENBQUE7SUFDcEIsK0VBQW9CLENBQUE7QUFDdEIsQ0FBQyxFQTVSVyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQTRSN0I7QUFFRCxJQUFZLCtCQXNFWDtBQXRFRCxXQUFZLCtCQUErQjtJQUN6Qzs7T0FFRztJQUNILDZGQUFlLENBQUE7SUFDZjs7T0FFRztJQUNILHlHQUFxQixDQUFBO0lBQ3JCOztPQUVHO0lBQ0gsNEZBQWMsQ0FBQTtJQUNkOztPQUVHO0lBQ0gsNkZBQWMsQ0FBQTtJQUNkOztPQUVHO0lBQ0gsNkZBQWMsQ0FBQTtJQUNkOztPQUVHO0lBQ0gseUdBQW9CLENBQUE7SUFDcEI7O09BRUc7SUFDSCx5R0FBb0IsQ0FBQTtJQUNwQjs7T0FFRztJQUNILCtIQUErQixDQUFBO0lBQy9COzs7O09BSUc7SUFDSCw2R0FBc0IsQ0FBQTtJQUN0Qjs7OztPQUlHO0lBQ0gseUdBQW9CLENBQUE7SUFDcEI7OztPQUdHO0lBQ0gsNkdBQXNCLENBQUE7SUFDdEI7OztPQUdHO0lBQ0gsbUdBQWlCLENBQUE7SUFDakI7OztPQUdHO0lBQ0gseUdBQW9CLENBQUE7SUFDcEI7OztPQUdHO0lBQ0gsaUdBQWdCLENBQUE7SUFDaEI7OztPQUdHO0lBQ0gsK0dBQXVCLENBQUE7QUFDekIsQ0FBQyxFQXRFVywrQkFBK0IsR0FBL0IsdUNBQStCLEtBQS9CLHVDQUErQixRQXNFMUMifQ==