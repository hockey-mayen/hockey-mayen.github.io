---
layout: default
title: "Turniere"
permalink: /turniere/
---

<h2>Turniertermine</h2>
<div class="aligned-content">
  <p>Wir spielen 🏑 in der Verbandsliga Rheinland-Pfalz-Saar.</p>
  <p><strong>Und wir sind hartnäckig wie Basalt. Mayener 🌋 Basalt – hau!</strong></p>
  <h3>Hier findest du die Turniertermine für unsere Teams</h3>
</div>

<div data-aos="fade-up" data-aos-delay="200">
  <div class="tiles-container">
    {% for tile in site.data.turniere.tiles %}
      <div class="tile">
        <h3>{{ tile.title }}</h3>

        {% if tile.details %}
          {% for detail in tile.details %}
            <div class="detail-row">
              <span class="date">{{ detail.date }}</span>
              <span class="location">{{ detail.location }}</span>
            </div>
          {% endfor %}
        {% endif %}

        {% if tile.link %}
          <div class="link-container"
               data-link-url="{{ tile.link.url }}"
               data-link-title="{{ tile.link.title | escape }}">

            <!-- Bild IMMER sichtbar -->
            <img src="{{ tile.link.image }}" alt="Link-Bild" style="width: 120px; height: auto;">

            <!-- Klickbarer Link wird per JS nur bei OK/unknown aktiviert -->
            <a class="ext-link is-disabled" href="#" target="_blank" rel="noopener noreferrer" aria-disabled="true">
              <div class="link-title">{{ tile.link.title }}</div>
            </a>

            <!-- Status (optional) -->
            <div class="link-status" style="font-size: 0.9em; opacity: 0.75;">Link wird geprüft…</div>
          </div>
        {% endif %}
      </div>
    {% endfor %}
  </div>
</div>

<style>
  .link-container{
    display:flex;
    flex-direction: column;
    align-items:center;
    text-align:center;
    gap:10px;
  }
  .link-container img{
    display:block;
    margin: 0 auto;
  }
  .ext-link{ text-decoration:none; }
  .ext-link.is-disabled{ pointer-events:none; opacity:.5; }
  .is-hidden{ display:none !important; }
</style>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".link-container[data-link-url]");

  containers.forEach(async (c) => {
    const url = c.getAttribute("data-link-url");
    const a = c.querySelector("a.ext-link");
    const status = c.querySelector(".link-status");

    if (!url || !a) return;

    // Start: Text/Link ausblenden
    a.classList.add("is-hidden");
    a.classList.add("is-disabled");
    a.setAttribute("aria-disabled", "true");
    a.setAttribute("href", "#");
    if (status) status.classList.add("is-hidden"); // Status nie zeigen (optional)

    const result = await checkUrl(url); // "ok" | "bad" | "unknown"

    if (result === "ok" || result === "unknown") {
      a.classList.remove("is-disabled");
      a.classList.remove("is-hidden");
      a.removeAttribute("aria-disabled");
      a.setAttribute("href", url);
    } else {
      // "bad" -> komplett verstecken
      a.classList.add("is-hidden");
    }
  });

async function checkUrl(url) {
  try {
    // 1) HEAD versuchen
    let headRes;
    try {
      headRes = await fetch(url, { method: "HEAD", mode: "cors", cache: "no-store", redirect: "follow" });
      console.log("[checkUrl][HEAD]", url, headRes.status, headRes.ok, headRes.type);
      if (headRes.ok) return "ok";
    } catch (e) {
      console.warn("[checkUrl] HEAD threw, fallback to GET:", url, e);
    }

    // 2) GET versuchen (auch wenn HEAD nur 404/403/etc geliefert hat)
    const getRes = await fetch(url, { method: "GET", mode: "cors", cache: "no-store", redirect: "follow" });
    console.log("[checkUrl][GET]", url, getRes.status, getRes.ok, getRes.type);

    return getRes.ok ? "ok" : "bad";
  } catch (e) {
    console.error("[checkUrl] fetch failed:", url, e);
    // CORS/Netzwerk/sonstiges: unbekannt
    return "unknown";
  }
}

});
</script>
