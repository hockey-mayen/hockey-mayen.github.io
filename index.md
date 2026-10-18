---
layout: default
title: Hockey-Club Grün-Weiss TuS Mayen
permalink: /verein/
scripts:
  - /assets/js/trainingImageRotator.js
  - /assets/js/turniereImageRotator.js
---

<div class="aligned-content">
<h2>
Feldhockey ist eine der schönsten Team-Sportarten
</h2>

<p> 
Der Hockeyclub Grün-Weiß TuS Mayen e.V. ist ein traditionsreicher Sportverein für Feld- und Hallenhockey. Gegründet im Jahr 1919, gehört er zu den etablierten Vereinen der rheinland-pfälzischen Hockeyszene. Der Club legt Wert darauf, dass jedes Mitglied das Clubleben aktiv mitgestalten kann. Komm vorbei und werde Teil unserer starken Gemeinschaft in der Eifelstadt Mayen und Umgebung.</p>
</div>
<div class="tiles-container">

    <!-- Training-Kachel mit dynamischem Bildwechsel -->
    <div class="tile">
        <h3>{{ site.data.startseite.tiles[0].title }}</h3>
        <p>{{ site.data.startseite.tiles[0].description }}</p>
        <div class="training-image-container">
            <div class="progress-bar"></div>
            <img id="trainingImage">
        </div>
    </div>

    <!-- Turniere-Kachel mit Bildwechsel -->
    <div class="tile">
        <h3>{{ site.data.startseite.tiles[1].title }}</h3>
        <p>{{ site.data.startseite.tiles[1].description }}</p>
        <div class="turniere-image-container">
            <img id="turniereImage">
        </div>
    </div>

    <!-- Veranstaltungen-Kachel -->
    <div class="tile">
        <h3>{{ site.data.startseite.tiles[2].title }}</h3>
        <p>{{ site.data.startseite.tiles[2].description }}</p>
        <img src="{{ site.data.startseite.tiles[2].image }}" alt="{{ site.data.startseite.tiles[2].title }}">
    </div>

    <!-- Just for Fun-Kachel -->
    <div class="tile">
        <h3>{{ site.data.startseite.tiles[3].title }}</h3>
        <p>{{ site.data.startseite.tiles[3].description }}</p>
        <img src="{{ site.data.startseite.tiles[3].image }}" alt="{{ site.data.startseite.tiles[3].title }}">
    </div>

</div>


