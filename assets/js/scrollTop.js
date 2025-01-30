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
