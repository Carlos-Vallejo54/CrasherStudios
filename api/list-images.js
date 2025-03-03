import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const imagesDir = path.resolve('./public/images/Gallery/Normal Display');

    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).json({ error: 'Unable to read images directory' });
        }

        const imageFiles = files.filter(file => /\.(jpe?g|png|gif)$/i.test(file));
        res.status(200).json({ images: imageFiles });
    });
}
