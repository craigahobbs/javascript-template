// Licensed under the MIT License
// https://github.com/{{github}}/{{package}}/blob/main/LICENSE


/**
 * Sum an array of numbers
 *
 * @param {number[]} numbers - The array of numbers to sum
 * @returns {number}
 */
export function sumNumbers(numbers) {
    return numbers.reduce((first, second) => first + second, 0);
}
