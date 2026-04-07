const mongoose = require('mongoose');

const healthArticleSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  summary:  { type: String, required: true },
  content:  { type: String, default: '' },
  category: { type: String, enum: ['fitness','mental-health','diet','preventive','heart','general'], default: 'general' },
  tags:     [String],
  readTime: { type: String, default: '5 min' },
  author:   { type: String, default: 'MedCare Editorial' },
  published:{ type: Boolean, default: true },
}, { timestamps: true });

healthArticleSchema.index({ title: 'text', summary: 'text', tags: 'text' });

module.exports = mongoose.model('HealthArticle', healthArticleSchema);
