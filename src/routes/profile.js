const router = require("express").Router();

// models
const User = require("../models/User");

//middleware
const { isLoggedIn } = require("../configs/middleware");

router.get("/profile/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate("posts").exec();

		res.render("profile/index", {
			pageTitle: user.fullName,
			userProfile: user,
		});
	} catch (error) {
		res.send({ error });
	}
});

router.put("/profile/:id/edit", isLoggedIn, async (req, res) => {
	res.send("edit profile");
});

router.delete("/profile/:id", isLoggedIn, async (req, res) => {
	res.send("delete user account");
});

module.exports = router;
