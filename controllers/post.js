const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        posts: posts,
        totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Bu id'ye ait bir ilan bulunamadı.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const userId = req.loggedUserId;
  const location = req.body.location;
  const bloodType = req.body.bloodType;
  const message = req.body.message;
  const post = new Post({
    userId,
    location,
    bloodType,
    message,
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "İlan başarıyla oluşturuldu!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.loggedUserId;
  const location = req.body.location;
  const bloodType = req.body.bloodType;
  const message = req.body.message;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Bu id'ye ait bir ilan bulunamadı.");
        error.statusCode = 404;
        throw error;
      }
      if (post.userId.toString() !== userId.toString()) {
        const error = new Error("Bu ilan size ait değil!");
        error.statusCode = 403;
        throw error;
      }
      post.location = location;
      post.bloodType = bloodType;
      post.message = message;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "İlan güncellendi!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  const loggedUserId = req.loggedUserId.toString();
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Bu id'ye ait bir ilan bulunamadı.");
        error.statusCode = 404;
        throw error;
      }

      //!! Check logged in user
      if (loggedUserId !== post.userId.toString()) {
        const error = new Error("Bu ilan size ait değil!");
        error.statusCode = 401;
        throw error;
      }
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "İlan başarıyla silindi." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
