const fs = require('node:fs');
const { buildCss, cssDir, sourceFiles } = require('./build-css.cjs');

let timer;

function rebuild() {
  try {
    buildCss();
  } catch (error) {
    console.error(error.message);
  }
}

rebuild();
fs.watch(cssDir, (eventType, filename) => {
  if (!filename || !sourceFiles.includes(filename.toString())) return;
  clearTimeout(timer);
  timer = setTimeout(rebuild, 150);
});
process.stdout.write('CSS-Watcher aktiv. Für die Vorschau Jekyll in einem zweiten Terminal starten.\n');
