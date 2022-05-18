// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

/* eslint-disable id-length */

import {JSDOM} from 'jsdom/lib/api.js';
import {MyPackage} from '../lib/app.js';
import test from 'ava';


// Helper class to mock window.location instances
class MockLocation {
    constructor(href, hash) {
        this._href = [href];
        this.hash = hash;
    }

    get href() {
        return this._href[this._href.length - 1];
    }

    set href(href) {
        this._href.push(href);
    }
}


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

    delete window.location;
    Object.assign(window, {'location': new MockLocation('http://localhost/', '#')});
    t.is(window.location.href, 'http://localhost/');

    const app = new MyPackage(window);
    app.render();
    t.deepEqual(app.params, {});
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<p>Hello</p>');
    t.deepEqual(window.location._href, ['http://localhost/']);

    // Re-render with same args and verify render short-circuit
    app.render();
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<p>Hello</p>');
    t.deepEqual(window.location._href, ['http://localhost/']);
});


test('MyPackage.render, hash ID', (t) => {
    const {window} = new JSDOM();

    delete window.location;
    Object.assign(window, {'location': new MockLocation('http://localhost/#hash-id', '#hash-id')});
    t.is(window.location.href, 'http://localhost/#hash-id');

    const app = new MyPackage(window);
    app.render();
    t.deepEqual(app.params, {});
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<p>Hello</p>');
    t.deepEqual(window.location._href, ['http://localhost/#hash-id', '#hash-id']);

    // Re-render with same args and verify render short-circuit
    app.render();
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<p>Hello</p>');
    t.deepEqual(window.location._href, ['http://localhost/#hash-id', '#hash-id']);
});


test('MyPackage.render, hash parameter error', (t) => {
    const {window} = new JSDOM();

    delete window.location;
    Object.assign(window, {'location': new MockLocation('http://localhost/#foo=bar', '#foo=bar')});
    t.is(window.location.href, 'http://localhost/#foo=bar');

    const app = new MyPackage(window);
    app.render();
    t.is(app.window, window);
    t.is(app.params, null);
    t.is(window.document.title, 'MyPackage');
    t.is(window.document.body.innerHTML, "<p>Error: Unknown member 'foo'</p>");
    t.deepEqual(window.location._href, ['http://localhost/#foo=bar']);
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
