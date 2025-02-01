// js/turniereImageRotator.js
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
    ];

    let currentImageIndex = Math.floor(Math.random() * images.length);

    let img1 = document.createElement("img");
    let img2 = document.createElement("img");

    img1.src = images[currentImageIndex];
    img1.classList.add("active");

    img2.src = images[(currentImageIndex + 1) % images.length];

    turniereContainer.appendChild(img1);
    turniereContainer.appendChild(img2);

    setInterval(() => {
        img1.classList.remove("active");
        img2.classList.add("active");

        setTimeout(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            img1.src = images[currentImageIndex];
            img1.classList.add("active");
            img2.classList.remove("active");
        }, 5000);
    }, 10000);
});
