// /**
//  * capitalizes a string
//  * @param {String} string - string to upperCase
//  * @returns {String} - all caps string
//  */
// export const allCaps = (string) => string.toUpperCase();
// /**
//  * capitalises the first letter of the first word in a string
//  * @param {String} string - to capitalize
//  * @returns {string} - string with first char capitalized
//  */
// export const capFirstLet = (string) => string.charAt(0).toUpperCase() + string.slice(1);
//
// /**
//  * capitalizes the first letter of every word in a string
//  * @param {String} string - to capitalize
//  * @returns {String} - string with every first letter capitalized
//  */
// export const capEveryFirst = (string) => string.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
//
// /**
//  * capitalize a string with different options.
//  *
//  * @param {String} string - to capitalize
//  * @param {String} option - 'everyFirst', 'first', or undefined for all caps
//  * @returns {String} - capitalized string
//  */
// export const capitalize = (string, option) =>
//     option === 'everyFirst'
//         ? capEveryFirst(string)
//         : (option === 'first'
//         ? capFirstLet(string)
//         : allCaps(string));
//
// export const deKabob = text => text.split('-').join('');
//
// export const deSnake = text => text.split('_').join(' ');
//
// /**
//  * helper function to replace characters in a string with another value
//  * @param {String} string - to replaces chars in
//  * @param {Array} arr - an array of objects containing the key values to find and replace : string - to find, with - to replace with
//  * @returns {String} - updated string
//  */
// export const textReplacer = (string, arr = [{string: '', with: '',}]) => {
//     let _text = string;
//     arr.forEach((obj) => {
//         _text = _text.split(obj.string).join(obj.with);
//     });
//     return _text;
// };
//
// const replacements1 = [
//     {string: '_', with: ' '},
//     {string: '.', with: ' '},
//     {string: '-', with: ' '},
// ];
//
// export const camelCase = (value) => {
//     value = textReplacer(value, replacements1);
//     value = capitalize(value, 'everyFirst');
//     value = textReplacer(value, [{string: ' ', with: ''}]);
//     return value.charAt(0).toLowerCase() + value.slice(1);
// };
// export const minifyString = str => str.split('\n').join(' ').split('\t').join(' ').replace(/  +/g, ' ');
