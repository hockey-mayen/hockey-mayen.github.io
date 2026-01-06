---
layout: default
title: "Turniere"
description: "Turniertermine und Spieltage des Vereins Hockey-Club Grün-Weiss TuS Mayen e.V. 1919  (U10, U12, U14) – Hallen- und Feldsaison."
permalink: /turniere/
og_image: /assets/images/og.jpg   
---


<h2>Turniertermine</h2>
<div class ="aligned-content">
<p>Wir spielen 🏑 in der Verbandsliga Rheinland-Pfalz-Saar.</p>
<p><strong>Und wir sind hartnäckig wie Basalt. Mayener 🌋 Basalt – hau!</strong></p>
<h3>Hier findest du die Turniertermine für unsere Teams</h3>
</div>

<div data-aos="fade-up" data-aos-delay="200" >

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

<div class="video-section aligned-content">
  <h2>{{ site.data.videos.title }}</h2>

  <div class="video-grid">
    {% for v in site.data.videos.items %}
      <div class="video-card" data-aos="fade-up" data-aos-delay="150">
        <h3>{{ v.title }}</h3>
        {% if v.description %}<p>{{ v.description }}</p>{% endif %}

            <video controls preload="metadata" playsinline
            {% if v.poster %}poster="{{ v.poster | relative_url }}"{% endif %}>
              <source src="{{ v.src | relative_url }}" type="{{ v.type }}">
              Dein Browser unterstützt dieses Video-Format leider nicht.
            </video>
        {% if v.date %}<p class="video-meta">{{ v.date }}</p>{% endif %}
      </div>
    {% endfor %}
  </div>
</div>
