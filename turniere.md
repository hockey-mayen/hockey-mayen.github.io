---
layout: default
title: "Turniere"
---

<h2>Turniertermine</h2>
<p>Wir sind hartnäckig wie Basalt. Mayener Basalt – hau!</p>
<p>Hier findest du die aktuellen Turniertermine für unsere Teams</p>

<div class="tiles-container">
    {% for tile in site.data.turniere.tiles %}
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
