---
layout: default
title: "Kontakt"
permalink: /sportstaetten/
---

## Sportstätten

<div class="tiles-container">
    {% for tile in site.data.sportstaetten.tiles %}
    <div class="tile">
        <!-- Titel der Sportstätte -->
        <h3>{{ tile.title }}</h3>

        <!-- Bild der Sportstätte -->
        <img src="{{ tile.image_link }}" alt="{{ tile.title }}" class="sportstaetten-image">
        
        <!-- Beschreibung -->
        <p>{{ tile.description }}</p>

        <!-- Google Maps Link -->
        <a href="{{ tile.map_link }}" target="_blank">
            <img src="../assets/images/navigation.png" alt="Navigation" style="width: 100px; height: auto;"><br>
            Google Maps Navigation
        </a>
    </div>
    {% endfor %}
</div>


<small>  
    In der warmen Jahreszeit spielen wir Hockey auf dem Kunstrasenplatz im Stadion Nettetal.  
    In der kalten Jahreszeit wechseln wir in die Sporthalle der Albert-Schweitzer-Realschule, wo wir die Hallensaison bestreiten.  
</small>

