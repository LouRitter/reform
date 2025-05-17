const fs = require('fs');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

async function extractText(filePath, type) {
  if (type === 'text') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (type === 'docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (type === 'pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  return '';
}

module.exports = extractText;