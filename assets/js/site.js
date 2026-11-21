document.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) {
        AOS.init({ offset: 20, duration: 800, easing: 'ease-out', delay: 0, once: true });
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
