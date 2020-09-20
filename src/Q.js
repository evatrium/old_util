export const Q = (count = 0, queue = {}) => ({
    nq: cb => queue[`${count++}`] = cb,
    kill: queue = {},
    invoke: () => Object.keys(queue).forEach(q => (queue[q](), delete queue[q]))
});