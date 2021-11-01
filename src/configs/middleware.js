const Camp = require("../models/Camp");
const Comment = require("../models/Comment");

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();

	req.flash("error", "Please, Login first. :)");
	res.redirect("/login");
};

exports.isCommentOwner = async (req, res, next) => {
	if (!req.isAuthenticated()) res.redirect("/login");

	const comment = await Comment.findById(req.params.id2);
	if (comment.author === req.user.username) return next();

	res.redirect("back");
};

exports.isCampOwner = async (req, res, next) => {
	// if not authentic than redirect back
	if (!req.isAuthenticated()) return res.redirect("back");

	// if camps creator === loggedIn user than go next
	const camp = await Camp.findById(req.params.id);
	if (camp.creator.equals(req.user._id)) return next();

	//else redirect
	res.redirect("back");
};
