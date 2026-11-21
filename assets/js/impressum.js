document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.collapsible-header');
    const content = document.querySelector('.collapsible-content');
    const arrow = button?.querySelector('.arrow');
    if (!button || !content || !arrow) return;

    button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        content.style.display = expanded ? 'none' : 'block';
        arrow.textContent = expanded ? '▶' : '▼';
    });
});
