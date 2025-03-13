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
        }

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

    eventContainer.appendChild(leftButton);
    eventContainer.appendChild(imageElement);
    eventContainer.appendChild(rightButton);

    document.querySelector(".tile-aktuell:first-child").appendChild(eventContainer);
});
