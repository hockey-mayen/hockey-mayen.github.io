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
