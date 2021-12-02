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


test('MyPackage.main, help', (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.updateParams('help=1');
    t.deepEqual(app.main(), {'elements': app.helpElements()});
});


test('MyPackage.main', (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.updateParams('');
    t.deepEqual(
        app.main(),
        {
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        }
    );
});
