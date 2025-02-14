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