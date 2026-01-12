document.addEventListener("DOMContentLoaded", async function () {
    const chronikList = document.getElementById("chronik-list");

    // ✅ Script nur ausführen, wenn chronik-list auf der Seite existiert
    if (!chronikList) return;

    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "Mehr anzeigen";
    loadMoreButton.classList.add("load-more-btn");

    let allEntries = [];
    let displayedEntries = 0;
    let entriesPerLoad = 3;

    // ✅ Event Delegation
    chronikList.addEventListener("click", (e) => {
        const link = e.target.closest(".toggle-text");
        if (!link) return;

        e.preventDefault();
        const parent = link.parentElement;
        const shortText = parent.querySelector(".short-text");
        const fullText = parent.querySelector(".full-text");

        const expanded = shortText.style.display === "none";
        shortText.style.display = expanded ? "inline" : "none";
        fullText.style.display = expanded ? "none" : "inline";
        link.textContent = expanded ? "Weiterlesen" : "Weniger anzeigen";
    });

    try {
        const response = await fetch("/assets/data/chronik.json");
        const chronicData = await response.json();

        chronicData.events.forEach((eventYear) => {
            allEntries = allEntries.concat(eventYear.entries);
        });

        allEntries.sort(
            (a, b) => new Date(b.date || b.headline) - new Date(a.date || a.headline)
        );

        function loadEntries() {
            const maxLength = 650;
            const nextEntries = allEntries.slice(displayedEntries, displayedEntries + entriesPerLoad);
            const isInitialBatch = displayedEntries === 0;

            nextEntries.forEach((entry, entryIndex) => {
                const entryDiv = document.createElement("div");
                entryDiv.classList.add("chronik-entry");

                const eventText = entry.event || "";
                const isLongText = eventText.length > maxLength;

                let shortText = eventText;
                let fullText = eventText;

                if (isLongText) {
                    let trimmedText = eventText.substring(0, maxLength);
                    const lastSpaceIndex = trimmedText.lastIndexOf(" ");
                    if (lastSpaceIndex > -1) trimmedText = trimmedText.substring(0, lastSpaceIndex);
                    shortText = trimmedText + " ...";
                }

                const imagesHtml =
                    entry.images && entry.images.length > 0
                        ? `<div class="chronik-images">
                ${entry.images
                            .map((img, imgIndex) => {
                                const isHero = isInitialBatch && entryIndex === 0 && imgIndex === 0;
                                const loading = isHero ? "eager" : "lazy";
                                const fetchPriority = isHero ? "high" : "low";

                                return `
                                  <div class="img-wrap" data-img="${img}">
                                    <div class="img-skeleton" aria-hidden="true"></div>
                                    <img src="${img}"
                                      alt="Bild zu ${entry.headline}"
                                      loading="${loading}"
                                      decoding="async"
                                      fetchpriority="${fetchPriority}">
                                     </div>
                                        `;}).join("")}
                                    </div>`
                                    : "";

                const linkHtml = entry.link
                    ? `<div class="event-link">
              <a href="${entry.link}" target="_blank" rel="noopener noreferrer">
                ${entry.linkTitle || "Mehr erfahren"}
              </a>
            </div>`
                    : "";

                entryDiv.innerHTML = `
          <h2>${entry.headline}</h2>
          <p>
            <span class="short-text">${shortText}</span>
            <span class="full-text" style="display:none;">${fullText}</span>
            ${isLongText ? `<a href="#" class="toggle-text">Weiterlesen</a>` : ""}
          </p>
          ${imagesHtml}
          ${linkHtml}
        `;

                chronikList.appendChild(entryDiv);
                wireImageLoaders(entryDiv);
            });

            displayedEntries += entriesPerLoad;
            if (displayedEntries >= allEntries.length) loadMoreButton.style.display = "none";
        }

        loadEntries();

        loadMoreButton.addEventListener("click", loadEntries);
        chronikList.parentNode.appendChild(loadMoreButton);
    } catch (error) {
        console.error("Fehler beim Laden der Chronik:", error);
    }
    function wireImageLoaders(rootEl) {
        const wraps = rootEl.querySelectorAll(".img-wrap");

        wraps.forEach((wrap) => {
            const img = wrap.querySelector("img");
            if (!img) return;

            const done = (ok) => {
                wrap.classList.add(ok ? "is-loaded" : "is-error");
                img.classList.add("is-loaded");
            };

            // Wenn Bild evtl. schon aus Cache da ist
            if (img.complete && img.naturalWidth > 0) {
                done(true);
                return;
            }

            img.addEventListener("load", () => done(true), { once: true });
            img.addEventListener("error", () => done(false), { once: true });
        });
    }
});
