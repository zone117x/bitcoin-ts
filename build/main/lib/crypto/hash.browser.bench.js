"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement no-unsafe-any
const ava_1 = __importDefault(require("ava"));
const path_1 = require("path");
const puppeteer_1 = require("puppeteer");
const rollup_1 = require("rollup");
const rollup_plugin_alias_1 = __importDefault(require("rollup-plugin-alias"));
const rollup_plugin_commonjs_1 = __importDefault(require("rollup-plugin-commonjs"));
const rollup_plugin_node_resolve_1 = __importDefault(require("rollup-plugin-node-resolve"));
const prepareCode = async () => {
    // tslint:disable-next-line:no-unbound-method no-console
    const realConsoleWarn = console.warn;
    /**
     * Suppress Rollup warning: `Use of eval is strongly discouraged, as it poses
     * security risks and may cause issues with minification`
     */
    // tslint:disable-next-line:no-object-mutation no-console
    console.warn = (suppress) => suppress;
    const bundle = await rollup_1.rollup({
        // TODO: remove after https://github.com/rollup/rollup/pull/2348 lands
        inlineDynamicImports: false,
        input: path_1.join(__dirname, 'hash.browser.bench.helper.js'),
        // tslint:disable-next-line:readonly-array
        plugins: [
            rollup_plugin_alias_1.default({
                chuhai: './../../../bench/chuhai.js',
                'hash.js': './../../../bench/hash.js'
            }),
            rollup_plugin_commonjs_1.default(),
            rollup_plugin_node_resolve_1.default()
        ]
    });
    // tslint:disable-next-line:no-object-mutation no-console
    console.warn = realConsoleWarn;
    const { code } = await bundle.generate({
        format: 'esm'
    });
    return code;
};
const preparePage = async () => {
    const browser = await puppeteer_1.launch({
        // tslint:disable-next-line:readonly-array
        args: ['--no-sandbox', '--disable-setuid-sandbox']
        // devtools: true
    });
    const page = await browser.newPage();
    // https://github.com/GoogleChrome/puppeteer/issues/2301#issuecomment-379622459
    await page.goto('file:///');
    return { browser, page };
};
(async () => {
    const [code, { browser, page }] = await Promise.all([
        prepareCode(),
        preparePage()
    ]);
    ava_1.default(`# browser: ${await browser.version()}`, async (t) => {
        page.on('console', msg => {
            // tslint:disable-next-line:no-console
            console.log(msg.text());
        });
        page.on('error', err => {
            // tslint:disable-next-line:no-console
            console.error(`error: ${err}`);
        });
        page.on('pageerror', err => {
            // tslint:disable-next-line:no-console
            console.error(`pageerror: ${err}`);
        });
        await new Promise(async (resolve) => {
            await page.exposeFunction('benchError', (error) => {
                // tslint:disable-next-line:no-console
                console.error(error);
            });
            await page.exposeFunction('benchComplete', async () => {
                // tslint:disable-next-line:no-console
                console.log('Browser benchmark complete, closing browser.');
                await browser.close();
                t.pass();
                resolve();
            });
            await page.setContent(`<script type="module">${code}</script>`);
        });
    });
})().catch(err => {
    // tslint:disable-next-line:no-console
    console.error(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5icm93c2VyLmJlbmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jcnlwdG8vaGFzaC5icm93c2VyLmJlbmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsdURBQXVEO0FBQ3ZELDhDQUF1QjtBQUN2QiwrQkFBNEI7QUFDNUIseUNBQW1DO0FBQ25DLG1DQUFnQztBQUNoQyw4RUFBd0M7QUFDeEMsb0ZBQThDO0FBQzlDLDRGQUFxRDtBQUVyRCxNQUFNLFdBQVcsR0FBRyxLQUFLLElBQUksRUFBRTtJQUM3Qix3REFBd0Q7SUFDeEQsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztJQUNyQzs7O09BR0c7SUFDSCx5REFBeUQ7SUFDekQsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLFFBQWdCLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUU5QyxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQU0sQ0FBQztRQUMxQixzRUFBc0U7UUFDdEUsb0JBQW9CLEVBQUUsS0FBSztRQUMzQixLQUFLLEVBQUUsV0FBSSxDQUFDLFNBQVMsRUFBRSw4QkFBOEIsQ0FBQztRQUN0RCwwQ0FBMEM7UUFDMUMsT0FBTyxFQUFFO1lBQ1AsNkJBQUssQ0FBQztnQkFDSixNQUFNLEVBQUUsNEJBQTRCO2dCQUNwQyxTQUFTLEVBQUUsMEJBQTBCO2FBQ3RDLENBQUM7WUFDRixnQ0FBUSxFQUFFO1lBQ1Ysb0NBQVcsRUFBRTtTQUNkO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gseURBQXlEO0lBQ3pELE9BQU8sQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDO0lBRS9CLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDckMsTUFBTSxFQUFFLEtBQUs7S0FDZCxDQUFDLENBQUM7SUFDSCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFH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