import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
    const projectsDir = path.join(process.cwd(), "public/images/Project");

    try {
        const files = await fs.readdir(projectsDir, { withFileTypes: true });

        // Filter only directories (folders)
        const projects = files
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        res.status(200).json({ projects });
    } catch (error) {
        console.error("Error reading project directory:", error);
        res.status(500).json({ error: "Failed to load projects." });
    }
}
