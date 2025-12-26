document.addEventListener('DOMContentLoaded', () => {
    const WORKER_URL = 'https://hockey-mayen-contact.sergej-schatz.workers.dev/';

    const RECIPIENT_LABELS = {
        geschaeftsfuehrung: 'Geschäftsführung',
        vorsitz: 'Vorsitz',
        jugendwart: 'Jugendwart',
        webmaster: 'Webmaster',
    };

    const MIN_MESSAGE_LEN = 25;

    const form = document.getElementById('contactForm');
    if (!form) return;

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

    let turnstileToken = '';
    let isSubmitting = false;

    // =========================
    // ✅ HARD DEBUG (Console + UI)
    // =========================
    const DEBUG =
        new URLSearchParams(window.location.search).get('debug') === '1';

    function dbg(...args) {
        if (!DEBUG) return;
        console.log('[contactForm]', ...args);
    }

    // Kleine Debug-Box unten am Formular (nur wenn DEBUG=true)
    let debugBox = document.getElementById('contactDebugBox');
    if (!debugBox && DEBUG) {
        debugBox = document.createElement('pre');
        debugBox.id = 'contactDebugBox';
        debugBox.style.cssText =
            'margin-top:12px;padding:10px;border-radius:10px;background:#fff;' +
            'border:1px dashed #bbb;font-size:12px;line-height:1.35;white-space:pre-wrap;' +
            'color:#333;max-height:220px;overflow:auto;';
        debugBox.textContent = 'Debug aktiviert…';
        form.appendChild(debugBox);
    }

    function writeDebug(text) {
        if (!DEBUG || !debugBox) return;
        debugBox.textContent = text;
    }

    const sanitizeText = (v) => String(v ?? '').trim();
    const isValidEmail = (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());

    function setError(el, show) {
        if (!el) return;
        el.style.display = show ? 'block' : 'none';
    }

    function setSubmitEnabled(enabled, reason = '') {
        if (!submitBtn) return;
        const shouldEnable = !!enabled && !isSubmitting;

        const before = submitBtn.disabled;
        submitBtn.disabled = !shouldEnable;
        if (!shouldEnable) submitBtn.setAttribute('disabled', 'disabled');
        else submitBtn.removeAttribute('disabled');

        if (DEBUG && before !== submitBtn.disabled) {
            dbg('button changed', { disabled: submitBtn.disabled, reason });
        }
    }

    function updateMessageCounter() {
        if (!messageEl || !messageCounter) return;
        const len = sanitizeText(messageEl.value).length;

        if (len >= MIN_MESSAGE_LEN) {
            messageCounter.textContent = `${len}/${MIN_MESSAGE_LEN} Zeichen ✅`;
            messageCounter.style.color = '#008f5a';
        } else {
            messageCounter.textContent = `${len}/${MIN_MESSAGE_LEN} Zeichen (mindestens ${MIN_MESSAGE_LEN})`;
            messageCounter.style.color = '#6c757d';
        }
    }

    function snapshot(reason) {
        const recipientVal = sanitizeText(recipient?.value);
        const nameVal = sanitizeText(nameEl?.value);
        const emailVal = sanitizeText(emailEl?.value);
        const msgVal = sanitizeText(messageEl?.value);

        const snap = {
            reason,
            recipientVal,
            recipientOk: !!recipientVal,
            nameLen: nameVal.length,
            nameOk: nameVal.length >= 2,
            emailVal,
            emailOk: isValidEmail(emailVal),
            msgLen: msgVal.length,
            msgOk: msgVal.length >= MIN_MESSAGE_LEN,
            tokenLen: (turnstileToken || '').length,
            captchaOk: !!turnstileToken,
            isSubmitting,
            btnDisabled: submitBtn?.disabled,
        };

        dbg('snapshot', snap);
        writeDebug(JSON.stringify(snap, null, 2));
        return snap;
    }

    function validateForm(reason = 'validate') {
        if (!recipient || !nameEl || !emailEl || !messageEl) {
            dbg('validate aborted: missing elements');
            return false;
        }

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

        if (hint) {
            hint.textContent = recipientOk
                ? `Empfänger: ${RECIPIENT_LABELS[recipientVal] || recipientVal}`
                : '';
        }

        const allOk = recipientOk && nameOk && emailOk && msgOk && captchaOk;

        // Wichtig: hier schreiben wir IMMER einen Snapshot, damit du es siehst
        snapshot(`${reason} => allOk=${allOk}`);

        setSubmitEnabled(allOk, reason);
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
        if (!summaryBox) return;

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

    // ✅ Turnstile callbacks (global!)
    window.onTurnstileSuccess = (token) => {
        turnstileToken = String(token || '');
        if (turnstileError) turnstileError.style.display = 'none';
        dbg('turnstile success', { tokenLen: turnstileToken.length });
        validateForm('turnstileSuccess');
    };

    window.onTurnstileExpired = () => {
        turnstileToken = '';
        dbg('turnstile expired');
        validateForm('turnstileExpired');
    };

    window.onTurnstileError = () => {
        turnstileToken = '';
        dbg('turnstile error');
        if (turnstileError) turnstileError.style.display = 'block';
        validateForm('turnstileError');
    };

    // ✅ Events
    function hook(el, label) {
        if (!el) return;
        ['input', 'change', 'keyup', 'blur'].forEach((evt) => {
            el.addEventListener(evt, () => {
                dbg(`event ${label}:${evt}`);
                updateMessageCounter();
                validateForm(`${label}:${evt}`);
            });
        });
    }

    hook(recipient, 'recipient');
    hook(nameEl, 'name');
    hook(emailEl, 'email');
    hook(phoneEl, 'phone');
    hook(messageEl, 'message');

    // Extra: wenn disabled bleibt, sieht man warum
    submitBtn?.addEventListener('click', () => {
        dbg('submit button clicked', { disabled: submitBtn.disabled });
        snapshot('button clicked');
    });

    // Autofill / iOS / Browser-Specials
    requestAnimationFrame(() => {
        updateMessageCounter();
        validateForm('RAF');
    });

    setTimeout(() => {
        updateMessageCounter();
        validateForm('t+300ms');
    }, 300);

    setTimeout(() => {
        updateMessageCounter();
        validateForm('t+1200ms');
    }, 1200);

    // 🔁 Heartbeat: schreibt regelmäßig Status (wichtig für "sporadisch")
    setInterval(() => {
        updateMessageCounter();
        validateForm('heartbeat');
    }, 800);

    // Initial
    updateMessageCounter();
    setSubmitEnabled(false, 'init');
    validateForm('init');

    // ✅ Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (honeypotEl && sanitizeText(honeypotEl.value)) return;

        if (!turnstileToken) {
            if (turnstileError) {
                turnstileError.textContent = 'Bitte bestätigen Sie kurz, dass Sie kein Bot sind.';
                turnstileError.style.display = 'block';
            }
            validateForm('submit blocked: no token');
            return;
        }

        if (!validateForm('submit validate')) return;

        const recipientKey = sanitizeText(recipient.value);
        const payload = {
            honeypot: honeypotEl ? sanitizeText(honeypotEl.value) : '',
            recipient: recipientKey,
            recipientLabel: RECIPIENT_LABELS[recipientKey] || recipientKey,
            name: sanitizeText(nameEl.value),
            email: sanitizeText(emailEl.value),
            phone: sanitizeText(phoneEl.value),
            message: sanitizeText(messageEl.value),
            turnstileToken,
        };

        try {
            isSubmitting = true;
            setSubmitEnabled(false, 'submitting');
            if (submitBtn) submitBtn.textContent = 'Sende...';
            snapshot('submitting');

            const res = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            let data = null;
            try { data = await res.json(); } catch {}

            if (!res.ok || (data && data.ok === false)) {
                if (res.status === 403) {
                    turnstileToken = '';
                    if (turnstileError) {
                        turnstileError.textContent = 'Captcha ungültig/abgelaufen. Bitte erneut bestätigen.';
                        turnstileError.style.display = 'block';
                    }
                    if (window.turnstile && typeof window.turnstile.reset === 'function') {
                        window.turnstile.reset();
                    }
                }
                throw new Error(`HTTP ${res.status} ${data ? JSON.stringify(data) : ''}`);
            }

            renderSummary(payload);
            form.style.display = 'none';
            if (thankYouBox) thankYouBox.style.display = 'block';
            snapshot('submit success');
        } catch (err) {
            console.error(err);
            alert('Leider konnte die Nachricht nicht gesendet werden. Bitte versuchen Sie es später erneut.');
            if (submitBtn) submitBtn.textContent = 'Senden';
            isSubmitting = false;
            validateForm('submit error');
        } finally {
            if (!thankYouBox || thankYouBox.style.display !== 'block') {
                isSubmitting = false;
                if (submitBtn) submitBtn.textContent = 'Senden';
                validateForm('submit finally');
            }
        }
    });
});
