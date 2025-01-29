---
layout: default
title: Anmeldung
permalink: /anmeldung
useCaptcha: false
---

## Mitgliedsanmeldung

Bitte wähle eine Option:

<div class="tab-container">
    <button class="tab-button active" onclick="showTab('form-tab')">Online-Anmeldung</button>
    <button class="tab-button" onclick="showTab('download-tab')">PDF zum Drucken herunterladen</button>
</div>

<!-- Tab-Inhalt -->
<div id="form-tab" class="tab-content active">
    <h3>Online-Anmeldung</h3>

    {% if page.useCaptcha %}
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>

    <div class="recaptcha-container">
        <form id="captcha-form" onsubmit="return verifyCaptcha()">
            <div class="g-recaptcha" data-sitekey="6LcpE8YqAAAAAPJgVvCCf_vN1_Emki7itcgc-QyP"></div>
            <button type="submit">Zum Formular</button>
        </form>
    </div>  

    <div id="form-container" style="display: none;">
        <iframe width="640px" height="480px" src="https://forms.office.com/e/jk4p9wk3St" frameborder="0"
                marginwidth="0" marginheight="0" style="border: none; max-width:100%; max-height:100vh" allowfullscreen
                webkitallowfullscreen mozallowfullscreen msallowfullscreen> </iframe>
    </div>
    {% else %}
    <iframe width="640px" height="480px" src="https://forms.office.com/e/jk4p9wk3St" frameborder="0"
            marginwidth="0" marginheight="0" style="border: none; max-width:100%; max-height:100vh" allowfullscreen
            webkitallowfullscreen mozallowfullscreen msallowfullscreen> </iframe>
    {% endif %}
</div>

<div id="download-tab" class="tab-content">
    <h3>Anmeldeformular herunterladen</h3>
    <p>
        Hier kannst du das Anmeldeformular als PDF herunterladen
    </p>
    <p>
        Drucke es aus, fülle es aus und schicke es an die Vereinsadresse:
    </p>
    <p><strong>Vereinsadresse:</strong> Teststrasse 1, 56727 Mayen</p>

    <p>
        Oder gebe es einfach beim nächsten Training ab!
    </p>

    <a href="/assets/pdf/Beitrittserklaerung-SEPA_Hockey-ab-2022.pdf" download class="download-link">Anmeldeformular herunterladen (PDF)</a>
</div>

<script>
    function verifyCaptcha() {
        const captchaResponse = grecaptcha.getResponse();
        if (captchaResponse.length === 0) {
            alert('Bitte lösen Sie das CAPTCHA, um fortzufahren.');
            return false;
        } else {
            document.getElementById('captcha-form').style.display = 'none';
            document.getElementById('form-container').style.display = 'block';
            return false; 
        }
    }

    // Tabs umschalten
    function showTab(tabId) {
        // Alle Tabs verstecken
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Alle Buttons inaktiv machen
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });

        // Ausgewählten Tab und Button aktivieren
        document.getElementById(tabId).classList.add('active');
        event.target.classList.add('active');
    }
</script>

<style>
    .tab-container {
        display: flex;
        justify-content: center; /* Zentriert die Tabs horizontal */
        margin-bottom: 20px;
        border-bottom: 2px solid #ddd;
        border-bottom: 2px solid #ddd;
    }

    .tab-button {
        text-align: center; /* Zentriert den Text in den Tabs */
        padding: 10px 20px;
        cursor: pointer;
        border: none;
        background: none;
        font-size: 16px;
        border-bottom: 2px solid transparent;
        transition: border-bottom 0.3s;
    }

    .tab-button.active {
        border-bottom: 2px solid #004d26; /* Dunkelgrün */
        color: #004d26;
    }

    .tab-content {
        display: none;
    }

    .tab-content.active {
        display: block;
    }

    .download-link {
        color: #004d26;
        font-weight: bold;
        text-decoration: none;
    }

    .download-link:hover {
        text-decoration: underline;
    }
</style>
