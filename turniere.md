---
layout: default
title: "Turniere"
permalink: /turniere/
---


<h2>Turniertermine</h2>
<div class ="aligned-content">
<p>Wir spielen In der Verbandsliga Rheinland-Pfalz-Saar.</p>
<p><strong>Und wir sind hartnäckig wie Basalt. Mayener Basalt – hau!</strong></p>
<h3>Hier findest du die Turniertermine für unsere Teams🚀</h3>
</div>

<div class="aligned-content" data-aos="fade-up" data-aos-delay="200" >

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
        <div class="link-container">
            <a href="{{ tile.link.url }}" target="_blank">
                <img src="{{ tile.link.image }}" alt="Link-Bild" style="width: 120px; height: auto;">
                <div class="link-title">{{ tile.link.title }}</div>
            </a>
        </div>
        {% endif %}
    </div>
    {% endfor %}
</div>
</div>

