import {NOOP} from "./constants";
import {eventListener} from "./events";
import {ifBrowser} from "./browser";

export const ScrollLocker = (_stopScroll, _xscroll, _yscroll, dom) => {
    dom = dom || ifBrowser(() => window);
    return {
        unlisten: ifBrowser(() => {
            return eventListener(dom, 'scroll', () => _stopScroll && dom.scrollTo(_xscroll, _yscroll))
        }, NOOP),
        lock: () => {
            _stopScroll = true;
            _xscroll = (ifBrowser(() => window)).pageXOffset;// || window.document.documentElement.scrollLeft
            _yscroll = (ifBrowser(() => window)).pageYOffset;// || window.document.documentElement.scrollTop;
        },
        letGo: () => (_stopScroll = false)
    }
};