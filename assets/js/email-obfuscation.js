document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-e').forEach(el => {
        const user = el.dataset.mu;
        const domain = el.dataset.md;

        if (!user || !domain) return;

        const email = `${user}@${domain}`;

        el.innerHTML = `<a href="mailto:${email}">${email}</a>`;
    });
});
