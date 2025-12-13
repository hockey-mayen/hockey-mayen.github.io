document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-email').forEach(el => {
        const user = el.dataset.user;
        const domain = el.dataset.domain;

        if (!user || !domain) return;

        const email = `${user}@${domain}`;

        el.innerHTML = `<a href="mailto:${email}">${email}</a>`;
    });
});
