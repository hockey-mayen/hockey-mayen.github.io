---
layout: default
title: Mitgliedsanmeldung
permalink: /anmeldung/
---
## Mitgliedsanmeldung

Bitte fülle das folgende Formular aus, um Mitglied in unserem Verein zu werden:


<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<div class="recaptcha-container">
    <form id="captcha-form" onsubmit="return verifyCaptcha()">
        <div class="g-recaptcha" data-sitekey="6LcpE8YqAAAAAPJgVvCCf_vN1_Emki7itcgc-QyP"></div>
        <button type="submit">Zum Formular</button>
    </form>
</div>

<div id="form-container" style="display: none;">




<iframe width="640px" height="480px" src="https://forms.office.com/Pages/ResponsePage.aspx?id=yd_CcI7FxkmgfOIlIj4fhxfYiC1dqM1JlsjxuWLsFS5UMDlWQkZKNUExS1FYODlXQjIzVDZPSkZJRS4u&embed=true" frameborder="0" 
marginwidth="0" marginheight="0" style="border: none; max-width:100%; max-height:100vh" allowfullscreen webkitallowfullscreen mozallowfullscreen msallowfullscreen> </iframe>


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
</script>