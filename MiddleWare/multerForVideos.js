const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = './uploads/videos'; 
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); 
        }

        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const filename = `video-${Date.now()}-${file.originalname}`;
        callback(null, filename); 
    }
});

const fileFilter = (req, file, callback) => {
    const allowedTypes = [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/mkv",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Invalid file format. Only MP4, AVI, MOV, MKV are allowed."), false);
    }
};

// Multer configuration
const multerConfig = multer({
    storage,
    fileFilter,
    limits: { fileSize: 150 * 1024 * 1024 } // Limit file size to 150MB (adjust as needed)
});

module.exports = multerConfig;
