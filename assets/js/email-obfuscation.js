document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-mail').forEach((a) => {
        let revealed = false;

        a.addEventListener('click', (e) => {
            // Beim ersten Klick nur anzeigen
            if (!revealed) {
                e.preventDefault();

                const encoded = a.dataset.x;
                if (!encoded) return;

                let email;
                try {
                    email = atob(encoded);
                } catch {
                    return;
                }

                a.textContent = email;
                a.href = `mailto:${email}`;
                revealed = true;
            }
            // beim zweiten Klick → normales mailto
        });
    });
});
