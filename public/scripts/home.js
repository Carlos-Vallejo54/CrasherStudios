document.addEventListener("DOMContentLoaded", function () {
    // Initialize Banner Swiper
    new Swiper(".swiper-container", {
        loop: true,
        autoplay: {
            delay: 5000,
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

// Load Featured Projects
document.addEventListener("DOMContentLoaded", async function () {
    const coverflowProjects = document.getElementById("coverflow-projects");
    const supportedImageFormats = ["png", "jpg", "jpeg", "webp", "gif", "JPG"];
    let currentIndex = 0;

    async function loadFeaturedProjects() {
        try {
            const response = await fetch("/api/projects");
            const data = await response.json();

            if (!data.projects || data.projects.length === 0) {
                console.warn("No projects found.");
                return;
            }

            const selectedProjects = data.projects.sort(() => Math.random() - 0.5).slice(0, 3);

            for (const project of selectedProjects) {
                const encodedProject = encodeURIComponent(project);
                const projectFolder = `../images/Project/${encodedProject}`;
                const mainImage = await findExistingImage(`${projectFolder}/${encodedProject} Main`);

                let projectItem = document.createElement("div");
                projectItem.classList.add("project-item");

                let img = document.createElement("img");
                img.src = mainImage;
                img.alt = project;
                img.onerror = () => { img.src = "../images/fallback.png"; };

                let title = document.createElement("h3");
                title.textContent = project;

                projectItem.appendChild(img);
                projectItem.appendChild(title);
                projectItem.onclick = () => openProjectPopup(projectFolder, project);
                
                coverflowProjects.appendChild(projectItem);
            }

            updateSlidePosition();
        } catch (error) {
            console.error("Failed to load featured projects:", error);
        }
    }

    function moveSlide(direction) {
        const slides = document.querySelectorAll(".project-item");
        currentIndex = (currentIndex + direction + slides.length) % slides.length;
        updateSlidePosition();
    }

    function updateSlidePosition() {
        const slides = document.querySelectorAll(".project-item");
        const totalSlides = slides.length;
        slides.forEach((slide, index) => {
            let offset = index - currentIndex;
            if (offset < 0) offset += totalSlides;
            if (offset === 0) {
                slide.style.transform = `translateX(0) scale(1.2)`;
                slide.style.opacity = "1";
                slide.style.pointerEvents = "auto";
            } else {
                const direction = offset < totalSlides / 2 ? -1 : 1;
                slide.style.transform = `translateX(${direction * 200}%) scale(0.8)`;
                slide.style.opacity = "0";
                slide.style.pointerEvents = "none";
            }
        });
    }

    document.querySelector(".coverflow-button.prev").addEventListener("click", () => moveSlide(-1));
    document.querySelector(".coverflow-button.next").addEventListener("click", () => moveSlide(1));

    async function findExistingImage(basePath) {
        for (let ext of supportedImageFormats) {
            let imgPath = `${basePath}.${ext}`;
            try {
                const response = await fetch(imgPath, { method: "HEAD" });
                if (response.ok) return imgPath;
            } catch (error) {
                console.warn(`Image not found: ${imgPath}`);
            }
        }
        return "../images/fallback.png"; 
    }

    async function openProjectPopup(folder, project) {
        const popup = document.getElementById("project-popup");
        const popupTitle = document.getElementById("popup-title");
        const popupYear = document.getElementById("popup-year");
        const popupNote = document.getElementById("popup-note");
        const popupImages = document.getElementById("popup-images");
        const popupDescription = document.getElementById("popup-description");
        const loadingSpinner = document.getElementById("loading-spinner");

        loadingSpinner.style.display = "block";

        try {
            const infoResponse = await fetch(`${folder}/projectinfo.txt`);
            const infoText = await infoResponse.text();
            const infoLines = infoText.split("\n");

            popupTitle.innerText = infoLines[0];
            popupYear.innerText = `Year: ${infoLines[1]}`;
            popupNote.innerText = infoLines[2];

            popupImages.innerHTML = "";
            let imgIndex = 1;
            while (true) {
                const baseImgPath = `${folder}/${project} ${imgIndex}`;
                const imagePath = await findExistingImage(baseImgPath);
                
                if (imagePath === "../images/fallback.png") break; 

                let imgElement = document.createElement("img");
                imgElement.src = imagePath;
                imgElement.classList.add("popup-img");
                popupImages.appendChild(imgElement);
                imgIndex++;
            }

            const noteResponse = await fetch(`${folder}/projectnote.txt`);
            const noteText = await noteResponse.text();
            const noteLines = noteText.split("\n");

            popupDescription.innerHTML = "";
            noteLines.forEach(line => {
                let p = document.createElement("p");
                p.innerText = line;
                popupDescription.appendChild(p);
            });

            popup.style.display = "flex";
        } catch (error) {
            console.error("Failed to load project details:", error);
        } finally {
            loadingSpinner.style.display = "none";
        }
    }

    document.querySelector(".close-popup").addEventListener("click", () => {
        document.getElementById("project-popup").style.display = "none";
    });

    loadFeaturedProjects();
});