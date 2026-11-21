document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.copy-gps-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const gpsText = button.parentElement.querySelector('.gps-text').textContent;
            try {
                if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
                await navigator.clipboard.writeText(gpsText);
                button.textContent = '✔ Kopiert!';
            } catch {
                const input = document.createElement('input');
                input.value = gpsText;
                input.style.position = 'absolute';
                input.style.left = '-9999px';
                document.body.appendChild(input);
                input.select();
                try {
                    button.textContent = document.execCommand('copy') ? '✔ Kopiert!' : 'Fehler';
                } catch {
                    button.textContent = 'Fehler';
                } finally {
                    input.remove();
                }
            }
            setTimeout(() => { button.textContent = 'Kopieren'; }, 2000);
        });
    });
});
