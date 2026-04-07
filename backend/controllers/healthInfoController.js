const HealthArticle = require('../models/HealthArticle');

const getArticles = async (req, res) => {
  const { category, search } = req.query;
  const query = { published: true };
  if (category && category !== 'all') query.category = category;
  if (search) query.$text = { $search: search };
  const articles = await HealthArticle.find(query).sort({ createdAt: -1 });
  res.json(articles);
};

const getArticle = async (req, res) => {
  const article = await HealthArticle.findById(req.params.id);
  if (!article || !article.published) return res.status(404).json({ message: 'Article not found' });
  res.json(article);
};

const createArticle = async (req, res) => {
  const { title, summary, content, category, tags, readTime } = req.body;
  if (!title || !summary) return res.status(400).json({ message: 'Title and summary required' });
  const article = await HealthArticle.create({ title, summary, content, category, tags, readTime });
  res.status(201).json(article);
};

const deleteArticle = async (req, res) => {
  const article = await HealthArticle.findByIdAndDelete(req.params.id);
  if (!article) return res.status(404).json({ message: 'Article not found' });
  res.json({ message: 'Deleted' });
};

module.exports = { getArticles, getArticle, createArticle, deleteArticle };
