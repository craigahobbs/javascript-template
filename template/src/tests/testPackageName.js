// Licensed under the MIT License
// https://github.com/{{github}}/{{package}}/blob/main/LICENSE

/* eslint-disable id-length */

{% set packageClass = package.replace('-', ' ').title().replace(' ', '') -%}
{% if noapp is defined and noapp -%}
import {sumNumbers} from '../{{package}}/index.js';
import test from 'ava';


test('sumNumbers', (t) => {
    t.is(sumNumbers([1, 2, 3]), 6);
});


test('sumNumbers, empty', (t) => {
    t.is(sumNumbers([]), 0);
});
{%- else -%}
import {JSDOM} from 'jsdom/lib/api.js';
import {{'{'}}{{packageClass}}} from '../{{package}}/index.js';
import test from 'ava';


test('{{packageClass}}, constructor', (t) => {
    const {window} = new JSDOM();
    const app = new {{packageClass}}(window, 'README.md');
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.is(app.params, null);
});


test('{{packageClass}}.run, help command', async (t) => {
    const {window} = new JSDOM();
    window.location.hash = '#cmd.help=1';
    const app = await {{packageClass}}.run(window);
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.deepEqual(app.params, {'cmd': {'help': 1}});
    t.is(window.document.title, '{{packageClass}}');
    t.true(window.document.body.innerHTML.startsWith(
        '<h1 id="cmd.help=1&amp;type_{{packageClass}}">{{packageClass}}</h1>'
    ));
});


test('{{packageClass}}.run, main', async (t) => {
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
    const app = await {{packageClass}}.run(window);
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.deepEqual(app.params, {});
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<h1 id="hello">Hello</h1>');
});


test('{{packageClass}}.run, hash parameter error', async (t) => {
    const {window} = new JSDOM();
    window.location.hash = '#foo=bar';
    const app = await {{packageClass}}.run(window);
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.is(app.params, null);
    t.is(window.document.title, '{{packageClass}}');
    t.is(window.document.body.innerHTML, "<p>Error: Unknown member 'foo'</p>");
});


test('{{packageClass}}.main', async (t) => {
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
    const app = new {{packageClass}}(window, 'README.md');
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


test('{{packageClass}}.main, url', async (t) => {
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
    const app = new {{packageClass}}(window, 'README.md');
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


test('{{packageClass}}.main, fetch error', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': false, 'statusText': 'Not Found'};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new {{packageClass}}(window, 'README.md');
    app.updateParams('');
    let errorMessage = null;
    try {
        await app.main();
    } catch ({message}) { /* c8 ignore next */
        errorMessage = message;
    }
    t.is(errorMessage, 'Could not fetch "README.md", "Not Found"');
});


test('{{packageClass}}.main, fetch error no status text', async (t) => {
    const {window} = new JSDOM();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': false, 'statusText': ''};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new {{packageClass}}(window, 'README.md');
    app.updateParams('');
    let errorMessage = null;
    try {
        await app.main();
    } catch ({message}) { /* c8 ignore next */
        errorMessage = message;
    }
    t.is(errorMessage, 'Could not fetch "README.md"');
});


test('{{packageClass}}.main, no title', async (t) => {
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
    const app = new {{packageClass}}(window, 'README.md');
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
{%- endif %}
