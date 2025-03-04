document.addEventListener("DOMContentLoaded", function () {
    new Swiper(".swiper-container", {
        loop: true, // Infinite loop
        autoplay: {
            delay: 5000, // Change slide every 5 seconds
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
});

// Lightbox Functions for Banners
function openLightbox(src) {
    const lightbox = document.getElementById("banner-lightbox");
    const lightboxImg = document.getElementById("banner-lightbox-img");

    lightboxImg.src = src;
    lightbox.classList.remove("hidden");
}

function closeLightbox() {
    document.getElementById("banner-lightbox").classList.add("hidden");
}
