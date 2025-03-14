document.addEventListener("DOMContentLoaded", async function () {
    const eventContainer = document.createElement("div");
    eventContainer.classList.add("event-slider");

    const imageElement = document.createElement("img");
    imageElement.classList.add("event-image");

    const leftButton = document.createElement("button");
    leftButton.classList.add("event-nav", "left");
    leftButton.innerHTML = "&lt;";

    const rightButton = document.createElement("button");
    rightButton.classList.add("event-nav", "right");
    rightButton.innerHTML = "&gt;";

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

        // Funktion zur Aktualisierung des Bildes und der aktiven Punkte
        function updateImage() {
            imageElement.src = events[currentIndex].image;
            imageElement.alt = events[currentIndex].title;

            // Punkte aktualisieren
            document.querySelectorAll(".dot").forEach((dot, index) => {
                dot.classList.toggle("active", index === currentIndex);
            });
        }

        // Punkte erstellen
        events.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active"); // Erster Punkt aktiv
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

        updateImage(); // Erstes Bild setzen

    } catch (error) {
        console.error("Fehler beim Laden der Events:", error);
    }

    eventContainer.appendChild(leftButton);
    eventContainer.appendChild(imageElement);
    eventContainer.appendChild(rightButton);

    document.querySelector(".tile-aktuell:first-child").appendChild(eventContainer);
    document.querySelector(".tile-aktuell:first-child").appendChild(dotsContainer);

    // ** Swipe-Funktionalität für mobile Geräte **
    let startX = 0;
    let endX = 0;

    eventContainer.addEventListener("touchstart", (event) => {
        startX = event.touches[0].clientX;
    });

    eventContainer.addEventListener("touchend", (event) => {
        endX = event.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        let swipeThreshold = 50; // Mindestbewegung, um als Swipe zu gelten

        if (startX - endX > swipeThreshold) {
            // Nach links wischen (nächstes Bild)
            currentIndex = (currentIndex + 1) % events.length;
        } else if (endX - startX > swipeThreshold) {
            // Nach rechts wischen (vorheriges Bild)
            currentIndex = (currentIndex - 1 + events.length) % events.length;
        }

        updateImage();
    }
});
