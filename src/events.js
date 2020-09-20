import {ifBrowser} from "./browser";
import {Subie} from "./Subie";


export const addListener = (to, ev, cb) => to.addEventListener(ev, cb);
export const removeListener = (from, ev, cb) => from.removeEventListener(ev, cb);
export const eventListener = (to, ev, cb, opts) => {
    if (!Array.isArray(to)) return addListener(to, ev, cb, opts), () => removeListener(to, ev, cb);
    let unListenAll = [];
    to.forEach(l => {
        addListener(l[0], l[1], l[2], l[3]);
        unListenAll.push(() => removeListener(l[0], l[1], l[2]));
    });
    return () => unListenAll.forEach(f => f());
};


//synthetic events
export const Eve = (all) => {
    all = all || Object.create(null);
    let off = (event, handler) => all[event] && all[event].splice(all[event].indexOf(handler) >>> 0, 1),
        on = (event, handler) => ((all[event] || (all[event] = [])).push(handler), () => off(event, handler));
    return {
        on, off, destroy: (event) => delete all[event],
        emit: (event, ...data) => {
            (all[event] || []).slice().map(fn => fn(...data));
            (all['*'] || []).slice().map(fn => fn(event, ...data));
        }
    };
};

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

//real dom events
export const Events = () => {
    let handlers = {},
        Handler = () => {
            let [sub, notify] = Subie();
            return {
                listener: ({detail}) => notify(detail),
                sub,
            }
        },
        on = (event, handler) => {
            if (!handlers[event]) {
                handlers[event] = Handler();
                ifBrowser(() => {
                    addListener(window, event, handlers[event].listener)
                })
            }
            return handlers[event].sub(handler);
        };

    return {
        on,
        once: (event, handler) => {
            let unsub = on(event, (data) => {
                handler(data);
                unsub();
            });
            return unsub
        },
        emit: (event, data) =>
            ifBrowser(() => {
                window.dispatchEvent(
                    new CustomEvent(event, {detail: data, bubbles: true, composed: true})
                )
            }),
    }
};

