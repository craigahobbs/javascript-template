// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

import {JSDOM} from 'jsdom/lib/api.js';
import {MyPackage} from '../lib/app.js';
import {strict as assert} from 'node:assert';
import test from 'node:test';


test('MyPackage, constructor', () => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    assert.equal(app.window, window);
    assert.equal(app.params, null);
});


test('MyPackage.run', () => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.run();
    assert.deepEqual(app.params, {});
    assert.equal(window.document.title, 'Hello');
    assert.equal(window.document.body.innerHTML, '<p>Hello</p>');
});


test('MyPackage.render', () => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.render();
    assert.deepEqual(app.params, {});
    assert.equal(window.document.title, 'Hello');
    assert.equal(window.document.body.innerHTML, '<p>Hello</p>');

    // Re-render with same args and verify render short-circuit
    app.render();
    assert.equal(window.document.title, 'Hello');
    assert.equal(window.document.body.innerHTML, '<p>Hello</p>');
});


test('MyPackage.render, hash ID', () => {
    const {window} = new JSDOM();
    window.location.hash = '#hash-id';
    const app = new MyPackage(window);
    app.render();
    assert.deepEqual(app.params, {});
    assert.equal(window.document.title, 'Hello');
    assert.equal(window.document.body.innerHTML, '<p>Hello</p>');

    // Re-render with same args and verify render short-circuit
    app.render();
    assert.equal(window.document.title, 'Hello');
    assert.equal(window.document.body.innerHTML, '<p>Hello</p>');
});


test('MyPackage.render, hash parameter error', () => {
    const {window} = new JSDOM();
    window.location.hash = '#foo=bar';
    const app = new MyPackage(window);
    app.render();
    assert.equal(app.window, window);
    assert.equal(app.params, null);
    assert.equal(window.document.title, 'MyPackage');
    assert.equal(window.document.body.innerHTML, "<p>Error: Unknown member 'foo'</p>");
});


test('MyPackage.main, help', () => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.updateParams('help=1');
    const result = app.main();
    assert.equal(result.elements[0][0].html, 'h1');
    result.elements[0] = '<helpElements>';
    assert.deepEqual(
        result,
        {
            'title': 'MyPackage',
            'elements': [
                '<helpElements>',
                null
            ]
        }
    );
});


test('MyPackage.main', () => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.updateParams('');
    assert.deepEqual(
        app.main(),
        {
            'title': 'Hello',
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        }
    );
});
