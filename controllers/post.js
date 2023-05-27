const Post = require("../models/post");

exports.getMyPosts = async (req, res, _next) => {
  const userId = req.loggedUserId;
  console.log(userId);
  const posts = await Post.find({ user: userId });
  return res.status(200).json({ posts });
};

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 50;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage).sort({"createdAt": -1})
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
  const patientName = req.body.patientName;
  const patientSurname = req.body.patientSurname;
  const patientAge = req.body.patientAge;
  const patientBloodType = req.body.patientBloodType;
  const location = req.body.location;
  const message = req.body.message;
  const post = new Post({
    user: userId,
    patientName,
    patientSurname,
    patientAge,
    patientBloodType,
    location,
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

exports.reply = async (req, res, next) => {
  const userId = req.loggedUserId;
  const postId = req.body.postId;
  const comment = req.body.comment;

  const post = await Post.findById(postId);
  if (!post) {
    const error = new Error("Bu id'ye ait bir ilan bulunamadı.");
    error.statusCode = 404;
    return next(error);
  }
  const replies = [...post.replies, { from: userId, content: comment }];
  post.replies = replies;
  try {
    const result = await post.save();
    return res.status(200).json({ message: "Reply edildi!", post: result });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
exports.fetchByLocation = async (req, res, next) => {
  const city = req.query.city;
  const district = req.query.district;
  try {
    const posts = await Post.find({
      "location.city": city,
      "location.district": district,
    });
    return res.status(200).json({ posts }).sort({"createdAt": -1});
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.fetchByCity = async (req, res, next) => {
  const city = req.params.city;
  try {
    const posts = await Post.find({ "location.city": city });
    return res.status(200).json({ posts }).sort({"createdAt": -1});
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
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
      if (post.user._id.toString() !== userId.toString()) {
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
      if (loggedUserId !== post.user._id.toString()) {
        const error = new Error("Bu ilan size ait değil!");
        error.statusCode = 401;
        throw error;
      }
      return Post.findByIdAndRemove(postId);
    })
    .then((_result) =>
      res.status(200).json({ message: "İlan başarıyla silindi." })
    )
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
