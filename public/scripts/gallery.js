document.addEventListener("DOMContentLoaded", async function () {
    const coverflowGallery = document.getElementById("coverflow-gallery");
    const gallery = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");

    async function loadImages() {
        try {
            const response = await fetch("/api/list-images");
            if (!response.ok) {
                throw new Error("Failed to fetch images");
            }

            const data = await response.json();

            // Shuffle images for randomness
            const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

            const featuredImages = shuffleArray(data.featuredImages);
            const normalImages = shuffleArray(data.normalImages);

            // Load Featured Images into Cover Flow
            featuredImages.forEach(file => {
                let img = document.createElement("img");
                img.src = `/images/Gallery/Featured/${file}`;
                img.alt = file;
                img.onclick = () => openLightbox(img.src, file);

                let slide = document.createElement("div");
                slide.classList.add("swiper-slide");
                slide.appendChild(img);
                coverflowGallery.appendChild(slide);
            });

            // Load Normal Display Images into Gallery
            normalImages.forEach(file => {
                let img = document.createElement("img");
                img.src = `/images/Gallery/Normal Display/${file}`;
                img.alt = file;
                img.onclick = () => openLightbox(img.src, file);
                gallery.appendChild(img);
            });

            // Initialize Cover Flow
            initCoverFlow();

        } catch (error) {
            console.error("Failed to load images:", error);
        }
    }

    function initCoverFlow() {
        new Swiper('.swiper-container', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            loop: true,
        });
    }

    function openLightbox(src, filename) {
        const cleanFilename = filename.replace(/\.[^/.]+$/, ""); // Remove file extension
        lightboxImg.src = src;
        lightboxCaption.textContent = cleanFilename;
        lightbox.classList.remove("hidden");
    }

    window.closeLightbox = function () {
        lightbox.classList.add("hidden");
    };

    // Load images
    loadImages();
});
