import {isArray, isObj, isObjOrArr} from "./typeChecking";

export const deepCopy = o => {
    let copy = isObj(o) ? {} : isArray(o) ? [] : o;
    if (isObjOrArr(o)) for (let k in o) copy[k] = isObjOrArr(o[k]) ? deepCopy(o[k]) : o[k];
    return copy;
};
