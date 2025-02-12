---
layout: default
title: "Chronik"
permalink: /chronik/
---
<h2>Vereinschronik</h2>
<small>(in Arbeit, Ergänzungen folgen ..)</small>

<div class="timeline-container">
    <ul id="timeline"></ul>
</div>

<script>
    async function loadChronik() {
    const response = await fetch("/assets/data/chronik.json");
    const data = await response.json();
    const timelineContainer = document.getElementById("timeline");

    data.events.forEach(yearEntry => {
        let yearHeading = document.createElement("div");
        yearHeading.className = "year-heading";
        yearHeading.textContent = yearEntry.year;
        timelineContainer.appendChild(yearHeading);

        let eventList = document.createElement("ul");
        eventList.className = "event-list";

        yearEntry.entries.forEach(entry => {
            let eventItem = document.createElement("li");
            eventItem.className = "event-item";

            const maxLength = 450; // Maximale Zeichenanzahl für die Vorschau

            let isLongText = entry.event.length > maxLength;
            let shortText = entry.event;

            if (isLongText) {
                let trimmedText = entry.event.substring(0, maxLength);

                // Sucht das letzte Leerzeichen vor dem Limit, um ein Wort nicht abzuschneiden
                let lastSpaceIndex = trimmedText.lastIndexOf(" ");
                if (lastSpaceIndex > -1) {
                    shortText = trimmedText.substring(0, lastSpaceIndex);
                }

                shortText += " ...";
            }

            let eventContent = `<div class="event-details">
                                    <span class="event-item-month short-text">${entry.month}</span>
                                    <span class="event-text short-text">${shortText}</span>
                                    <span class="event-text full-text" style="display: none;">${entry.event}</span>`;


            if (isLongText) {
                eventContent += `<a href="#" class="toggle-text">Weiterlesen</a>`;
            }

            if (entry.image) {
                eventContent += `<div class="event-image">
                                    <img src="${entry.image}" alt="Event Image">
                                </div>`;
            }

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

    document.querySelectorAll(".toggle-text").forEach(link => {
        link.style.color = "#007b5f";
        link.style.fontWeight = "bold";
        link.style.textDecoration = "none";
        link.style.marginLeft = "5px";
        link.style.cursor = "pointer";
        link.style.fontSize = "14px";

        link.addEventListener("click", function (e) {
            e.preventDefault();
            const parent = this.parentElement;
            const shortText = parent.querySelector(".short-text");
            const fullText = parent.querySelector(".full-text");

            if (shortText.style.display === "none") {
                shortText.style.display = "inline";
                fullText.style.display = "none";
                this.textContent = "Weiterlesen";
            } else {
                shortText.style.display = "none";
                fullText.style.display = "inline";
                this.textContent = "Weniger anzeigen";
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", loadChronik);

</script>



