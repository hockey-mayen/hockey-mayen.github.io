const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'assets/data/chronik.json');
const outputPath = path.join(root, '_includes/highlights-initial.html');

function imageDimensions(file) {
    const data = fs.readFileSync(file);
    if (data.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
        return [data.readUInt32BE(16), data.readUInt32BE(20)];
    }
    if (data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP') {
        const format = data.toString('ascii', 12, 16);
        if (format === 'VP8X') {
            return [1 + data.readUIntLE(24, 3), 1 + data.readUIntLE(27, 3)];
        }
        if (format === 'VP8L') {
            return [
                1 + (data[21] | ((data[22] & 0x3f) << 8)),
                1 + ((data[22] >> 6) | (data[23] << 2) | ((data[24] & 0x0f) << 10)),
            ];
        }
        if (format === 'VP8 ') {
            return [data.readUInt16LE(26) & 0x3fff, data.readUInt16LE(28) & 0x3fff];
        }
    }
    if (data[0] === 0xff && data[1] === 0xd8) {
        let offset = 2;
        while (offset + 8 < data.length) {
            if (data[offset] !== 0xff) break;
            const marker = data[offset + 1];
            if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
                return [data.readUInt16BE(offset + 7), data.readUInt16BE(offset + 5)];
            }
            const length = data.readUInt16BE(offset + 2);
            if (length < 2) break;
            offset += 2 + length;
        }
    }
    return null;
}

async function build() {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const entryCount = Math.min(3, data.events.flatMap(year => year.entries).length);
    const dom = new JSDOM(
        '<div class="highlight-container"><div class="highlight-list" id="chronik-list"></div></div>',
        { url: 'https://hockey-mayen.de/', runScripts: 'outside-only' }
    );
    const { window } = dom;

    try {
        // Die echte Browser-Ausgabe samt ihrer HTML-Bereinigung wiederverwenden.
        if (window.document.readyState === 'loading') {
            await new Promise(resolve => window.document.addEventListener('DOMContentLoaded', resolve, { once: true }));
        }
        window.fetch = async (url) => {
            if (url !== '/assets/data/chronik.json') throw new Error(`Unexpected fetch: ${url}`);
            return { json: async () => data };
        };
        window.eval(fs.readFileSync(path.join(root, 'assets/js/chronik-content.js'), 'utf8'));
        window.eval(fs.readFileSync(path.join(root, 'assets/js/highlights.js'), 'utf8'));

        const list = window.document.getElementById('chronik-list');
        const rendered = new Promise((resolve, reject) => {
            if (entryCount === 0) return resolve();
            const timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error('Initial highlights did not render'));
            }, 3000);
            const observer = new window.MutationObserver(() => {
                if (list.children.length !== entryCount) return;
                clearTimeout(timer);
                observer.disconnect();
                resolve();
            });
            observer.observe(list, { childList: true });
        });

        window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
        await rendered;

        // Lokale Vorschau darf keine Bilder von der veröffentlichten Seite laden.
        for (const element of list.querySelectorAll('img[src], .img-wrap[data-img]')) {
            for (const attribute of ['src', 'data-img']) {
                if (!element.hasAttribute(attribute)) continue;
                const url = new URL(element.getAttribute(attribute), window.location.href);
                if (url.origin !== window.location.origin) throw new Error('Unexpected image origin');
                element.setAttribute(attribute, url.pathname + url.search + url.hash);
            }
        }

        const imageRoot = path.join(root, 'assets/images');
        for (const image of list.querySelectorAll('.img-wrap img[src]')) {
            const url = new URL(image.getAttribute('src'), window.location.href);
            const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
            if (!file.startsWith(imageRoot + path.sep) || !fs.existsSync(file)) continue;
            const dimensions = imageDimensions(file);
            if (!dimensions || dimensions.some(value => !value)) continue;
            const [width, height] = dimensions;
            image.setAttribute('width', String(width));
            image.setAttribute('height', String(height));
            const wrap = image.closest('.img-wrap');
            wrap.style.setProperty('--image-width', `${width}px`);
            wrap.style.setProperty('--image-ratio', `${width} / ${height}`);
        }

        list.dataset.initialCount = String(entryCount);
        const entries = Array.from(list.children, element => element.outerHTML).join('\n');
        const html = `<div class="highlight-list" id="chronik-list" data-initial-count="${entryCount}">\n${entries}\n</div>\n`
            // Jekyll verarbeitet Includes mit Liquid. Redaktionelle Klammern bleiben Text.
            .replaceAll('{', '&#123;')
            .replaceAll('}', '&#125;');

        if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, 'utf8') !== html) {
            fs.writeFileSync(outputPath, html);
            console.log(`Built ${path.relative(root, outputPath)} (${entryCount} entries)`);
        }
    } finally {
        window.close();
    }
}

build().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
