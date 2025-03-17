---
layout: default
title: "Training"
permalink: /training/
---

## Training

<strong>am 26.3.2025 startet die Feldsaison, und wir trainieren auf dem Kunstrasenplatz !</strong>

<strong>
Dein Kind möchte den Hockeysport ausprobieren? Du selbst willst den Schläger schwingen ?
</strong>  
Jung oder alt, Anfänger oder Fortgeschrittene – bei uns findet jeder das passende Training!  
Komm einfach vorbei zu unseren Schnupper-Einheiten.

<div class="tiles-container">
    {% assign datumWechselHalleZuFeld = "2025-03-26" %}
    {% assign datumWechselFeldZuHalle = "2025-10-31" %}

    {% assign today = "now" | date: "%Y-%m-%d" %}

    {% if today >= datumWechselHalleZuFeld and today < datumWechselFeldZuHalle %}
        {% assign istFeldsaison = true %}
    {% else %}
        {% assign istFeldsaison = false %}
    {% endif %}

    {% for tile in site.data.training.tiles %}
    <div class="tile">
        <h3>{{ tile.title }}</h3>
        {% if tile.times %}
            {% for time in tile.times %}
                {% if time.location contains "Kunstrasenplatz" %}
                    <div class="training-time {% if istFeldsaison == false %}inactive{% endif %}">
                        ⏰<strong>{{ time.day }}, {{ time.time }}</strong> <br>
                        📍{{ time.location }}
                    </div>
                {% elsif time.location contains "Sporthalle" %}
                    <div class="training-time {% if istFeldsaison == true %}inactive{% endif %}">
                        ⏰<strong>{{ time.day }}, {{ time.time }}</strong> <br>
                        📍{{ time.location }}
                    </div>
                {% else %}
                    <div class="training-time">
                        ⏰<strong>{{ time.day }}, {{ time.time }}</strong> <br>
                        📍{{ time.location }}
                    </div>
                {% endif %}
            {% endfor %}
        {% endif %}
        <em>{{ tile.trainer }}</em>
    </div>
    {% endfor %}
</div>

<small>Auf dem Kunstrasenplatz sind wir in der warmen Jahreszeit, und in der kalten Jahreszeit - in der Sporthalle</small>  
<small>Hockey Schläger 🏑 in allen Größen stellen wir dir zum Schnupper-Training zur Verfügung</small>  
<small>Du hast Fragen zu unserem Training und möchtest dich näher informieren? Schreibe uns einfach!   
<span class="email-highlight"><a href="/kontakt/">Kontaktformular</a></span></small>


