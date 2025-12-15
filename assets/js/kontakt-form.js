document.addEventListener('DOMContentLoaded', () => {
    /**
     * TODO: HIER EINTRAGEN
     * Power Automate HTTP Trigger URL (mit sig=...)
     */
    // const POWER_AUTOMATE_URL =
    //     'https://default70c2dfc9c58e49c6a07ce225223e1f.87.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/0c0a313922b74506a150cf9f3d41eb47/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_emNsEutw_nagUeo1Zsi1Nkf4hs5Wr8fXiyBhJse2Ko';
    const POWER_AUTOMATE_URL =
        'https://hockey-mayen-contact.sergej-schatz.workers.dev';
    /**
     * Muss zu deiner Flow-Condition passen (secret == ...)
     */
    const FLOW_SECRET = 'HCM_CONTACT_2025';

    /**
     * Für die E-Mail: was im Flow später verwendet wird
     */
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

        setError(recipientError, !recipientOk);
        setError(nameError, nameVal.length > 0 && !nameOk);
        setError(emailError, emailVal.length > 0 && !emailOk);
        setError(messageError, msgVal.length > 0 && !msgOk);

        if (hint) {
            hint.textContent = recipientOk ? `Empfänger: ${RECIPIENT_LABELS[recipientVal] || recipientVal}` : '';
        }

        const allOk = recipientOk && nameOk && emailOk && msgOk;
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

        // Honeypot gefüllt? -> Bot
        if (honeypotEl && sanitizeText(honeypotEl.value)) {
            return;
        }

        if (!validateForm()) return;

        if (!POWER_AUTOMATE_URL || POWER_AUTOMATE_URL.includes('PASTE_YOUR_POWER_AUTOMATE_TRIGGER_URL_HERE')) {
            alert('Power Automate URL ist noch nicht gesetzt.');
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
        };

        try {
            setSubmitEnabled(false);
            submitBtn.textContent = 'Sende...';

            const res = await fetch(POWER_AUTOMATE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            // Response kann z.B. {"ok":true} sein
            // (nicht zwingend nötig auszuwerten, aber nice)
            let data = null;
            try {
                data = await res.json();
            } catch {
                // falls Response kein JSON ist
            }

            // Optional: wenn Flow {ok:false} liefert
            if (data && data.ok === false) {
                throw new Error('Flow returned ok:false');
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
