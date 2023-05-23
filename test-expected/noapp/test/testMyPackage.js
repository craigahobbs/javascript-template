// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

import {strict as assert} from 'node:assert';
import {sumNumbers} from '../lib/myPackage.js';
import test from 'node:test';


test('sumNumbers', () => {
    assert.equal(sumNumbers([1, 2, 3]), 6);
});


test('sumNumbers, empty', () => {
    assert.equal(sumNumbers([]), 0);
});
