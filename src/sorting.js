export const sortOrderOfObjArr = (arr, objProp, descend) => {
    let nameA, nameB, lowerIt = val => typeof val === 'string' ? val.toLowerCase() : val;
    return arr.sort((a, b) => {
        nameA = lowerIt(a[objProp]);
        nameB = lowerIt(b[objProp]);
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
