---
layout: default
title: "Turniere"
---

<h2>Turniertermine</h2>
<p>Wir spielen In der Verbandsliga Rheinland-Pfalz-Saar.</p>
<p><strong>Und wir sind hartnäckig wie Basalt. Mayener Basalt – hau!</strong></p>
<p>Hier findest du die Turniertermine für unsere Teams:</p>

<div class="tiles-container">
    {% for tile in site.data.turniere.tiles %}
    <div class="tile">
        <h3>{{ tile.title }}</h3>
        {% if tile.details %}
            {% for detail in tile.details %}
            <br>{{ detail.date }} - {{ detail.location }}
            {% endfor %}
        {% endif %}
    </div>
    {% endfor %}
</div>

<!-- NEUE KACHEL: Automatisch geparste Mayen-Spiele -->
<div class="tile" id="mayen-spiele">
    <h3>HC GW Mayen Weibliche U12 – Spieltermine (automatisches fetch aus www.rps-hockey.de )</h3>
    <p><strong>📍 Ort:</strong> Halle Realschule, Joignystr. 5</p>
    <p><strong>📅 Datum:</strong> Sonntag, 9. Februar 2025</p>
    <ul id="spiele-liste">
        <li>Lade Spieltermine...</li>
    </ul>
</div>

<script>
    async function fetchMayenGames() {
        const response = await fetch("https://www.rps-hockey.de/VVI-web/RPS-Hockey/Ligen-RPS.asp?lokal=RPS&auswahl=HalleJug&liga=RPS-JP-MB&modus=3&club=000");
        const text = await response.text();

        // Temporäres HTML-Dokument erstellen
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        const spieleListe = document.getElementById("spiele-liste");
        spieleListe.innerHTML = ""; // Leeren der Ladeanzeige

        doc.querySelectorAll("tr").forEach(row => {
            if (row.innerText.includes("HC GW Mayen")) {
                const columns = row.querySelectorAll("td");
                if (columns.length >= 3) {
                    let uhrzeit = columns[4]?.innerText.trim();
                    let spielpaarung = columns[2]?.innerText.trim();
                    if (spielpaarung && uhrzeit) {
                        let listItem = document.createElement("li");
                        listItem.textContent = `⏰ ${uhrzeit} → ${spielpaarung}`;
                        spieleListe.appendChild(listItem);
                    }
                }
            }
        });

        // Falls keine Spiele gefunden wurden
        if (!spieleListe.hasChildNodes()) {
            spieleListe.innerHTML = "<li>Keine Spieltermine gefunden.</li>";
        }
    }

    // Funktion nach Laden der Seite ausführen
    document.addEventListener("DOMContentLoaded", fetchMayenGames);
</script>