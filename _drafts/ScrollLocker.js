// import {NOOP} from "./constants";
// import {eventListener} from "./events";
// import {inBrowser} from "./browser";
//
// export const ScrollLocker = (_stopScroll, _xscroll, _yscroll, dom) => {
//     dom = dom || inBrowser(() => window);
//     return {
//         unlisten: inBrowser(() => {
//             return eventListener(dom, 'scroll', () => _stopScroll && dom.scrollTo(_xscroll, _yscroll))
//         }, NOOP),
//         lock: () => {
//             _stopScroll = true;
//             _xscroll = (inBrowser(() => window)).pageXOffset;// || window.document.documentElement.scrollLeft
//             _yscroll = (inBrowser(() => window)).pageYOffset;// || window.document.documentElement.scrollTop;
//         },
//         letGo: () => (_stopScroll = false)
//     }
// };