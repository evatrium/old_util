export const propsChanged = (a, b) => {
    a = a || {};
    b = b || {};
    for (var k in a) if (a[k] !== b[k]) return true;
    for (var k in b) if (a[k] !== b[k]) return true;
    return false
};