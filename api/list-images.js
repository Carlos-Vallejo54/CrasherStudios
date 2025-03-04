import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const galleryPath = path.join(process.cwd(), 'public/images/Gallery');

    const normalDisplayPath = path.join(galleryPath, 'Normal Display');
    const featuredPath = path.join(galleryPath, 'Featured');

    try {
        const imageExtensions = /\.(jpe?g|png|gif|webp)$/i; 

        const normalImages = fs.readdirSync(normalDisplayPath).filter(file =>
            imageExtensions.test(file)
        );

        const featuredImages = fs.readdirSync(featuredPath).filter(file =>
            imageExtensions.test(file)
        );

        res.status(200).json({
            normalImages,
            featuredImages
        });

    } catch (error) {
        console.error('Error reading image directories:', error);
        res.status(500).json({ error: 'Unable to read images directory' });
    }
}