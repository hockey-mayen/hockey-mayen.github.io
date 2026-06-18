---
layout: default
title: "Training"
description: "Termine für Training des Vereins Hockey-Club Grün-Weiss TuS Mayen e.V. 1919  (U10, U12, U14) – Hallen- und Feldsaison."
permalink: /training/
og_image: /assets/images/og.jpg   
---


<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"SportsOrganization",
  "name":"Hockey-Club Grün-Weiss TuS Mayen e.V. 1919",
  "url":"https://hockey-mayen.de/",
  "sport":["Field hockey","Indoor hockey"],
  "description":"Schnuppern in den Trainingszeiten für Kinder, Jugend und Erwachsene in Mayen (Sporthalle). In den Schulferien findet kein Training statt.",
  "location":[
    {
      "@type":"SportsActivityLocation",
      "name":"Sporthalle Albert-Schweitzer-Realschule",
      "address":{
        "@type":"PostalAddress",
        "streetAddress":"Joignystraße 5",
        "postalCode":"56727",
        "addressLocality":"Mayen",
        "addressCountry":"DE"
      },
      "openingHoursSpecification":[
        { "@type":"OpeningHoursSpecification", "dayOfWeek":"https://schema.org/Thursday", "opens":"16:15", "closes":"17:45", "description":"Mini/U8/U10 Kinder" },
        { "@type":"OpeningHoursSpecification", "dayOfWeek":"https://schema.org/Tuesday",  "opens":"16:30", "closes":"18:30", "description":"U10/U12 Mädels" },
        { "@type":"OpeningHoursSpecification", "dayOfWeek":"https://schema.org/Tuesday",  "opens":"18:00", "closes":"20:00", "description":"U14 Jungs" },
        { "@type":"OpeningHoursSpecification", "dayOfWeek":"https://schema.org/Tuesday",  "opens":"20:00", "closes":"21:30", "description":"Jugend & Erwachsene (Just For Fun)" }
      ]
    }
  ]
}
</script>



## Training

<div class="aligned-content">


<div style="background:#e8f5e9;
            border:2px solid #2e7d32;
            color:#1b5e20;
            padding:15px;
            border-radius:8px;
            margin:15px 0;">

<h3 style="margin-top:0;">🏑 Sommerferien 2026 🌞</h3>

📅 Letztes Training: <strong>24.06.2026</strong><br>
🚫 Trainingspause: <strong>29.06. – 07.08.2026</strong><br>
🎉 Trainingsstart: <strong>12.08.2026</strong>

</div>

<div style="
    background: linear-gradient(135deg, #f7fff8, #e8f5e9);
    border: 2px solid #2e7d32;
    border-radius: 14px;
    padding: 20px;
    margin: 25px 0;
    color: #1b5e20;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
">

    <h3 style="
        margin-top:0;
        color:#1b5e20;
    ">
        🏑 Hockey ausprobieren?
    </h3>

    <p style="line-height:1.5;">
        Dein Kind möchte den Hockeysport kennenlernen – oder du selbst willst den Schläger schwingen?
    </p>

    <p style="line-height:1.5;">
        Ob jung oder alt, Anfänger oder Fortgeschrittene:
        Bei uns findet jeder das passende Training.
    </p>

    <div >
        ✨ Komm einfach zu unseren Schnupper-Einheiten in der regulären Trainingszeit vorbei!
    </div>

    <div style="
        background:#fff8e1;
        color:#795548;
        padding:12px;
        border-radius:8px;
        margin:15px 0;
        font-weight:bold;
    ">
        📌 In den Schulferien findet kein Training statt.
    </div>

    <p>
        💬 Fragen zum Training? Schreib uns gerne.
    </p>

    <p style="margin-top:20px;">
        <a href="/kontakt/?recipient=jugendwart"
           style="
               display:inline-block;
               background:#2e7d32;
               color:white;
               padding:12px 18px;
               border-radius:8px;
               text-decoration:none;
               font-weight:bold;
           ">
            🏑📩 Kontaktformular
        </a>
    </p>

</div>


<div  data-aos="fade-up" data-aos-delay="200" >
<h3>Unsere Trainingszeiten</h3>

<div class="tiles-container">
    {% assign datumWechselHalleZuFeld = "2026-03-05" %}
    {% assign datumWechselFeldZuHalle = "2026-10-31" %}
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
                        🗓️<strong>{{ time.day }}, {{ time.time }}</strong> <br>
                        🏑{{ time.location }}
                    </div>
                {% elsif time.location contains "Sporthalle" %}
                    <div class="training-time {% if istFeldsaison == true %}inactive{% endif %}">
                        🗓️<strong>{{ time.day }}, {{ time.time }}</strong> <br>
                        🏑{{ time.location }}
                    </div>
                {% else %}
                    <div class="training-time">
                        🗓️<strong>{{ time.day }}, {{ time.time }}</strong> <br>
                        🏑{{ time.location }}
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


