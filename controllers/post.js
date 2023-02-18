const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10; //** You will change this with a logical number. */
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
        message: "Fetched posts successfully.",
        posts: posts,
        totalItems: totalItems,
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
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post fetched.", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
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
        message: "Post created successfully!",
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const userId = req.loggedUserId;
  const location = req.body.location;
  const bloodType = req.body.bloodType;
  const message = req.body.message;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.userId.toString() !== userId.toString()) {
        const error = new Error("Its not your post.");
        error.statusCode = 403;
        throw error;
      }
      post.location = location;
      post.bloodType = bloodType;
      post.message = message;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated!", post: result });
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
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }

      //!! Check logged in user
      if (loggedUserId !== post.userId.toString()) {
        const error = new Error("Its not your post.");
        error.statusCode = 401;
        throw error;
      }
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Deleted post." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
