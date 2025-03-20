document.addEventListener("DOMContentLoaded", function () {
    let turniereContainer = document.querySelector(".turniere-image-container");

    if (!turniereContainer) {
        console.error("Fehler: .turniere-image-container nicht gefunden!");
        return;
    }

    let images = [
        "/assets/images/turniere/turnier1.jpg",
        "/assets/images/turniere/turnier2.jpg",
        "/assets/images/turniere/turnier3.jpg",
        "/assets/images/turniere/turnier4.jpg",
        "/assets/images/turniere/turnier5.jpg",
        "/assets/images/turniere/turnier6.jpg",
        "/assets/images/turniere/turnier7.jpg",
        "/assets/images/turniere/turnier8.jpg",
        "/assets/images/turniere/turnier9.jpg",
        "/assets/images/turniere/turnier10.jpg",
        "/assets/images/turniere/turnier11.jpg",
        "/assets/images/turniere/turnier12.jpg",
        "/assets/images/turniere/turnier13.jpg",
        "/assets/images/turniere/turnier14.jpg",
        "/assets/images/turniere/turnier15.jpg",
        "/assets/images/turniere/turnier16.jpg",

        "/assets/images/turniere/turnier17.jpg",
        "/assets/images/turniere/turnier18.jpg",
        "/assets/images/turniere/turnier19.jpg",
        "/assets/images/turniere/turnier20.jpg",

        "/assets/images/turniere/turnier21.jpg",
        "/assets/images/turniere/turnier22.jpg",
        "/assets/images/turniere/turnier23.jpg",
        "/assets/images/turniere/turnier24.jpg",
        "/assets/images/turniere/turnier25.jpg",
        "/assets/images/turniere/turnier26.jpg",
        "/assets/images/turniere/turnier27.jpg",
        "/assets/images/turniere/turnier28.jpg",
        "/assets/images/turniere/turnier29.jpg",

        "/assets/images/turniere/turnier30.jpg",
        "/assets/images/turniere/turnier31.jpg",
        "/assets/images/turniere/turnier32.jpg",
        "/assets/images/turniere/turnier33.jpg",
        "/assets/images/turniere/turnier34.jpg",
        "/assets/images/turniere/turnier35.jpg",
        "/assets/images/turniere/turnier36.jpg",
        "/assets/images/turniere/turnier37.jpg",
        "/assets/images/turniere/turnier38.jpg",
        "/assets/images/turniere/turnier39.jpg",

        "/assets/images/turniere/turnier40.jpg",
        "/assets/images/turniere/turnier41.jpg",
        "/assets/images/turniere/turnier42.jpg",
        "/assets/images/turniere/turnier43.jpg",

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
