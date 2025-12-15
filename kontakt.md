---
layout: default
title: "Kontakt"
permalink: /kontakt/
---

## Kontakt

<div class="aligned-content">
  <p>Schreib uns – wir melden uns so schnell wie möglich zurück.</p>

  <form id="contactForm" novalidate>
    <!-- Honeypot (gegen einfache Bots) -->
    <input type="text" name="honeypot" id="honeypot" style="display:none" tabindex="-1" autocomplete="off" />

    <label for="recipient">Ansprechpartner</label>
    <select id="recipient" name="recipient" required>
      <option value="" disabled selected>Bitte auswählen…</option>

      <option value="vorsitz">1. Vorsitzender – Sascha Flinsch</option>
      <option value="geschaeftsfuehrung">Geschäftsführerin – Nina Graeff</option>
      <option value="jugendwart">Jugendwart – Mike Flinsch (Training)</option>
      <option value="webmaster">Webmaster – Sergej Schatz</option>
    </select>
    <small id="recipientError" style="display:none; color:#c0392b; margin-top:6px;">Bitte einen Ansprechpartner auswählen.</small>

    <label for="name">Ihr Name</label>
    <input id="name" type="text" name="name" required placeholder="Vor- und Nachname" autocomplete="name" />
    <small id="nameError" style="display:none; color:#c0392b; margin-top:6px;">Bitte Ihren Namen eingeben.</small>

    <label for="email">Ihre E-Mail-Adresse</label>
    <input id="email" type="email" name="email" required placeholder="name@beispiel.de" autocomplete="email" />
    <small id="emailError" style="display:none; color:#c0392b; margin-top:6px;">Bitte eine gültige E-Mail-Adresse eingeben.</small>

    <label for="phone">Telefonnummer (optional)</label>
    <input id="phone" type="tel" name="phone" placeholder="+49 170 1234567" autocomplete="tel" />
    <small id="phoneHint" style="display:block; color:#6c757d; margin-top:6px;">
      Optional – falls wir Sie telefonisch erreichen sollen.
    </small>

    <label for="message">Ihre Nachricht</label>
    <textarea id="message" name="message" rows="7" required placeholder="Ihre Nachricht…"></textarea>

    <!-- Zeichen-Zähler -->
    <small id="messageCounter" style="display:block; color:#6c757d; margin-top:6px;">
      0/20 Zeichen (mindestens 20)
    </small>
    <small id="messageError" style="display:none; color:#c0392b; margin-top:6px;">
      Bitte schreiben Sie eine Nachricht mit mindestens 20 Zeichen.
    </small>

    <!-- Turnstile (genau EINMAL auf der Seite!) -->
    <div style="margin: 18px 0;">
      <div
        id="turnstile"
        class="cf-turnstile"
        data-sitekey="0x4AAAAAACGxbJt0GUzQbP8g"
        data-callback="onTurnstileSuccess"
        data-expired-callback="onTurnstileExpired"
        data-error-callback="onTurnstileError"
      ></div>
      <small id="turnstileError" style="display:none; color:#c0392b; margin-top:8px;">
        Bitte bestätigen Sie kurz, dass Sie kein Bot sind.
      </small>
    </div>

    <button id="submitBtn" type="submit" class="load-more-btn" disabled>Senden</button>
    <p id="formHint" style="margin-top:10px; font-size:14px; color:#6c757d;"></p>
  </form>

  <div id="thankYouBox" style="display:none; margin-top:20px; background:#ffffff; border-radius:12px; padding:18px;">
    <h3 style="margin-top:0;">Danke! ✅</h3>
    <p>Ihre Nachricht wurde gesendet. Hier ist eine Zusammenfassung:</p>

    <div id="summaryBox" style="background:#f6fbf8; border:1px solid #bdddcc; border-radius:10px; padding:12px;"></div>

    <p style="margin-top:14px;">
      <a href="/kontakt/" class="load-more-btn" style="display:inline-block; text-decoration:none;">Noch eine Nachricht senden</a>
    </p>
  </div>
</div>

<!-- Turnstile Script (genau EINMAL) -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<!-- Mini-CSS, damit disabled auch sichtbar ist -->
<style>
  #submitBtn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    filter: grayscale(15%);
  }
</style>
