// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

/* eslint-disable id-length */

import {ElementApplication} from 'element-app/lib/app.js';
import {JSDOM} from 'jsdom/lib/api.js';
import {MyPackage} from '../lib/app.js';
import {UserTypeElements} from 'schema-markdown-doc/lib/userTypeElements.js';
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
    const result = ElementApplication.validateMain(app.main());
    t.deepEqual(result, {
        'elements': new UserTypeElements(app.params).getElements(app.hashTypes, app.hashType)
    });
});


test('MyPackage.main', (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.updateParams('');
    const result = ElementApplication.validateMain(app.main());
    t.deepEqual(result, {
        'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
    });
});
