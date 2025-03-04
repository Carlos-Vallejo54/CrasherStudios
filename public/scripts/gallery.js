document.addEventListener("DOMContentLoaded", async function () {
    const gallery = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption"); // New caption element

    const imageFolder = "/images/Gallery/Normal Display/";

    async function loadGallery() {
        try {
            const response = await fetch("/api/list-images");
            if (!response.ok) {
                throw new Error("Failed to fetch images");
            }

            const data = await response.json();
            let images = data.images;

            // Shuffle images randomly
            images = images.sort(() => Math.random() - 0.5);

            // Populate gallery
            images.forEach(file => {
                let img = document.createElement("img");
                img.src = `${imageFolder}${file}`;
                img.alt = file;
                img.onclick = () => openLightbox(img.src, file);
                gallery.appendChild(img);
            });
        } catch (error) {
            console.error("Failed to load images:", error);
        }
    }

    function openLightbox(src, filename) {
        lightboxImg.src = src;
        lightboxCaption.textContent = filename; // Set the filename under the image
        lightbox.classList.remove("hidden");
    }

    window.closeLightbox = function () {
        lightbox.classList.add("hidden");
    };

    loadGallery();
});
