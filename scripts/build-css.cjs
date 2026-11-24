const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const CleanCSS = require('clean-css');

const root = path.resolve(__dirname, '..');
const cssDir = path.join(root, 'assets', 'css');
// Die Reihenfolge gehört zum Design: spätere Dateien dürfen frühere Regeln überschreiben.
const sourceFiles = [
  'global.css',
  'header.css',
  'aktuell.css',
  'footer.css',
  'tiles.css',
  'chronik.css',
  'impressum.css',
  'events.css',
  'highlights.css',
  'kontakt.css',
  'training.css',
  'turniere.css',
  'just-for-fun.css',
  'anmeldung.css',
  'datenschutz.css',
  'themes.css',
];

function buildCss() {
  const source = sourceFiles.map((file) => {
    const filename = path.join(cssDir, file);
    const css = fs.readFileSync(filename, 'utf8').replace(
      /url\((['"]?)(\/assets\/images\/christmas\/[a-z0-9-]+\.svg)\1\)/gi,
      (_match, _quote, url) => {
        const image = fs.readFileSync(path.join(root, url.slice(1)));
        const version = createHash('sha256').update(image).digest('hex').slice(0, 12);
        return `url('${url}?v=${version}')`;
      },
    );
    if (!css.trim()) throw new Error(`CSS-Quelldatei ist leer: ${file}`);
    return `/* ${file} */\n${css}`;
  }).join('\n');

  const result = new CleanCSS({ level: 1, rebase: false }).minify(source);
  if (result.errors.length || result.warnings.length || !result.styles) {
    throw new Error([...result.errors, ...result.warnings].join('\n') || 'CSS-Build lieferte keine Ausgabe');
  }

  const destination = path.join(cssDir, 'all.min.css');
  const output = `${result.styles}\n`;
  if (!fs.existsSync(destination) || fs.readFileSync(destination, 'utf8') !== output) {
    fs.writeFileSync(destination, output);
  }
  process.stdout.write(`CSS gebaut: ${sourceFiles.length} Dateien → assets/css/all.min.css (${Buffer.byteLength(output)} Bytes)\n`);
}

if (require.main === module) {
  try {
    buildCss();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { buildCss, cssDir, sourceFiles };
