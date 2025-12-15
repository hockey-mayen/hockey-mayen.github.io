document.addEventListener('DOMContentLoaded', () => {
    const POWER_AUTOMATE_URL = 'https://hockey-mayen-contact.sergej-schatz.workers.dev';
    const FLOW_SECRET = 'HCM_CONTACT_2025';

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

    // Turnstile Token (wird per Callback gesetzt)
    let turnstileToken = '';

    // Turnstile callbacks müssen global sein (weil data-callback="...")
    window.onTurnstileSuccess = (token) => {
        turnstileToken = String(token || '');
        if (turnstileError) turnstileError.style.display = 'none';
        validateForm();
    };

    window.onTurnstileExpired = () => {
        turnstileToken = '';
        validateForm();
    };

    window.onTurnstileError = () => {
        turnstileToken = '';
        if (turnstileError) turnstileError.style.display = 'block';
        validateForm();
    };

    const sanitizeText = (v) => String(v ?? '').trim();
    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());

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

        const captchaOk = !!turnstileToken;

        setError(recipientError, !recipientOk);
        setError(nameError, nameVal.length > 0 && !nameOk);
        setError(emailError, emailVal.length > 0 && !emailOk);
        setError(messageError, msgVal.length > 0 && !msgOk);

        // Turnstile-Fehlertext nur anzeigen, wenn User schon versucht zu senden -> machen wir beim Submit.
        // Hier lassen wir ihn ruhig, damit es nicht nervt.

        if (hint) {
            hint.textContent = recipientOk ? `Empfänger: ${RECIPIENT_LABELS[recipientVal] || recipientVal}` : '';
        }

        const allOk = recipientOk && nameOk && emailOk && msgOk && captchaOk;
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
    validateForm();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Honeypot gefüllt? -> Bot (still)
        if (honeypotEl && sanitizeText(honeypotEl.value)) {
            return;
        }

        // Wenn captcha fehlt: Fehltext zeigen
        if (!turnstileToken) {
            if (turnstileError) turnstileError.style.display = 'block';
            validateForm();
            return;
        }

        if (!validateForm()) return;

        if (!POWER_AUTOMATE_URL) {
            alert('Worker URL ist noch nicht gesetzt.');
            return;
        }

        const recipientKey = sanitizeText(recipient.value);
        const payload = {
            secret: FLOW_SECRET,
            honeypot: honeypotEl ? sanitizeText(honeypotEl.value) : '',
            recipient: recipientKey,
            recipientLabel: RECIPIENT_LABELS[recipientKey] || recipientKey,
            name: sanitizeText(nameEl.value),
            email: sanitizeText(emailEl.value),
            phone: sanitizeText(phoneEl.value),
            message: sanitizeText(messageEl.value),
            turnstileToken, // <-- wichtig
        };

        try {
            setSubmitEnabled(false);
            submitBtn.textContent = 'Sende...';

            const res = await fetch(POWER_AUTOMATE_URL, {
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
                // typischer Fall: Turnstile abgelaufen/ungültig => 403
                if (res.status === 403) {
                    turnstileToken = '';
                    if (turnstileError) {
                        turnstileError.textContent = 'Captcha ungültig/abgelaufen. Bitte erneut bestätigen.';
                        turnstileError.style.display = 'block';
                    }
                    // optional: Turnstile reset, falls verfügbar
                    if (window.turnstile && typeof window.turnstile.reset === 'function') {
                        window.turnstile.reset();
                    }
                }
                throw new Error(`HTTP ${res.status}`);
            }

            renderSummary(payload);
            form.style.display = 'none';
            thankYouBox.style.display = 'block';
        } catch (err) {
            console.error(err);
            alert('Leider konnte die Nachricht nicht gesendet werden. Bitte versuchen Sie es später erneut.');
            submitBtn.textContent = 'Senden';
            updateMessageCounter();
            validateForm();
        }
    });
});
