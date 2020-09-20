export const Subie = (subs = [], _unsub = it => subs.splice(subs.indexOf(it) >>> 0, 1)) => [
    it => ((subs.push(it), () => _unsub(it))),
    (...data) => subs.slice().map(f => (f(...data)))
];
