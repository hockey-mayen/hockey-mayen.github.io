document.addEventListener('DOMContentLoaded', () => {
    // Worker Endpoint (öffentlich ok)
    const WORKER_URL = 'https://hockey-mayen-contact.sergej-schatz.workers.dev';

    const RECIPIENT_LABELS = {
        geschaeftsfuehrung: 'Geschäftsführung',
        vorsitz: 'Vorsitz',
        jugendwart: 'Jugendwart',
        webmaster: 'Webmaster',
    };

    const MIN_MESSAGE_LEN = 20;

    const form = document.getElementById('contactForm');
    const recipient = document.getElementById('recipient');
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const messageEl = document.getElementById('message');
    const honeypotEl = document.getElementById('honeypot');

    const submitBtn = document.getElementById('submitBtn');
    const hint = document.getElementById('formHint');

    const recipientError = document.getElementById('recipientError');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const messageCounter = document.getElementById('messageCounter');

    const thankYouBox = document.getElementById('thankYouBox');
    const summaryBox = document.getElementById('summaryBox');

    const turnstileError = document.getElementById('turnstileError');

    const sanitizeText = (v) => String(v ?? '').trim();
    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());

    // Turnstile token wird hier gespeichert
    let turnstileToken = '';

    function setError(el, show) {
        if (!el) return;
        el.style.display = show ? 'block' : 'none';
    }

    function setSubmitEnabled(enabled) {
        submitBtn.disabled = !enabled;
        if (!enabled) submitBtn.setAttribute('disabled', 'disabled');
        else submitBtn.removeAttribute('disabled');
    }

    function updateMessageCounter() {
        const len = sanitizeText(messageEl.value).length;
        if (!messageCounter) return;

        if (len >= MIN_MESSAGE_LEN) {
            messageCounter.textContent = `${len}/${MIN_MESSAGE_LEN} Zeichen ✅`;
            messageCounter.style.color = '#008f5a';
        } else {
            messageCounter.textContent = `${len}/${MIN_MESSAGE_LEN} Zeichen (mindestens ${MIN_MESSAGE_LEN})`;
            messageCounter.style.color = '#6c757d';
        }
    }

    function validateForm() {
        const recipientVal = sanitizeText(recipient.value);
        const recipientOk = !!recipientVal;

        const nameVal = sanitizeText(nameEl.value);
        const nameOk = nameVal.length >= 2;

        const emailVal = sanitizeText(emailEl.value);
        const emailOk = isValidEmail(emailVal);

        const msgVal = sanitizeText(messageEl.value);
        const msgOk = msgVal.length >= MIN_MESSAGE_LEN;

        // Turnstile token vorhanden?
        const turnstileOk = !!sanitizeText(turnstileToken);

        setError(recipientError, !recipientOk);
        setError(nameError, nameVal.length > 0 && !nameOk);
        setError(emailError, emailVal.length > 0 && !emailOk);
        setError(messageError, msgVal.length > 0 && !msgOk);
        setError(turnstileError, !turnstileOk);

        if (hint) {
            hint.textContent = recipientOk ? `Empfänger: ${RECIPIENT_LABELS[recipientVal] || recipientVal}` : '';
        }

        const allOk = recipientOk && nameOk && emailOk && msgOk && turnstileOk;
        setSubmitEnabled(allOk);
        return allOk;
    }

    function escapeHtml(str) {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function renderSummary(payload) {
        const telLine = payload.phone
            ? `<div><strong>Telefon:</strong> ${escapeHtml(payload.phone)}</div>`
            : '';

        summaryBox.innerHTML = `
      <div><strong>Ansprechpartner:</strong> ${escapeHtml(payload.recipientLabel)}</div>
      <div><strong>Name:</strong> ${escapeHtml(payload.name)}</div>
      <div><strong>E-Mail:</strong> ${escapeHtml(payload.email)}</div>
      ${telLine}
      <div style="margin-top:10px;"><strong>Nachricht:</strong></div>
      <div style="white-space:pre-wrap;">${escapeHtml(payload.message)}</div>
    `;
    }

    // ---- Turnstile Hook: sobald Turnstile geladen ist, Token holen ----
    // Turnstile (Cloudflare) setzt global "turnstile". Wir pollen kurz, bis es da ist.
    function wireTurnstile() {
        const el = document.getElementById('turnstileWidget');
        if (!el) return;

        const tryInit = () => {
            if (!window.turnstile || typeof window.turnstile.render !== 'function') {
                setTimeout(tryInit, 150);
                return;
            }

            // Widget rendern (wenn Cloudflare es nicht automatisch getan hat)
            // Wenn es schon gerendert ist, ist render() idempotent je nach Browser – safe.
            const widgetId = window.turnstile.render(el, {
                sitekey: el.getAttribute('data-sitekey'),
                callback: (token) => {
                    turnstileToken = token || '';
                    validateForm();
                },
                'expired-callback': () => {
                    turnstileToken = '';
                    validateForm();
                },
                'error-callback': () => {
                    turnstileToken = '';
                    validateForm();
                },
            });

            // Optional: für Debug
            // console.log('Turnstile widgetId', widgetId);
        };

        tryInit();
    }

    // Events
    recipient.addEventListener('change', validateForm);
    nameEl.addEventListener('input', validateForm);
    emailEl.addEventListener('input', validateForm);
    phoneEl.addEventListener('input', validateForm);

    messageEl.addEventListener('input', () => {
        updateMessageCounter();
        validateForm();
    });

    // Init
    updateMessageCounter();
    setSubmitEnabled(false);
    wireTurnstile();
    validateForm();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Honeypot gefüllt? -> Bot (still)
        if (honeypotEl && sanitizeText(honeypotEl.value)) {
            return;
        }

        // Wenn Token fehlt: Fehlermeldung zeigen
        if (!sanitizeText(turnstileToken)) {
            setError(turnstileError, true);
            return;
        }

        if (!validateForm()) return;

        const recipientKey = sanitizeText(recipient.value);

        const payload = {
            // Turnstile
            turnstileToken,

            // Honeypot
            honeypot: honeypotEl ? sanitizeText(honeypotEl.value) : '',

            // Form data
            recipient: recipientKey,
            recipientLabel: RECIPIENT_LABELS[recipientKey] || recipientKey,
            name: sanitizeText(nameEl.value),
            email: sanitizeText(emailEl.value),
            phone: sanitizeText(phoneEl.value),
            message: sanitizeText(messageEl.value),
            page: window.location.href,
        };

        try {
            setSubmitEnabled(false);
            submitBtn.textContent = 'Sende...';

            const res = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            let data = null;
            try {
                data = await res.json();
            } catch {
                // ignore
            }

            if (!res.ok || (data && data.ok === false)) {
                throw new Error(`Worker failed: HTTP ${res.status}`);
            }

            renderSummary(payload);
            form.style.display = 'none';
            thankYouBox.style.display = 'block';

            // Turnstile Token nach Erfolg „verbrauchen“ (verhindert double-submit)
            turnstileToken = '';
            if (window.turnstile && typeof window.turnstile.reset === 'function') {
                try { window.turnstile.reset(); } catch {}
            }
        } catch (err) {
            console.error(err);
            alert('Leider konnte die Nachricht nicht gesendet werden. Bitte versuchen Sie es später erneut.');

            submitBtn.textContent = 'Senden';
            updateMessageCounter();

            // Turnstile resetten (neues Token)
            turnstileToken = '';
            if (window.turnstile && typeof window.turnstile.reset === 'function') {
                try { window.turnstile.reset(); } catch {}
            }

            validateForm();
        }
    });
});
