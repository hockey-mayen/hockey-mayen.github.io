document.addEventListener("DOMContentLoaded", function () {
    let trainingContainer = document.querySelector(".training-image-container");

    if (!trainingContainer) {
        console.error("Fehler: .training-image-container nicht gefunden!");
        return;
    }

    let images = [
        "/assets/images/training/training1.jpg",
        "/assets/images/training/training2.jpg",
        "/assets/images/training/training3.jpg",
        "/assets/images/training/training4.jpg",
        "/assets/images/training/training5.jpg",
        "/assets/images/training/training6.jpg",
        "/assets/images/training/training7.jpg",
        "/assets/images/training/training8.jpg",
        "/assets/images/training/training9.jpg",
        "/assets/images/training/training10.jpg",
    ];

    let currentImageIndex = Math.floor(Math.random() * images.length); // Zufälliges Startbild
    let nextImageIndex = (currentImageIndex + 1) % images.length;

    // Zwei Bilder für den Crossfade vorbereiten
    let img1 = document.createElement("img");
    let img2 = document.createElement("img");

    img1.src = images[currentImageIndex];
    img1.classList.add("active");

    img2.src = images[nextImageIndex];

    trainingContainer.appendChild(img1);
    trainingContainer.appendChild(img2);

    let isTransitioning = false; // Variable zur Sicherung gegen doppeltes Wechseln

    function changeImage() {
        if (isTransitioning) return; // Verhindert doppelte Wechsel

        isTransitioning = true; // Sperre Wechsel während der Animation

        img1.classList.remove("active");
        img2.classList.add("active");

        // Warte auf den sanften Übergang (CSS Transition Zeit + Sicherheit)
        setTimeout(() => {
            // Bildquelle wechseln für den nächsten Wechsel
            currentImageIndex = (currentImageIndex + 1) % images.length;
            nextImageIndex = (currentImageIndex + 1) % images.length;

            img1.src = images[nextImageIndex];

            // Tausche die Rollen der Bilder
            img1.classList.add("fade");
            img2.classList.remove("fade");

            // Nach Wechsel ist wieder ein neuer Wechsel erlaubt
            [img1, img2] = [img2, img1];

            isTransitioning = false;
        }, 2000); // Gleiche Zeit wie CSS Transition
    }

    setInterval(changeImage, 15000);
});
