---
layout: default
title: "Termine"
---

<h2>Turniertermine</h2>
<p>Hier findest du die aktuellen Turniertermine und Veranstaltungsorte für unsere Teams:</p>

<div class="tiles-container">
    {% for tile in site.data.termine.tiles %}
    <div class="tile">
        <h3>{{ tile.title }}</h3>
        {% if tile.details %}
            {% for detail in tile.details %}
            <br>{{ detail.date }} - {{ detail.location }}
            {% endfor %}
        {% endif %}
    </div>
    {% endfor %}
</div>
