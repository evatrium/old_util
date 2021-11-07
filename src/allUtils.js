import {
  isPlainObject, isString, isEmpty, isFunction, isNumber, isBoolean, isDate,
  toPath, clone, isObject, startCase
} from 'lodash-es';

/*
    aliasing old stuff with lodash-es
 */

/*################################
##################################

TYPEOF

##################################
################################*/


export const isArray = Array.isArray;
export const isObj = isPlainObject;
export const isFunc = isFunction;
export const isNum = isNumber;
export const isBool = isBoolean;
export const isObjOrArr = (thing) => (isPlainObject(thing) || isArray(thing));
export const isInteger = (obj) => String(Math.floor(Number(obj))) === obj;
export {
  isPlainObject,
  isString,
  isEmpty,
  isFunction,
  isNumber,
  isBoolean,
  isDate
};


/*################################
##################################

PARSING

##################################
################################*/

export const jsonParse = str => {
  let result;
  try {
    result = { ok: true, data: JSON.parse(str) };
  } catch (e) {
    result = { ok: false };
  }
  return result;
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
    isOpera = typeof window.opr !== 'undefined',
    isIEedge = winNav.userAgent.indexOf('Edge') > -1,
    isIOSChrome = winNav.userAgent.match('CriOS');

  return isIOSChrome || isChromium !== null &&
    typeof isChromium !== 'undefined' &&
    vendorName === 'Google Inc.' &&
    isOpera === false &&
    isIEedge === false;
});

export const downloadTextFile = ({ name = 'download', extension = 'txt', string = '' } = {}) => {
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

const _onTouchClick = (isBrowser && ('ontouchstart' in window)) ? 'onTouchStart' : 'onClick';
export const onTap = (fn) => ({ [_onTouchClick]: fn });


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

export const localStore = {
  clear: () => ls.clear(),
  removeItem: key => ls.removeItem(key),
  setItem: (key, val) => ls.setItem(key, JSON.stringify(val)),
  getItem: key => {
    let item = ls.getItem(key);
    if (!item || item === 'undefined') return null;
    const { ok, data } = jsonParse(item);
    return ok ? data : null;
  }
};

export const CreateSingleItemStorage = storageKey => ({
  remove: () => localStore.removeItem(),
  set: value => localStore.setItem(storageKey, value),
  get: () => localStore.getItem(storageKey)
});


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
  return (noQuestionMark ? '' : '?') + str;
};


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
    if (isPlainObject(value)) {
      if (!isEmpty(value)) out.params = value = stringifyParams(value);
      else value = '';
    } else if (value === undefined) value = '';
    out.url += `${string}${value}`;
    return out;
  }, { url: '' });

export const responseTypeIsJSON = response => /^application\/json/.test(response.headers.get('content-type'));

export const API = (
  {
    API_URL = '',
    getFetchOptions = () => ({}),
    onResponseOk = new Set(),
    onFailStatus = new Set(),
    onFinally = new Set()
  }, _token) => Object.assign(async (objOrTemplateStringsArray, ...interpolations) => {
  let request = isArray(objOrTemplateStringsArray)
    ? joinEndpointInterpolations(objOrTemplateStringsArray, interpolations)
    : objOrTemplateStringsArray;
  let response;
  const callback = f => f(request, response);
  const { method, url, body } = request;
  try {
    response = await fetch(API_URL + url, {
      method,
      ...(body && { body }),
      ...api.getFetchOptions(request)
    });
    if (response.ok) {
      api.onResponseOk.forEach(callback);
      api.onFinally.forEach(callback);
      return Promise.resolve(responseTypeIsJSON(response) ? await response.json() : response);
    }
    const err = new Error(await response.text() || response.statusText);
    err.response = response;
    api.onFailStatus.forEach(callback);
    api.onFinally.forEach(callback);
    return Promise.reject(err);
  } catch (error) {
    response = { ok: false, status: 1000, statusText: error.message };
    api.onFailStatus.forEach(callback);
    api.onFinally.forEach(callback);
    error.response = response;
    return Promise.reject(error);
  }
}, {
  getFetchOptions,
  onResponseOk, onFailStatus, onFinally,
  auth: {
    setToken: t => (_token = t),
    getToken: () => (_token),
    clearToken: () => (_token = undefined)
  }
});


/*################################
##################################

OBJECTS

##################################
################################*/

export const getStateUpdate = (updater, prev) => (typeof updater === 'function' ? updater(prev) : updater);


export const assign = (obj, props) => {
  for (let i in props) obj[i] = props[i];
  return obj;
};
export const extend = assign;

const emptyTarget = val => isObj(val) ? {} : isArray(val) ? [] : val;
export const deepCopy = o => {
  let copy = emptyTarget(o);
  if (isObjOrArr(o)) for (let k in o) copy[k] = isObjOrArr(o[k]) ? deepCopy(o[k]) : o[k];
  return copy;
};

// *experimental - merge objects and arrays
export const deepMerge = (o, p) => {
  if (isObjOrArr(p)) for (let k in p) o[k] = isObjOrArr(p[k])
    ? deepMerge(o[k] || (o[k] = emptyTarget(p[k])), p[k]) : p[k];
  else o = p;
  return o;
};

// https://github.com/mui-org/material-ui/blob/next/packages/material-ui-utils/src/deepmerge.ts
export const deepMergeObj = (target, source, options = { clone: true }) => {
  var output = options.clone ? { ...target } : target;
  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach(key => {
      if (key === '__proto__') return;  // Avoid prototype pollution
      if (isPlainObject(source[key]) && key in target && isPlainObject(target[key])) {
        output[key] = deepMergeObj(target[key], source[key], options);
      } else output[key] = source[key];
    });
  }
  return output;
};


export function getIn(obj, key, def, p = 0) {
  const path = toPath(key);
  while (obj && p < path.length) obj = obj[path[p++]];
  return obj === undefined ? def : obj;
}

// https://github.com/formium/formik/blob/master/packages/formik/src/utils.ts
/**
 * Deeply set a value from in object via it's path. If the value at `path`
 * has changed, return a shallow copy of obj with `value` set at `path`.
 * If `value` has not changed, return the original `obj`.
 *
 * Existing objects / arrays along `path` are also shallow copied. Sibling
 * objects along path retain the same internal js reference. Since new
 * objects / arrays are only created along `path`, we can test if anything
 * changed in a nested structure by comparing the object's reference in
 * the old and new object, similar to how russian doll cache invalidation
 * works.
 *
 * In earlier versions of this function, which used cloneDeep, there were
 * issues whereby settings a nested value would mutate the parent
 * instead of creating a new object. `clone` avoids that bug making a
 * shallow copy of the objects along the update path
 * so no object is mutated in place.
 *
 * Before changing this function, please read through the following
 * discussions.
 *
 * @see https://github.com/developit/linkstate
 * @see https://github.com/jaredpalmer/formik/pull/123
 */
export function setIn(obj, path, value) {
  let res = clone(obj); // this keeps inheritance when obj is a class
  let resVal = res;
  let i = 0;
  let pathArray = toPath(path);

  for (; i < pathArray.length - 1; i++) {
    const currentPath = pathArray[i];
    let currentObj = getIn(obj, pathArray.slice(0, i + 1));

    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      resVal = resVal[currentPath] = clone(currentObj);
    } else {
      const nextPath = pathArray[i + 1];
      resVal = resVal[currentPath] = isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  }

  // Return original object if new value is the same as current
  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }

  if (value === undefined) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  }

  // If the path array has a single element, the loop did not run.
  // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
  if (i === 0 && value === undefined) {
    delete res[pathArray[i]];
  }

  return res;
}


export const selectAndOthers = ({ props, select, fallbacks }) => {
  let selected = {};
  let others = { ...props };
  for (let i = 0; i < select.length; i++) {
    const prop = select[i];
    const { [prop]: value, ...rest } = others;
    if (typeof value !== 'undefined') {
      selected[prop] = value;
      others = rest;
    } else if (fallbacks) selected[prop] = fallbacks[prop];
  }
  return { selected, others };
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
    const groupName = isFunction(prop) ? prop(item) : item[prop];
    const shouldGroup = condition(groupName);
    (shouldGroup ? groups[groupName] || (groups[groupName] = []) : others).push(item);
  });
  return { groups, others };
};

export const sortOrderOfObjArr = (arr, propKeyOrGetterFunc, descend) => {
  let nameA, nameB, lowerIt = val => typeof val === 'string' ? val.toLowerCase() : val;
  const get = isFunction(propKeyOrGetterFunc)
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

export const createIsInArray = ({ findById } = {}) => {
  const itemsMatch = getMatcherForFindIndex(findById);
  return (arr, item) => arr.findIndex(it => itemsMatch(item, it)) !== -1;
};

export const isInArray = (arr, item, { findById } = {}) => {
  const itemsMatch = getMatcherForFindIndex(findById);
  return arr.findIndex(it => itemsMatch(item, it)) !== -1;
};

//not [*(!][!)!]
export const excludeItemsFromAray = (targetArray, toExcludeArray, { findById } = {}) => {
  const isInArray = createIsInArray({ findById });
  return [...targetArray].filter(item => !isInArray(toExcludeArray, item));
};

//intersection [!(*][*)!]
export const getItemsThatExistInBothArrays = (arr1, arr2, { findById } = {}) => {
  const isInArray = createIsInArray({ findById });
  return [...arr1].filter(it => isInArray(arr2, it));
};

//union
export const combineArraysAndDeduplicate = (arr1, arr2, { findById } = {}) => {
  return [...arr1, ...excludeItemsFromAray(arr2, arr1, { findById })];
};

export const removeItemFromArray = (arr, item, { findById, returnRemoved } = {}) => {
  const itemsMatch = getMatcherForFindIndex(findById);
  arr = [...arr];
  const removed = arr.splice(arr.findIndex(it => itemsMatch(item, it)) >>> 0, 1);
  return returnRemoved ? [arr, { removed }] : arr;
};

export const toggleSelection = (selections, item, { findById, returnAction } = {}) => {
  let out, action;
  if (!isInArray(selections, item, { findById })) {
    out = [...selections, item];
    action = { added: item };
  } else {
    const [update, { removed }] = removeItemFromArray(selections, item, { findById, returnRemoved: true });
    out = update;
    action = { removed };
  }
  return returnAction ? [out, action] : out;
};

export const updateSelectionsInArray = ({ array = [], selections = [], findById } = {}, updateFn) => {
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

/*################################
##################################

COMPARISON, CHECKS

##################################
################################*/

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

const is = (x, y) => {
  if (x === y) return x !== 0 || y !== 0 || 1 / x === 1 / y;
  return x !== x && y !== y; // eslint-disable-line
};


export const shallowEqual = (objA, objB) => {
  if (is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null
    || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) { //eslint-disable-line
    if (!hasOwn.call(objB, keysA[i])
      || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
};

/*################################
##################################

ASYNC

##################################
################################*/

export const cancelablePromise = (promise) => {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)));
    promise.catch(error => (hasCanceled ? reject({ isCanceled: true }) : reject(error)));
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    }
  };
};

export const till = promise => promise
  .then(data => ({ data, ok: true }))
  .catch(error => Promise.resolve({ error, ok: false }));

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


/*################################
##################################

DATE TIME

##################################
################################*/

export const formatSeconds = seconds =>
  Object.entries({ hr: seconds / 3600, min: (seconds % 3600) / 60, sec: (seconds % 3600) % 60 })
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


export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
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
  (...data) => subs.slice().map(f => (f(...data)))
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
    (e.keyCode ? e.keyCode : e.which) === 13 && cb && cb();
  }
});


/*################################
##################################

STRINGS

##################################
################################*/

//alias
export const snakeToSentenceCase = text => startCase(text);

export const reduceWhiteSpaceToMax1Space = string =>
  string.trim().split('\n').join(' ').split('\r').join(' ').split('\t').join(' ').replace(/ +/g, ' ');

export const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

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
  'css' +
  str.split('').reduce((out, i) => (10 * out + i.charCodeAt(0)) >>> 0, 0);


/*################################
##################################

MISC

##################################
################################*/

export const stringify = (data) => {
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