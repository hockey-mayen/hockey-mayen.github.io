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

        // 🎯 Jahr-Navigation Eintrag erstellen
        let yearButton = document.createElement("button");
        yearButton.className = "year-button";
        yearButton.textContent = yearEntry.year;
        yearButton.setAttribute("data-year", yearEntry.year);
        yearButton.onclick = () => fadeToYear(yearEntry.year);
        yearNavContainer.appendChild(yearButton);
    });

    // 🌟 Setze das neueste Jahr als aktiv beim Laden der Chronik
    const newestYear = data.events[0].year;
    document.querySelector(`.year-button[data-year='${newestYear}']`).classList.add("active");

    // 🔍 Starte Scroll-Tracking
    window.addEventListener("scroll", highlightCurrentYear);

    // 📖 "Weiterlesen"-Logik
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

    // 🟢 Direkt das erste Jahr markieren
    highlightCurrentYear();
}

// 🎨 **Sanftes Ausblenden, Sprung, dann Einblenden**
function fadeToYear(year) {
    const timeline = document.getElementById("timeline");
    const targetSection = document.getElementById(`year-${year}`);

    if (!targetSection) return;

    // 1️⃣ **Langsam ausblenden**
    timeline.style.transition = "opacity 0.4s ease-in-out";
    timeline.style.opacity = "0.0";

    setTimeout(() => {
        // 2️⃣ **Sofort zum neuen Jahr springen, aber noch unsichtbar**
        window.scrollTo({ top: targetSection.offsetTop - 100, behavior: "instant" });

        // 3️⃣ **Langsam einblenden**
        timeline.style.transition = "opacity 0.6s ease-in-out";
        timeline.style.opacity = "1";

        // 🟢 Nach dem Sprung das aktive Jahr in der Navigation setzen
        document.querySelectorAll(".year-button").forEach(btn => btn.classList.remove("active"));
        document.querySelector(`.year-button[data-year='${year}']`).classList.add("active");

    }, 400); // Warte, bis das Ausblenden vorbei ist
}

// 🏑 **Scroll-Tracking: Automatische Hervorhebung des aktuellen Jahres**
function highlightCurrentYear() {
    let yearHeadings = document.querySelectorAll(".year-heading");
    let scrollPosition = window.scrollY + 200; // Puffer, damit das Jahr früh erkannt wird

    let currentYear = null;

    yearHeadings.forEach(heading => {
        if (heading.offsetTop <= scrollPosition) {
            currentYear = heading.id.replace("year-", "");
        }
    });

    if (currentYear) {
        document.querySelectorAll(".year-button").forEach(btn => btn.classList.remove("active"));
        let activeButton = document.querySelector(`.year-button[data-year='${currentYear}']`);
        if (activeButton) {
            activeButton.classList.add("active");
        }
    }
}

// 🎯 Chronik laden, wenn Seite geladen wird
document.addEventListener("DOMContentLoaded", loadChronik);
