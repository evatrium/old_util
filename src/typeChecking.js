export const isArray = Array.isArray;
export const isObj = (thing) => Object.prototype.toString.call(thing) === '[object Object]';
export const isFunc = (thing) => typeof thing === 'function';
export const isString = (thing) => typeof thing === 'string';
export const isNum = (thing) => !isNaN(parseFloat(thing)) && !isNaN(thing - 0);
export const isBool = (thing) => typeof thing === 'boolean';
export const isObjOrArr = thing => (isObj(thing) || isArray(thing));