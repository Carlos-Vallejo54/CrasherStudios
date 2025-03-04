async function loadProjects() {
    const projectsGrid = document.getElementById("projects-grid");

    try {
        const response = await fetch("/api/projects");
        const data = await response.json();

        if (!data.projects || data.projects.length === 0) {
            console.warn("No projects found.");
            return;
        }

        data.projects.forEach(async (project) => {
            const projectFolder = `images/Project/${project}`;
            const mainImage = `${projectFolder}/${project} Main.png`;

            const projectItem = document.createElement("div");
            projectItem.classList.add("project-item");

            projectItem.innerHTML = `
                <img src="${mainImage}" alt="${project}">
                <h3>${project}</h3>
            `;

            projectItem.addEventListener("click", async () => {
                await loadProjectDetails(projectFolder, project);
            });

            projectsGrid.appendChild(projectItem);
        });
    } catch (error) {
        console.error("Failed to load projects:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadHeaderFooter();
    loadProjects();
});
