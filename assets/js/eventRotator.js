async function loadEvents() {
    const response = await fetch("/assets/data/veranstaltungen.json");
    const data = await response.json();

    let eventIndex = 0;
    const eventImageElement = document.getElementById("eventImage");

    function showNextEvent() {
        eventImageElement.src = data[eventIndex].image;
        eventImageElement.alt = data[eventIndex].title;

        eventIndex = (eventIndex + 1) % data.length;
    }

    showNextEvent();
    setInterval(showNextEvent, 5000); // Wechselt alle 5 Sekunden
}

document.addEventListener("DOMContentLoaded", loadEvents);
