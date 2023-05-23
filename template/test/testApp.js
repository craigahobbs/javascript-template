{% set packageClass = package.replace('-', ' ').title().replace(' ', '') -%}

// Licensed under the MIT License
// https://github.com/{{github}}/{{package}}/blob/main/LICENSE

import {JSDOM} from 'jsdom/lib/api.js';
import {{'{'}}{{packageClass}}} from '../lib/app.js';
import {strict as assert} from 'node:assert';
import test from 'node:test';


test('{{packageClass}}, constructor', () => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    assert.equal(app.window, window);
    assert.equal(app.params, null);
});


test('{{packageClass}}.run', () => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    app.run();
    assert.deepEqual(app.params, {});
    assert.equal(window.document.title, 'Hello');
    assert.equal(window.document.body.innerHTML, '<p>Hello</p>');
});


test('{{packageClass}}.render', () => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    app.render();
    assert.deepEqual(app.params, {});
    assert.equal(window.document.title, 'Hello');
    assert.equal(window.document.body.innerHTML, '<p>Hello</p>');

    // Re-render with same args and verify render short-circuit
    app.render();
    assert.equal(window.document.title, 'Hello');
    assert.equal(window.document.body.innerHTML, '<p>Hello</p>');
});


test('{{packageClass}}.render, hash ID', () => {
    const {window} = new JSDOM();
    window.location.hash = '#hash-id';
    const app = new {{packageClass}}(window);
    app.render();
    assert.deepEqual(app.params, {});
    assert.equal(window.document.title, 'Hello');
    assert.equal(window.document.body.innerHTML, '<p>Hello</p>');

    // Re-render with same args and verify render short-circuit
    app.render();
    assert.equal(window.document.title, 'Hello');
    assert.equal(window.document.body.innerHTML, '<p>Hello</p>');
});


test('{{packageClass}}.render, hash parameter error', () => {
    const {window} = new JSDOM();
    window.location.hash = '#foo=bar';
    const app = new {{packageClass}}(window);
    app.render();
    assert.equal(app.window, window);
    assert.equal(app.params, null);
    assert.equal(window.document.title, 'MyPackage');
    assert.equal(window.document.body.innerHTML, "<p>Error: Unknown member 'foo'</p>");
});


test('{{packageClass}}.main, help', () => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    app.updateParams('help=1');
    const result = app.main();
    assert.equal(result.elements[0][0].html, 'h1');
    result.elements[0] = '<helpElements>';
    assert.deepEqual(
        result,
        {
            'title': '{{packageClass}}',
            'elements': [
                '<helpElements>',
                null
            ]
        }
    );
});


test('{{packageClass}}.main', () => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window);
    app.updateParams('');
    assert.deepEqual(
        app.main(),
        {
            'title': 'Hello',
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        }
    );
});
