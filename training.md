---
layout: default
title: "Training"
permalink: /training/
---

## Training

<strong>
Dein Kind möchte den Hockeysport ausprobieren? Du selbst willst den Schläger schwingen ?
</strong>  
Jung oder alt, Anfänger oder Fortgeschrittene – bei uns findet jeder das passende Training!  
Komm einfach vorbei zu unseren Schnupper-Einheiten.

<div class="tiles-container">
    {% for tile in site.data.training.tiles %}
    <div class="tile">
        <h3>{{ tile.title }}</h3>
        {% if tile.times %}
                {% for time in tile.times %}
                    <strong>{{ time.day }},{{ time.time }}</strong>{{ time.location }}<br><br>
                {% endfor %}
        {% endif %}
        <em>{{ tile.trainer }}</em>
    </div>
    {% endfor %}
</div>

<small>Auf dem Kunstrasenplatz sind wir in der warmen Jahreszeit, und in der kalten Jahreszeit - in der Sporthalle</small>  
<small>Hockey Schläger 🏑 in allen Größen stellen wir dir zum Schnupper-Training zur Verfügung</small>  
<small>Du hast Fragen zu unserem Training und möchtest dich näher informieren ? Schreibe uns einfach!   
<span class="email-highlight"><a href="mailto:info@test-domain.de">Kontaktformular</a></span></small>

