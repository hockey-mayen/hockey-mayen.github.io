document.addEventListener('DOMContentLoaded', () => {
    const WORKER_URL = 'https://hockey-mayen-contact.sergej-schatz.workers.dev/';

    const RECIPIENT_LABELS = {
        geschaeftsfuehrung: 'Geschäftsführung',
        vorsitz: 'Vorsitz',
        jugendwart: 'Jugendwart',
        webmaster: 'Webmaster',
    };

    const MIN_MESSAGE_LEN = 25;
    const MAX_MESSAGE_LEN = 5000;

    const form = document.getElementById('contactForm');
    document.documentElement.classList.add('js');
    if (!form) return;

    const recipient = document.getElementById('recipient');
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const messageEl = document.getElementById('message');
    if (messageEl) messageEl.maxLength = MAX_MESSAGE_LEN;
    const honeypotEl = document.getElementById('honeypot');

    const submitBtn = document.getElementById('submitBtn');
    const hint = document.getElementById('formHint');

    const recipientError = document.getElementById('recipientError');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const phoneError = document.getElementById('phoneError');
    const messageCounter = document.getElementById('messageCounter');

    const thankYouBox = document.getElementById('thankYouBox');
    const summaryBox = document.getElementById('summaryBox');
    const turnstileError = document.getElementById('turnstileError');

    let turnstileToken = '';
    let isSubmitting = false;

    // Nur Normalisierung; HTML-Ausgabe erfolgt unten über Textknoten.
    const sanitizeText = (v) => String(v ?? '').trim();
    const isValidEmail = (value) =>
        /^[^\s@<>,;:"\\]+@[^\s@<>,;:"\\]+\.[^\s@<>,;:"\\]{2,}$/.test(String(value).trim());

    function setError(el, show) {
        if (!el) return;
        el.style.display = show ? 'block' : 'none';
    }

    function setSubmitEnabled(enabled) {
        if (!submitBtn) return;
        const shouldEnable = !!enabled && !isSubmitting;

        submitBtn.disabled = !shouldEnable;
        if (!shouldEnable) submitBtn.setAttribute('disabled', 'disabled');
        else submitBtn.removeAttribute('disabled');
    }

    function updateMessageCounter() {
        if (!messageEl || !messageCounter) return;
        const len = sanitizeText(messageEl.value).length;

        if (len >= MIN_MESSAGE_LEN) {
            messageCounter.textContent = `${len.toLocaleString('de-DE')} / 5.000 Zeichen (mindestens ${MIN_MESSAGE_LEN})`;
            messageCounter.style.color = '#008f5a';
        } else {
            messageCounter.textContent = `${len.toLocaleString('de-DE')} / 5.000 Zeichen (mindestens ${MIN_MESSAGE_LEN})`;
            messageCounter.style.color = '#6c757d';
        }
    }

    function validateForm() {
        if (!recipient || !nameEl || !emailEl || !messageEl) {
            return false;
        }

        const recipientVal = sanitizeText(recipient.value);
        const recipientOk = Object.prototype.hasOwnProperty.call(RECIPIENT_LABELS, recipientVal);

        const nameVal = sanitizeText(nameEl.value);
        const nameOk = nameVal.length >= 2 && nameVal.length <= 120 && !/[\u0000-\u001f\u007f]/.test(nameVal);

        const emailVal = sanitizeText(emailEl.value);
        const emailOk = emailVal.length <= 254 && isValidEmail(emailVal);

        const msgVal = sanitizeText(messageEl.value);
        const msgOk = msgVal.length >= MIN_MESSAGE_LEN && msgVal.length <= MAX_MESSAGE_LEN;
        const phoneVal = sanitizeText(phoneEl?.value);
        const phoneOk = phoneVal.length <= 50 && !/[\u0000-\u001f\u007f]/.test(phoneVal);

        const captchaOk = !!turnstileToken;

        setError(recipientError, !recipientOk);
        setError(nameError, nameVal.length > 0 && !nameOk);
        setError(emailError, emailVal.length > 0 && !emailOk);
        setError(messageError, msgVal.length > 0 && !msgOk);
        setError(phoneError, !phoneOk);

        if (hint) {
            hint.textContent = recipientOk
                ? `Empfänger: ${RECIPIENT_LABELS[recipientVal] || recipientVal}`
                : '';
        }

        const allOk = recipientOk && nameOk && emailOk && phoneOk && msgOk && captchaOk;

        setSubmitEnabled(allOk);

        return allOk;
    }

    function renderSummary(payload) {
        if (!summaryBox) return;
        summaryBox.replaceChildren();

        const appendLine = (label, value) => {
            const line = document.createElement('div');
            const title = document.createElement('strong');
            title.textContent = `${label}: `;
            line.append(title, document.createTextNode(value));
            summaryBox.appendChild(line);
        };

        appendLine('Ansprechpartner', payload.recipientLabel);
        appendLine('Name', payload.name);
        appendLine('E-Mail', payload.email);
        if (payload.phone) appendLine('Telefon', payload.phone);

        const message = document.createElement('div');
        message.style.marginTop = '10px';
        message.style.whiteSpace = 'pre-wrap';
        const title = document.createElement('strong');
        title.textContent = 'Nachricht:';
        message.append(title, document.createTextNode(`\n${payload.message}`));
        summaryBox.appendChild(message);
    }

    // ======================================================
    // ✅ NEW: Custom Dropdown für Ansprechpartner (macOS-like)
    // Voraussetzung: kontakt.md enthält recipientWrap/Btn/Menu
    // ======================================================
    function initCustomRecipientSelect() {
        const wrap = document.getElementById('recipientWrap');
        const native = document.getElementById('recipient');
        const btn = document.getElementById('recipientBtn');
        const menu = document.getElementById('recipientMenu');

        if (!wrap || !native || !btn || !menu) {
            return;
        }

        const options = Array.from(menu.querySelectorAll('[role="option"]'));

        // ✅ echtes Overlay-Element (DOM), nicht ::before
        let overlayEl = null;

        const ensureOverlay = () => {
            if (overlayEl) return overlayEl;

            overlayEl = document.createElement('div');
            overlayEl.className = 'select-overlay';
            overlayEl.setAttribute('aria-hidden', 'true');

            // ✅ Tap/Click auf Overlay => schließen
            overlayEl.addEventListener('click', () => close());
            overlayEl.addEventListener('touchstart', () => close(), { passive: true });

            document.body.appendChild(overlayEl);
            return overlayEl;
        };

        const open = () => {
            wrap.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');

            // ✅ Scroll sperren (damit nicht Seite scrollt)
            document.body.style.overflow = 'hidden';

            // ✅ Overlay aktivieren
            ensureOverlay().classList.add('is-visible');

            // active auf aktuell ausgewählte Option setzen
            const current = native.value || '';
            options.forEach((o) =>
                o.classList.toggle('is-active', (o.getAttribute('data-value') || '') === current)
            );
        };

        const close = () => {
            wrap.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');

            // ✅ Scroll wieder erlauben
            document.body.style.overflow = '';

            // ✅ Overlay ausblenden (und optional entfernen)
            if (overlayEl) overlayEl.classList.remove('is-visible');
        };

        const setSelected = (value) => {
            native.value = value;
            native.dispatchEvent(new Event('change', { bubbles: true }));

            const match = options.find((o) => (o.getAttribute('data-value') || '') === value);
            btn.textContent = match ? match.textContent.trim() : 'Bitte auswählen…';

            options.forEach((o) => o.setAttribute('aria-selected', 'false'));
            if (match) match.setAttribute('aria-selected', 'true');
        };

        // initial sync
        setSelected(native.value || '');

        // Öffnen/Schließen
        btn.addEventListener('click', () => {
            wrap.classList.contains('is-open') ? close() : open();
        });

        // Auswahl per Klick
        options.forEach((opt) => {
            opt.addEventListener('click', () => {
                const v = opt.getAttribute('data-value') || '';
                setSelected(v);
                close();
            });
        });

        // ESC schließen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });

        // Click outside schließen (zusätzlich)
        document.addEventListener('click', (e) => {
            if (!wrap.contains(e.target) && wrap.classList.contains('is-open')) close();
        });

        // Wenn native select von außen gesetzt wird, UI syncen
        native.addEventListener('change', () => {
            const v = native.value || '';
            const match = options.find((o) => (o.getAttribute('data-value') || '') === v);
            btn.textContent = match ? match.textContent.trim() : 'Bitte auswählen…';
            options.forEach((o) => o.setAttribute('aria-selected', 'false'));
            if (match) match.setAttribute('aria-selected', 'true');
        });
    }

    // ==========================================
    // ✅ Recipient aus URL setzen (?recipient=...)
    // ==========================================
    function applyRecipientFromUrl() {
        try {
            const params = new URLSearchParams(window.location.search);
            const r = (params.get('recipient') || '').trim();
            if (!r) return;

            // Whitelist: nur bekannte Werte
            if (!Object.prototype.hasOwnProperty.call(RECIPIENT_LABELS, r)) return;

            // Wert setzen + change triggern
            if (recipient) {
                recipient.value = r;
                recipient.dispatchEvent(new Event('change', { bubbles: true }));
            }
        } catch {
            // Eine ungültige URL-Vorauswahl wird ignoriert.
        }
    }

    // ✅ Turnstile callbacks (global!)
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

    // ✅ Events
    function hook(el) {
        if (!el) return;
        ['input', 'change', 'blur'].forEach((evt) => {
            el.addEventListener(evt, () => {
                updateMessageCounter();
                validateForm();
            });
        });
    }

    hook(recipient);
    hook(nameEl);
    hook(emailEl);
    hook(phoneEl);
    hook(messageEl);

    // Autofill / Browser-Specials
    requestAnimationFrame(() => {
        updateMessageCounter();
        validateForm();
    });

    setTimeout(() => {
        updateMessageCounter();
        validateForm();
    }, 300);

    setTimeout(() => {
        updateMessageCounter();
        validateForm();
    }, 1200);

    // Initial
    updateMessageCounter();
    setSubmitEnabled(false);

    // ✅ NEW: Custom Select initialisieren (vor URL-Preselect ist ok)
    initCustomRecipientSelect();

    // ✅ NEW: preselect aus URL
    applyRecipientFromUrl();

    validateForm();

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
            validateForm();
            return;
        }

        if (!validateForm()) return;

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
            setSubmitEnabled(false);
            if (submitBtn) submitBtn.textContent = 'Sende...';

            const res = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            let data = null;
            try {
                data = await res.json();
            } catch {}

            if (!res.ok || data?.ok !== true) {
                throw new Error('send-failed');
            }

            renderSummary(payload);
            form.style.display = 'none';
            if (thankYouBox) thankYouBox.style.display = 'block';
        } catch {
            turnstileToken = '';
            if (turnstileError) {
                turnstileError.textContent = 'Bitte bestätigen Sie vor einem neuen Versuch erneut, dass Sie kein Bot sind.';
                turnstileError.style.display = 'block';
            }
            if (window.turnstile && typeof window.turnstile.reset === 'function') {
                window.turnstile.reset();
            }
            alert('Der Versand konnte nicht bestätigt werden. Bitte prüfen Sie vor einem erneuten Versuch, ob die Nachricht bereits angekommen ist.');
            if (submitBtn) submitBtn.textContent = 'Senden';
            isSubmitting = false;
            validateForm();
        } finally {
            if (!thankYouBox || thankYouBox.style.display !== 'block') {
                isSubmitting = false;
                if (submitBtn) submitBtn.textContent = 'Senden';
                validateForm();
            }
        }
    });
});
