{% set packageClass = package.replace('-', ' ').title().replace(' ', '') %}

// Licensed under the MIT License
// https://github.com/{{github}}/{{package}}/blob/main/LICENSE

/* eslint-disable id-length */

import {JSDOM} from 'jsdom/lib/api.js';
import {{'{'}}{{packageClass}}} from '../lib/app.js';
import test from 'ava';


test('{{packageClass}}, constructor', (t) => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    t.is(app.window, window);
    t.is(app.params, null);
});


test('{{packageClass}}.main, help', async (t) => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    app.updateParams('help=1');
    const main = await app.main();
    t.deepEqual(Object.keys(main).sort(), ['elements']);
    t.deepEqual(main.elements[0][0], {
        'html': 'h1',
        'attr': {'id': 'help=1&type_{{packageClass}}'},
        'elem': {'text': '{{packageClass}}'}
    });
});


test('{{packageClass}}.main', async (t) => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    app.updateParams('');
    t.deepEqual(
        await app.main(),
        {
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        }
    );
});
