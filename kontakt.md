---
layout: default
title: "Kontakt"
permalink: /kontakt/
scripts:
  - /assets/js/kontakt-form.js
---

## Kontakt

<div class="aligned-content">
  {% if site.preview %}
  <p role="status">Dies ist die Testversion. Das Kontaktformular versendet hier keine Nachrichten.</p>
  {% endif %}
  <p>Schreiben Sie uns – wir melden uns so schnell wie möglich zurück.</p>

  <form id="contactForm" novalidate{% if site.preview %} data-preview="true"{% endif %}>
    <!-- Honeypot (gegen einfache Bots) -->
    <input type="text" name="honeypot" id="honeypot" tabindex="-1" autocomplete="off" />
    
    <label for="recipient">Ansprechpartner</label>
    
    <div class="select-wrap" id="recipientWrap">
      <!-- echtes Select bleibt für Formular/Validation -->
      <select id="recipient" name="recipient" required>
        <option value="" selected>Bitte auswählen…</option>
        <option value="vorsitz">1. Vorsitzender Sascha Flinsch</option>
        <option value="geschaeftsfuehrung">Geschäftsführerin Nina Graeff</option>
        <option value="jugendwart">Jugendwart Mike Flinsch</option>
        <option value="webmaster">Webmaster Sergej Schatz</option>
      </select>
    
      <!-- Custom UI -->
    <button type="button"
    class="select-btn"
    id="recipientBtn"
    aria-haspopup="listbox"
    aria-expanded="false">
    Bitte auswählen…
    </button>
    
      <ul class="select-menu" id="recipientMenu" role="listbox" tabindex="-1">
        <li role="option" data-value="" aria-selected="true">Bitte auswählen…</li>
        <li role="option" data-value="vorsitz">1. Vorsitzender Sascha Flinsch</li>
        <li role="option" data-value="geschaeftsfuehrung">Geschäftsführerin Nina Graeff</li>
        <li role="option" data-value="jugendwart">Jugendwart Mike Flinsch</li>
        <li role="option" data-value="webmaster">Webmaster Sergej Schatz</li>
      </ul>
    </div>
    
    <small id="recipientError" class="form-error">Bitte einen Ansprechpartner
    auswählen.</small>

    <label for="name">Ihr Name</label>
    <input id="name" type="text" name="name" minlength="2" maxlength="120" required placeholder="Vor- und Nachname" autocomplete="name" />
    <small id="nameError" class="form-error">Bitte einen Namen mit 2 bis 120 Zeichen ohne Zeilenumbrüche eingeben.</small>

    <label for="email">Ihre E-Mail-Adresse</label>
    <input id="email" type="email" name="email" maxlength="254" required placeholder="name@beispiel.de" autocomplete="email" />
    <small id="emailError" class="form-error">Bitte eine gültige E-Mail-Adresse eingeben.</small>

    <label for="phone">Telefonnummer (optional)</label>
    <input id="phone" type="tel" name="phone" maxlength="50" placeholder="+49 170 1234567" autocomplete="tel" />
    <small id="phoneError" class="form-error">Bitte höchstens 50 Zeichen ohne Zeilenumbrüche eingeben.</small>
    <small id="phoneHint" class="form-help">
      Optional – falls wir Sie telefonisch erreichen sollen.
    </small>

    <label for="message">Ihre Nachricht</label>
    <textarea id="message" name="message" rows="7" minlength="25" maxlength="5000" required placeholder="Ihre Nachricht…"></textarea>

    <small id="messageCounter" class="form-help">
      0 / 5.000 Zeichen (mindestens 25)
    </small>
    <small id="messageError" class="form-error">
      Bitte schreiben Sie eine Nachricht mit min. 25 Zeichen.
    </small>

    <!-- Turnstile -->
    <div class="turnstile-field">
      <div
        id="turnstileWidget"
        class="cf-turnstile"
        data-sitekey="0x4AAAAAACGxbJt0GUzQbP8g"
        data-theme="light"
        data-size="compact"
        data-callback="onTurnstileSuccess"
        data-expired-callback="onTurnstileExpired"
        data-error-callback="onTurnstileError"
      ></div>

      <small id="turnstileError" class="form-error">
        Bitte bestätigen Sie kurz, dass Sie kein Bot sind.
      </small>
    </div>

    <button id="submitBtn" type="submit" class="load-more-btn" disabled>Senden</button>
    <p id="formHint"></p>

  </form>

  <div id="thankYouBox">
    <h3>Danke! ✅</h3>
    <p>Ihre Nachricht wurde gesendet. Hier ist eine Zusammenfassung:</p>

    <div id="summaryBox"></div>

  </div>
</div>

<!-- Turnstile Script -->
{% unless site.preview %}
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" defer></script>
{% endunless %}
