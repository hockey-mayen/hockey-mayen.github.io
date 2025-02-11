---
layout: default
title: Impressum
permalink: /impressum
---

## Impressum

**Hockey-Club Grün-Weiss TuS Mayen e.V.**  
Am Barwinkel 26  
56727 Mayen  

**Vorsitzender**  
Sascha Flinsch

**Vorstand**  
**Geschäftsführerin** Nina Graeff    
**Schatzmeister**  Yannik Dietz   
**Jugendwart** Mike Flinsch  
Heike Hoffmann, Sven Albers, Ralf Heepenstrick, Oliver Hannus  
Karl-Heinz Hannus, Katja Frank, Gabi Lotz, Michael Dietz, Justus Sörger, Jost Schäfer, Sergej Schatz  

<span class="email-highlight"><a href="mailto:info@test-domain.de">Kontakt</a></span>  
<small>  
**Urheberrecht**  
Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
</small> 

<div class="collapsible-container">
    <div class="collapsible-header" onclick="toggleCollapsible()">
        <span class="arrow">&#9654;</span> Weitere rechtliche und technische Informationen
    </div>
    <div class="collapsible-content">
        <small>  
        <strong>Registereintrag</strong><br> 
        Eingetragen im Vereinsregister beim Amtsgericht XY unter VR ____
        </small><br>
        <small>  
        <strong>Haftung für Inhalte</strong><br> 
        Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,  
        Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.  
        </small><br>
        <small>  
        <strong>Haftung für Links</strong><br>
        Unsere Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.  
        Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.  
        </small>  
    </div>
</div>

<script>
    function toggleCollapsible() {
        let content = document.querySelector('.collapsible-content');
        let arrow = document.querySelector('.arrow');
        
        if (content.style.display === "block") {
            content.style.display = "none";
            arrow.innerHTML = "&#9654;"; // Pfeil nach rechts
        } else {
            content.style.display = "block";
            arrow.innerHTML = "&#9660;"; // Pfeil nach unten
        }
    }
</script>

<style>
    .collapsible-container {
        margin-top: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        /*background-color: #f9f9f9;*/
border: none; /* Entfernt den Rahmen */
    }

    .collapsible-header {
        font-weight: bold;
        color: #007b5f;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center; /* Zentriert den Text und den Pfeil */
        text-align: center;
        padding: 10px 0;
        
    }

    .arrow {
        font-size: 16px;
        margin-right: 8px;
        transition: transform 0.2s;
    }

    .collapsible-content {
      display: none;
      padding: 10px;
      font-size: 14px; /* Falls zu groß, kannst du es kleiner setzen */
      color: gray; /* Farbe von der Website erben */
    }
</style>

