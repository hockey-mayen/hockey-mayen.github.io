---
layout: default
title: "Turniere"
---

<h2>Turniertermine</h2>
<p>Wir spielen In der Verbandsliga Rheinland-Pfalz-Saar.</p>
<p><strong>Und wir sind hartnäckig wie Basalt. Mayener Basalt – hau!</strong></p>
<p>Hier findest du die Turniertermine für unsere Teams:</p>

<div class="tiles-container">
    {% for tile in site.data.turniere.tiles %}
    <div class="tile">
        <h3>{{ tile.title }}</h3>

        {% if tile.details %}
            {% for detail in tile.details %}
            {{ detail.date }} - {{ detail.location }}<br>
            {% endfor %}
        {% endif %}

        {% if tile.link %}
        <div class="link-container">
            <a href="{{ tile.link.url }}" target="_blank">
                <img src="{{ tile.link.image }}" alt="Link-Bild" style="width: 200px; height: auto;">
                <div class="link-title">{{ tile.link.title }}</div>
            </a>
        </div>
        {% endif %}
    </div>
    {% endfor %}
</div>


