document.addEventListener("DOMContentLoaded", async function () {
    const tileAktuell = document.querySelector(".tile-aktuell");
    if (!tileAktuell) return;

    const container = document.createElement("div");
    container.classList.add("event-container");

    const navContainer = document.createElement("div");
    navContainer.classList.add("event-nav-container");

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
            imageElement.src = events[currentIndex].image;
            imageElement.alt = events[currentIndex].title;

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
    navContainer.appendChild(leftButton);
    navContainer.appendChild(dotsContainer);
    navContainer.appendChild(rightButton);

    tileAktuell.appendChild(navContainer);
    tileAktuell.appendChild(container);
    container.appendChild(imageElement);
});
