document.addEventListener("DOMContentLoaded", async function () {
    const chronikList = document.getElementById("chronik-list");
    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "Mehr anzeigen";
    loadMoreButton.classList.add("load-more-btn");

    let allEntries = [];
    let displayedEntries = 0;
    let entriesPerLoad = 5;

    try {
        const response = await fetch("/assets/data/chronik.json");
        const chronikData = await response.json();

        // Alle Einträge aus allen Jahren sammeln
        chronikData.events.forEach(eventYear => {
            allEntries = allEntries.concat(eventYear.entries);
        });

        // Damit die neuesten Einträge zuerst kommen, nicht reverse(), sondern direkt von hinten iterieren
        allEntries.sort((a, b) => new Date(b.date || b.headline) - new Date(a.date || a.headline));

        function loadEntries() {
            let nextEntries = allEntries.slice(displayedEntries, displayedEntries + entriesPerLoad);
            nextEntries.forEach(entry => {
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

            displayedEntries += entriesPerLoad;

            // Button ausblenden, wenn keine weiteren Einträge vorhanden sind
            if (displayedEntries >= allEntries.length) {
                loadMoreButton.style.display = "none";
            }
        }

        // Erste 5 Einträge laden (neuste zuerst)
        loadEntries();

        // Button einfügen und bei Klick weitere laden
        loadMoreButton.addEventListener("click", loadEntries);
        chronikList.parentNode.appendChild(loadMoreButton);

    } catch (error) {
        console.error("Fehler beim Laden der Chronik:", error);
    }
});
