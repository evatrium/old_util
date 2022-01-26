//
/*################################
##################################

            TYPEOF

##################################
################################*/


export const isArray = Array.isArray;
export const isString = thing => typeof thing === 'string';
export const isObjectType = (value) => typeof value === 'object';
export const isNullOrUndefined = (value) => value == null;
export const isPrimitive = (value) => isNullOrUndefined(value) || !isObjectType(value);
export const isPlainObject = thing => thing !== null && typeof thing === 'object' && thing.constructor === Object;
export const isObj = isPlainObject;
export const isObject = isPlainObject;
export const isFunc = thing => typeof thing === 'function';
export const isNum = thing => !isNaN(parseFloat(thing)) && !isNaN(thing - 0);
export const isBool = thing => typeof thing === 'boolean';
export const isObjOrArr = (thing) => (isObj(thing) || isArray(thing));
export const isInteger = thing => String(Math.floor(Number(thing))) === thing;
export const isMap = thing => thing instanceof Map;
export const isSet = thing => thing instanceof Set;
export const isPromise = thing => isObj(thing) && isFunc(thing.then);
export const isDateObject = (data) => data instanceof Date;


/*################################
##################################

        COMPARISON, CHECKS

##################################
################################*/

export const hasNoKeys = x => {
    for (var key in x) if (Object.prototype.hasOwnProperty.call(x, key)) return false;
    return true;
}

export const isEmpty = (x) => {
    if (!x) return true;
    else if (isArray(x)) {
        if (x.length === 0) return true
    } else if (isObj(x) || isFunc(x)) {
        if (hasNoKeys(x)) return true;
    } else if (isMap(x) || isSet(x)) {
        if (x.size === 0) return true;
    }
    return false;
}

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

export const propsChanged = (a = {}, b = {}) => {
    for (let i in a) if (!(i in b)) return true;
    for (let i in b) if (a[i] !== b[i]) return true;
    return false;
};

// a smidge faster for when theres known/equal number of keys
export const fixedPropsChanged = (a = {}, b = {}) => {
    for (let i in b) if (a[i] !== b[i]) return true;
    return false;
};


// https://github.com/dashed/shallowequal
export function shallowEqual(objA, objB, compare, compareContext) {
    var ret = compare ? compare.call(compareContext, objA, objB) : void 0;
    if (ret !== void 0) return !!ret;
    if (Object.is(objA, objB)) return true;
    if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) return false;
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    // Test for A's keys different from B.
    for (var idx = 0; idx < keysA.length; idx++) {
        var key = keysA[idx];
        if (!bHasOwnProperty(key)) return false;
        var valueA = objA[key];
        var valueB = objB[key];
        ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
        if (ret === false || (ret === void 0 && !Object.is(valueA, valueB))) return false;
    }
    return true;
}

// inspired by react hooked form utils
//https://github.com/react-hook-form/react-hook-form/blob/master/src/utils/deepEqual.ts
export const isEqual = (object1, object2) => {
    if (isPrimitive(object1) || isPrimitive(object2)) {
        return object1 === object2;
    }
    if (isDateObject(object1) && isDateObject(object2)) {
        return object1.getTime() === object2.getTime();
    }
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        if (!keys2.includes(key)) return false;
        const val2 = object2[key];
        if (
            (isDateObject(val1) && isDateObject(val2)) ||
            (isObj(val1) && isObj(val2)) ||
            (isArray(val1) && isArray(val2))
                ? !isEqual(val1, val2)
                : val1 !== val2) {
            return false;
        }
    }
    return true;
}

/*################################
##################################

           PARSING

##################################
################################*/


export const jsonParse = str => {
    let result;
    try {
        result = {data: JSON.parse(str)};
    } catch (error) {
        result = {error};
    }
    return result;
};

/*################################
##################################

            MISC

##################################
################################*/

export const stringify = (data = []) => {
    let out = '';
    for (let key in data) {
        let val = data[key];
        out += key + (typeof val == 'object' ? stringify(data[key]) : data[key]);
    }
    return out;
};

export const memoize = (fn) => {
    let cache = {};
    return (arg) => {
        if (cache[arg]) return cache[arg];
        let result = fn(arg);
        cache[arg] = result;
        return result;
    };
};

export const memoizeArgs = fn => {
    let cache = {};
    return (...args) => {
        const arg = stringify(args);
        if (cache[arg]) return cache[arg];
        let result = fn(arg);
        cache[arg] = result;
        return result;
    };
};

/*################################
##################################

            BROWSER

##################################
################################*/


let b;
if (typeof window !== 'undefined') b = true;
export const isBrowser = b;
export const inBrowser = (callback, fallback) => isBrowser ? callback() : fallback;

export const isIe = () => inBrowser(() =>
    navigator.userAgent.indexOf('MSIE') !== -1
    || !!winodw.StyleMedia
    || !!document.documentMode === true
);

export const isChrome = () => inBrowser(() => {
    let isChromium = window.chrome,
        winNav = window.navigator,
        vendorName = winNav.vendor,
        isOpera = typeof window.opdr !== 'undefined',
        isIEedge = winNav.userAgent.indexOf('Edge') > -1,
        isIOSChrome = winNav.userAgent.match('CriOS');

    return isIOSChrome || isChromium !== null &&
        typeof isChromium !== 'undefined' &&
        vendorName === 'Google Inc.' &&
        isOpera === false &&
        isIEedge === false;
});

export const downloadTextFile = ({name = 'download', extension = 'txt', string = ''} = {}) => {
    let link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(string));
    link.setAttribute('download', `${name}.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// https://github.com/Polymer/pwa-helpers
export const installOfflineWatcher = offlineUpdatedCallback => {
    inBrowser(() => {
        window.addEventListener('online', () => offlineUpdatedCallback(false));
        window.addEventListener('offline', () => offlineUpdatedCallback(true));
        offlineUpdatedCallback(navigator.onLine === false);
    });
};

export const isMobile = () => {
    const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}


/*################################
##################################

            STORAGE

##################################
################################*/

// mock
let ls = {
    getItem() {
    },
    setItem() {
    },
    clear() {
    },
    removeItem() {
    }
};

if (isBrowser) ls = window.localStorage;


export const CreateLocalStore = ({namespace = '', debounceSet = 500} = {}) => {

    const localStoreSetItem = (key, val) => ls.setItem(namespace + (key || ''), JSON.stringify(val));
    const setItemDebounced = debounce(localStoreSetItem, debounceSet);

    return {
        clear: () => ls.clear(),
        removeItem: key => ls.removeItem(namespace + (key || '')),
        setItem: localStoreSetItem,
        setItemDebounced,
        subscribe: callback => eventListener(window, 'storage', callback),
        subscribeToKey: (key, callback) => {
            return eventListener(window, 'storage', (e) => {
                if (e.storageArea === localStorage && e.key === key) {
                    const {data} = jsonParse(e.newValue);
                    callback(data || null);
                }
            })
        },
        subscribeToNameSpace: callback => {
            return eventListener(window, 'storage', (e) => {
                if (e.storageArea === localStorage && e.key.startsWith(namespace)) {
                    const {data} = jsonParse(e.newValue);
                    callback(data || null);
                }
            })
        },
        getItem: key => {
            let item = ls.getItem(namespace + (key || ''));
            if (!item || item === 'undefined') return null;
            const {data} = jsonParse(item);
            return data || null;
        }
    }
}

export const localStore = CreateLocalStore();

// will depreciate this because the newly added function above "createLocalStore"  achieves the same thing
export const CreateSingleItemStorage = (storageKey, {namespace = '', debounceSet = 500} = {}) => {
    console.warn('this will be depreciated in favor of CreateLocalStore');
    const localStore = CreateLocalStore({namespace, debounceSet});
    return {
        remove: () => localStore.removeItem(storageKey),
        set: value => localStore.setItem(storageKey, value),
        setDebounced: value => localStore.setItemDebounced(storageKey, value),
        get: () => localStore.getItem(storageKey)
    }
};


/*################################
##################################

        URL, ROUTING, PARAMS

##################################
################################*/

export const toValue = (mix) => {
    if (!mix) return '';
    var str = decodeURIComponent(mix);
    if (str === 'false') return false;
    if (str === 'true') return true;
    return (+str * 0 === 0) ? (+str) : str;
};

export const getParams = (str) => {
    let tmp, k, out = {}, indi;
    str = str || window.location.search;
    indi = str.indexOf('?');
    if (indi < 0) return;
    str = str.substr(indi + 1);
    let arr = str.split('&');
    while (tmp = arr.shift()) {
        tmp = tmp.split('=');
        k = tmp.shift();
        if (out[k] !== void 0) out[k] = [].concat(out[k], toValue(tmp.shift()));
        else out[k] = toValue(tmp.shift());
    }
    return out;
};

export const stringifyParams = (obj, noQuestionMark) => {
    var enc = encodeURIComponent, k, i, tmp, str = '';
    for (k in obj) {
        if ((tmp = obj[k]) !== void 0) {
            if (Array.isArray(tmp)) {
                for (i = 0; i < tmp.length; i++) {
                    str && (str += '&');
                    str += enc(k) + '=' + enc(tmp[i]);
                }
            } else {
                str && (str += '&');
                str += enc(k) + '=' + enc(tmp);
            }
        }
    }
    return str;
};

export const url = (strings, ...interpolations) =>
    strings.reduce((out, string, i) => {
        let value = interpolations[i];
        if (isObj(value)) {
            value = isEmpty(value) ? ''
                : `${string.endsWith('?') ? '' : '?'}${stringifyParams(value)}`
        }
        if (value === undefined) value = '';
        out += `${string}${value}`;
        return out;
    }, '');

/*################################
##################################

            FETCH

##################################
################################*/

export const getCookie = (name, _out = null) => {
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                _out = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return _out;
};

export const joinEndpointInterpolations = (strings, interpolations) =>
    strings.reduce((out, string, i) => {
        let value = interpolations[i];
        if (i === 0) {
            let [method, after] = string.split(':');
            out.method = method.toUpperCase();
            string = after;
        }
        if (isObjOrArr(value) && (string.endsWith(' ') || string.endsWith('\n'))) {
            out.body = JSON.stringify(value);
            out.url += string.trim();
            return out;
        }
        if (isObj(value)) {
            if (!isEmpty(value)) out.params = value = `?${stringifyParams(value)}`;
            else value = '';
        } else if (value === undefined) value = '';
        out.url += `${string}${value}`;
        return out;
    }, {url: ''});

export const responseTypeIsJSON = response => /^application\/json/.test(response.headers.get('content-type'));

export const API = (
    {
        API_URL = '',
        getFetchOptions = () => ({}),
        onResponseOk = new Set(),
        onFailStatus = new Set(),
        onFinally = new Set()
    }, _token) => {
    const api = async (objOrTemplateStringsArray, ...interpolations) => {
        let request = Array.isArray(objOrTemplateStringsArray)
            ? joinEndpointInterpolations(objOrTemplateStringsArray, interpolations)
            : objOrTemplateStringsArray;
        let response;
        const callback = f => f(request, response);
        const {method, url, body} = request;
        try {
            response = await fetch(API_URL + url, {
                method,
                ...(body && {body}),
                ...api.getFetchOptions(request)
            });
            if (response.ok) {
                api.onResponseOk.forEach(callback);
                api.onFinally.forEach(callback);

                if (responseTypeIsJSON(response)) {
                    response = await response.json()
                }
                return Promise.resolve(response);
            }
            const err = new Error(await response.text() || response.statusText);
            err.response = response;
            api.onFailStatus.forEach(callback);
            api.onFinally.forEach(callback);
            return Promise.reject(err);
        } catch (error) {
            response = {ok: false, status: 1000, statusText: error.message};
            api.onFailStatus.forEach(callback);
            api.onFinally.forEach(callback);
            error.response = response;
            return Promise.reject(error);
        }
    };

    Object.assign(api, {
        getFetchOptions,
        onResponseOk, onFailStatus, onFinally,
        auth: {
            setToken: t => (_token = t),
            getToken: () => (_token),
            clearToken: () => (_token = undefined)
        }
    });
    return api;
};


/*################################
##################################

            OBJECTS

##################################
################################*/


export const assign = (obj, props) => {
    for (let i in props) obj[i] = props[i];
    return obj;
};
export const extend = assign;

const emptyTarget = val => isArray(val) ? [] : isObj(val) ? {} : val;

export const shallowCopy = objOrArr => assign(emptyTarget(objOrArr), objOrArr)

// export const deepCopy = o => {
//     let copy = emptyTarget(o);
//     if (isObjOrArr(o)) for (let k in o) copy[k] = isObjOrArr(o[k]) ? deepCopy(o[k]) : o[k];
//     return copy;
// };

// inspired by react-hook-form util
export function deepCopy(data) {
    let copy;
    const isArray = Array.isArray(data);
    if (isDateObject(data)) {
        copy = new Date(data);
    } else if (data instanceof Set) {
        copy = new Set(data);
    } else if (isArray || isObject(data)) {
        copy = isArray ? [] : {};
        for (const key in data) copy[key] = deepCopy(data[key]);
    } else {
        return data;
    }
    return copy;
}

export const deepCopySerializable = o => JSON.parse(JSON.stringify(o));

// inspired by react-hook-form util
export const deepMerge = (target, source) => {
    if (isPrimitive(target) || isPrimitive(source)) return source;
    for (const key in source) {
        const targetValue = target[key];
        const sourceValue = source[key];
        const bothAreObjectsOrBothAreArrays = (isObj(targetValue) && isObj(sourceValue))
            || (isArray(targetValue) && isArray(sourceValue));
        if (bothAreObjectsOrBothAreArrays) target[key] = deepMerge(targetValue, sourceValue);
        else target[key] = sourceValue
    }
    return target;
}

// https://youmightnotneed.com/lodash/
// toPath('a[0].b.c') // => ['a', '0', 'b', 'c']
export const toPath = (path) => path.match(/([^[.\]])+/g);

export function getIn(obj, key, def, p = 0) {
    const path = isArray(key) ? key : toPath(key);
    while (obj && p < path.length) obj = obj[path[p++]];
    return obj === undefined ? def : obj;
}

// inspired by https://github.com/formium/formik/blob/master/packages/formik/src/utils.ts
// This is Jarad Palmer's version of setIn.
// It is better tailored for more accurate change detection in state management
export function setIn(obj, path, value) {
    let res = shallowCopy(obj);
    let resVal = res;
    let i = 0;
    let pathArray = toPath(path);
    for (; i < pathArray.length - 1; i++) {
        const currentPath = pathArray[i];
        let currentObj = getIn(obj, pathArray.slice(0, i + 1));
        if (currentObj && (isObj(currentObj) || isArray(currentObj))) {
            resVal = resVal[currentPath] = shallowCopy(currentObj);
        } else {
            const nextPath = pathArray[i + 1];
            resVal = resVal[currentPath] = isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
        }
    }
    // Return original object if new value is the same as current
    if ((i === 0 ? obj : resVal)[pathArray[i]] === value) return obj;
    if (value === undefined) delete resVal[pathArray[i]];
    else resVal[pathArray[i]] = value;
    // If the path array has a single element, the loop did not run.
    // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
    if (i === 0 && value === undefined) delete res[pathArray[i]];
    return res;
}


export const selectAndOthers = ({props, select, fallbacks} = {}) => {
    let selected = {};
    let others = {...props};
    for (let i = 0; i < select.length; i++) {
        const prop = select[i];
        const {[prop]: value, ...rest} = others;
        if (typeof value !== 'undefined') {
            selected[prop] = value;
            others = rest;
        } else if (fallbacks) {
            selected[prop] = fallbacks[prop];
        }
    }
    return {selected, others};
};


export const formatObjArrForSimpleTable = (objArr, excludeKeys = [], formatter = str => str) => {
    let columns = [];
    let row = objArr[0];
    Object.keys(row).forEach(key => {
        if (!excludeKeys.includes(key)) {
            columns.push({
                id: key,
                label: formatter(key)
            });
        }
    });
    return {
        columns,
        rows: objArr
    };
};

export const getStateUpdate = (updater, prev) => (isFunc(updater) ? updater(prev) : updater);

/*################################
##################################

            ARRAYS

##################################
################################*/

export const getTotalOfPropInObjArr = (objArr, prop, initial = 0) =>
    objArr.reduce((acc, curr) => acc + curr[prop], initial);

export const groupObjArrByProp = (objArr, prop, condition = x => !!x) => {
    const groups = {}, others = [];
    objArr.forEach(item => {
        const groupName = isFunc(prop) ? prop(item) : item[prop];
        const shouldGroup = condition(groupName);
        (shouldGroup ? groups[groupName] || (groups[groupName] = []) : others).push(item);
    });
    return {groups, others};
};

export const sortOrderOfObjArr = (arr, propKeyOrGetterFunc, descend) => {
    let nameA, nameB, lowerIt = val => typeof val === 'string' ? val.toLowerCase() : val;
    const get = isFunc(propKeyOrGetterFunc)
        ? obj => (propKeyOrGetterFunc(obj))
        : obj => (obj[propKeyOrGetterFunc]);
    return arr.sort((a, b) => {
        nameA = lowerIt(get(a));
        nameB = lowerIt(get(b));
        if (nameA < nameB) return descend ? 1 : -1;
        if (nameA > nameB) return descend ? -1 : 1;
        return 0;
    });
};

export const reorder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};


export const getMatcherForFindIndex = findById => {
    findById = findById === true ? 'id' : findById;
    return findById ? (a, b) => (a[findById] === b[findById]) : (a, b) => (a === b);
};

export const createIsInArray = ({findById} = {}) => {
    const itemsMatch = getMatcherForFindIndex(findById);
    return (arr, item) => arr.findIndex(it => itemsMatch(item, it)) !== -1;
};

export const isInArray = (arr, item, {findById} = {}) => {
    const itemsMatch = getMatcherForFindIndex(findById);
    return arr.findIndex(it => itemsMatch(item, it)) !== -1;
};

//not [*(!][!)!]
export const excludeItemsFromAray = (targetArray, toExcludeArray, {findById} = {}) => {
    const isInArray = createIsInArray({findById});
    return [...targetArray].filter(item => !isInArray(toExcludeArray, item));
};

//intersection [!(*][*)!]
export const getItemsThatExistInBothArrays = (arr1, arr2, {findById} = {}) => {
    const isInArray = createIsInArray({findById});
    return [...arr1].filter(it => isInArray(arr2, it));
};

// const union = (arr, ...args) => [...new Set(arr.concat(...args))]
//union
export const combineArraysAndDeduplicate = (arr1, arr2, {findById} = {}) => {
    return [...arr1, ...excludeItemsFromAray(arr2, arr1, {findById})];
};

export const removeItemFromArray = (arr, item, {findById, returnRemoved} = {}) => {
    const itemsMatch = getMatcherForFindIndex(findById);
    arr = [...arr];
    const removed = arr.splice(arr.findIndex(it => itemsMatch(item, it)) >>> 0, 1);
    return returnRemoved ? [arr, {removed}] : arr;
};

export const toggleSelection = (selections, item, {findById, returnAction} = {}) => {
    let out, action;
    if (!isInArray(selections, item, {findById})) {
        out = [...selections, item];
        action = {added: item};
    } else {
        const [update, {removed}] = removeItemFromArray(selections, item, {findById, returnRemoved: true});
        out = update;
        action = {removed};
    }
    return returnAction ? [out, action] : out;
};

export const updateSelectionsInArray = ({array = [], selections = [], findById} = {}, updateFn) => {
    const itemsMatch = getMatcherForFindIndex(findById), arrayCopy = [...array];
    for (let arrayIndex = 0; arrayIndex < arrayCopy.length; arrayIndex++) {
        for (let selectionsIndex = 0; selectionsIndex < selections.length; selectionsIndex++) {
            let arrayItem = arrayCopy[arrayIndex], selectionsItem = selections[selectionsIndex];
            if (arrayItem && selectionsItem && itemsMatch(arrayItem, selectionsItem)) {
                const result = updateFn({
                    array: arrayCopy, arrayIndex, selections, selectionsIndex, arrayItem, selectionsItem
                });
                if (result) arrayCopy[arrayIndex] = result;
            }
        }
    }
    return arrayCopy;
};

export const array1IncludesAllItemsFromArray2 = (arr1, arr2) => {
    let len1 = arr1.length, len2 = arr2.length;
    if ((!len1 && !len2) || (len1 && !len2) || (!len1 && len2)) return false;
    for (let i = len2; i--;) if (!arr1.includes(arr2[i])) return false;
    return true;
};

export function closestItem(arr, item) {
    const index = arr.indexOf(item);
    if (index === -1) {
        return arr[0];
    } else if (index === arr.length - 1) {
        return arr[arr.length - 2];
    } else {
        return arr[index + 1];
    }
}

/*################################
##################################

            ASYNC

##################################
################################*/

export const tryCatchProm = async prom => {
    try {
        return {data: await prom, error: undefined}
    } catch (error) {
        return {error, data: undefined}
    }
}

export const tryCatch = async fn => {
    try {
        return {data: await fn(), error: undefined}
    } catch (error) {
        return {error, data: undefined}
    }
}

export const cancelablePromise = (promise) => {
    let hasCanceled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(val => (hasCanceled ? reject({isCanceled: true}) : resolve(val)));
        promise.catch(error => (hasCanceled ? reject({isCanceled: true}) : reject(error)));
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled = true;
        }
    };
};

export const till = promise => promise
    .then(data => ({data}))
    .catch(error => Promise.resolve({error}));

export const createProcessor = onUpdateComplete => {
    const promise = new Promise(resolve => resolve());
    let isProcessing = false;
    return () => {
        if (!isProcessing) isProcessing = promise.then(() => {
            onUpdateComplete();
            isProcessing = false;
        });
        return isProcessing;
    };
};

export const wait = time => new Promise(r => setTimeout(r, time));

/*################################
##################################

            DATE / TIME

##################################
################################*/

export const formatSeconds = seconds =>
    Object.entries({hr: seconds / 3600, min: (seconds % 3600) / 60, sec: (seconds % 3600) % 60})
        .reduce((acc, [t, a, amount = Math.floor(a)]) => {
            // amount = amount ? amount + `${t} ` : '';
            amount = amount ? amount + `${t}${amount !== 1 ? 's' : ''}` : '';
            acc = acc + amount;
            return acc;
        }, '');


/*################################
##################################

            TIMING

##################################
################################*/

//
// export function debounced(func, wait, immediate) {
//     var timeout;
//     return function () {
//         var context = this, args = arguments;
//         var later = function () {
//             timeout = null;
//             if (!immediate) func.apply(context, args);
//         };
//         var callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(context, args);
//     };
// }

// https://github.com/mui-org/material-ui/blob/master/packages/mui-utils/src/debounce.js
export function debounce(func, wait = 166) {
    let timeout;

    function debounced(...args) {
        const later = () => {
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    }

    debounced.clear = () => {
        clearTimeout(timeout);
    };

    return debounced;
}

// stackoverflow : make-javascript-interval-synchronize-with-actual-time
// get the current time rounded down to a whole second in milliseconds (with a 10% margin)
export const getCurrentRoundedTimeMs = () => 1000 * Math.floor(Date.now() / 1000 + 0.1);

export const oncePerSecond = callback => {
    let timeout, stop;
    const fn = () => {
        let now = getCurrentRoundedTimeMs();
        callback(now);
        if (!stop) {
            timeout = setTimeout(fn, now + 1000 - Date.now());
        } else clearTimeout(timeout);
    };
    fn();
    return () => {
        stop = true;
        clearTimeout(timeout);
    };
};


/*################################
##################################

    EVENTS, QUEUE, SUBSCRIPTIONS

##################################
################################*/

export const Q = (count = 0, queue = {}) => ({
    nq: cb => queue[`${count++}`] = cb,
    kill: () => (queue = {}),
    invoke: () => {
        for (let q in queue) queue[q]();
        queue = {};
    }
});

export const Subie = (subs = [], _unsub = it => subs.splice(subs.indexOf(it) >>> 0, 1)) => [
    it => ((subs.push(it), () => _unsub(it))),
    (...data) => subs.slice().map(f => (f(...data))),
    _unsub
];


export const addListener = (to, ev, cb) => to.addEventListener(ev, cb);
export const removeListener = (from, ev, cb) => from.removeEventListener(ev, cb);
export const eventListener = (to, ev, cb, opts) => {
    if (!Array.isArray(to)) return addListener(to, ev, cb, opts), () => removeListener(to, ev, cb);
    let unListenAll = [];
    to.forEach(l => {
        addListener(...l);
        unListenAll.push(() => removeListener(...l));
    });
    return () => unListenAll.forEach(f => f());
};


//synthetic events @credit mitt
export const Eventer = (all) => {
    all = all || Object.create(null);
    let on = (event, handler) => (all[event] || (all[event] = [])).push(handler),
        off = (event, handler) => all[event] && all[event].splice(all[event].indexOf(handler) >>> 0, 1),
        counter = 0, once = (event, handler) => {
            const func = {}, oneTimeCall = (counter++) + '', unregister = () => off(event, func[oneTimeCall]);
            func[oneTimeCall] = (...data) => (handler(...data), unregister());
            on(event, func[oneTimeCall]);
            return unregister;
        };
    return {
        on, off, once, destroy: (event) => delete all[event],
        emit: (event, ...data) => {
            (all[event] || []).slice().map(fn => fn(...data));
            (all['*'] || []).slice().map(fn => fn(event, ...data));
        }

    };
};

export const onEnterKey = cb => ({
    onKeyDown: e => {
        (e.keyCode ? e.keyCode : e.which) === 13 && cb && cb(e);
    }
});


const _onTouchClick = (isBrowser && ('ontouchstart' in window)) ? 'onTouchStart' : 'onClick';
export const onTap = (fn) => ({[_onTouchClick]: fn});


/*################################
##################################

           STRINGS

##################################
################################*/


export const reduceWhiteSpaceToMax1Space = string =>
    string.trim().split('\n').join(' ').split('\r').join(' ').split('\t').join(' ').replace(/ +/g, ' ');

export const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

export const capEachFirst = (string) =>
    string.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

export const deSnake = text => text.split('_').join(' ');

export const deKebab = text => text.split('-').join(' ');

export const snakeToSentenceCase = text => capEachFirst(deSnake(text));


/*################################
##################################

    RANDOM, NUMBER GENERATION, UNIQUE IDS, HASH

##################################
################################*/

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const getRandomOneOf = (arr) => arr[getRandomInt(0, arr.length - 1)];

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const alphaLen = alphabet.length;

export const getAlphaCharFromNum = (num, result = '') => {
    let charIndex = num % alphaLen, quotient = num / alphaLen;
    if (charIndex - 1 === -1) {
        charIndex = alphaLen;
        quotient--;
    }
    result = alphabet.charAt(charIndex - 1) + result;
    return quotient >= 1 ? getAlphaCharFromNum(parseInt(quotient), result) : result;
};

const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

export const uuid = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();

export const uniqueId = () => uuid() + '-' + Date.now();

export const toHash = str =>
    'css' + str.split('').reduce((out, i) => (10 * out + i.charCodeAt(0)) >>> 0, 0);

