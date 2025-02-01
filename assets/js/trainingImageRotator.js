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

    let img1 = document.createElement("img");
    let img2 = document.createElement("img");

    img1.src = images[currentImageIndex];
    img1.classList.add("active");

    img2.src = images[(currentImageIndex + 1) % images.length];

    trainingContainer.appendChild(img1);
    trainingContainer.appendChild(img2);

    setInterval(() => {
        img1.classList.remove("active"); // Altes Bild ausblenden
        img2.classList.add("active");    // Neues Bild einblenden

        setTimeout(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            img1.src = images[currentImageIndex];
            img1.classList.add("active");
            img2.classList.remove("active");
        }, 5000);
    }, 10000);
});
