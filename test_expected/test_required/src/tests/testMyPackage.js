// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

/* eslint-disable id-length */

import {sumNumbers} from '../my-package/index.js';
import test from 'ava';


test('sumNumbers', (t) => {
    t.is(sumNumbers([1, 2, 3]), 6);
});


test('sumNumbers, empty', (t) => {
    t.is(sumNumbers([]), 0);
});
