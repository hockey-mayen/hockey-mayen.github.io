---
layout: default
title: "Startseite"
---

🛠️ Seite aktuell im Aufbau 🛠️

<h2>Feldhockey ist eine der schönsten Team-Sportarten</h2>
<p>Wir leben und lieben Hockey, komm vorbei und werde Teil unserer starken Gemeinschaft</p>

<div class="tiles-container">
    {% for tile in site.data.startseite.tiles %}
    <div class="tile">
        <h3>{{ tile.title }}</h3>
        <p>{{ tile.description }}</p>
        {% if tile.image %}
        <img src="{{ tile.image }}" alt="{{ tile.title }}">
        {% endif %}
    </div>
    {% endfor %}
</div>
