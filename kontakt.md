---
layout: default
title: "Kontakt"
permalink: /kontakt/
---

## Kontakt

🛠️ Seite aktuell im Aufbau 🛠️


**Kontakt:**  
<span class="email-highlight"><a href="mailto:info@testdomain.de">info@testdomain.de</a></span>  
Telefon: +49 123 4567890

<div class="tiles-container">
    {% for tile in site.data.kontakt.tiles %}
    <div class="tile">
        <h3>{{ tile.title }}</h3>
        <p>{{ tile.description }}</p>
    </div>
    {% endfor %}
</div>

## Sportstätten

<div class="tiles-container">
    {% for tile in site.data.sportstaetten.tiles %}
    <div class="tile">
        <h3>{{ tile.title }}</h3>
        <p>{{ tile.description }}</p>
        <a href="{{ tile.map_link }}" target="_blank">Google Maps</a>
    </div>
    {% endfor %}
</div>
