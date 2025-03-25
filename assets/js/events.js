document.addEventListener("DOMContentLoaded", async function () {
    const tileAktuell = document.querySelector(".tile-aktuell");
    if (!tileAktuell) return;

    const container = document.createElement("div");
    container.classList.add("event-container");

    const navContainer = document.createElement("div");
    navContainer.classList.add("event-nav-container");

    const downloadContainer = document.createElement("div");
    downloadContainer.classList.add("event-download-container");

    const downloadButton = document.createElement("img");
    downloadButton.classList.add("event-download");
    downloadButton.src = "/assets/images/download-button.png";
    downloadButton.alt = "Download";

    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "");
    downloadLink.appendChild(downloadButton);
    downloadContainer.appendChild(downloadLink);

    const leftButton = document.createElement("button");
    leftButton.classList.add("event-nav", "left");
    leftButton.innerHTML = "&lt;";

    const rightButton = document.createElement("button");
    rightButton.classList.add("event-nav", "right");
    rightButton.innerHTML = "&gt;";

    const imageElement = document.createElement("img");
    imageElement.classList.add("event-image");

    const dotsContainer = document.createElement("div");
    dotsContainer.classList.add("event-dots");

    let events = [];
    let currentIndex = 0;

    try {
        const response = await fetch("/assets/data/events.json");
        events = await response.json();

        if (events.length === 0) throw new Error("Keine Events gefunden.");

        // Bild aktualisieren mit Richtung
        function updateImage(direction = "right") {
            const currentImagePath = events[currentIndex].image;

            // Animation zurücksetzen
            imageElement.classList.remove("animate-slide-in", "slide-from-left", "slide-from-right");
            imageElement.classList.add("hidden");

            // Lade-Handler vorbereiten
            const tempImg = new Image();
            tempImg.src = currentImagePath;
            tempImg.onload = () => {
                // Erst wenn das Bild vollständig geladen ist, ersetzen wir es
                imageElement.src = tempImg.src;
                imageElement.alt = events[currentIndex].title;

                const cleanFileName = currentImagePath.replace("-web", "");
                const downloadPath = cleanFileName.replace("/web/", "/").replace(".webp", ".png");
                downloadLink.href = downloadPath;

                // Animation starten
                imageElement.classList.remove("hidden");
                imageElement.classList.add("animate-slide-in");
                imageElement.classList.add(direction === "left" ? "slide-from-left" : "slide-from-right");

                // Dots aktualisieren
                document.querySelectorAll(".dot").forEach((dot, index) => {
                    dot.classList.toggle("active", index === currentIndex);
                });
            };
        }


        events.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                const direction = index > currentIndex ? "right" : "left";
                currentIndex = index;
                updateImage(direction);
            });
            dotsContainer.appendChild(dot);
        });

        leftButton.addEventListener("click", function () {
            const oldIndex = currentIndex;
            currentIndex = (currentIndex - 1 + events.length) % events.length;
            updateImage("left");
        });

        rightButton.addEventListener("click", function () {
            const oldIndex = currentIndex;
            currentIndex = (currentIndex + 1) % events.length;
            updateImage("right");
        });

        updateImage(); // Initial anzeigen

    } catch (error) {
        console.error("Fehler beim Laden der Events:", error);
    }

    const navGroup = document.createElement("div");
    navGroup.classList.add("event-nav-group");
    navGroup.appendChild(downloadContainer);
    navGroup.appendChild(leftButton);
    navGroup.appendChild(dotsContainer);
    navGroup.appendChild(rightButton);

    navContainer.appendChild(navGroup);
    tileAktuell.appendChild(navContainer);
    tileAktuell.appendChild(container);
    container.appendChild(imageElement);
});
