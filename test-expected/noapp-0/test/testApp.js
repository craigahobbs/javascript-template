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


test('MyPackage.run', (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.run();
    t.deepEqual(app.params, {});
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<p>Hello</p>');
});


test('MyPackage.render', (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.render();
    t.deepEqual(app.params, {});
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<p>Hello</p>');

    // Re-render with same args and verify render short-circuit
    app.render();
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<p>Hello</p>');
});


test('MyPackage.render, hash ID', (t) => {
    const {window} = new JSDOM();
    window.location.hash = '#hash-id';
    const app = new MyPackage(window);
    app.render();
    t.deepEqual(app.params, {});
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<p>Hello</p>');

    // Re-render with same args and verify render short-circuit
    app.render();
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<p>Hello</p>');
});


test('MyPackage.render, hash parameter error', (t) => {
    const {window} = new JSDOM();
    window.location.hash = '#foo=bar';
    const app = new MyPackage(window);
    app.render();
    t.is(app.window, window);
    t.is(app.params, null);
    t.is(window.document.title, 'MyPackage');
    t.is(window.document.body.innerHTML, "<p>Error: Unknown member 'foo'</p>");
});


test('MyPackage.main, help', (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.updateParams('help=1');
    const result = app.main();
    t.is(result.elements[0][0].html, 'h1');
    result.elements[0] = '<helpElements>';
    t.deepEqual(
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


test('MyPackage.main', (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window);
    app.updateParams('');
    t.deepEqual(
        app.main(),
        {
            'title': 'Hello',
            'elements': {'html': 'p', 'elem': {'text': 'Hello'}}
        }
    );
});
