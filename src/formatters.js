export const formatObjArrForSimpleTable = (objArr, excludeKeys = [], formatter = str => str) => {
    let columns = [];
    let row = objArr[0];
    Object.keys(row).forEach(key => {
        if (!excludeKeys.includes(key)) {
            columns.push({
                id: key,
                label: formatter(key)
            })
        }
    });
    return {
        columns,
        rows: objArr
    }
};