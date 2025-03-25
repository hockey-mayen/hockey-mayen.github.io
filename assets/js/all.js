// scrollTop.js
// js/scrollTop.js
document.addEventListener("DOMContentLoaded", function() {
    let scrollBtn = document.getElementById("scrollTopBtn");

    // Zeigt den Button, wenn man 100px gescrollt hat
    window.addEventListener("scroll", function() {
        if (window.scrollY > 100) {
            scrollBtn.classList.add("show");
        } else {
            scrollBtn.classList.remove("show");
        }
    });

    // Funktion zum sanften Scrollen nach oben
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
});


// events.js
document.addEventListener("DOMContentLoaded", async function () {
    const tileAktuell = document.querySelector(".tile-aktuell");
    if (!tileAktuell) return;

    const container = document.createElement("div");
    container.classList.add("event-container");

    const navContainer = document.createElement("div");
    navContainer.classList.add("event-nav-container");

    // Download-Button mit Flyout-Text erstellen
    const downloadContainer = document.createElement("div");
    downloadContainer.classList.add("event-download-container"); // Container für Tooltip

    const downloadButton = document.createElement("img");
    downloadButton.classList.add("event-download");
    downloadButton.src = "/assets/images/download-button.png";
    downloadButton.alt = "Download";

    // Link-Button zum tatsächlichen Download
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "");
    downloadLink.appendChild(downloadButton);

    downloadContainer.appendChild(downloadLink); // Button in Container setzen

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
            const currentImagePath = events[currentIndex].image;
            imageElement.src = currentImagePath;
            imageElement.alt = events[currentIndex].title;

            // Download-Pfad korrigieren
            const cleanFileName = currentImagePath.replace("-web", ""); // Entfernt "-web"
            const downloadPath = cleanFileName.replace("/web/", "/").replace(".webp", ".png"); // Eine Ebene höher & ersetzt .png mit .jpg
            downloadLink.href = downloadPath;

            // Markiere den aktiven Punkt
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
    const navGroup = document.createElement("div");
    navGroup.classList.add("event-nav-group"); // Neue Gruppe für zentrierte Buttons

    navGroup.appendChild(downloadContainer); // Download-Button zuerst
    navGroup.appendChild(leftButton);
    navGroup.appendChild(dotsContainer);
    navGroup.appendChild(rightButton);

    navContainer.appendChild(navGroup); // Die gesamte Gruppe ins navContainer einfügen

    tileAktuell.appendChild(navContainer);
    tileAktuell.appendChild(container);
    container.appendChild(imageElement);
});


// highlights.js
document.addEventListener("DOMContentLoaded", async function () {
    const chronikList = document.getElementById("chronik-list");
    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "Mehr anzeigen";
    loadMoreButton.classList.add("load-more-btn");

    let allEntries = [];
    let displayedEntries = 0;
    let entriesPerLoad = 5;

    try {
        const response = await fetch("/assets/data/chronik.json");
        const chronikData = await response.json();

        // Alle Einträge aus allen Jahren sammeln
        chronikData.events.forEach(eventYear => {
            allEntries = allEntries.concat(eventYear.entries);
        });

        // Damit die neuesten Einträge zuerst kommen, nicht reverse(), sondern direkt von hinten iterieren
        allEntries.sort((a, b) => new Date(b.date || b.headline) - new Date(a.date || a.headline));

        function loadEntries() {
            const maxLength = 450;
            let nextEntries = allEntries.slice(displayedEntries, displayedEntries + entriesPerLoad);

            nextEntries.forEach(entry => {
                const entryDiv = document.createElement("div");
                entryDiv.classList.add("chronik-entry");

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

                let html = `
            <h4>${entry.headline}</h4>
            <p>
                <span class="short-text">${shortText}</span>
                <span class="full-text" style="display: none;">${fullText}</span>
                ${isLongText ? `<a href="#" class="toggle-text">Weiterlesen</a>` : ""}
            </p>
            ${entry.images && entry.images.length > 0
                    ? `<div class="chronik-images">
                        ${entry.images.map(img => `<img src="${img}" alt="Bild zu ${entry.headline}">`).join('')}
                   </div>`
                    : ''
                }
            ${entry.link
                    ? `<div class="event-link"><a href="${entry.link}" target="_blank">${entry.linkTitle || "Mehr erfahren"}</a></div>`
                    : ''}
        `;

                entryDiv.innerHTML = html;
                chronikList.appendChild(entryDiv);
            });

            displayedEntries += entriesPerLoad;

            // 🔁 Event-Handler für neue "Weiterlesen"-Links setzen
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

            if (displayedEntries >= allEntries.length) {
                loadMoreButton.style.display = "none";
            }
        }


        // Erste 5 Einträge laden (neuste zuerst)
        loadEntries();

        // Button einfügen und bei Klick weitere laden
        loadMoreButton.addEventListener("click", loadEntries);
        chronikList.parentNode.appendChild(loadMoreButton);

    } catch (error) {
        console.error("Fehler beim Laden der Chronik:", error);
    }
});


// trainingImageRotator.js
document.addEventListener("DOMContentLoaded", function () {
    let trainingContainer = document.querySelector(".training-image-container");

    if (!trainingContainer) {
        console.error("Fehler: .training-image-container nicht gefunden!");
        return;
    }
    let images = [
        "/assets/images/training/training1.webp",
        "/assets/images/training/training2.webp",
        "/assets/images/training/training3.webp",
        "/assets/images/training/training4.webp",
        "/assets/images/training/training5.webp",
        "/assets/images/training/training6.webp",
        "/assets/images/training/training7.webp",
        "/assets/images/training/training8.webp",
        "/assets/images/training/training9.webp",
        "/assets/images/training/training11.webp",
        "/assets/images/training/training12.webp",
        "/assets/images/training/training13.webp",
        "/assets/images/training/training14.webp",
        "/assets/images/training/training15.webp",
        "/assets/images/training/training16.webp",
        "/assets/images/training/training17.webp",
        "/assets/images/training/training18.webp",
        "/assets/images/training/training19.webp",
        "/assets/images/training/training20.webp",
        "/assets/images/training/training21.webp",
        "/assets/images/training/training22.webp",
        "/assets/images/training/training23.webp",
        "/assets/images/training/training24.webp",
        "/assets/images/training/training25.webp",
        "/assets/images/training/training26.webp",
        "/assets/images/training/training27.webp",
        "/assets/images/training/training28.webp",
        "/assets/images/training/training29.webp",
    ];

    let currentImageIndex = Math.floor(Math.random() * images.length);
    let nextImageIndex = (currentImageIndex + 1) % images.length;

    let img1 = document.createElement("img");
    let img2 = document.createElement("img");

    img1.src = images[currentImageIndex];
    img1.classList.add("active");

    img2.src = images[nextImageIndex];

    trainingContainer.appendChild(img1);
    trainingContainer.appendChild(img2);

    // Fortschrittsbalken erstellen und hinzufügen
    let progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    trainingContainer.appendChild(progressBar);

    console.log("Progress-Bar wurde hinzugefügt:", progressBar); // Debugging

    let isTransitioning = false;

    function changeImage() {
        if (isTransitioning) return;
        isTransitioning = true;

        img1.classList.remove("active");
        img2.classList.add("active");

        setTimeout(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            nextImageIndex = (currentImageIndex + 1) % images.length;

            img1.src = images[nextImageIndex];

            img1.classList.add("fade");
            img2.classList.remove("fade");

            [img1, img2] = [img2, img1];

            isTransitioning = false;

            // **Ladebalken genau jetzt starten!**
            startProgressBar();

        }, 3000); // **3s Bildwechsel abwarten**
    }

    function startProgressBar() {
        progressBar.style.width = "0%";
        progressBar.style.transition = "none"; // Direkt resetten

        setTimeout(() => {
            progressBar.style.transition = "width 10s linear"; // Jetzt startet die Animation
            progressBar.style.width = "100%";
        }, 50);
    }

    function resetProgressBar() {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
    }

    function cycleImages() {
        resetProgressBar(); // **Balken zurücksetzen**
        changeImage(); // **Bild wechseln**
    }

    setInterval(cycleImages, 13000); // 3s Bildwechsel + 10s Fortschrittsbalken = **13s pro Durchlauf**

    // **Starte direkt mit der Progress-Bar nach dem ersten Bild**
    startProgressBar();
});


// turniereImageRotator.js
document.addEventListener("DOMContentLoaded", function () {
    let turniereContainer = document.querySelector(".turniere-image-container");

    if (!turniereContainer) {
        console.error("Fehler: .turniere-image-container nicht gefunden!");
        return;
    }

    let images = [
        "/assets/images/turniere/turnier1.webp",
        "/assets/images/turniere/turnier2.webp",
        "/assets/images/turniere/turnier3.webp",
        "/assets/images/turniere/turnier4.webp",
        "/assets/images/turniere/turnier5.webp",
        "/assets/images/turniere/turnier6.webp",
        "/assets/images/turniere/turnier7.webp",
        "/assets/images/turniere/turnier8.webp",
        "/assets/images/turniere/turnier9.webp",
        "/assets/images/turniere/turnier10.webp",
        "/assets/images/turniere/turnier11.webp",
        "/assets/images/turniere/turnier12.webp",
        "/assets/images/turniere/turnier13.webp",
        "/assets/images/turniere/turnier14.webp",
        "/assets/images/turniere/turnier15.webp",
        "/assets/images/turniere/turnier16.webp",

        "/assets/images/turniere/turnier17.webp",
        "/assets/images/turniere/turnier18.webp",
        "/assets/images/turniere/turnier19.webp",
        "/assets/images/turniere/turnier20.webp",

        "/assets/images/turniere/turnier21.webp",
        "/assets/images/turniere/turnier22.webp",
        "/assets/images/turniere/turnier23.webp",
        "/assets/images/turniere/turnier24.webp",
        "/assets/images/turniere/turnier25.webp",
        "/assets/images/turniere/turnier26.webp",
        "/assets/images/turniere/turnier27.webp",
        "/assets/images/turniere/turnier28.webp",
        "/assets/images/turniere/turnier29.webp",

        "/assets/images/turniere/turnier30.webp",
        "/assets/images/turniere/turnier31.webp",
        "/assets/images/turniere/turnier32.webp",
        "/assets/images/turniere/turnier33.webp",
        "/assets/images/turniere/turnier34.webp",
        "/assets/images/turniere/turnier35.webp",
        "/assets/images/turniere/turnier36.webp",
        "/assets/images/turniere/turnier37.webp",
        "/assets/images/turniere/turnier38.webp",
        "/assets/images/turniere/turnier39.webp",

        "/assets/images/turniere/turnier40.webp",
        "/assets/images/turniere/turnier41.webp",
        "/assets/images/turniere/turnier42.webp",
    ];

    let currentImageIndex = Math.floor(Math.random() * images.length);
    let nextImageIndex = (currentImageIndex + 1) % images.length;

    let img1 = document.createElement("img");
    let img2 = document.createElement("img");

    img1.src = images[currentImageIndex];
    img1.classList.add("active");

    img2.src = images[nextImageIndex];

    turniereContainer.appendChild(img1);
    turniereContainer.appendChild(img2);

    // Fortschrittsbalken erstellen und hinzufügen
    let progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    turniereContainer.appendChild(progressBar);

    console.log("Progress-Bar wurde hinzugefügt:", progressBar); // Debugging

    let isTransitioning = false;

    function changeImage() {
        if (isTransitioning) return;
        isTransitioning = true;

        img1.classList.remove("active");
        img2.classList.add("active");

        setTimeout(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            nextImageIndex = (currentImageIndex + 1) % images.length;

            img1.src = images[nextImageIndex];

            img1.classList.add("fade");
            img2.classList.remove("fade");

            [img1, img2] = [img2, img1];

            isTransitioning = false;

            // **Ladebalken genau jetzt starten!**
            startProgressBar();

        }, 3000); // **3s Bildwechsel abwarten**
    }

    function startProgressBar() {
        progressBar.style.width = "0%";
        progressBar.style.transition = "none"; // Direkt resetten

        setTimeout(() => {
            progressBar.style.transition = "width 10s linear"; // Jetzt startet die Animation
            progressBar.style.width = "100%";
        }, 50);
    }

    function resetProgressBar() {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
    }

    function cycleImages() {
        resetProgressBar(); // **Balken zurücksetzen**
        changeImage(); // **Bild wechseln**
    }

    setInterval(cycleImages, 13000); // 3s Bildwechsel + 10s Fortschrittsbalken = **13s pro Durchlauf**

    // **Starte direkt mit der Progress-Bar nach dem ersten Bild**
    startProgressBar();
});


// chronik.js
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
    document.querySelector(`.year-button[data-year='${years[0]}']`).classList.add("active");

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
        document.querySelector(`.year-button[data-year='${year}']`)?.classList.add("active");

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


// impressum.js
function toggleCollapsible() {
    let content = document.querySelector('.collapsible-content');
    let arrow = document.querySelector('.arrow');

    if (content.style.display === "block") {
        content.style.display = "none";
        arrow.innerHTML = "&#9654;"; // Pfeil nach rechts
    } else {
        content.style.display = "block";
        arrow.innerHTML = "&#9660;"; // Pfeil nach unten
    }
}

// kontaktScroll.js
document.addEventListener("DOMContentLoaded", function () {
    let kontaktContainer = document.querySelector(".kontakt-container");

    if (!kontaktContainer) {
        console.error("Fehler: .kontakt-container nicht gefunden!");
        return;
    }

    // Nur auf Smartphones scrollen (Bildschirmbreite < 768px)
    if (window.innerWidth < 1025) {
        setTimeout(() => {
            kontaktContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300); // Kleine Verzögerung, um das Rendering abzuwarten
    }
});


