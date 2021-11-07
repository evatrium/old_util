// import { addListener, inBrowser, Subie } from '../src/_utils';
//
// export const Eve = (all) => {
//   all = all || Object.create(null);
//   let off = (event, handler) => all[event] && all[event].splice(all[event].indexOf(handler) >>> 0, 1),
//     on = (event, handler) => ((all[event] || (all[event] = [])).push(handler), () => off(event, handler));
//   return {
//     on, off, destroy: (event) => delete all[event],
//     emit: (event, ...data) => {
//       (all[event] || []).slice().map(fn => fn(...data));
//       (all['*'] || []).slice().map(fn => fn(event, ...data));
//     }
//   };
// };
//
// //real dom events
// export const Events = () => {
//   let handlers = {},
//     Handler = () => {
//       let [sub, notify] = Subie();
//       return {
//         listener: ({ detail }) => notify(detail),
//         sub
//       };
//     },
//     on = (event, handler) => {
//       if (!handlers[event]) {
//         handlers[event] = Handler();
//         inBrowser(() => {
//           addListener(window, event, handlers[event].listener);
//         });
//       }
//       return handlers[event].sub(handler);
//     };
//
//   return {
//     on,
//     once: (event, handler) => {
//       let unsub = on(event, (data) => {
//         handler(data);
//         unsub();
//       });
//       return unsub;
//     },
//     emit: (event, data) =>
//       inBrowser(() => {
//         window.dispatchEvent(
//           new CustomEvent(event, { detail: data, bubbles: true, composed: true })
//         );
//       })
//   };
// };