async function loadProjects() {
    const projectsGrid = document.getElementById("projects-grid");

    // Fetch project folders dynamically
    const response = await fetch("public/images/Project/");
    const projects = await response.json();

    projects.forEach(async (project) => {
        const projectFolder = `public/images/Project/${project}`;
        const mainImage = `${projectFolder}/${project} Main.png`;

        // Create project card
        const projectItem = document.createElement("div");
        projectItem.classList.add("project-item");

        projectItem.innerHTML = `
            <img src="${mainImage}" alt="${project}">
            <h3>${project}</h3>
        `;

        // Click event to open popup
        projectItem.addEventListener("click", async () => {
            await loadProjectDetails(projectFolder, project);
        });

        projectsGrid.appendChild(projectItem);
    });
}

async function loadProjectDetails(folder, project) {
    const popup = document.getElementById("project-popup");
    const popupTitle = document.getElementById("popup-title");
    const popupYear = document.getElementById("popup-year");
    const popupNote = document.getElementById("popup-note");
    const popupImages = document.getElementById("popup-images");
    const popupDescription = document.getElementById("popup-description");

    // Read project info
    const infoResponse = await fetch(`${folder}/projectinfo.txt`);
    const infoText = await infoResponse.text();
    const infoLines = infoText.split("\n");

    popupTitle.innerText = infoLines[0];  // Name
    popupYear.innerText = `Year: ${infoLines[1]}`;  // Year
    popupNote.innerText = infoLines[2];  // Note

    // Load images
    popupImages.innerHTML = "";
    let imgIndex = 1;
    while (true) {
        const imgPath = `${folder}/${project} ${imgIndex}.png`;
        const imgExists = await fetch(imgPath, { method: "HEAD" });

        if (!imgExists.ok) break;

        const imgElement = document.createElement("img");
        imgElement.src = imgPath;
        popupImages.appendChild(imgElement);
        imgIndex++;
    }

    // Load project notes
    const noteResponse = await fetch(`${folder}/projectnote.txt`);
    const noteText = await noteResponse.text();
    const noteLines = noteText.split("\n");

    popupDescription.innerHTML = "";
    noteLines.forEach(line => {
        const p = document.createElement("p");
        p.innerText = line;
        popupDescription.appendChild(p);
    });

    // Show popup
    popup.style.display = "flex";
}

// Close popup
document.querySelector(".close-popup").addEventListener("click", () => {
    document.getElementById("project-popup").style.display = "none";
});

// Load Header & Footer like in gallery.html
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("header").innerHTML = '<script src="../scripts/loadHeaderFooter.js"></script>';
    document.getElementById("footer").innerHTML = '<script src="../scripts/loadHeaderFooter.js"></script>';
});
