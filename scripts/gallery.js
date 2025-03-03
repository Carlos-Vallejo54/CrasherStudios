document.addEventListener("DOMContentLoaded", async function () {
    const gallery = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    const imageFolder = "/images/Gallery/Normal Display/";

    async function loadGallery() {
        try {
            const response = await fetch("/api/list-images");
            const data = await response.json();
            
            data.images.forEach(file => {
                let img = document.createElement("img");
                img.src = `${imageFolder}${file}`;
                img.alt = "Gallery Image";
                img.onclick = () => openLightbox(img.src);
                gallery.appendChild(img);
            });
        } catch (error) {
            console.error("Failed to load images:", error);
        }
    }

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.remove("hidden");
    }

    window.closeLightbox = function () {
        lightbox.classList.add("hidden");
    };

    loadGallery();
});
