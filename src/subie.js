export const Subie = () => {
    let subs = [],
        unsub = (sub, i) => {
            let out = [];
            for (i = subs.length; i--;) subs[i] === sub ? (sub = null) : (out.push(subs[i]));
            subs = out;
        };
    return {
        unsub,
        sub: sub => (subs.push(sub), () => unsub(sub)),
        notify: data => subs.forEach(s => s && s(data))
    }
};