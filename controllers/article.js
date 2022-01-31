const Article = require('../models/article');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

const {
  invalidInputText, articleNotFoundText, resourceFobiddenText, articleDeletedText, badRequestText,
} = require('../constants');

module.exports.getArticles = (req, res, next) => {
  const userId = req.user._id;
  Article.find({ owner: userId })
    .then((articles) => res.status(200).send(articles))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image, owner = req.user._id,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      if (!article) {
        throw new ForbiddenError(invalidInputText);
      }
      res.status(200).send(article);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const userId = req.user._id;
  const articleToDeleteId = req.params.articleId;
  Article.findById(articleToDeleteId).select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError(articleNotFoundText);
      } else if (article.owner.toString() !== userId) {
        throw new ForbiddenError(resourceFobiddenText);
      }
      Article.deleteOne({ _id: articleToDeleteId })
        .then(() => {
          res.status(200).send({ message: articleDeletedText });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') throw new BadRequestError(badRequestText);
      next(err);
    })
    .catch(next);
};
