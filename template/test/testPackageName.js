{%- set packageFile = package[:1] + package.replace('-', ' ').title().replace(' ', '')[1:] + '.js' -%}

// Licensed under the MIT License
// https://github.com/{{github}}/{{package}}/blob/main/LICENSE

/* eslint-disable id-length */

import {sumNumbers} from '../lib/{{packageFile}}';
import test from 'ava';


test('sumNumbers', (t) => {
    t.is(sumNumbers([1, 2, 3]), 6);
});


test('sumNumbers, empty', (t) => {
    t.is(sumNumbers([]), 0);
});
