const express = require("express");

const postController = require("../controllers/post");
const isAuth = require("../controllers/isAuth.js");

const router = express.Router();

router.get("/myPosts", isAuth, postController.getMyPosts);
router.get("/location/:city", postController.fetchByCity);
router.get("/location/", postController.fetchByLocation);
router.get("/:postId", postController.getPost);
router.get("/", postController.getPosts);

router.post("/reply", isAuth, postController.reply);
router.post("/", isAuth, postController.createPost);

router.put("/:postId", isAuth, postController.updatePost);

router.delete("/:postId", isAuth, postController.deletePost);

module.exports = router;
