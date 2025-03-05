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

document.addEventListener("DOMContentLoaded", async function () {
    // Load Featured Projects Cover Flow
    await loadFeaturedProjects();

    function initCoverFlow() {
        new Swiper('#featured-projects-carousel', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 3,  
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 300, 
                modifier: 1,
                slideShadows: true,
            },
            loop: true, 
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }    

    async function loadFeaturedProjects() {
        const projectWrapper = document.getElementById("featured-projects-wrapper");

        try {
            const response = await fetch("/api/projects");
            const data = await response.json();

            if (!data.projects || data.projects.length === 0) {
                console.warn("No projects found.");
                return;
            }

            // Randomly select 3 projects
            const shuffledProjects = data.projects.sort(() => 0.5 - Math.random()).slice(0, 3);

            shuffledProjects.forEach(async (project) => {
                const encodedProject = encodeURIComponent(project);
                const projectFolder = `../images/Project/${encodedProject}`;
                const mainImage = await findExistingImage(`${projectFolder}/${encodedProject} Main`);

                let slide = document.createElement("div");
                slide.classList.add("swiper-slide");

                let img = document.createElement("img");
                img.src = mainImage;
                img.alt = project;
                img.onclick = () => openProjectPopup(projectFolder, project);

                let caption = document.createElement("div");
                caption.classList.add("carousel-caption");
                caption.textContent = project;

                slide.appendChild(img);
                slide.appendChild(caption);
                projectWrapper.appendChild(slide);
            });

            // Initialize Cover Flow
            initCoverFlow();

        } catch (error) {
            console.error("Failed to load featured projects:", error);
        }
    }

    async function findExistingImage(basePath) {
        const supportedImageFormats = ["png", "jpg", "jpeg", "webp", "gif", "JPG"];
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
        }
    }

    document.querySelector(".close-popup").addEventListener("click", () => {
        document.getElementById("project-popup").style.display = "none";
    });
});