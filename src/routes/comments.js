const router = require("express").Router();

const Camp = require("../models/Camp");
const Comment = require("../models/Comment");

//middleware
const { isLoggedIn, isCommentOwner } = require("../configs/middleware");

// GET /camps/:id ---> shows all comments --> this route is camp show page

// GET /camps/:id ---> shows form --> this route is camp show page

// POST /camps/:id/comments --> redirect to /camps/:id
router.post("/camps/:id/comments", isLoggedIn, async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id);
		const comment = new Comment({
			content: req.body.content,
			author: req.user.username,
		});

		await comment.save();
		camp.comments.push(comment);
		await camp.save();
		res.redirect("/camps/" + req.params.id);
	} catch (error) {
		res.redirect(`/camps/${req.params.id}`);
		console.log(error);
	}
});

// get /camps/:id/comments/:id --> edit form
router.get("/camps/:id1/comments/:id2/edit", isCommentOwner, async (req, res) => {
	const comment = await Comment.findById(req.params.id2);
	res.render("comments/edit", {
		pageTitle: "Edit comments",
		campId: req.params.id1,
		comment,
	});
});

// PUT /camps/:id/comments/:id --> edit form
router.put("/camps/:id1/comments/:id2", isLoggedIn, async (req, res) => {
	const comment = await Comment.findById(req.params.id2);

	if (req.body.content) comment.content = req.body.content;

	await comment.save();

	res.redirect(`/camps/${req.params.id1}`);
});

// DELETE /camps/:id/comments/:id --> delete comment
router.delete("/camps/:id1/comments/:id2", isCommentOwner, async (req, res) => {
	const comment = await Comment.findById(req.params.id2);

	await comment.remove();

	res.redirect(`/camps/${req.params.id1}`);
});

module.exports = router;
