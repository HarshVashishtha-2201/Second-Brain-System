const fs = require('fs');
const pdf = require('pdf-parse');

async function extractTextFromPdf(pathOrBuffer) {
  let dataBuffer;
  if (Buffer.isBuffer(pathOrBuffer)) dataBuffer = pathOrBuffer;
  else dataBuffer = fs.readFileSync(pathOrBuffer);
  const data = await pdf(dataBuffer);
  return data.text || '';
}

module.exports = { extractTextFromPdf };
