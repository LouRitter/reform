const fs = require('fs');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

jest.mock('fs');
jest.mock('mammoth');
jest.mock('pdf-parse');

const extractText = require('./parser');
const { detectFileType } = require('../routes/upload');

describe('extractText', () => {
  it('returns text from .txt files', async () => {
    fs.readFileSync.mockReturnValue('hello');
    const result = await extractText('file.txt', 'text');
    expect(result).toBe('hello');
  });

  it('returns text from .docx files', async () => {
    mammoth.extractRawText.mockResolvedValue({ value: 'docx text' });
    const result = await extractText('file.docx', 'docx');
    expect(result).toBe('docx text');
  });

  it('returns text from .pdf files', async () => {
    pdfParse.mockResolvedValue({ text: 'pdf text' });
    const result = await extractText('file.pdf', 'pdf');
    expect(result).toBe('pdf text');
  });
});

describe('detectFileType', () => {
  if (detectFileType) {
    it('identifies pdf files', () => {
      expect(detectFileType('a.pdf')).toBe('pdf');
    });
    it('identifies docx files', () => {
      expect(detectFileType('a.docx')).toBe('docx');
    });
    it('identifies txt files', () => {
      expect(detectFileType('a.txt')).toBe('text');
    });
    it('identifies pptx files', () => {
      expect(detectFileType('a.pptx')).toBe('pptx');
    });
  }
});
