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
