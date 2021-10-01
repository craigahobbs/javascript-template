// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

/* eslint-disable id-length */

import {JSDOM} from 'jsdom/lib/api.js';
import {MyPackage} from '../my-package/index.js';
import test from 'ava';


test('MyPackage, constructor', (t) => {
    const {window} = new JSDOM();
    const app = new MyPackage(window, 'README.md');
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.is(app.params, null);
});


test('MyPackage.run, help command', async (t) => {
    const {window} = new JSDOM();
    window.location.hash = '#cmd.help=1';
    const app = await MyPackage.run(window);
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.deepEqual(app.params, {'cmd': {'help': 1}});
    t.is(window.document.title, 'MyPackage');
    t.true(window.document.body.innerHTML.startsWith(
        '<h1 id="cmd.help=1&amp;type_MyPackage">MyPackage</h1>'
    ));
});


test('MyPackage.run, main', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': true, 'text': () => new Promise((resolve) => {
            resolve('# Hello');
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    window.location.hash = '#';
    const app = await MyPackage.run(window);
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.deepEqual(app.params, {});
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<h1 id="hello">Hello</h1>');
});


test('MyPackage.run, hash parameter error', async (t) => {
    const {window} = new JSDOM();
    window.location.hash = '#foo=bar';
    const app = await MyPackage.run(window);
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.is(app.params, null);
    t.is(window.document.title, 'MyPackage');
    t.is(window.document.body.innerHTML, "<p>Error: Unknown member 'foo'</p>");
});


test('MyPackage.main', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': true, 'text': () => new Promise((resolve) => {
            resolve('# Hello');
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new MyPackage(window, 'README.md');
    app.updateParams('');
    t.deepEqual(
        await app.main(),
        {
            'title': 'Hello',
            'elements': [
                {'html': 'h1', 'attr': {'id': 'hello'}, 'elem': [{'text': 'Hello'}]}
            ]
        }
    );
});


test('MyPackage.main, url', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'sub/other.md');
        return {'ok': true, 'text': () => new Promise((resolve) => {
            resolve(`\
# Hello

[A relative link](foo.html)

[A page link](#hello)
`);
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new MyPackage(window, 'README.md');
    app.updateParams('url=sub%2Fother.md');
    t.deepEqual(
        await app.main(),
        {
            'title': 'Hello',
            'elements': [
                {'html': 'h1', 'attr': {'id': 'url=sub%2Fother.md&hello'}, 'elem': [{'text': 'Hello'}]},
                {
                    'html': 'p',
                    'elem': [
                        {
                            'html': 'a',
                            'attr': {'href': 'sub/foo.html'},
                            'elem': [{'text': 'A relative link'}]
                        }
                    ]
                },
                {
                    'html': 'p',
                    'elem': [
                        {
                            'html': 'a',
                            'attr': {'href': '#url=sub%2Fother.md&hello'},
                            'elem': [{'text': 'A page link'}]
                        }
                    ]
                }
            ]
        }
    );
});


test('MyPackage.main, fetch error', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': false, 'statusText': 'Not Found'};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new MyPackage(window, 'README.md');
    app.updateParams('');
    let errorMessage = null;
    try {
        await app.main();
    } catch ({message}) { /* c8 ignore next */
        errorMessage = message;
    }
    t.is(errorMessage, 'Could not fetch "README.md", "Not Found"');
});


test('MyPackage.main, fetch error no status text', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': false, 'statusText': ''};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new MyPackage(window, 'README.md');
    app.updateParams('');
    let errorMessage = null;
    try {
        await app.main();
    } catch ({message}) { /* c8 ignore next */
        errorMessage = message;
    }
    t.is(errorMessage, 'Could not fetch "README.md"');
});


test('MyPackage.main, no title', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': true, 'text': () => new Promise((resolve) => {
            resolve('Hello');
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new MyPackage(window, 'README.md');
    app.updateParams('');
    t.deepEqual(
        await app.main(),
        {
            'elements': [
                {'html': 'p', 'elem': [{'text': 'Hello'}]}
            ]
        }
    );
});
