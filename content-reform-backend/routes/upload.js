const express = require('express');
const multer = require('multer');
const path = require('path');
const extractText = require('../parsers/parser');
const cleanText = require('../utils/cleanText');

const router = express.Router();

// ======= Multer setup =========
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// ======= File type detection =========
const detectFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.docx') return 'docx';
  if (ext === '.txt') return 'text';
  if (ext === '.pptx') return 'pptx';
  return 'unknown';
};


// ======= Upload route =========
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const type = detectFileType(filePath);
    const rawText = await extractText(filePath, type);
    const clean = cleanText(rawText);

    res.json({
      filename: req.file.originalname,
      type,
      preview: clean.slice(0, 300),
      fullText: clean
    });
  } catch (err) {
    console.error('Error in upload route:', err);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

module.exports = router;
module.exports.detectFileType = detectFileType;
