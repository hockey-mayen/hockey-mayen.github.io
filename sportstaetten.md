---
layout: default
title: "Kontakt"
permalink: /sportstaetten/
---

## Sportstätten

Hockey ist eine Sportart, die sowohl draußen auf dem Feld als auch in der Halle gespielt wird  

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
    In der warmen Jahreszeit spielen wir Hockey auf dem Kunstrasenplatz im Stadion Nettetal – umgeben von frischer Luft und Natur.  
    In der kalten Jahreszeit wechseln wir in die Sporthalle der Albert-Schweitzer-Realschule, wo wir die Hallensaison bestreiten.  
</small>