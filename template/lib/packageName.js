{% set packageVariable = package[:1] + package.replace('-', ' ').title().replace(' ', '')[1:] -%}

// Licensed under the MIT License
// https://github.com/{{github}}/{{package}}/blob/main/LICENSE

/** @module lib/{{packageVariable}} */


/**
 * Sum an array of numbers
 *
 * @param {number[]} numbers - The array of numbers to sum
 * @returns {number}
 */
export function sumNumbers(numbers) {
    return numbers.reduce((first, second) => first + second, 0);
}
