export const selectionsHandler = (selections, item, findIndex = it => it === item) => {
    let index = selections.findIndex(findIndex), out = [];
    if (index === -1) out = [...selections, item];
    else if (index === 0) out = out.concat(selections.slice(1));
    else if (index === selections.length - 1) out = out.concat(selections.slice(0, -1));
    else if (index > 0) out = out.concat(selections.slice(0, index), selections.slice(index + 1));
    return out;
};