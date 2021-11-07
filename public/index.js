import {snakeToSentenceCase, deepMergeObj, deepMerge, deepCopy} from '../src';
import clone from 'lodash/cloneDeep';

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
        obj_a_array: ['a', 2, 'c', 'd']
    },
    // obj_c: {
    //     c: 1,
    //     d: true
    // }
};

const clonedObjB = clone(objB);
console.log(clonedObjB.obj_a === objB.obj_a);

// let merged = deepCopy(objB, objA, {clone: true});

// const clonedMerge = clone(merged)

// console.log(merged.obj_c === objA.obj_c)
// console.log(merged)