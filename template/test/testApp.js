{% set packageClass = package.replace('-', ' ').title().replace(' ', '') -%}

// Licensed under the MIT License
// https://github.com/{{github}}/{{package}}/blob/main/LICENSE

/* eslint-disable id-length */

import {JSDOM} from 'jsdom/lib/api.js';
import {{'{'}}{{packageClass}}} from '../lib/app.js';
import {UserTypeElements} from 'schema-markdown-doc/lib/userTypeElements.js';
import test from 'ava';


test('{{packageClass}}, constructor', (t) => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    t.is(app.window, window);
    t.is(app.params, null);
});


test('{{packageClass}}.main, help', (t) => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    app.updateParams('help=1');
    t.deepEqual(app.main(), {'elements': new UserTypeElements(app.params).getElements(app.hashTypes, app.hashType)});
});


test('{{packageClass}}.main', (t) => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    app.updateParams('');
    t.deepEqual(
        app.main(),
        {
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        }
    );
});
