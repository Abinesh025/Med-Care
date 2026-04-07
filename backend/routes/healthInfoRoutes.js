const router = require('express').Router();
const {
  getArticles,
  getArticle,
  createArticle,
  deleteArticle,
} = require('../controllers/healthInfoController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/',      getArticles);
router.get('/:id',   getArticle);
router.post('/',     protect, adminOnly, createArticle);
router.delete('/:id',protect, adminOnly, deleteArticle);

module.exports = router;
