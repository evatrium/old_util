/**
 * creates a single style sheet. returns a function to update the same sheet
 * @param {node|| null} mount - pass the node to mount the style element to defaults to document head
 * @returns {function} for adding styles to the same stylesheet
 */
export const headStyleTag = (mount) => {
    let style = document.createElement('style');
    style.appendChild(document.createTextNode(""));
    (mount || document.head).appendChild(style);
    return (css) => (style.appendChild(document.createTextNode(css)), style);
};

export const toCssVarsFromJsThemeObj = (themeObj) =>
    Object.keys(themeObj).reduce((acc, curr) =>
        ((acc[curr] = `var(--${curr},${themeObj[curr]})`), acc), {});

export const convertThemeToCssVars = (vars, selector) =>
    `${selector || ':root'}{${Object.keys(vars).map((key) => `--${key}:${vars[key]};`).join('')}}`;

export const raf = (fn) => requestAnimationFrame(fn);

export const CSSTextToObj = cssText => {
    var style = {},
        cssToJs = s => s.startsWith('-') ? s : s.replace(/\W+\w/g, match => match.slice(-1).toUpperCase()),
        properties = cssText.split(";").map(o => o.split(":").map(x => x && x.trim()));
    for (var [property, value] of properties) {
        let prop = cssToJs(property);
        if (prop) style[prop] = value;
    }
    return style
};

export const hexToRgbA = (hex, opacity) => {
    let c = [...hex.substring(1)];
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')}, ${opacity || '1'})`;
};


export const toHash = str =>
    "css" +
    str.split("").reduce((out, i) => (10 * out + i.charCodeAt(0)) >>> 0, 0);
