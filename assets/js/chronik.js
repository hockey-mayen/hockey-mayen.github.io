async function loadChronik() {
    const response = await fetch("/assets/data/chronik.json");
    const data = await response.json();
    const timelineContainer = document.getElementById("timeline");
    const yearColumnLeft = document.getElementById("year-column-left");
    const yearColumnRight = document.getElementById("year-column-right");
    const yearDropdown = document.getElementById("year-dropdown"); // Dropdown-Menü

    const years = data.events.map(event => event.year);

    // In zwei Spalten aufteilen (erste Hälfte links, zweite Hälfte rechts, mit Anpassung)
    const midIndex = Math.ceil(years.length / 2);
    const leftYears = years.slice(0, midIndex);
    const rightYears = years.slice(midIndex).reverse(); // Älteste Jahre zuerst in rechter Spalte

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

            const details = document.createElement('div');
            details.className = 'event-details';
            const heading = document.createElement('span');
            heading.className = 'event-item-headline';
            ChronikContent.appendHeadline(heading, entry.headline);
            details.appendChild(heading);

            const { short, full } = ChronikContent.appendText(details, entry.event, 450);
            short.classList.add('event-text');
            full.classList.add('event-text');

            if (Array.isArray(entry.images)) {
                const gallery = document.createElement('div');
                gallery.className = 'event-gallery';
                entry.images.forEach(value => {
                    const src = ChronikContent.safeUrl(value, { image: true });
                    if (!src) return;
                    const wrapper = document.createElement('div');
                    wrapper.className = 'event-image';
                    const image = document.createElement('img');
                    image.src = src;
                    image.alt = 'Event Image';
                    wrapper.appendChild(image);
                    gallery.appendChild(wrapper);
                });
                if (gallery.childElementCount) details.appendChild(gallery);
            }

            const link = ChronikContent.createLink(entry.link, entry.linkTitle);
            if (link && ChronikContent.text(entry.linkTitle)) {
                const linkContainer = document.createElement('div');
                linkContainer.className = 'event-link';
                linkContainer.appendChild(link);
                details.appendChild(linkContainer);
            }

            eventItem.appendChild(details);
            eventList.appendChild(eventItem);
        });

        timelineContainer.appendChild(eventList);
    });

    // Buttons für linke Spalte (neuere Jahre)
    leftYears.forEach(year => {
        let yearButton = document.createElement("button");
        yearButton.className = "year-button";
        yearButton.textContent = year;
        yearButton.setAttribute("data-year", year);
        yearButton.onclick = () => fadeToYear(year);
        yearColumnLeft.appendChild(yearButton);
    });

    // Buttons für rechte Spalte (ältere Jahre)
    rightYears.forEach(year => {
        let yearButton = document.createElement("button");
        yearButton.className = "year-button";
        yearButton.textContent = year;
        yearButton.setAttribute("data-year", year);
        yearButton.onclick = () => fadeToYear(year);
        yearColumnRight.appendChild(yearButton);
    });

    // 📌 Dropdown mit Jahren befüllen (nur für mobile Ansicht)
    years.forEach(year => {
        let option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });

    // Event-Listener für das Dropdown-Menü
    yearDropdown.addEventListener("change", function () {
        fadeToYear(this.value);
    });

    // Erstes Jahr automatisch aktiv setzen
    findYearButton(years[0])?.classList.add("active");

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

    // Scroll-Tracking aktivieren
    window.addEventListener("scroll", highlightCurrentYear);
}

// Werte aus den Daten werden nicht in CSS-Selektoren eingesetzt.
function findYearButton(year) {
    return Array.from(document.querySelectorAll('.year-button'))
        .find(button => button.dataset.year === String(year));
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
        findYearButton(year)?.classList.add("active");

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
        let activeButton = findYearButton(currentYear);
        if (activeButton) {
            activeButton.classList.add("active");
        }
    }
}

// 🎯 Chronik laden, wenn Seite geladen wird
document.addEventListener("DOMContentLoaded", loadChronik);
