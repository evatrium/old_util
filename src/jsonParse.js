export const jsonParse = str => {
    let result;
    try {
        result = {ok: true, data: JSON.parse(str)}
    } catch (e) {
        result = {ok: false}
    }
    return result;
};