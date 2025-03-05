document.addEventListener("DOMContentLoaded", async function () {
    const projectsGrid = document.getElementById("projects-grid");
    const supportedImageFormats = ["png", "jpg", "jpeg", "webp", "gif", "JPG"]; 

    async function loadProjects() {
        try {
            const response = await fetch("/api/projects");
            const data = await response.json();

            if (!data.projects || data.projects.length === 0) {
                console.warn("No projects found.");
                return;
            }

            data.projects.forEach(async (project) => {
                const encodedProject = encodeURIComponent(project);
                const projectFolder = `../images/Project/${encodedProject}`;
                const mainImage = await findExistingImage(`${projectFolder}/${encodedProject} Main`);

                console.log(`Checking image: ${mainImage}`);

                let projectItem = document.createElement("div");
                projectItem.classList.add("project-item");

                let img = document.createElement("img");
                img.src = mainImage;
                img.alt = project;
                img.onerror = () => {
                    img.src = "../images/fallback.png";
                };

                let title = document.createElement("h3");
                title.textContent = project;

                projectItem.appendChild(img);
                projectItem.appendChild(title);
                projectItem.addEventListener("click", () => openProjectPopup(projectFolder, project));

                projectsGrid.appendChild(projectItem);
            });
        } catch (error) {
            console.error("Failed to load projects:", error);
        }
    }

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

    loadProjects();
});
