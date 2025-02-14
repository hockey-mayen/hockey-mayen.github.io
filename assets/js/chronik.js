async function loadChronik() {
    const response = await fetch("/assets/data/chronik.json");
    const data = await response.json();
    const timelineContainer = document.getElementById("timeline");
    const yearNavContainer = document.getElementById("year-nav");

    data.events.forEach(yearEntry => {
        let yearHeading = document.createElement("div");
        yearHeading.className = "year-heading";
        yearHeading.id = `year-${yearEntry.year}`;
        yearHeading.textContent = yearEntry.year;
        timelineContainer.appendChild(yearHeading);

        let eventList = document.createElement("ul");
        eventList.className = "event-list";

        yearEntry.entries.forEach(entry => {
            let eventItem = document.createElement("li");
            eventItem.className = "event-item";

            const maxLength = 450;
            let isLongText = entry.event.length > maxLength;
            let shortText = entry.event;
            let fullText = entry.event;

            if (isLongText) {
                let trimmedText = entry.event.substring(0, maxLength);
                let lastSpaceIndex = trimmedText.lastIndexOf(" ");
                if (lastSpaceIndex > -1) {
                    shortText = trimmedText.substring(0, lastSpaceIndex);
                }
                shortText += " ...";
            }

            let eventContent = `<div class="event-details">
                                    <span class="event-item-headline">${entry.headline}</span>
                                    <span class="event-text short-text">${shortText}</span>
                                    <span class="event-text full-text" style="display: none;">${fullText}</span>`;

            if (isLongText) {
                eventContent += `<a href="#" class="toggle-text">Weiterlesen</a>`;
            }

            if (entry.images && entry.images.length > 0) {
                eventContent += `<div class="event-gallery">`;
                entry.images.forEach(image => {
                    eventContent += `<div class="event-image"><img src="${image}" alt="Event Image"></div>`;
                });
                eventContent += `</div>`;
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

        let showYearNav = false;

        if (showYearNav) {
            let yearButton = document.createElement("button");
            yearButton.className = "year-button";
            yearButton.textContent = yearEntry.year;
            yearButton.onclick = () => {
                document.getElementById(`year-${yearEntry.year}`).scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            };
            yearNavContainer.appendChild(yearButton);
        }
    });

    document.querySelectorAll(".toggle-text").forEach(link => {
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
