---
layout: default
title: "Just-for-Fun-Turnier"
description: "Just-for-Fun Hallenhockey-Turnier in Mayen am 1. März 2026 – ab Ü14. Infos & Anmeldung per E-Mail."
permalink: /just-for-fun-turnier/
---

<style>
  .jff-wrap{max-width:980px;margin:0 auto;padding:18px 16px;}
  .jff-hero{
    border-radius:18px;
    padding:12px 10px;
    background: linear-gradient(135deg, rgba(0,120,70,.10), rgba(0,0,0,.04));
    box-shadow: 0 10px 25px rgba(0,0,0,.06);
  }
  .jff-title{margin:0 0 6px 0; font-size: clamp(1.6rem, 2.6vw, 2.2rem); line-height:1.15;}
  .jff-sub{margin:0; opacity:.85; font-size:1.05rem;}
  .jff-grid{
    display:grid;
    grid-template-columns: 1fr;
    gap:16px;
    margin-top:16px;
  }
  .jff-card{
    border-radius:16px;
    padding:8px 8px;
    background:#e9eeee;
    box-shadow: 0 10px 22px rgba(0,0,0,.06);
    border: 1px solid rgba(0,0,0,.06);
  }
  .jff-card h2{margin:0 0 10px 0; font-size:1.15rem;}
  .jff-facts{list-style:none; padding:0; margin:0;}
  .jff-facts li{padding:8px 0; border-bottom:1px dashed rgba(0,0,0,.10);}
  .jff-facts li:last-child{border-bottom:none;}
  .jff-badges{margin-bottom:8px;}
  .jff-badge{
    display:inline-block;
    padding:4px 10px;
    border-radius:999px;
    font-size:.9rem;
    background: rgba(0,120,70,.12);
    margin-right:6px;
    margin-bottom:8px;
  }
  .jff-small{opacity:.9; font-size:.98rem; margin:0;}
  .jff-hr{height:1px;background:rgba(0,0,0,.08);border:0;margin:14px 0;}
  .jff-list{margin:0; padding-left:18px;}
  .jff-mail a{font-weight:700; text-decoration:none;}
  .jff-mail a:hover{text-decoration:underline;}


/* Mail-Link in Vereins-Dunkelgrün */
.jff-mail a,
.jff-mail a:visited{
  color:#0A833A;
}

.jff-mail a:hover,
.jff-mail a:focus{
  color:#086B2F;
  text-decoration:underline;
}

.jff-icon{
  width:90px;
  height:auto;
  flex:0 0 auto;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,.12));
}
</style>

<div class="jff-wrap">
  <div class="jff-hero">

        <img class="jff-icon"
             src="{{ '/assets/images/turniere/just-for-fun-small.png' | relative_url }}"
             alt="Hallenhockey Just for Fun"
             loading="lazy">
        <div>

    <h1 class="jff-title">🏑 Hallenhockey Just for Fun Turnier</h1>
    <h1 class="jff-title">01.03.2026</h1>
    <p class="jff-sub">
        Der Club lädt alle <strong>Hockeyspielerinnen und Hockeyspieler</strong><br> aus der Umgebung <strong>Mayen/Koblenz/Neuwied/WW</strong> zum Mitspielen ein.
    </p>
  </div>

  <div class="jff-grid">
    <!-- Combined card: Infos + Ort -->
    <div class="jff-card">
      <h2>Infos</h2>

      <div class="jff-badges">
        <span class="jff-badge">🗓️01.03.2026</span>
        <span class="jff-badge">⏰ Treffen 10:00</span>
        <span class="jff-badge">🏑 Spielen bis ca. 15:00</span>
        <span class="jff-badge">🎯 ab Ü14</span>
        <span class="jff-badge">🗓️ Anmeldeschluss 22.02.2026</span>
      </div>
 
      <ul class="jff-facts">
        <li><strong>Treffen & Aufbau:</strong> ab 10:00 Uhr</li>
        <li><strong>Spielzeit:</strong> ca. 10:30 bis 14:30 / 15:00 Uhr (je nach Ablauf)</li>
        <li><strong>Teilnahme:</strong> alle Erwachsene und Jugend ab <strong>Ü14</strong></li>
        <li class="jff-mail">
          <strong>Info & Anmeldung</strong><br>
          <strong>Yannik Dietz</strong><br>
          <a href="mailto:Ya.dietz@icloud.com?subject=Anmeldung%20Just-for-Fun-Turnier%20am%2001.03.2026&body=Hi%20Yannik%2C%0A%0Aich%20m%C3%B6chte%20mich%20f%C3%BCr%20das%20Just-for-Fun-Turnier%20am%2001.03.2026%20anmelden.%0A%0AName%3A%20%0AAlter%20%2F%20Team%3A%20%0A%0ALG">
            Ya.dietz@icloud.com
          </a>
        </li>
      </ul>

      <hr class="jff-hr"/>

      <h2>Ort</h2>
      <p class="jff-small">
        <strong>Sporthalle Albert-Schweitzer-Realschule</strong><br/>
        Joignystraße 5, 56727 Mayen
      </p>
    </div>


  </div>
</div>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Just-for-Fun-Turnier (Halle) – Hockey-Club Grün-Weiss TuS Mayen",
  "description": "Just-for-Fun Hallenhockey-Turnier in Mayen am 1. März 2026. Treffen 10:00 Uhr, Spielbetrieb bis ca. 15:00 Uhr. Teilnahme ab Ü14. Anmeldung bis 22.02.2026 per E-Mail an Ya.dietz@icloud.com.",
  "startDate": "2026-03-01T10:00:00+01:00",
  "endDate": "2026-03-01T15:00:00+01:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Sporthalle Albert-Schweitzer-Realschule",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Joignystraße 5",
      "postalCode": "56727",
      "addressLocality": "Mayen",
      "addressCountry": "DE"
    }
  },
  "organizer": {
    "@type": "SportsOrganization",
    "name": "Hockey-Club Grün-Weiss TuS Mayen e.V. 1919",
    "url": "https://hockey-mayen.de/"
  }
}
</script>
