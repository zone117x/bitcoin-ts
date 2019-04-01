export declare enum BitcoinCashOpcodes {
    /**
     * A.K.A. `OP_FALSE` or `OP_PUSHBYTES_0`
     */
    OP_0 = 0,
    OP_PUSHBYTES_1 = 1,
    OP_PUSHBYTES_2 = 2,
    OP_PUSHBYTES_3 = 3,
    OP_PUSHBYTES_4 = 4,
    OP_PUSHBYTES_5 = 5,
    OP_PUSHBYTES_6 = 6,
    OP_PUSHBYTES_7 = 7,
    OP_PUSHBYTES_8 = 8,
    OP_PUSHBYTES_9 = 9,
    OP_PUSHBYTES_10 = 10,
    OP_PUSHBYTES_11 = 11,
    OP_PUSHBYTES_12 = 12,
    OP_PUSHBYTES_13 = 13,
    OP_PUSHBYTES_14 = 14,
    OP_PUSHBYTES_15 = 15,
    OP_PUSHBYTES_16 = 16,
    OP_PUSHBYTES_17 = 17,
    OP_PUSHBYTES_18 = 18,
    OP_PUSHBYTES_19 = 19,
    OP_PUSHBYTES_20 = 20,
    OP_PUSHBYTES_21 = 21,
    OP_PUSHBYTES_22 = 22,
    OP_PUSHBYTES_23 = 23,
    OP_PUSHBYTES_24 = 24,
    OP_PUSHBYTES_25 = 25,
    OP_PUSHBYTES_26 = 26,
    OP_PUSHBYTES_27 = 27,
    OP_PUSHBYTES_28 = 28,
    OP_PUSHBYTES_29 = 29,
    OP_PUSHBYTES_30 = 30,
    OP_PUSHBYTES_31 = 31,
    OP_PUSHBYTES_32 = 32,
    OP_PUSHBYTES_33 = 33,
    OP_PUSHBYTES_34 = 34,
    OP_PUSHBYTES_35 = 35,
    OP_PUSHBYTES_36 = 36,
    OP_PUSHBYTES_37 = 37,
    OP_PUSHBYTES_38 = 38,
    OP_PUSHBYTES_39 = 39,
    OP_PUSHBYTES_40 = 40,
    OP_PUSHBYTES_41 = 41,
    OP_PUSHBYTES_42 = 42,
    OP_PUSHBYTES_43 = 43,
    OP_PUSHBYTES_44 = 44,
    OP_PUSHBYTES_45 = 45,
    OP_PUSHBYTES_46 = 46,
    OP_PUSHBYTES_47 = 47,
    OP_PUSHBYTES_48 = 48,
    OP_PUSHBYTES_49 = 49,
    OP_PUSHBYTES_50 = 50,
    OP_PUSHBYTES_51 = 51,
    OP_PUSHBYTES_52 = 52,
    OP_PUSHBYTES_53 = 53,
    OP_PUSHBYTES_54 = 54,
    OP_PUSHBYTES_55 = 55,
    OP_PUSHBYTES_56 = 56,
    OP_PUSHBYTES_57 = 57,
    OP_PUSHBYTES_58 = 58,
    OP_PUSHBYTES_59 = 59,
    OP_PUSHBYTES_60 = 60,
    OP_PUSHBYTES_61 = 61,
    OP_PUSHBYTES_62 = 62,
    OP_PUSHBYTES_63 = 63,
    OP_PUSHBYTES_64 = 64,
    OP_PUSHBYTES_65 = 65,
    OP_PUSHBYTES_66 = 66,
    OP_PUSHBYTES_67 = 67,
    OP_PUSHBYTES_68 = 68,
    OP_PUSHBYTES_69 = 69,
    OP_PUSHBYTES_70 = 70,
    OP_PUSHBYTES_71 = 71,
    OP_PUSHBYTES_72 = 72,
    OP_PUSHBYTES_73 = 73,
    OP_PUSHBYTES_74 = 74,
    OP_PUSHBYTES_75 = 75,
    OP_PUSHDATA_1 = 76,
    OP_PUSHDATA_2 = 77,
    OP_PUSHDATA_4 = 78,
    OP_1NEGATE = 79,
    OP_RESERVED = 80,
    /**
     * A.K.A. `OP_TRUE`
     */
    OP_1 = 81,
    OP_2 = 82,
    OP_3 = 83,
    OP_4 = 84,
    OP_5 = 85,
    OP_6 = 86,
    OP_7 = 87,
    OP_8 = 88,
    OP_9 = 89,
    OP_10 = 90,
    OP_11 = 91,
    OP_12 = 92,
    OP_13 = 93,
    OP_14 = 94,
    OP_15 = 95,
    OP_16 = 96,
    OP_NOP = 97,
    OP_VER = 98,
    OP_IF = 99,
    OP_NOTIF = 100,
    OP_VERIF = 101,
    OP_VERNOTIF = 102,
    OP_ELSE = 103,
    OP_ENDIF = 104,
    OP_VERIFY = 105,
    OP_RETURN = 106,
    OP_TOALTSTACK = 107,
    OP_FROMALTSTACK = 108,
    OP_2DROP = 109,
    OP_2DUP = 110,
    OP_3DUP = 111,
    OP_2OVER = 112,
    OP_2ROT = 113,
    OP_2SWAP = 114,
    OP_IFDUP = 115,
    OP_DEPTH = 116,
    OP_DROP = 117,
    OP_DUP = 118,
    OP_NIP = 119,
    OP_OVER = 120,
    OP_PICK = 121,
    OP_ROLL = 122,
    OP_ROT = 123,
    OP_SWAP = 124,
    OP_TUCK = 125,
    OP_CAT = 126,
    OP_SPLIT = 127,
    OP_NUM2BIN = 128,
    OP_BIN2NUM = 129,
    OP_SIZE = 130,
    OP_INVERT = 131,
    OP_AND = 132,
    OP_OR = 133,
    OP_XOR = 134,
    OP_EQUAL = 135,
    OP_EQUALVERIFY = 136,
    OP_RESERVED1 = 137,
    OP_RESERVED2 = 138,
    OP_1ADD = 139,
    OP_1SUB = 140,
    OP_2MUL = 141,
    OP_2DIV = 142,
    OP_NEGATE = 143,
    OP_ABS = 144,
    OP_NOT = 145,
    OP_0NOTEQUAL = 146,
    OP_ADD = 147,
    OP_SUB = 148,
    OP_MUL = 149,
    OP_DIV = 150,
    OP_MOD = 151,
    OP_LSHIFT = 152,
    OP_RSHIFT = 153,
    OP_BOOLAND = 154,
    OP_BOOLOR = 155,
    OP_NUMEQUAL = 156,
    OP_NUMEQUALVERIFY = 157,
    OP_NUMNOTEQUAL = 158,
    OP_LESSTHAN = 159,
    OP_GREATERTHAN = 160,
    OP_LESSTHANOREQUAL = 161,
    OP_GREATERTHANOREQUAL = 162,
    OP_MIN = 163,
    OP_MAX = 164,
    OP_WITHIN = 165,
    OP_RIPEMD160 = 166,
    OP_SHA1 = 167,
    OP_SHA256 = 168,
    OP_HASH160 = 169,
    OP_HASH256 = 170,
    OP_CODESEPARATOR = 171,
    OP_CHECKSIG = 172,
    OP_CHECKSIGVERIFY = 173,
    OP_CHECKMULTISIG = 174,
    OP_CHECKMULTISIGVERIFY = 175,
    OP_NOP1 = 176,
    /**
     * Previously `OP_NOP2`
     */
    OP_CHECKLOCKTIMEVERIFY = 177,
    /**
     * Previously `OP_NOP2`
     */
    OP_CHECKSEQUENCEVERIFY = 178,
    OP_NOP4 = 179,
    OP_NOP5 = 180,
    OP_NOP6 = 181,
    OP_NOP7 = 182,
    OP_NOP8 = 183,
    OP_NOP9 = 184,
    OP_NOP10 = 185,
    /**
     * Previously `OP_UNKNOWN186`
     */
    OP_CHECKDATASIG = 186,
    /**
     * Previously `OP_UNKNOWN187`
     */
    OP_CHECKDATASIGVERIFY = 187,
    /**
     * A.K.A. `FIRST_UNDEFINED_OP_VALUE`
     */
    OP_UNKNOWN188 = 188,
    OP_UNKNOWN189 = 189,
    OP_UNKNOWN190 = 190,
    OP_UNKNOWN191 = 191,
    OP_UNKNOWN192 = 192,
    OP_UNKNOWN193 = 193,
    OP_UNKNOWN194 = 194,
    OP_UNKNOWN195 = 195,
    OP_UNKNOWN196 = 196,
    OP_UNKNOWN197 = 197,
    OP_UNKNOWN198 = 198,
    OP_UNKNOWN199 = 199,
    OP_UNKNOWN200 = 200,
    OP_UNKNOWN201 = 201,
    OP_UNKNOWN202 = 202,
    OP_UNKNOWN203 = 203,
    OP_UNKNOWN204 = 204,
    OP_UNKNOWN205 = 205,
    OP_UNKNOWN206 = 206,
    OP_UNKNOWN207 = 207,
    OP_UNKNOWN208 = 208,
    OP_UNKNOWN209 = 209,
    OP_UNKNOWN210 = 210,
    OP_UNKNOWN211 = 211,
    OP_UNKNOWN212 = 212,
    OP_UNKNOWN213 = 213,
    OP_UNKNOWN214 = 214,
    OP_UNKNOWN215 = 215,
    OP_UNKNOWN216 = 216,
    OP_UNKNOWN217 = 217,
    OP_UNKNOWN218 = 218,
    OP_UNKNOWN219 = 219,
    OP_UNKNOWN220 = 220,
    OP_UNKNOWN221 = 221,
    OP_UNKNOWN222 = 222,
    OP_UNKNOWN223 = 223,
    OP_UNKNOWN224 = 224,
    OP_UNKNOWN225 = 225,
    OP_UNKNOWN226 = 226,
    OP_UNKNOWN227 = 227,
    OP_UNKNOWN228 = 228,
    OP_UNKNOWN229 = 229,
    OP_UNKNOWN230 = 230,
    OP_UNKNOWN231 = 231,
    OP_UNKNOWN232 = 232,
    OP_UNKNOWN233 = 233,
    OP_UNKNOWN234 = 234,
    OP_UNKNOWN235 = 235,
    OP_UNKNOWN236 = 236,
    OP_UNKNOWN237 = 237,
    OP_UNKNOWN238 = 238,
    OP_UNKNOWN239 = 239,
    /**
     * A.K.A. `OP_PREFIX_BEGIN`
     */
    OP_UNKNOWN240 = 240,
    OP_UNKNOWN241 = 241,
    OP_UNKNOWN242 = 242,
    OP_UNKNOWN243 = 243,
    OP_UNKNOWN244 = 244,
    OP_UNKNOWN245 = 245,
    OP_UNKNOWN246 = 246,
    /**
     * A.K.A. `OP_PREFIX_END`
     */
    OP_UNKNOWN247 = 247,
    OP_UNKNOWN248 = 248,
    OP_UNKNOWN249 = 249,
    OP_UNKNOWN250 = 250,
    OP_UNKNOWN251 = 251,
    OP_UNKNOWN252 = 252,
    OP_UNKNOWN253 = 253,
    OP_UNKNOWN254 = 254,
    OP_UNKNOWN255 = 255
}
export declare enum BitcoinCashOpcodeAlternateNames {
    /**
     * A.K.A. `OP_0`
     */
    OP_FALSE = 0,
    /**
     * A.K.A. `OP_0`
     */
    OP_PUSHBYTES_0 = 0,
    /**
     * A.K.A. `OP_1`
     */
    OP_TRUE = 81,
    /**
     * A.K.A. `OP_CHECKLOCKTIMEVERIFY`
     */
    OP_NOP2 = 177,
    /**
     * A.K.A. `OP_CHECKSEQUENCEVERIFY`
     */
    OP_NOP3 = 178,
    /**
     * A.K.A. `OP_CHECKDATASIG`
     */
    OP_UNKNOWN186 = 186,
    /**
     * A.K.A. `OP_CHECKDATASIGVERIFY`
     */
    OP_UNKNOWN187 = 187,
    /**
     * A.K.A. `OP_UNKNOWN188`
     */
    FIRST_UNDEFINED_OP_VALUE = 188,
    /**
     * A.K.A. `OP_UNKNOWN240`. Some implementations have reserved opcodes
     * `0xf0` through `0xf7` for a future range of multi-byte opcodes, though none
     * are yet available on the network.
     */
    OP_PREFIX_BEGIN = 240,
    /**
     * A.K.A. `OP_UNKNOWN247`. Some implementations have reserved opcodes
     * `0xf0` through `0xf7` for a future range of multi-byte opcodes, though none
     * are yet available on the network.
     */
    OP_PREFIX_END = 247,
    /**
     * `OP_SMALLINTEGER` is used internally for template matching in the C++
     * implementation. When found on the network, it is `OP_UNKNOWN250`.
     */
    OP_SMALLINTEGER = 250,
    /**
     * `OP_PUBKEYS` is used internally for template matching in the C++
     * implementation. When found on the network, it is `OP_UNKNOWN251`.
     */
    OP_PUBKEYS = 251,
    /**
     * `OP_PUBKEYHASH` is used internally for template matching in the C++
     * implementation. When found on the network, it is `OP_UNKNOWN253`.
     */
    OP_PUBKEYHASH = 253,
    /**
     * `OP_PUBKEY` is used internally for template matching in the C++
     * implementation. When found on the network, it is `OP_UNKNOWN254`.
     */
    OP_PUBKEY = 254,
    /**
     * `OP_INVALIDOPCODE` is described as such for testing in the C++
     * implementation. When found on the network, it is `OP_UNKNOWN255`.
     */
    OP_INVALIDOPCODE = 255
}
