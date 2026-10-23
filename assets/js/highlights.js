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
            const maxLength = 1350;
            const nextEntries = allEntries.slice(displayedEntries, displayedEntries + entriesPerLoad);
            const isInitialBatch = displayedEntries === 0;

            nextEntries.forEach((entry, entryIndex) => {
                const entryDiv = document.createElement("div");
                entryDiv.classList.add("chronik-entry");

                const heading = document.createElement('h2');
                ChronikContent.appendHeadline(heading, entry.headline);
                const paragraph = document.createElement('p');
                ChronikContent.appendText(paragraph, entry.event, maxLength);
                entryDiv.append(heading, paragraph);

                if (Array.isArray(entry.images)) {
                    const gallery = document.createElement('div');
                    gallery.className = 'chronik-images';

                    entry.images.forEach((value, imgIndex) => {
                        const src = ChronikContent.safeUrl(value, { image: true });
                        if (!src) return;
                        const isHero = isInitialBatch && entryIndex === 0 && imgIndex === 0;
                        const wrap = document.createElement('div');
                        wrap.className = 'img-wrap';
                        wrap.dataset.img = src;
                        const skeleton = document.createElement('div');
                        skeleton.className = 'img-skeleton';
                        skeleton.setAttribute('aria-hidden', 'true');
                        const image = document.createElement('img');
                        image.src = src;
                        image.alt = `Bild zu ${ChronikContent.text(entry.headline)}`;
                        image.loading = isHero ? 'eager' : 'lazy';
                        image.decoding = 'async';
                        image.setAttribute('fetchpriority', isHero ? 'high' : 'low');
                        wrap.append(skeleton, image);
                        gallery.appendChild(wrap);
                    });
                    if (gallery.childElementCount) entryDiv.appendChild(gallery);
                }

                const link = ChronikContent.createLink(
                    entry.link, ChronikContent.text(entry.linkTitle) || 'Mehr erfahren'
                );
                if (link) {
                    const linkContainer = document.createElement('div');
                    linkContainer.className = 'event-link';
                    linkContainer.appendChild(link);
                    entryDiv.appendChild(linkContainer);
                }

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
