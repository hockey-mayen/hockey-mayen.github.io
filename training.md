---
layout: default
title: "Training"
permalink: /training/
---

## Training

<div class="aligned-content">
<strong>Training beginnt wieder am 08.01.2026 nach den Winterferien </strong>   <br>

<strong>
Dein Kind möchte den Hockeysport ausprobieren? Du selbst willst den Schläger schwingen ?
</strong>
<br>
Jung oder alt, Anfänger oder Fortgeschrittene – bei uns findet jeder das passende Training!
<br>
<br>
Komm einfach vorbei zu unseren ✨ Schnupper-Einheiten in der regulären Trainingszeit!
<br>
<strong>Hinweis:</strong> <em>In den Schulferien findet kein Training statt.</em> 
<br>
<br>
Du hast 💬 Fragen zu unserem Training und möchtest dich näher informieren? Schreibe uns einfach!
</div>

<div>
    <p class="email-highlight"><a href="/kontakt/?recipient=jugendwart"> 🏑📩 Kontaktformular</a></p>
<br>

<div class="aligned-content" data-aos="fade-up" data-aos-delay="200" >
  <img src="../assets/images/training/schnuppern.png" style="width: 120px; height: auto; transform: translateY(10px);" />
</div>

<div  data-aos="fade-up" data-aos-delay="200" >
<h3>Unsere Trainingszeiten:</h3>

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
    </div>
    {% endfor %}
</div>
</div>

<div class="aligned-content">
Auf dem Kunstrasenplatz sind wir in der warmen Jahreszeit, und in der kalten Jahreszeit - in der Sporthalle.

Hockey Schläger 🏑 in allen Größen stellen wir dir zum Schnupper-Training zur Verfügung.


</div>


