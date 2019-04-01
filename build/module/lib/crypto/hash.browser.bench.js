// tslint:disable:no-expression-statement no-unsafe-any
import test from 'ava';
import { join } from 'path';
import { launch } from 'puppeteer';
import { rollup } from 'rollup';
import alias from 'rollup-plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
const prepareCode = async () => {
    // tslint:disable-next-line:no-unbound-method no-console
    const realConsoleWarn = console.warn;
    /**
     * Suppress Rollup warning: `Use of eval is strongly discouraged, as it poses
     * security risks and may cause issues with minification`
     */
    // tslint:disable-next-line:no-object-mutation no-console
    console.warn = (suppress) => suppress;
    const bundle = await rollup({
        // TODO: remove after https://github.com/rollup/rollup/pull/2348 lands
        inlineDynamicImports: false,
        input: join(__dirname, 'hash.browser.bench.helper.js'),
        // tslint:disable-next-line:readonly-array
        plugins: [
            alias({
                chuhai: './../../../bench/chuhai.js',
                'hash.js': './../../../bench/hash.js'
            }),
            commonjs(),
            nodeResolve()
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
    const browser = await launch({
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
    test(`# browser: ${await browser.version()}`, async (t) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5icm93c2VyLmJlbmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jcnlwdG8vaGFzaC5icm93c2VyLmJlbmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVEQUF1RDtBQUN2RCxPQUFPLElBQUksTUFBTSxLQUFLLENBQUM7QUFDdkIsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ25DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDaEMsT0FBTyxLQUFLLE1BQU0scUJBQXFCLENBQUM7QUFDeEMsT0FBTyxRQUFRLE1BQU0sd0JBQXdCLENBQUM7QUFDOUMsT0FBTyxXQUFXLE1BQU0sNEJBQTRCLENBQUM7QUFFckQsTUFBTSxXQUFXLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDN0Isd0RBQXdEO0lBQ3hELE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDckM7OztPQUdHO0lBQ0gseURBQXlEO0lBQ3pELE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUM7SUFFOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUM7UUFDMUIsc0VBQXNFO1FBQ3RFLG9CQUFvQixFQUFFLEtBQUs7UUFDM0IsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsOEJBQThCLENBQUM7UUFDdEQsMENBQTBDO1FBQzFDLE9BQU8sRUFBRTtZQUNQLEtBQUssQ0FBQztnQkFDSixNQUFNLEVBQUUsNEJBQTRCO2dCQUNwQyxTQUFTLEVBQUUsMEJBQTBCO2FBQ3RDLENBQUM7WUFDRixRQUFRLEVBQUU7WUFDVixXQUFXLEVBQUU7U0FDZDtLQUNGLENBQUMsQ0FBQztJQUNILHlEQUF5RDtJQUN6RCxPQUFPLENBQUMsSUFBSSxHQUFHLGVB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