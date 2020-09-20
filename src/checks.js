export const objectIsEmpty = obj => Object.keys(obj || {}).length === 0;

export const arrayIncludesItemFromArray = (arr1, arr2) => {
    let len1 = arr1.length, len2 = arr2.length;
    if (!len1 && !len2 || len1 && !len2 || !len1 && len2) return false;
    for (let i = len1; i--;) if (arr2.includes(arr1[i])) return true;
    return false;
};

export const arrayIncludesAllItemsFromArray = (arr1, arr2) => {
    let len1 = arr1.length, len2 = arr2.length;
    if (!len1 && !len2 || len1 && !len2 || !len1 && len2) return false;
    for (let i = len2; i--;) if (arr1.includes(arr2[i])) return true;
    return false;
};

/**
 * compare 2 array
 * @param {array} before
 * @param {array} after
 * @example
 * isEqualArray([1,2,3,4],[1,2,3,4]) // true
 * isEqualArray([1,2,3,4],[1,2,3])   // false
 * isEqualArray([5,1,2,3],[1,2,3,5]) // false
 * isEqualArray([],[]) // true
 * @returns {boolean}
 */
export const isEqualArray = (before, after) => {
    let length = before.length;
    if (length !== after.length) return false;
    for (let i = 0; i < length; i++) if (before[i] !== after[i]) return false;
    return true;
};

export const propsChanged = (a, b) => {
    a = a || {};
    b = b || {};
    for (let i in a) if (!(i in b)) return true;
    for (let i in b) if (a[i] !== b[i]) return true;
    return false
};