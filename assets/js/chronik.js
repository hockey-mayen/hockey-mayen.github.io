async function loadChronik() {
    const response = await fetch("/assets/data/chronik.json");
    const data = await response.json();
    const timelineContainer = document.getElementById("timeline");
    const yearColumnLeft = document.getElementById("year-column-left");
    const yearColumnRight = document.getElementById("year-column-right");

    const years = data.events.map(event => event.year);

// In zwei Spalten aufteilen (erste Hälfte links, zweite Hälfte rechts)
    const midIndex = Math.floor(years.length / 2);
    const leftYears = years.slice(0, midIndex); // Erste Hälfte (Neueste Jahre)
    const rightYears = years.slice(midIndex); // Zweite Hälfte (ältere Jahre)

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

            let eventContent = `<div class="event-details">
                                    <span class="event-item-headline">${entry.headline}</span>
                                    <span class="event-text">${entry.event}</span>`;

            if (entry.images && entry.images.length > 0) {
                eventContent += `<div class="event-gallery">`;
                entry.images.forEach(image => {
                    eventContent += `<div class="event-image"><img src="${image}" alt="Event Image"></div>`;
                });
                eventContent += `</div>`;
            }

            eventContent += `</div>`;
            eventItem.innerHTML = eventContent;
            eventList.appendChild(eventItem);
        });

        timelineContainer.appendChild(eventList);
    });

    // Buttons für linke Spalte
    leftYears.forEach(year => {
        let yearButton = document.createElement("button");
        yearButton.className = "year-button";
        yearButton.textContent = year;
        yearButton.setAttribute("data-year", year);
        yearButton.onclick = () => fadeToYear(year);
        yearColumnLeft.appendChild(yearButton);
    });

    // Buttons für rechte Spalte (älteste Jahre)
    rightYears.forEach(year => {
        let yearButton = document.createElement("button");
        yearButton.className = "year-button";
        yearButton.textContent = year;
        yearButton.setAttribute("data-year", year);
        yearButton.onclick = () => fadeToYear(year);
        yearColumnRight.appendChild(yearButton);
    });

    // Erstes Jahr automatisch aktiv setzen
    document.querySelector(`.year-button[data-year='${years[0]}']`).classList.add("active");

    // Scroll-Tracking aktivieren
    window.addEventListener("scroll", highlightCurrentYear);
}

document.addEventListener("DOMContentLoaded", loadChronik);


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
