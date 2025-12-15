const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  content_text: { type: String },
  type: { type: String, enum: ['text','pdf','web','audio','image','markdown'], required: true },
  source: { type: String },
  metadata: { type: Object }
}, { timestamps: true });

// Add a text index for searching title and content
ContentSchema.index({ title: 'text', content_text: 'text' });

module.exports = mongoose.model('ContentItem', ContentSchema);
