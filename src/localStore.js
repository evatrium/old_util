import {isBrowser} from "./browser";
import {jsonParse} from "./jsonParse";

let ls = {
    getItem: () => {
    }
};

if(isBrowser){
    ls = window.localStorage;
}

export const localStore = {
    clear: () => ls.clear(),
    removeItem: key => ls.removeItem(key),
    setItem: (key, val) => ls.setItem(key, JSON.stringify(val)),
    getItem: key => {
        let item = ls.getItem(key);
        if (!item || item === 'undefined') return null;
        const {ok, data} = jsonParse(item);
        return ok ? data : null;
    }
};
