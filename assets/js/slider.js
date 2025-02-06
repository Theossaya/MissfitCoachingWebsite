const logosContainer = document.querySelector('.clients__logos');
let scrollPosition = 0;
const scrollStep = 300; // Adjust based on the logo size and spacing
const intervalTime = 3000; // 3 seconds between slides

function slideLogos() {
    const maxScroll = logosContainer.scrollWidth - logosContainer.offsetWidth;

    scrollPosition += scrollStep;

    // Reset to the beginning if the scroll reaches the end
    if (scrollPosition > maxScroll) {
        scrollPosition = 0;
    }

    logosContainer.style.transform = `translateX(-${scrollPosition}px)`;
}

// Set interval to slide logos
setInterval(slideLogos, intervalTime);
