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
    indi = str.indexOf("?");
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
export const stringifyParams = (obj) => {
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
    return '?' + str;
};