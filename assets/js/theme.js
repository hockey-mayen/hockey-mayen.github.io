// Vor dem Stylesheet ausführen, damit gespeicherte Designs nicht kurz umspringen.
(() => {
    const storageKey = 'hockey-mayen-theme';
    const root = document.documentElement;
    const validTheme = value => value === 'standard' ? 'standard' : 'christmas';
    let initial = 'christmas';
    try {
        initial = validTheme(localStorage.getItem(storageKey));
    } catch {
        // Auch bei gesperrtem Browserspeicher bleibt der Schalter nutzbar.
    }
    root.dataset.theme = initial;
    root.dataset.themeSwitch = 'ready';

    function applyTheme(value, save = false) {
        const theme = validTheme(value);
        root.dataset.theme = theme;
        document.querySelectorAll('[data-theme-choice]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
        });
        const color = document.querySelector('meta[name="theme-color"]');
        if (color) color.content = theme === 'christmas' ? '#103c30' : '#2ea44f';
        if (save) {
            try { localStorage.setItem(storageKey, theme); } catch {}
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(root.dataset.theme);
        document.querySelectorAll('[data-theme-choice]').forEach(button => {
            button.addEventListener('click', () => applyTheme(button.dataset.themeChoice, true));
        });
    });

    window.addEventListener('storage', event => {
        if (event.key === storageKey || event.key === null) applyTheme(event.newValue);
    });
})();
