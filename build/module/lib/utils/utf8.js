/* istanbul ignore file */ // TODO: stabilize & test
// TODO: clean up - this implementation comes from:
// https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js
// consider switching to:
// https://github.com/mathiasbynens/utf8.js/blob/master/utf8.js
// tslint:disable:cyclomatic-complexity readonly-array no-let no-if-statement no-magic-numbers no-object-mutation no-expression-statement no-bitwise
export const utf8ToBin = (utf8) => {
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
export const binToUtf8 = (bytes) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRmOC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvdXRpbHMvdXRmOC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEIsQ0FBQyx5QkFBeUI7QUFFcEQsbURBQW1EO0FBQ25ELHNIQUFzSDtBQUN0SCx5QkFBeUI7QUFDekIsK0RBQStEO0FBRS9ELG9KQUFvSjtBQUNwSixNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtJQUN4QyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDVixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtZQUNYLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNkO2FBQU0sSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFO1lBQ25CLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUMxQixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDM0I7YUFBTSxJQUNMLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLE1BQU07WUFDdkIsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTTtZQUNuQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLE1BQU0sRUFDNUM7WUFDQSxDQUFD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