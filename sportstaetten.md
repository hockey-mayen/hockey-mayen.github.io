---
layout: default
title: "Kontakt"
permalink: /sportstaetten/
---

## Sportstätten

<div class="tiles-container">
    {% for tile in site.data.sportstaetten.tiles %}
    <div class="tile">
        <h3>{{ tile.title }}</h3>
        <p>{{ tile.description }}</p>
        <a href="{{ tile.map_link }}" target="_blank">Google Maps Navigation</a>
    </div>
    {% endfor %}
</div>

<small>  
    In der warmen Jahreszeit spielen wir Hockey auf dem Kunstrasenplatz im Stadion Nettetal.  
    In der kalten Jahreszeit wechseln wir in die Sporthalle der Albert-Schweitzer-Realschule, wo wir die Hallensaison bestreiten.  
</small>