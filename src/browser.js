export const isBrowser = typeof window !== 'undefined';
export const ifBrowser = (callback, fallback) => isBrowser ? callback() : fallback;

export const is_ie_or_old_edge = () => ifBrowser(() =>
    navigator.userAgent.indexOf("MSIE") !== -1
    || !!winodw.StyleMedia
    || !!document.documentMode === true
);

export const isChrome = () => ifBrowser(() => {
    let isChromium = window.chrome,
        winNav = window.navigator,
        vendorName = winNav.vendor,
        isOpera = typeof window.opr !== "undefined",
        isIEedge = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS");

    return isIOSChrome || isChromium !== null &&
        typeof isChromium !== "undefined" &&
        vendorName === "Google Inc." &&
        isOpera === false &&
        isIEedge === false;
});

// https://github.com/Polymer/pwa-helpers
export const installOfflineWatcher = offlineUpdatedCallback => {
   ifBrowser(()=>{
       window.addEventListener('online', () => offlineUpdatedCallback(false));
       window.addEventListener('offline', () => offlineUpdatedCallback(true));
       offlineUpdatedCallback(navigator.onLine === false);
   })
};

export const getCookie = (name, _out = null) => {
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                _out = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return _out;
};