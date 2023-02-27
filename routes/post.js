const express = require("express");

const postController = require("../controllers/post");
const isAuth = require("../controllers/isAuth.js");

const router = express.Router();

router.get("/", postController.getPosts);
router.get("/:postId", postController.getPost);

router.post(
  "/",
  isAuth,
  postController.createPost
);

router.put(
  "/:postId",
  isAuth,
  postController.updatePost
);

router.delete("/:postId", isAuth, postController.deletePost);

module.exports = router;
