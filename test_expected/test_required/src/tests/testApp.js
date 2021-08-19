// Licensed under the MIT License
// https://github.com/johndoe/package-name/blob/main/LICENSE

/* eslint-disable id-length */

import {PackageName} from '../package-name/index.js';
import Window from 'window';
import test from 'ava';


test('PackageName, constructor', (t) => {
    const window = new Window();
    const app = new PackageName(window, 'README.md');
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.is(app.params, null);
});


test('PackageName.run, help command', async (t) => {
    const window = new Window();
    window.location.hash = '#cmd.help=1';
    const app = await PackageName.run(window);
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.deepEqual(app.params, {'cmd': {'help': 1}});
    t.is(window.document.title, 'PackageName');
    t.true(window.document.body.innerHTML.startsWith(
        '<h1 id="cmd.help=1&amp;type_PackageName"><a class="linktarget">PackageName</a></h1>'
    ));
});


test('PackageName.run, main', async (t) => {
    const window = new Window();
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
    const app = await PackageName.run(window);
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.deepEqual(app.params, {});
    t.is(window.document.title, 'Hello');
    t.is(window.document.body.innerHTML, '<h1>Hello</h1>');
});


test('PackageName.run, hash parameter error', async (t) => {
    const window = new Window();
    window.location.hash = '#foo=bar';
    const app = await PackageName.run(window);
    t.is(app.window, window);
    t.is(app.defaultURL, 'README.md');
    t.is(app.params, null);
    t.is(window.document.title, 'PackageName');
    t.is(window.document.body.innerHTML, "<p>Error: Unknown member 'foo'</p>");
});


test('PackageName.main', async (t) => {
    const window = new Window();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': true, 'text': () => new Promise((resolve) => {
            resolve('# Hello');
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new PackageName(window, 'README.md');
    app.updateParams('');
    t.deepEqual(
        await app.main(),
        {
            'title': 'Hello',
            'elements': [
                {'html': 'h1', 'elem': [{'text': 'Hello'}]}
            ]
        }
    );
});


test('PackageName.main, url', async (t) => {
    const window = new Window();
    const fetchResolve = (url) => {
        t.is(url, 'other.md');
        return {'ok': true, 'text': () => new Promise((resolve) => {
            resolve('# Hello');
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new PackageName(window, 'README.md');
    app.updateParams('url=other.md');
    t.deepEqual(
        await app.main(),
        {
            'title': 'Hello',
            'elements': [
                {'html': 'h1', 'elem': [{'text': 'Hello'}]}
            ]
        }
    );
});


test('PackageName.main, fetch error', async (t) => {
    const window = new Window();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': false, 'statusText': 'Not Found'};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new PackageName(window, 'README.md');
    app.updateParams('');
    let errorMessage = null;
    try {
        await app.main();
    } catch ({message}) { /* c8 ignore next */
        errorMessage = message;
    }
    t.is(errorMessage, 'Could not fetch "README.md", "Not Found"');
});


test('PackageName.main, fetch error no status text', async (t) => {
    const window = new Window();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': false, 'statusText': ''};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new PackageName(window, 'README.md');
    app.updateParams('');
    let errorMessage = null;
    try {
        await app.main();
    } catch ({message}) { /* c8 ignore next */
        errorMessage = message;
    }
    t.is(errorMessage, 'Could not fetch "README.md"');
});


test('PackageName.main, no title', async (t) => {
    const window = new Window();
    const fetchResolve = (url) => {
        t.is(url, 'README.md');
        return {'ok': true, 'text': () => new Promise((resolve) => {
            resolve('Hello');
        })};
    };
    window.fetch = (url) => new Promise((resolve) => {
        resolve(fetchResolve(url));
    });
    const app = new PackageName(window, 'README.md');
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
