

// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

/* eslint-disable id-length */

import {JSDOM} from 'jsdom/lib/api.js';
import {MyPackage} from '../lib/app.js';
import test from 'ava';


test('MyPackage, constructor', (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    t.is(app.window, window);
    t.is(app.params, null);
});


test('MyPackage.main, help', async (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.updateParams('help=1');
    const main = await app.main();
    t.deepEqual(Object.keys(main).sort(), ['elements']);
    t.deepEqual(main.elements[0][0], {
        'html': 'h1',
        'attr': {'id': 'help=1&type_MyPackage'},
        'elem': {'text': 'MyPackage'}
    });
});


test('MyPackage.main', async (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.updateParams('');
    t.deepEqual(
        await app.main(),
        {
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        }
    );
});
