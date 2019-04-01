"use strict";
/* istanbul ignore file */ // TODO: stabilize & test
Object.defineProperty(exports, "__esModule", { value: true });
const hex_1 = require("./hex");
exports.stringify = (object, spacing = 2) => JSON.stringify(object, 
// tslint:disable-next-line:cyclomatic-complexity
(_, value) => {
    const type = typeof value;
    const name = 
    // tslint:disable-next-line: no-unsafe-any
    type === 'object' ? value.constructor && value.constructor.name : type;
    switch (name) {
        case 'Uint8Array':
            return `<Uint8Array: 0x${hex_1.binToHex(value)}>`;
        case 'bigint':
            return `<bigint: ${value.toString()}n>`;
        case 'function':
        case 'symbol':
            // tslint:disable-next-line: ban-types
            return `<${name}: ${value.toString()}>`;
        default:
            return value;
    }
}, spacing);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi91dGlscy9sb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUEwQixDQUFDLHlCQUF5Qjs7QUFFcEQsK0JBQWlDO0FBRXBCLFFBQUEsU0FBUyxHQUFHLENBQUMsTUFBYyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUN2RCxJQUFJLENBQUMsU0FBUyxDQUNaLE1BQU07QUFDTixpREFBaUQ7QUFDakQsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDWCxNQUFNLElBQUksR0FBRyxPQUFPLEtBQUssQ0FBQztJQUMxQixNQUFNLElBQUk7SUFDUiwwQ0FBMEM7SUFDMUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3pFLFFBQVEsSUFBSSxFQUFFO1FBQ1osS0FBSyxZQUFZO1lBQ2YsT0FBTyxrQkFBa0IsY0FBUSxDQUFDLEtBQW1CLENBQUMsR0FBRyxDQUFDO1FBQzVELEtBQUssUUFBUTtZQUNYLE9BQU8sWUFBYSxLQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUM7UUFDdEQsS0FBSyxVQUFVLENBQUM7UUFDaEIsS0FBSyxRQUFRO1lBQ1gsc0NBQXNDO1lBQ3RDLE9BQU8sSUFBSSxJQUFJLEtBQU0sS0FBMkIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDO1FBRWpFO1lBQ0UsT0FBTyxLQUFLLENBQUM7S0FDaEI7QUFDSCxDQUFDLEVBQ0QsT0FBTyxDQUNSLENBQUMifQ==