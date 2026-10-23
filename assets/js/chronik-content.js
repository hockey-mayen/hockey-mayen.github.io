// Gemeinsame, begrenzte Ausgabe für Chronik und aktuelle Meldungen.
(() => {
    const text = (value) => typeof value === 'string' ? value : '';
    const allowedTags = new Set(['B', 'STRONG', 'EM', 'I', 'BR', 'A']);
    const discardedTags = new Set([
        'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH',
        'TEMPLATE', 'NOSCRIPT', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA',
        'IMG', 'VIDEO', 'AUDIO', 'SOURCE', 'LINK', 'META', 'BASE',
    ]);

    function safeUrl(value, { image = false } = {}) {
        if (typeof value !== 'string' || !value.trim() || /[\u0000-\u001f\u007f]/.test(value)) {
            return null;
        }

        try {
            const url = new URL(value.trim(), window.location.href);
            if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
                return null;
            }
            // Chronikbilder werden ausschließlich von der eigenen Website geladen.
            if (image && url.origin !== window.location.origin) return null;
            return url.href;
        } catch {
            return null;
        }
    }

    function createLink(value, label) {
        const href = safeUrl(value);
        if (!href) return null;
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text(label);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        return link;
    }

    function appendHeadline(container, value) {
        // Eine bestehende Überschrift enthält einen redaktionellen Zeilenumbruch.
        // Nur das attributlose <br> wird erkannt; alles andere bleibt Klartext.
        text(value).split(/<br\s*\/?>/i).forEach((part, index) => {
            if (index) container.appendChild(document.createElement('br'));
            container.appendChild(document.createTextNode(part));
        });
    }

    function richText(value) {
        // template-Inhalt bleibt inert und wird niemals direkt in die Seite übernommen.
        // Nur neu erzeugte erlaubte Elemente und Textknoten verlassen diese Funktion.
        const template = document.createElement('template');
        template.innerHTML = text(value);

        function copyChildren(source, target, depth = 0) {
            if (depth > 40) return;
            for (const node of source.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    target.appendChild(document.createTextNode(node.textContent));
                    continue;
                }
                if (node.nodeType !== Node.ELEMENT_NODE) continue;
                if (node.namespaceURI !== 'http://www.w3.org/1999/xhtml') continue;
                if (discardedTags.has(node.tagName)) continue;

                if (!allowedTags.has(node.tagName)) {
                    copyChildren(node, target, depth + 1);
                    continue;
                }

                let element;
                if (node.tagName === 'A') {
                    element = createLink(node.getAttribute('href'), '');
                    if (!element) {
                        copyChildren(node, target, depth + 1);
                        continue;
                    }
                    // Bisheriges Erscheinungsbild des redaktionellen Inline-Links.
                    element.style.color = '#00865a';
                    element.style.fontWeight = '600';
                } else {
                    element = document.createElement(node.tagName.toLowerCase());
                }
                copyChildren(node, element, depth + 1);
                target.appendChild(element);
            }
        }

        const fragment = document.createDocumentFragment();
        copyChildren(template.content, fragment);
        return fragment;
    }

    function appendText(container, value, maxLength) {
        const fullContent = richText(value);
        const plainContent = fullContent.cloneNode(true);
        plainContent.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode('\n')));
        const plainText = plainContent.textContent;
        const isLong = plainText.length > maxLength;
        const short = document.createElement('span');
        short.className = 'short-text';

        if (isLong) {
            let shortened = plainText.slice(0, maxLength);
            const lastSpace = shortened.lastIndexOf(' ');
            if (lastSpace > 0) shortened = shortened.slice(0, lastSpace);
            // Nur den bereits bereinigten DOM-Baum kürzen, nicht HTML-Quelltext.
            // Dadurch bleiben Formatierungen und Zeilenumbrüche erhalten.
            let remaining = shortened.length;
            function appendPrefix(source, target) {
                for (const node of source.childNodes) {
                    if (remaining <= 0) break;
                    if (node.nodeType === Node.TEXT_NODE) {
                        const value = node.textContent.slice(0, remaining);
                        target.appendChild(document.createTextNode(value));
                        remaining -= value.length;
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const copy = node.cloneNode(false);
                        if (node.tagName === 'BR') remaining -= 1;
                        else appendPrefix(node, copy);
                        target.appendChild(copy);
                    }
                }
            }
            appendPrefix(fullContent, short);
            short.appendChild(document.createTextNode(' ...'));
        } else {
            short.appendChild(fullContent.cloneNode(true));
        }

        const full = document.createElement('span');
        full.className = 'full-text';
        full.style.display = 'none';
        full.appendChild(fullContent);
        container.append(short, full);

        if (isLong) {
            const toggle = document.createElement('a');
            toggle.href = '#';
            toggle.className = 'toggle-text';
            toggle.textContent = 'Weiterlesen';
            container.appendChild(toggle);
        }
        return { short, full };
    }

    window.ChronikContent = Object.freeze({ text, safeUrl, createLink, appendHeadline, appendText });
})();
