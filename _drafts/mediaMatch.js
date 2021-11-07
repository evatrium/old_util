// import * as React from 'react';
// import { getThemeProps, useTheme } from '@material-ui/styles';
//
// export default function useMediaQuery(queryInput, options = {}) {
//     const theme = useTheme();
//     const props = getThemeProps({
//         theme,
//         name: 'MuiUseMediaQuery',
//         props: {},
//     });
//
//
//     let query = typeof queryInput === 'function' ? queryInput(theme) : queryInput;
//     query = query.replace(/^@media( ?)/m, '');
//
//
//
//     const [match, setMatch] = React.useState(() => {
//
//         // Once the component is mounted, we rely on the
//         // event listeners to return the correct matches value.
//         return defaultMatches;
//     });
//
//     React.useEffect(() => {
//         let active = true;
//
//         const queryList = matchMedia(query);
//         const updateMatch = () => {
//             // Workaround Safari wrong implementation of matchMedia
//             // TODO can we remove it?
//             // https://github.com/mui-org/material-ui/pull/17315#issuecomment-528286677
//             if (active) {
//                 setMatch(queryList.matches);
//             }
//         };
//         updateMatch();
//         queryList.addListener(updateMatch);
//         return () => {
//             active = false;
//             queryList.removeListener(updateMatch);
//         };
//     }, [query, matchMedia, supportMatchMedia]);
//
//     return match;
// }

// let mm = window.matchMedia,
//     screenSizes = ['xs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
//     values = [360, 360, 600, 800, 960, 1280, 1920],
//     queries = screenSizes.map((size, i) => `screen and (${i === 0 ? 'max' : 'min'}-width:${values[screenSizes.indexOf(size)]}px)`),
//     getMatches = () => [...screenSizes.filter((size, i) => !!mm(queries[i]).matches ? size : false)],
//     colNums = 12,
//     percents = {...[...Array(colNums + 1)].map((_, i) => ((i / colNums) * 100).toFixed(8) + '%')},
//     getStyles = (matching, propOptions) => {
//         let styleSizing = {};
//         for (let i = matching.length, propMatch; i--;) {
//             propMatch = propOptions[matching[i]];
//             if ((propMatch + '') && percents[propMatch]) {
//                 const noShow = propMatch === 0 ? {display: 'none'} : {};
//                 styleSizing = {flexBasis: percents[propMatch], maxWidth: percents[propMatch], ...noShow};
//                 break;
//             }
//         }
//         return styleSizing
//     },
//     initMatches = getMatches(),
//     mediaMatch = obi({
//         matching: initMatches,
//         match: initMatches[initMatches.length - 1]
//     }),
//     getSetMatches = (matches) => {
//         matches = getMatches();
//         mediaMatch.$merge({
//             matching: matches,
//             match: matches[matches.length - 1]
//         })
//     };
//
// queries.forEach((q) => mm(q).addListener(getSetMatches));
//
// export {mediaMatch, getStyles, screenSizes}
