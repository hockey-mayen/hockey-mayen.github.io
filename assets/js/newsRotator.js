// 🛠 EINSTELLBARE VARIABLEN
const typingSpeed = 65; // Tippgeschwindigkeit (langsamer für angenehmes Lesen)
const delayBeforeNext = 2500; // Verzögerung nach vollständigem Text
const sentencePause = 800; // Pause nach Satzenden (leicht verlängert für Natürlichkeit)
const maxLength = 50; // Maximale Zeichenanzahl vor "Weiterlesen"-Link
const imageDisplayDuration = 2500; // 🆕 Dauer, wie lange ein Bild sichtbar bleibt (in ms)

async function loadNews() {
    console.log("🔄 Lade News-Daten...");
    const response = await fetch("/assets/data/chronik.json");
    const data = await response.json();

    let latestEntries = [];
    data.events.forEach(event => {
        event.entries.forEach(entry => {
            latestEntries.push({
                year: event.year,
                text: entry.event,
                headline: entry.headline,
                images: entry.images || [] // Falls keine Bilder existieren, leeres Array
            });
        });
    });

    latestEntries.sort((a, b) => b.year - a.year); // Neueste zuerst
    latestEntries = latestEntries.slice(0, 5); // Nur die 5 neuesten Nachrichten

    let newsIndex = 0;
    const contentElement = document.getElementById("news-content");

    function displayNextNews() {
        const entry = latestEntries[newsIndex];
        const fullText = entry.text;
        const year = entry.year;
        const headline = entry.headline;
        const images = entry.images;

        console.log(`🔍 Prüfe Bilder für "${headline}":`, images);

        // 🔥 Generiere eine ID für den Chronik-Link
        const entryId = `chronik-${headline.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`;

        let shortText = fullText;
        let showReadMore = false;

        if (fullText.length > maxLength) {
            let trimmedText = fullText.substring(0, maxLength);
            let lastSpaceIndex = trimmedText.lastIndexOf(" ");
            if (lastSpaceIndex > -1) {
                shortText = trimmedText.substring(0, lastSpaceIndex);
            }
            shortText += " ...";
            showReadMore = true;
        }

        contentElement.textContent = ""; // Vorherigen Text löschen
        console.log(`📢 Starte neue Nachricht (${newsIndex + 1}/${latestEntries.length}): "${shortText}"`);

        typeTextWithPauses(shortText, contentElement, typingSpeed, sentencePause, () => {
            console.log(`✅ Nachricht vollständig getippt: "${shortText}"`);

            // „Weiterlesen“-Link mit direkter ID in der Chronik
            if (showReadMore) {
                let readMoreLink = document.createElement("a");
                readMoreLink.href = `/chronik/#${entryId}`;
                readMoreLink.textContent = "Weiterlesen";
                readMoreLink.style.marginLeft = "10px";
                readMoreLink.style.color = "#007bff";
                readMoreLink.style.cursor = "pointer";

                readMoreLink.addEventListener("click", (event) => {
                    event.preventDefault();
                    window.location.href = `/chronik/#${entryId}`;
                    setTimeout(() => scrollToEntry(entryId), 300);
                });

                contentElement.appendChild(readMoreLink);
            }

            // 🖼 Falls Bilder existieren, zeige sie **direkt nach dem Text**
            if (images.length > 0) {
                console.log(`🖼 Zeige ${images.length} Bilder für "${headline}" an`);
                displayImages(images, () => {
                    console.log("🎬 Alle Bilder angezeigt, weiter zum nächsten Event");
                    setTimeout(nextNewsEntry, delayBeforeNext);
                });
            } else {
                setTimeout(nextNewsEntry, delayBeforeNext);
            }
        });
    }

    function nextNewsEntry() {
        newsIndex = (newsIndex + 1) % latestEntries.length;
        console.log(`➡️ Wechsle zu Nachricht #${newsIndex + 1}`);
        displayNextNews();
    }

    function typeTextWithPauses(text, element, speed, sentencePause, callback) {
        let i = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;

                if (text.charAt(i - 1) === ".") {
                    console.log(`⏸️ Satzende erkannt. Warte ${sentencePause}ms...`);
                    setTimeout(type, sentencePause);
                } else {
                    setTimeout(type, speed);
                }
            } else {
                setTimeout(() => {
                    element.classList.add("visible"); // ✅ Text sichtbar machen
                    if (callback) callback();
                }, delayBeforeNext);
            }
        }

        element.classList.remove("visible"); // Verhindert sofortige Anzeige
        type();
    }

    // 🆕 Funktion für **direkte** Bildanzeige (KEINE Übergänge!)
    function displayImages(images, callback) {
        let imageIndex = 0;
        const contentElement = document.getElementById("news-content"); // Stelle sicher, dass Bilder in "Nachrichten" angezeigt werden
        contentElement.innerHTML = ""; // Vorherigen Text/Bilder löschen

        function showNextImage() {
            if (imageIndex >= images.length) {
                callback();
                return;
            }

            let img = new Image();
            img.src = images[imageIndex];
            img.classList.add("news-image");

            img.onload = () => {
                console.log(`🖼 Bild geladen & eingefügt: ${images[imageIndex]}`);

                contentElement.innerHTML = ""; // Löscht vorherigen Inhalt (Text/Bild)
                contentElement.appendChild(img);
            };

            img.onerror = () => {
                console.error(`❌ FEHLER: Bild konnte nicht geladen werden: ${images[imageIndex]}`);
                imageIndex++;
                showNextImage();
            };

            setTimeout(() => {
                contentElement.innerHTML = ""; // Entferne Bild nach Ablauf der Anzeigezeit
                imageIndex++;
                showNextImage();
            }, imageDisplayDuration);
        }

        showNextImage();
    }



    console.log("🚀 Starte News-Rotator...");
    displayNextNews();
}

document.addEventListener("DOMContentLoaded", loadNews);
