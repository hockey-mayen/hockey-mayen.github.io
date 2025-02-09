---
layout: default
title: "Chronik"
permalink: /chronik/
---
<h2>Vereinschronik</h2>
(aktuell in Arbeit, Ergänzungen folgen nach weiteren Recherchen)

<div class="timeline-container">
    <ul id="timeline"></ul>
</div>

<script>
   async function loadChronik() {
    const response = await fetch("/assets/data/chronik.json");
    const data = await response.json();
    const timelineContainer = document.getElementById("timeline");

    data.events.forEach(yearEntry => {
        // Jahresüberschrift als <div>
        let yearHeading = document.createElement("div");
        yearHeading.className = "year-heading";
        yearHeading.textContent = yearEntry.year;
        timelineContainer.appendChild(yearHeading);

        // Ereignisse unter dem Jahr
        let eventList = document.createElement("ul");
        eventList.className = "event-list";

        yearEntry.entries.forEach(entry => {
            let eventItem = document.createElement("li");
            eventItem.className = "event-item";

            // Standardtext für das Event
            let eventContent = `<div class="event-details">
                                    <span class="event-text">${entry.month} – ${entry.event}</span>`;

            // Falls ein Bild existiert, füge es UNTER dem Text hinzu
            if (entry.image) {
                eventContent += `<div class="event-image">
                                    <img src="${entry.image}" alt="Event Image">
                                 </div>`;
            }

            // Falls ein Link existiert, füge ihn mit Überschrift hinzu
            if (entry.link && entry.linkTitle) {
                eventContent += `<div class="event-link">
                                    <a href="${entry.link}" target="_blank">${entry.linkTitle}</a>
                                 </div>`;
            }

            eventContent += `</div>`;
            eventItem.innerHTML = eventContent;
            eventList.appendChild(eventItem);
        });

        timelineContainer.appendChild(eventList);
    });
}

document.addEventListener("DOMContentLoaded", loadChronik);

</script>


