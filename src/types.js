export const isArray = Array.isArray;
export const isObj = (thing) => ((typeof thing === 'object') && thing instanceof Object);
export const isFunc = (thing) => typeof thing === 'function';
export const isString = (thing) => typeof thing === 'string';
export const isNum = (thing) => typeof thing === 'number';
