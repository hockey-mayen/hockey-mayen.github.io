
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