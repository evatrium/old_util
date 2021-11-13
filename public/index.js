import {
    snakeToSentenceCase, deepMergeObj, deepMerge, deepCopy, shallowCopy, setIn, getIn,
    // toPath
} from '../src';
import lodashClone from 'lodash/clone';
import lodashToPath from 'lodash/toPath'


const objA = {
    obj_a: {
        obj_a_array: [1, 2, 3]
    },
    obj_c: {
        c: 2,
        obj_c_obj: {
            foo: 'bar'
        }
    }
};
const objB = {
    obj_b: 'b',
    obj_a: {
        obj_a_array: ['a', 2, 'c', 'd', objA]
    },
    // obj_c: {
    //     c: 1,
    //     d: true
    // }
};
const path = 'obj_a.obj_a_array[4].obj_c.c'
console.log('lodash toPath', lodashToPath(path));
// console.log('simple toPath', toPath(path));


const cloneTest = (cloner, name) => {
    const clonedObjB = cloner(objB);
    console.log(`****** using ${name} *********`);
    console.log('is same root reference', clonedObjB === objB);
    console.log('is same nested reference', clonedObjB.obj_a === objB.obj_a);
    console.log('is same nested reference', clonedObjB.obj_a.obj_a_array === objB.obj_a.obj_a_array);
};

cloneTest(lodashClone, 'lodash clone');
cloneTest(shallowCopy, 'simple shallow copy');


const getInResult = getIn(objB, path, 'asdf');

console.log('*** getInResult', getInResult);


const setInResult = setIn(objB, path, 'deeeep');

console.log('*** setIn result', setInResult);

console.log('*** getInResult after', getIn(setInResult, path, 'asdf'));

console.log('is same root reference', setInResult === objB);
console.log('is same nested-1 reference', setInResult.obj_a === objB.obj_a);
const nestedDeepPath = 'obj_a.obj_a_array[4].obj_a'
console.log('is same nested-deep reference',
    getIn(setInResult, nestedDeepPath) === getIn(objB, nestedDeepPath)
);

// let merged = deepCopy(objB, objA, {clone: true});

// const clonedMerge = clone(merged)

// console.log(merged.obj_c === objA.obj_c)
// console.log(merged)