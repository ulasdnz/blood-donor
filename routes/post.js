const express = require("express");
const { body } = require("express-validator");

const postController = require("../controllers/post");
const authorizationCheck =
  require("../controllers/authorizationCheck.js").authorizationCheck;

const router = express.Router();

router.get("/", postController.getPosts);
router.get("/:postId", postController.getPost);


router.post(
  "/",
  [body("message").trim().isLength({ min: 10 })],
  authorizationCheck,
  postController.createPost
);

router.put(
  "/:postId",
  [body("message").trim().isLength({ min: 10 })],
  authorizationCheck,
  postController.updatePost
);

router.delete("/:postId", authorizationCheck, postController.deletePost);

module.exports = router;
