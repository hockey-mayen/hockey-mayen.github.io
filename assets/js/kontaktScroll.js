document.addEventListener("DOMContentLoaded", function () {
    let kontaktContainer = document.querySelector(".kontakt-container");

    if (!kontaktContainer) {
        console.error("Fehler: .kontakt-container nicht gefunden!");
        return;
    }

    // Nur auf Smartphones scrollen (Bildschirmbreite < 768px)
    if (window.innerWidth < 768) {
        setTimeout(() => {
            kontaktContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300); // Kleine Verzögerung, um das Rendering abzuwarten
    }
});
