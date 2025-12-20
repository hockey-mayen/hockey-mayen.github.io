document.addEventListener("DOMContentLoaded", async function () {
    const chronikList = document.getElementById("chronik-list");
    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "Mehr anzeigen";
    loadMoreButton.classList.add("load-more-btn");

    let allEntries = [];
    let displayedEntries = 0;
    let entriesPerLoad = 3;

    try {
        const response = await fetch("/assets/data/chronik.json");
        const chronicData = await response.json();

        // Alle Einträge aus allen Jahren sammeln
        chronicData.events.forEach(eventYear => {
            allEntries = allEntries.concat(eventYear.entries);
        });

        // Damit die neuesten Einträge zuerst kommen, nicht reverse(), sondern direkt von hinten iterieren
        allEntries.sort((a, b) => new Date(b.date || b.headline) - new Date(a.date || a.headline));

        function loadEntries() {
            const maxLength = 450;
            let nextEntries = allEntries.slice(displayedEntries, displayedEntries + entriesPerLoad);

            nextEntries.forEach(entry => {
                const entryDiv = document.createElement("div");
                entryDiv.classList.add("chronik-entry");

                let isLongText = entry.event.length > maxLength;
                let shortText = entry.event;
                let fullText = entry.event;

                if (isLongText) {
                    let trimmedText = entry.event.substring(0, maxLength);
                    let lastSpaceIndex = trimmedText.lastIndexOf(" ");
                    if (lastSpaceIndex > -1) {
                        shortText = trimmedText.substring(0, lastSpaceIndex);
                    }
                    shortText += " ...";
                }

                let html = `
            <h4>${entry.headline}</h4>
            <p>
                <span class="short-text">${shortText}</span>
                <span class="full-text" style="display: none;">${fullText}</span>
                ${isLongText ? `<a href="#" class="toggle-text">Weiterlesen</a>` : ""}
            </p>
            ${entry.images && entry.images.length > 0
                    ? `<div class="chronik-images">
                        ${entry.images.map(img => `<img src="${img}" alt="Bild zu ${entry.headline}">`).join('')}
                   </div>`
                    : ''
                }
            ${entry.link
                    ? `<div class="event-link"><a href="${entry.link}" target="_blank">${entry.linkTitle || "Mehr erfahren"}</a></div>`
                    : ''}
        `;

                entryDiv.innerHTML = html;
                chronikList.appendChild(entryDiv);
            });

            displayedEntries += entriesPerLoad;

            // 🔁 Event-Handler für neue "Weiterlesen"-Links setzen
            document.querySelectorAll(".toggle-text").forEach(link => {
                link.addEventListener("click", function (e) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    const shortText = parent.querySelector(".short-text");
                    const fullText = parent.querySelector(".full-text");

                    if (shortText.style.display === "none") {
                        shortText.style.display = "inline";
                        fullText.style.display = "none";
                        this.textContent = "Weiterlesen";
                    } else {
                        shortText.style.display = "none";
                        fullText.style.display = "inline";
                        this.textContent = "Weniger anzeigen";
                    }
                });
            });

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
