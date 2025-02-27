document.addEventListener("DOMContentLoaded", async function () {
    const chronikList = document.getElementById("chronik-list");

    try {
        const response = await fetch("/assets/data/chronik.json");
        const chronikData = await response.json();

        // Neuestes Jahr ermitteln
        const latestYear = chronikData.events[0];

        // Letzte 5 Einträge aus diesem Jahr holen
        let numberLastHighlights = 5;
        const lastEntries = latestYear.entries.slice(0, numberLastHighlights);

        lastEntries.forEach(entry => {
            const entryDiv = document.createElement("div");
            entryDiv.classList.add("chronik-entry");

            entryDiv.innerHTML = `
                <h4>${entry.headline}</h4>
                <p>${entry.event}</p>
                ${entry.images && entry.images.length > 0
                ? `<div class="chronik-images">
                          ${entry.images.map(img => `<img src="${img}" alt="Bild zu ${entry.headline}">`).join('')}
                      </div>`
                : ''
            }
                ${entry.link
                ? `<p><a href="${entry.link}" target="_blank">${entry.linkTitle || "Mehr erfahren"}</a></p>`
                : ''}
            `;

            chronikList.appendChild(entryDiv);
        });

    } catch (error) {
        console.error("Fehler beim Laden der Chronik:", error);
    }
});