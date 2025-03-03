document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    // Path to the images folder
    const imageFolder = "../images/Gallery/Normal Display/";

    // Fetch images dynamically from GitHub repo
    async function loadGallery() {
        const response = await fetch(imageFolder);
        const data = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, "text/html");
        
        // Extract image file names
        const imageFiles = [...htmlDoc.querySelectorAll("a")]
            .map(a => a.href)
            .filter(href => href.match(/\.(jpe?g|png|gif)$/i)) // Only image files
            .map(href => decodeURIComponent(href.split("/").pop())); // Get filename
        
        imageFiles.forEach(file => {
            let img = document.createElement("img");
            img.src = `${imageFolder}${file}`;
            img.alt = "Gallery Image";
            img.onclick = () => openLightbox(img.src);
            gallery.appendChild(img);
        });
    }

    // Open lightbox
    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.remove("hidden");
    }

    // Close lightbox
    window.closeLightbox = function () {
        lightbox.classList.add("hidden");
    };

    loadGallery();
});
