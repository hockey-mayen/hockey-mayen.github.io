document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-mail').forEach((a) => {
        const encoded = a.dataset.x;
        if (!encoded) return;

        let email;
        try {
            email = atob(encoded);
        } catch {
            return;
        }

        // Mail direkt anzeigen
        a.textContent = email;
        a.href = `mailto:${email}`;

        // optional: extern behandeln
        a.target = '_blank';
        a.rel = 'noopener';
    });
});
