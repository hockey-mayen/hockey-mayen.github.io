---
layout: default
title: "Chronik"
permalink: /chronik/
---

<h2>Vereinschronik</h2>

<div class="timeline-container">
    <ul id="timeline"></ul>
</div>

<script>
    async function loadChronik() {
        const response = await fetch("/assets/data/chronik.json");
        const data = await response.json();
        const timelineContainer = document.getElementById("timeline");

        data.events.forEach(yearEntry => {
            // Jahresüberschrift
            let yearHeading = document.createElement("li");
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

                eventContent += `</div>`;
                eventItem.innerHTML = eventContent;
                eventList.appendChild(eventItem);
            });

            timelineContainer.appendChild(eventList);
        });
    }

    document.addEventListener("DOMContentLoaded", loadChronik);
</script>


