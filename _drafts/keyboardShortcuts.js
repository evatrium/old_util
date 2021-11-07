//
// /**
//  * Setup keyboard shortcuts
//  */
// window.addEventListener('keydown', (e) => {
//   // console.log('key', e.code, e.ctrlKey, e.metaKey, e.shiftKey, e.key);
//
//   // Save As
//   if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyS') {
//     e.preventDefault();
//     app.saveFileAs();
//     return;
//   }
//
//   // Save
//   if ((e.ctrlKey === true || e.metaKey === true) && e.key === 's') {
//     e.preventDefault();
//     app.saveFile();
//     return;
//   }
//
//   // Open
//   if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'o') {
//     e.preventDefault();
//     app.openFile();
//     return;
//   }
//
//   // Close
//   if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'n') {
//     e.preventDefault();
//     app.newFile();
//     return;
//   }
//
//   // Quit
//   if ((e.ctrlKey === true || e.metaKey === true) &&
//     (e.key === 'q' || e.key === 'w')) {
//     e.preventDefault();
//     app.quitApp();
//     return;
//   }
//
//   // Capture Tabs
//   if (e.ctrlKey === true && e.shiftKey === true && e.key === 'M') {
//     e.preventDefault();
//     e.stopPropagation();
//     app.toggleCaptureTabs();
//   }
// });