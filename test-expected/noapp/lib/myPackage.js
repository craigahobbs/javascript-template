// Licensed under the MIT License
// https://github.com/johndoe/my-package/blob/main/LICENSE

/** @module lib/myPackage */


/**
 * Sum an array of numbers
 *
 * @param {number[]} numbers - The array of numbers to sum
 * @returns {number}
 */
export function sumNumbers(numbers) {
    return numbers.reduce((first, second) => first + second, 0);
}
