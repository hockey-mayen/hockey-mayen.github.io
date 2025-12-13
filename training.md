---
layout: default
title: "Training"
permalink: /training/
---

## Training

<div class="aligned-content">
<strong>am 30.10.2025 startet die Hallensaison, und wir trainieren in der Halle !  </strong>   <br>


<strong>
Dein Kind möchte den Hockeysport ausprobieren? Du selbst willst den Schläger schwingen ?
</strong>  
<br>
Jung oder alt, Anfänger oder Fortgeschrittene – bei uns findet jeder das passende Training!  
<br>
Komm einfach vorbei zu unseren Schnupper-Einheiten.
<div class="aligned-content" data-aos="fade-up" data-aos-delay="200" >
<img src="../assets/images/training/schnuppern.png" style="width: 120px; height: auto; transform: translateY(10px);" />
</div>



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
        <br/>
        <em>
          <strong>Kontakt &amp; Info:</strong>
          📩
          <span
            class="js-email"
            data-user="{{ tile.mailUser }}"
            data-domain="{{ tile.mailDomain }}">
          </span>
        </em>
    </div>
    {% endfor %}
</div>
<div class="aligned-content">
Auf dem Kunstrasenplatz sind wir in der warmen Jahreszeit, und in der kalten Jahreszeit - in der Sporthalle. 

Hockey Schläger 🏑 in allen Größen stellen wir dir zum Schnupper-Training zur Verfügung.

Du hast Fragen zu unserem Training und möchtest dich näher informieren? Schreibe uns einfach!  
</div>
<span class="email-highlight"><a href="/kontakt/">Kontaktformular</a></span>

