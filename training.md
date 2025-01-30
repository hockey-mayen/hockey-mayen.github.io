---
layout: default
title: "Training"
permalink: /training/
---

## Training

Jung oder alt, Anfänger oder Fortgeschrittene – bei uns findet jeder das passende Training!  

Auf dem Kunstrasenplatz sind wir in der warmen Jahreszeit, und in der kalten Jahreszeit - in der Sporthalle  

<strong> Komm einfach vorbei zu kostenlosen Schnupper-Einheiten in unserem Training.  
Dein Kind möchte den Hockeysport ausprobieren ? Du selbst willst den Schläger schwingen ?  
Bei uns ist jeder willkommen!  </strong>  

<div class="tiles-container">
    {% for tile in site.data.training.tiles %}
    <div class="tile">
        <h3>{{ tile.title }}</h3>
        {% if tile.times %}
                {% for time in tile.times %}
                    <strong>{{ time.day }},{{ time.time }}</strong>{{ time.location }}<br><br>
                {% endfor %}
        {% endif %}
    </div>
    {% endfor %}
</div>

<small>Hockey Schläger 🏑 in allen Größen stellen wir dir zum Schnupper-Training zur Verfügung</small>

