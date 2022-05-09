// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

/* eslint-disable id-length */

import {ElementApplication} from 'element-app/lib/app.js';
import {JSDOM} from 'jsdom/lib/api.js';
import {MyPackage} from '../lib/app.js';
import {encodeQueryString} from 'schema-markdown/lib/encode.js';
import {schemaMarkdownDoc} from 'schema-markdown-doc/lib/schemaMarkdownDoc.js';
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
    t.deepEqual(
        ElementApplication.validateMain(app.main()),
        {
            'elements': schemaMarkdownDoc(app.hashTypes, app.hashType, {'params': encodeQueryString(app.params)})
        }
    );
});


test('MyPackage.main', (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.updateParams('');
    t.deepEqual(
        ElementApplication.validateMain(app.main()),
        {
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        }
    );
});
