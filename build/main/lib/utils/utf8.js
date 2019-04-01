"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: clean up - this implementation comes from:
// https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js
// consider switching to:
// https://github.com/mathiasbynens/utf8.js/blob/master/utf8.js
// tslint:disable:cyclomatic-complexity readonly-array no-let no-if-statement no-magic-numbers no-object-mutation no-expression-statement no-bitwise
exports.utf8ToBin = (utf8) => {
    const out = [];
    let p = 0;
    for (let i = 0; i < utf8.length; i++) {
        let c = utf8.charCodeAt(i);
        if (c < 128) {
            out[p++] = c;
        }
        else if (c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        }
        else if ((c & 0xfc00) === 0xd800 &&
            i + 1 < utf8.length &&
            (utf8.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
            c = ((c & 0x03ff) << 10) + 0x10000 + (utf8.charCodeAt(++i) & 0x03ff);
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
        else {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return new Uint8Array(out);
};
// tslint:enable:cyclomatic-complexity readonly-array no-let no-if-statement no-magic-numbers no-object-mutation no-expression-statement no-bitwise
// also compare to:
// https://gist.github.com/joni/3760795
// https://gist.github.com/pascaldekloe/62546103a1576803dade9269ccf76330
// and:
// function stringFromUTF8Array(data)
// {
//   const extraByteMap = [ 1, 1, 1, 1, 2, 2, 3, 0 ];
//   var count = data.length;
//   var str = "";
//   for (var index = 0;index < count;)
//   {
//     var ch = data[index++];
//     if (ch & 0x80)
//     {
//       var extra = extraByteMap[(ch >> 3) & 0x07];
//       if (!(ch & 0x40) || !extra || ((index + extra) > count))
//         return null;
//       ch = ch & (0x3F >> extra);
//       for (;extra > 0;extra -= 1)
//       {
//         var chx = data[index++];
//         if ((chx & 0xC0) != 0x80)
//           return null;
//         ch = (ch << 6) | (chx & 0x3F);
//       }
//     }
//     str += String.fromCharCode(ch);
//   }
//   return str;
// }
// tslint:disable:cyclomatic-complexity readonly-array no-let no-if-statement no-magic-numbers no-object-mutation no-expression-statement no-bitwise
exports.binToUtf8 = (bytes) => {
    const out = [];
    let pos = 0;
    let c = 0;
    while (pos < bytes.length) {
        const c1 = bytes[pos++];
        if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
        }
        else if (c1 > 191 && c1 < 224) {
            const c2 = bytes[pos++];
            out[c++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
        }
        else if (c1 > 239 && c1 < 365) {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            const c4 = bytes[pos++];
            const u = (((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) -
                0x10000;
            out[c++] = String.fromCharCode((u >> 10) + 0xd800);
            out[c++] = String.fromCharCode((u & 1023) + 0xdc00);
        }
        else {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            out[c++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        }
    }
    return out.join('');
};
// tslint:enable:cyclomatic-complexity readonly-array no-let no-if-statement no-magic-numbers no-object-mutation no-expression-statement no-bitwise
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRmOC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvdXRpbHMvdXRmOC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQTBCLENBQUMseUJBQXlCOztBQUVwRCxtREFBbUQ7QUFDbkQsc0hBQXNIO0FBQ3RILHlCQUF5QjtBQUN6QiwrREFBK0Q7QUFFL0Qsb0pBQW9KO0FBQ3ZJLFFBQUEsU0FBUyxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUU7SUFDeEMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDcEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFDWCxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDZDthQUFNLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRTtZQUNuQixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDMUIsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQzNCO2FBQU0sSUFDTCxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxNQUFNO1lBQ3ZCLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU07WUFDbkIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxNQUFNLEVBQzVDO1lBQ0EsQ0FBQyxHQUFHLENB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