---
layout: default
#title: "{{ site.data.startseite.title }}"
permalink: /
---

## {{ site.data.startseite.title }}

{{ site.data.startseite.content }}

<div class="tiles-container">

    <!-- Training-Kachel mit dynamischem Bildwechsel -->
    <div class="tile">
        <h3>{{ site.data.startseite.tiles[0].title }}</h3>
        <p>{{ site.data.startseite.tiles[0].description }}</p>
        <div class="training-image-container">
            <img id="trainingImage" src="/assets/images/training/training1.jpg" alt="Training">
        </div>
    </div>

    <!-- Turniere-Kachel mit Bildwechsel -->
    <div class="tile">
        <h3>{{ site.data.startseite.tiles[1].title }}</h3>
        <p>{{ site.data.startseite.tiles[1].description }}</p>
        <div class="turniere-image-container">
            <img id="turniereImage" src="/assets/images/turniere/turnier1.jpg" alt="Turniere">
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

<script src="/assets/js/trainingImageRotator.js"></script>
<script src="/assets/js/turniereImageRotator.js"></script>
