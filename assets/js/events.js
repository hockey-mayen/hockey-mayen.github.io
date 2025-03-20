document.addEventListener("DOMContentLoaded", async function () {
    const tileAktuell = document.querySelector(".tile-aktuell");
    if (!tileAktuell) return;

    const container = document.createElement("div");
    container.classList.add("event-container");

    const navContainer = document.createElement("div");
    navContainer.classList.add("event-nav-container");

    // Download-Button mit Flyout-Text erstellen
    const downloadContainer = document.createElement("div");
    downloadContainer.classList.add("event-download-container"); // Container für Tooltip

    const downloadButton = document.createElement("img");
    downloadButton.classList.add("event-download");
    downloadButton.src = "/assets/images/download-button.png";
    downloadButton.alt = "Download";

    // Link-Button zum tatsächlichen Download
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "");
    downloadLink.appendChild(downloadButton);

    downloadContainer.appendChild(downloadLink); // Button in Container setzen

    const leftButton = document.createElement("button");
    leftButton.classList.add("event-nav", "left");
    leftButton.innerHTML = "&lt;"; // "<"

    const rightButton = document.createElement("button");
    rightButton.classList.add("event-nav", "right");
    rightButton.innerHTML = "&gt;"; // ">"

    const imageElement = document.createElement("img");
    imageElement.classList.add("event-image");

    const dotsContainer = document.createElement("div");
    dotsContainer.classList.add("event-dots");

    let events = [];
    let currentIndex = 0;

    try {
        const response = await fetch("/assets/data/events.json");
        events = await response.json();

        if (events.length === 0) {
            throw new Error("Keine Events gefunden.");
        }

        function updateImage() {
            const currentImagePath = events[currentIndex].image;
            imageElement.src = currentImagePath;
            imageElement.alt = events[currentIndex].title;

            // Download-Pfad korrigieren
            const cleanFileName = currentImagePath.replace("-web", ""); // Entfernt "-web"
            const downloadPath = cleanFileName.replace("/web/", "/").replace(".jpg", ".png"); // Eine Ebene höher & ersetzt .png mit .jpg
            downloadLink.href = downloadPath;

            // Markiere den aktiven Punkt
            document.querySelectorAll(".dot").forEach((dot, index) => {
                dot.classList.toggle("active", index === currentIndex);
            });
        }

        events.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                currentIndex = index;
                updateImage();
            });
            dotsContainer.appendChild(dot);
        });

        leftButton.addEventListener("click", function () {
            currentIndex = (currentIndex - 1 + events.length) % events.length;
            updateImage();
        });

        rightButton.addEventListener("click", function () {
            currentIndex = (currentIndex + 1) % events.length;
            updateImage();
        });

        updateImage();

    } catch (error) {
        console.error("Fehler beim Laden der Events:", error);
    }

    // Buttons und Dots direkt nebeneinander setzen
    const navGroup = document.createElement("div");
    navGroup.classList.add("event-nav-group"); // Neue Gruppe für zentrierte Buttons

    navGroup.appendChild(downloadContainer); // Download-Button zuerst
    navGroup.appendChild(leftButton);
    navGroup.appendChild(dotsContainer);
    navGroup.appendChild(rightButton);

    navContainer.appendChild(navGroup); // Die gesamte Gruppe ins navContainer einfügen

    tileAktuell.appendChild(navContainer);
    tileAktuell.appendChild(container);
    container.appendChild(imageElement);
});
