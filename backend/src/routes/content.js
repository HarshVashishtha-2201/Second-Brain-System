const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { extractTextFromPdf } = require('../utils/pdf');
const store = require('../store');
const auth = require('../middleware/auth');

const UPLOAD_DIR = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf','text/markdown','text/plain','image/png','image/jpeg','image/jpg','audio/mpeg','audio/wav'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.md$|\.pdf$|\.mdown$|\.markdown$/i)) cb(null, true);
    else cb(new Error('Unsupported file type'));
  }
});

router.post('/upload', auth, upload.single('file'), async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type, title, text, url } = req.body;
    let content_text = '';
    let source = '';
    let finalType = type;

    if (req.file) {
      source = req.file.filename;
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext === '.pdf') {
        content_text = await extractTextFromPdf(req.file.path);
        finalType = 'pdf';
      } else if (ext === '.md' || req.file.mimetype === 'text/markdown') {
        content_text = fs.readFileSync(req.file.path, 'utf8');
        finalType = 'markdown';
      } else if (req.file.mimetype && req.file.mimetype.startsWith('image/')) {
        content_text = text || '';
        finalType = 'image';
      } else if (req.file.mimetype && req.file.mimetype.startsWith('audio/')) {
        content_text = '';
        finalType = 'audio';
      } else {
        try { content_text = fs.readFileSync(req.file.path, 'utf8'); }
        catch(e) { content_text = ''; }
      }
    } else if (url) {
      source = url;
      const resp = await axios.get(url);
      const $ = cheerio.load(resp.data);
      content_text = $('body').text().replace(/\s+/g,' ').trim().slice(0, 200000);
      finalType = 'web';
    } else if (text) {
      content_text = text;
      finalType = 'text';
    } else {
      return res.status(400).json({ error: 'No content provided' });
    }

    const item = store.createContent(
      userId,
      title || (req.file ? req.file.originalname : (url || 'Untitled')),
      content_text,
      finalType,
      source,
      { uploadedAt: new Date() }
    );

    res.json({ item });
  } catch (err) { next(err); }
});

router.get('/list', auth, async (req, res, next) => {
  try {
    const items = store.findContentByUserId(req.user._id, 200);
    res.json({ items });
  } catch (err) { next(err); }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const item = store.findContentByUserIdAndId(req.user._id, parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ item });
  } catch (err) { next(err); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const item = store.deleteContent(parseInt(req.params.id), req.user._id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.get('/search', auth, async (req, res, next) => {
  try {
    const { q, fromDate, toDate } = req.query;
    const items = store.searchContent(req.user._id, q, fromDate, toDate);
    res.json({ items });
  } catch (err) { next(err); }
});

module.exports = router;
